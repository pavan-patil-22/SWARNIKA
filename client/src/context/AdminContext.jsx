import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  productService, 
  categoryService, 
  bannerService, 
  offerService, 
  settingService, 
  orderService,
  realGoldService,
  contactService
} from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [realGoldItems, setRealGoldItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [offers, setOffers] = useState([]);
  const [settings, setSettings] = useState({});
  const [allOrders, setAllOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [unreadOrdersCount, setUnreadOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadAllAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const [prods, goldItems, cats, bans, offs, sets, ords, inqs] = await Promise.all([
        productService.getProducts(),
        realGoldService.getRealGoldItems(),
        categoryService.getCategories(),
        bannerService.getBanners(),
        offerService.getOffers(),
        settingService.getSettings(),
        orderService.getOrders(null),
        contactService.getInquiries()
      ]);

      const safeProds = Array.isArray(prods) ? prods : [];
      const safeGoldItems = Array.isArray(goldItems) ? goldItems : [];
      const safeCats = Array.isArray(cats) ? cats : [];
      const safeBans = Array.isArray(bans) ? bans : [];
      const safeOffs = Array.isArray(offs) ? offs : [];
      const safeOrds = Array.isArray(ords) ? ords : [];
      const safeInqs = Array.isArray(inqs) ? inqs : [];

      setProducts(safeProds);
      setRealGoldItems(safeGoldItems);
      setCategories(safeCats);
      setBanners(safeBans);
      setOffers(safeOffs);
      setSettings(sets || {});
      setInquiries(safeInqs);
      
      const newOrders = safeOrds.filter(o => o.isUnreadAdmin || o.orderStatus === 'Confirmed');
      if (safeOrds.length > (allOrders?.length || 0) && (allOrders?.length || 0) > 0) {
        toast.info(`🔔 New COD Order Received! (${safeOrds[0]?.id})`, {
          icon: '👑',
          autoClose: 5000
        });
      }
      setAllOrders(safeOrds);
      setUnreadOrdersCount(newOrders.length);
    } catch (e) {
      console.error("Admin data load error", e);
    } finally {
      setLoading(false);
    }
  }, [allOrders?.length]);

  useEffect(() => {
    loadAllAdminData();
    const interval = setInterval(() => {
      loadAllAdminData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const markAllOrdersAsRead = async () => {
    try {
      setUnreadOrdersCount(0);
      setAllOrders(prev => (Array.isArray(prev) ? prev : []).map(o => ({ ...o, isUnreadAdmin: false })));
    } catch (e) {
      console.error(e);
    }
  };

  const safeProducts = Array.isArray(products) ? products : [];
  const safeOrders = Array.isArray(allOrders) ? allOrders : [];
  const safeInquiries = Array.isArray(inquiries) ? inquiries : [];

  const lowStockProducts = safeProducts.filter(p => (p.stock || 0) <= 5);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = safeOrders.filter(o => o.createdAt && String(o.createdAt).startsWith(todayStr));
  const todayOrdersCount = todayOrders.length;
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const currentMonthStr = todayStr.substring(0, 7);
  const monthlyOrders = safeOrders.filter(o => o.createdAt && String(o.createdAt).startsWith(currentMonthStr));
  const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const totalRevenue = safeOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalUsersCount = 124;

  const pendingOrdersCount = safeOrders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed' || o.orderStatus === 'Packed').length;
  const deliveredOrdersCount = safeOrders.filter(o => o.orderStatus === 'Delivered').length;

  const pendingReturnsCount = safeOrders.filter(o => o.returnStatus === 'Requested').length;
  const pendingInquiriesCount = safeInquiries.filter(i => i.status === 'Pending').length;

  const getRevenueChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    return last7Days.map(dateStr => {
      const dayOrders = safeOrders.filter(o => o.createdAt && String(o.createdAt).startsWith(dateStr));
      const revenue = dayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const displayDate = new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return { date: displayDate, revenue, orders: dayOrders.length };
    });
  };

  const getCategoryDistributionData = () => {
    const counts = {};
    safeProducts.forEach(p => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return Object.keys(counts).map(catName => ({
      name: catName,
      value: counts[catName]
    }));
  };

  const getOrderStatusPieData = () => {
    const statuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
    return statuses.map(st => ({
      name: st,
      value: safeOrders.filter(o => o.orderStatus === st).length
    })).filter(item => item.value > 0);
  };

  // Product CRUD
  const saveProduct = async (productData, editId = null) => {
    if (editId) {
      await productService.updateProduct(editId, productData);
    } else {
      await productService.createProduct(productData);
    }
    await loadAllAdminData();
  };

  const removeProduct = async (id) => {
    await productService.deleteProduct(id);
    await loadAllAdminData();
  };

  // Real Gold Collection CRUD
  const saveRealGoldItem = async (goldData, editId = null) => {
    if (editId) {
      await realGoldService.updateRealGoldItem(editId, goldData);
    } else {
      await realGoldService.createRealGoldItem(goldData);
    }
    await loadAllAdminData();
  };

  const removeRealGoldItem = async (id) => {
    await realGoldService.deleteRealGoldItem(id);
    await loadAllAdminData();
  };

  // Category CRUD
  const saveCategory = async (catData, editId = null) => {
    if (editId) {
      await categoryService.updateCategory(editId, catData);
    } else {
      await categoryService.createCategory(catData);
    }
    await loadAllAdminData();
  };

  const removeCategory = async (id) => {
    await categoryService.deleteCategory(id);
    await loadAllAdminData();
  };

  // Banner CRUD
  const saveBanner = async (bannerData, editId = null) => {
    if (editId) {
      await bannerService.updateBanner(editId, bannerData);
    } else {
      await bannerService.createBanner(bannerData);
    }
    await loadAllAdminData();
  };

  const removeBanner = async (id) => {
    await bannerService.deleteBanner(id);
    await loadAllAdminData();
  };

  // Offer CRUD
  const saveOffer = async (offerData, editId = null) => {
    if (editId) {
      await offerService.updateOffer(editId, offerData);
    } else {
      await offerService.createOffer(offerData);
    }
    await loadAllAdminData();
  };

  const removeOffer = async (id) => {
    await offerService.deleteOffer(id);
    await loadAllAdminData();
  };

  // Settings
  const updateGlobalSettings = async (newSettings) => {
    const updated = await settingService.updateSettings(newSettings);
    setSettings(updated || {});
  };

  // Export Reports
  const exportReport = (type = 'orders', format = 'pdf', filters = {}) => {
    let dataToExport = [];
    let title = `${type.toUpperCase()} REPORT`;

    if (type === 'orders') {
      dataToExport = safeOrders.map(o => ({
        "Order ID": o.id,
        "Customer": o.userName,
        "Email": o.userEmail,
        "Phone": o.phone,
        "Items Count": o.items?.length || 0,
        "Total (INR)": `₹${o.total}`,
        "Status": o.orderStatus,
        "Payment": o.paymentMethod,
        "Date": new Date(o.createdAt || Date.now()).toLocaleDateString()
      }));
    } else if (type === 'products') {
      dataToExport = safeProducts.map(p => ({
        "SKU": p.sku,
        "Name": p.name,
        "Category": p.category,
        "Price (INR)": `₹${p.price}`,
        "Original Price": `₹${p.originalPrice}`,
        "Stock": p.stock,
        "Status": p.stock <= 5 ? "LOW STOCK" : "In Stock"
      }));
    } else if (type === 'revenue') {
      dataToExport = safeOrders.map(o => ({
        "Order ID": o.id,
        "Date": new Date(o.createdAt || Date.now()).toLocaleDateString(),
        "Subtotal": `₹${o.subtotal}`,
        "Discount": `₹${o.discount}`,
        "Tax (3% GST)": `₹${o.tax}`,
        "Grand Total": `₹${o.total}`
      }));
    }

    if (format === 'csv' || format === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, type.toUpperCase());
      const ext = format === 'csv' ? 'csv' : 'xlsx';
      XLSX.writeFile(workbook, `SWARNIKA_${type}_Report.${ext}`);
    } else if (format === 'pdf') {
      try {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.setTextColor(212, 175, 55);
        doc.text("SWARNIKA LUXURY HERITAGE", 14, 20);

        doc.setFontSize(11);
        doc.setTextColor(17, 17, 17);
        doc.text(`${title} - Generated on ${new Date().toLocaleString()}`, 14, 28);

        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text("Honnali Showroom Store Management & Financial Audit Report", 14, 34);

        if (dataToExport.length > 0) {
          const headers = Object.keys(dataToExport[0]);
          const rows = dataToExport.map(obj => Object.values(obj));

          autoTable(doc, {
            head: [headers],
            body: rows,
            startY: 40,
            headStyles: { fillColor: [212, 175, 55], textColor: [15, 23, 42], fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [250, 248, 245] }
          });
        }
        doc.save(`SWARNIKA_${type}_Report.pdf`);
        toast.success(`Exported ${type.toUpperCase()} PDF report!`);
      } catch (err) {
        console.error("Report PDF error:", err);
        toast.error("Failed to generate PDF report");
      }
    }
  };

  return (
    <AdminContext.Provider value={{
      products: safeProducts,
      realGoldItems: Array.isArray(realGoldItems) ? realGoldItems : [],
      categories: Array.isArray(categories) ? categories : [],
      banners: Array.isArray(banners) ? banners : [],
      offers: Array.isArray(offers) ? offers : [],
      settings,
      allOrders: safeOrders,
      inquiries: safeInquiries,
      unreadOrdersCount,
      loading,
      todayOrdersCount,
      todayRevenue,
      monthlyRevenue,
      totalRevenue,
      totalUsersCount,
      lowStockProducts,
      pendingOrdersCount,
      deliveredOrdersCount,
      pendingReturnsCount,
      pendingInquiriesCount,
      loadAllAdminData,
      markAllOrdersAsRead,
      saveProduct,
      removeProduct,
      saveRealGoldItem,
      removeRealGoldItem,
      saveCategory,
      removeCategory,
      saveBanner,
      removeBanner,
      saveOffer,
      removeOffer,
      updateGlobalSettings,
      exportReport,
      getRevenueChartData,
      getCategoryDistributionData,
      getOrderStatusPieData
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
