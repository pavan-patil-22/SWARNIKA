import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { settingService, offerService } from '../services/api';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('aureate_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(0);
  const [appliedMinQuantity, setAppliedMinQuantity] = useState(0);
  const [adminSettings, setAdminSettings] = useState({ deliveryCharge: 99, freeDeliveryThreshold: 1999 });

  useEffect(() => {
    localStorage.setItem('aureate_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const refreshSettings = useCallback(async () => {
    try {
      const sets = await settingService.getSettings();
      if (sets) setAdminSettings(sets);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  // AUTOMATIC COUPON REMOVAL WHEN CART ITEM QUANTITY DROPS BELOW MIN QUANTITY
  useEffect(() => {
    const currentItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    if (appliedCoupon && appliedMinQuantity > 0 && currentItemCount < appliedMinQuantity) {
      const oldCode = appliedCoupon;
      const minRequired = appliedMinQuantity;
      setAppliedCoupon(null);
      setCouponDiscountPercent(0);
      setAppliedMinQuantity(0);
      toast.warn(`Coupon ${oldCode} removed because cart items (${currentItemCount}) fell below required minimum of ${minRequired}`, {
        style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
      });
    }
  }, [cartItems, appliedCoupon, appliedMinQuantity]);

  const addToCart = (product, quantity = 1) => {
    refreshSettings();
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        toast.info(`Updated ${product.name} quantity in cart`, { style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' } });
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      } else {
        toast.success(`Added ${product.name} to cart`, { style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' } });
        return [...prev, {
          id: product.id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images?.[0] || product.image,
          quantity
        }];
      }
    });
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast.info('Item removed from cart');
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setCouponDiscountPercent(0);
    setAppliedMinQuantity(0);
  };

  // COUPON VALIDATION WITH MIN ITEM QUANTITY CHECK
  const applyCouponCode = async (codeStr) => {
    try {
      const currentItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const offers = await offerService.getOffers();
      const matched = offers.find(o => o.code.toUpperCase() === codeStr.trim().toUpperCase() && o.active);
      
      if (!matched) {
        toast.error('Invalid or expired promo coupon code');
        return false;
      }

      const minQty = matched.minQuantity || 1;
      if (currentItemCount < minQty) {
        toast.error(`Coupon ${matched.code} requires at least ${minQty} items in cart! (You have ${currentItemCount})`, {
          style: { background: '#FFF', color: '#EF4444', border: '1px solid #EF4444' }
        });
        return false;
      }

      setAppliedCoupon(matched.code);
      setCouponDiscountPercent(matched.discountPercent);
      setAppliedMinQuantity(minQty);

      toast.success(`Coupon ${matched.code} applied! (${matched.discountPercent}% OFF for ${minQty}+ items)`, {
        style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
      });
      return true;
    } catch (e) {
      toast.error('Could not validate coupon');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscountPercent(0);
    setAppliedMinQuantity(0);
    toast.info('Coupon code removed');
  };

  // Financial Calculations (TAX INCLUSIVE)
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Automatic Buy 2+ Offer or Applied Coupon
  let autoOfferDiscount = 0;
  if (totalItemCount >= 2 && !couponDiscountPercent) {
    autoOfferDiscount = Math.round(subtotal * 0.10); // 10% auto discount for 2+ items
  }

  const couponDiscount = couponDiscountPercent ? Math.round(subtotal * (couponDiscountPercent / 100)) : 0;
  const totalDiscount = Math.max(autoOfferDiscount, couponDiscount);

  const netSubtotal = Math.max(0, subtotal - totalDiscount);

  // TAX IS INCLUDED IN PRODUCT LISTED PRICE
  const inclusiveTax = Math.round(netSubtotal * 0.03); 

  // Admin Configurable Delivery Fee
  const deliveryChargeSetting = adminSettings.deliveryCharge !== undefined ? adminSettings.deliveryCharge : 99;
  const freeThreshold = adminSettings.freeDeliveryThreshold !== undefined ? adminSettings.freeDeliveryThreshold : 1999;
  const deliveryFee = (subtotal >= freeThreshold || cartItems.length === 0) ? 0 : deliveryChargeSetting;

  const grandTotal = netSubtotal + deliveryFee;

  return (
    <CartContext.Provider value={{
      cartItems,
      totalItemCount,
      subtotal,
      totalDiscount,
      autoOfferDiscount,
      appliedCoupon,
      couponDiscountPercent,
      appliedMinQuantity,
      tax: 0,
      inclusiveTax,
      deliveryFee,
      deliveryChargeSetting,
      freeThreshold,
      grandTotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyCouponCode,
      removeCoupon,
      refreshSettings
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
