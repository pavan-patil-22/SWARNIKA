import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/api';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders(user?.role === 'admin' ? null : (user?.id || user?.email));
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const placeOrder = async (orderData) => {
    const created = await orderService.createOrder({
      userId: user?.id || 'guest-usr',
      userName: user?.name || orderData.shippingAddress.fullName,
      userEmail: user?.email || 'guest@example.com',
      ...orderData
    });
    await fetchOrders();
    return created;
  };

  const updateStatus = async (orderId, newStatus, note = "") => {
    const updated = await orderService.updateOrderStatus(orderId, newStatus, note);
    await fetchOrders();
    return updated;
  };

  return (
    <OrderContext.Provider value={{
      orders,
      loading,
      fetchOrders,
      placeOrder,
      updateStatus
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
