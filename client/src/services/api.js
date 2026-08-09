import axios from 'axios';
import { INITIAL_PRODUCTS } from '../data/mockData';

// Dynamic API Base URL detection
const getApiBaseUrl = () => {
  const host = window.location.hostname;
  // return `http://${host}:7000/api`;
  return `https://swarnika-9eij.onrender.com`;
};

const API_BASE_URL = getApiBaseUrl();

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    const res = await axiosClient.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (name, email, password) => {
    const res = await axiosClient.post('/auth/register', { name, email, password });
    return res.data;
  },
  forgotPassword: async (email) => {
    const res = await axiosClient.post('/auth/forgot-password', { email });
    return res.data;
  },
  changePassword: async (email, newPassword) => {
    const res = await axiosClient.post('/auth/change-password', { email, newPassword });
    return res.data;
  }
};

export const contactService = {
  submitInquiry: async (formData) => {
    const res = await axiosClient.post('/contact', formData);
    return res.data;
  },
  getInquiries: async () => {
    const res = await axiosClient.get('/contact');
    return res.data;
  },
  replyInquiry: async (id, adminReply, replyMethod) => {
    const res = await axiosClient.post(`/contact/reply/${id}`, { adminReply, replyMethod });
    return res.data;
  }
};

export const realGoldService = {
  getRealGoldItems: async () => {
    try {
      const res = await axiosClient.get('/real-gold');
      return res.data;
    } catch (err) {
      console.error('Error fetching real gold items:', err.message);
      return [];
    }
  },
  createRealGoldItem: async (itemData) => {
    const res = await axiosClient.post('/real-gold', itemData);
    return res.data;
  },
  updateRealGoldItem: async (id, itemData) => {
    const res = await axiosClient.put(`/real-gold/${id}`, itemData);
    return res.data;
  },
  deleteRealGoldItem: async (id) => {
    await axiosClient.delete(`/real-gold/${id}`);
    return true;
  }
};

export const reviewService = {
  getReviews: async () => {
    try {
      const res = await axiosClient.get('/reviews');
      return res.data;
    } catch (err) {
      console.error('Error fetching reviews:', err.message);
      return [];
    }
  },
  submitReview: async (reviewData) => {
    const res = await axiosClient.post('/reviews', reviewData);
    return res.data;
  }
};

export const uploadService = {
  uploadDeviceFiles: async (files) => {
    const formData = new FormData();
    const fileArray = Array.from(files);
    fileArray.forEach(file => formData.append('images', file));

    const res = await axiosClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.urls;
  }
};

export const productService = {
  getProducts: async (params = {}) => {
    try {
      const res = await axiosClient.get('/products', { params });
      return res.data;
    } catch (err) {
      console.warn('API error, falling back to mock data:', err.message);
      let list = [...INITIAL_PRODUCTS];
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
      }
      if (params.category) list = list.filter(p => p.category === params.category);
      if (params.featured) list = list.filter(p => p.featured);
      return list;
    }
  },
  getProductById: async (id) => {
    try {
      const res = await axiosClient.get(`/products/${id}`);
      return res.data;
    } catch (err) {
      console.warn(`API error for product ${id}, falling back to mock data:`, err.message);
      return INITIAL_PRODUCTS.find(p => String(p.id) === String(id)) || null;
    }
  },
  createProduct: async (productData) => {
    const res = await axiosClient.post('/products', productData);
    return res.data;
  },
  updateProduct: async (id, productData) => {
    const res = await axiosClient.put(`/products/${id}`, productData);
    return res.data;
  },
  deleteProduct: async (id) => {
    await axiosClient.delete(`/products/${id}`);
    return true;
  }
};

export const categoryService = {
  getCategories: async () => {
    try {
      const res = await axiosClient.get('/categories');
      return res.data;
    } catch (err) {
      console.error('Error fetching categories from API:', err.message);
      return [];
    }
  },
  createCategory: async (categoryData) => {
    const res = await axiosClient.post('/categories', categoryData);
    return res.data;
  },
  updateCategory: async (id, categoryData) => {
    const res = await axiosClient.put(`/categories/${id}`, categoryData);
    return res.data;
  },
  deleteCategory: async (id) => {
    await axiosClient.delete(`/categories/${id}`);
    return true;
  }
};

export const bannerService = {
  getBanners: async () => {
    try {
      const res = await axiosClient.get('/banners');
      return res.data;
    } catch (err) {
      console.error('Error fetching banners from API:', err.message);
      return [];
    }
  },
  createBanner: async (bannerData) => {
    const res = await axiosClient.post('/banners', bannerData);
    return res.data;
  },
  updateBanner: async (id, bannerData) => {
    const res = await axiosClient.put(`/banners/${id}`, bannerData);
    return res.data;
  },
  deleteBanner: async (id) => {
    await axiosClient.delete(`/banners/${id}`);
    return true;
  }
};

export const offerService = {
  getOffers: async () => {
    try {
      const res = await axiosClient.get('/offers');
      return res.data;
    } catch (err) {
      console.error('Error fetching offers from API:', err.message);
      return [];
    }
  },
  createOffer: async (offerData) => {
    const res = await axiosClient.post('/offers', offerData);
    return res.data;
  },
  updateOffer: async (id, offerData) => {
    const res = await axiosClient.put(`/offers/${id}`, offerData);
    return res.data;
  },
  deleteOffer: async (id) => {
    await axiosClient.delete(`/offers/${id}`);
    return true;
  }
};

export const orderService = {
  getOrders: async (userId = null) => {
    try {
      const res = await axiosClient.get('/orders', { params: userId ? { userId } : {} });
      return res.data;
    } catch (err) {
      console.error('Error fetching orders from API:', err.message);
      return [];
    }
  },
  getOrderById: async (orderId) => {
    try {
      const res = await axiosClient.get(`/orders/${orderId}`);
      return res.data;
    } catch (err) {
      console.error(`Error fetching order ${orderId} from API:`, err.message);
      return null;
    }
  },
  createOrder: async (orderData) => {
    const res = await axiosClient.post('/orders', orderData);
    return res.data;
  },
  updateOrderStatus: async (orderId, status, note = "") => {
    const res = await axiosClient.put(`/orders/${orderId}`, { orderStatus: status, trackingNote: note });
    return res.data;
  },
  requestReturn: async (orderId, returnReason, returnImage = "") => {
    const res = await axiosClient.post(`/orders/return-request/${orderId}`, { returnReason, returnImage });
    return res.data;
  },
  respondReturn: async (orderId, action, adminComment = "") => {
    const res = await axiosClient.post(`/orders/return-respond/${orderId}`, { action, adminComment });
    return res.data;
  }
};

export const settingService = {
  getSettings: async () => {
    try {
      const res = await axiosClient.get('/settings');
      return res.data;
    } catch (err) {
      console.error('Error fetching settings from API:', err.message);
      return null;
    }
  },
  updateSettings: async (newSettings) => {
    const res = await axiosClient.put('/settings', newSettings);
    return res.data;
  }
};

// Cloudinary Multi-upload Handler
export const simulateCloudinaryUpload = async (files) => {
  return uploadService.uploadDeviceFiles(files);
};
