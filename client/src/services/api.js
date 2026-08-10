import axios from "axios";
import { INITIAL_PRODUCTS } from "../data/mockData";

// Dynamic API Base URL detection
const getApiBaseUrl = () => {
  const host = window.location.hostname;
  // return `http://${host}:7000/api`;
  return `https://swarnika-9eij.onrender.com/api`;
};


export default getApiBaseUrl;

const API_BASE_URL = getApiBaseUrl();

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // Extended 45s timeout for Render free tier cold-starts
  headers: {
    "Content-Type": "application/json",
  },
});

let coldStartTimer = null;

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Trigger cold-start notification if backend takes > 3.5 seconds
  if (!coldStartTimer) {
    coldStartTimer = setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("server-cold-start", { detail: { isWakingUp: true } }),
      );
    }, 3500);
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (coldStartTimer) {
      clearTimeout(coldStartTimer);
      coldStartTimer = null;
    }
    window.dispatchEvent(
      new CustomEvent("server-cold-start", { detail: { isWakingUp: false } }),
    );
    return response;
  },
  (error) => {
    if (coldStartTimer) {
      clearTimeout(coldStartTimer);
      coldStartTimer = null;
    }

    // Check if error is network error or server down (502/503/504) or timeout
    if (
      !error.response ||
      error.code === "ECONNABORTED" ||
      [502, 503, 504].includes(error.response?.status)
    ) {
      window.dispatchEvent(
        new CustomEvent("server-cold-start", {
          detail: { isWakingUp: true, isError: true },
        }),
      );
    } else {
      window.dispatchEvent(
        new CustomEvent("server-cold-start", { detail: { isWakingUp: false } }),
      );
    }

    return Promise.reject(error);
  },
);

export const authService = {
  login: async (email, password) => {
    const res = await axiosClient.post("/auth/login", { email, password });
    return res.data;
  },
  register: async (name, email, password) => {
    const res = await axiosClient.post("/auth/register", {
      name,
      email,
      password,
    });
    return res.data;
  },
  forgotPassword: async (email) => {
    const res = await axiosClient.post("/auth/forgot-password", { email });
    return res.data;
  },
  changePassword: async (email, newPassword) => {
    const res = await axiosClient.post("/auth/change-password", {
      email,
      newPassword,
    });
    return res.data;
  },
};

export const contactService = {
  submitInquiry: async (formData) => {
    const res = await axiosClient.post("/contact", formData);
    return res.data;
  },
  getInquiries: async () => {
    try {
      const res = await axiosClient.get("/contact");
      return res.data;
    } catch (err) {
      console.error("Error fetching inquiries from API:", err.message);
      return [];
    }
  },
  updateInquiryStatus: async (id, status) => {
    const res = await axiosClient.put(`/contact/${id}`, { status });
    return res.data;
  },
};

export const productService = {
  getProducts: async () => {
    try {
      const res = await axiosClient.get("/products");
      return res.data;
    } catch (err) {
      console.warn(
        "Backend API unavailable. Using fallback initial product data.",
      );
      return INITIAL_PRODUCTS;
    }
  },
  getProductById: async (id) => {
    try {
      const res = await axiosClient.get(`/products/${id}`);
      return res.data;
    } catch (err) {
      console.warn(`Product ${id} not found in API. Searching fallback data.`);
      return INITIAL_PRODUCTS.find((p) => String(p.id) === String(id)) || null;
    }
  },
  createProduct: async (productData) => {
    const res = await axiosClient.post("/products", productData);
    return res.data;
  },
  updateProduct: async (id, productData) => {
    const res = await axiosClient.put(`/products/${id}`, productData);
    return res.data;
  },
  deleteProduct: async (id) => {
    await axiosClient.delete(`/products/${id}`);
    return true;
  },
};

export const categoryService = {
  getCategories: async () => {
    try {
      const res = await axiosClient.get("/categories");
      return res.data;
    } catch (err) {
      console.error("Error fetching categories from API:", err.message);
      return [];
    }
  },
  createCategory: async (categoryData) => {
    const res = await axiosClient.post("/categories", categoryData);
    return res.data;
  },
  updateCategory: async (id, categoryData) => {
    const res = await axiosClient.put(`/categories/${id}`, categoryData);
    return res.data;
  },
  deleteCategory: async (id) => {
    await axiosClient.delete(`/categories/${id}`);
    return true;
  },
};

export const realGoldService = {
  getRealGoldItems: async () => {
    try {
      const res = await axiosClient.get("/real-gold");
      return res.data;
    } catch (err) {
      console.error("Error fetching real gold items from API:", err.message);
      return [];
    }
  },
  createRealGoldItem: async (itemData) => {
    const res = await axiosClient.post("/real-gold", itemData);
    return res.data;
  },
  updateRealGoldItem: async (id, itemData) => {
    const res = await axiosClient.put(`/real-gold/${id}`, itemData);
    return res.data;
  },
  deleteRealGoldItem: async (id) => {
    await axiosClient.delete(`/real-gold/${id}`);
    return true;
  },
};

export const bannerService = {
  getBanners: async () => {
    try {
      const res = await axiosClient.get("/banners");
      return res.data;
    } catch (err) {
      console.error("Error fetching banners from API:", err.message);
      return [];
    }
  },
  createBanner: async (bannerData) => {
    const res = await axiosClient.post("/banners", bannerData);
    return res.data;
  },
  updateBanner: async (id, bannerData) => {
    const res = await axiosClient.put(`/banners/${id}`, bannerData);
    return res.data;
  },
  deleteBanner: async (id) => {
    await axiosClient.delete(`/banners/${id}`);
    return true;
  },
};

export const offerService = {
  getOffers: async () => {
    try {
      const res = await axiosClient.get("/offers");
      return res.data;
    } catch (err) {
      console.error("Error fetching offers from API:", err.message);
      return [];
    }
  },
  createOffer: async (offerData) => {
    const res = await axiosClient.post("/offers", offerData);
    return res.data;
  },
  updateOffer: async (id, offerData) => {
    const res = await axiosClient.put(`/offers/${id}`, offerData);
    return res.data;
  },
  deleteOffer: async (id) => {
    await axiosClient.delete(`/offers/${id}`);
    return true;
  },
};

export const orderService = {
  getOrders: async (userId = null) => {
    try {
      const res = await axiosClient.get("/orders", {
        params: userId ? { userId } : {},
      });
      return res.data;
    } catch (err) {
      console.error("Error fetching orders from API:", err.message);
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
    const res = await axiosClient.post("/orders", orderData);
    return res.data;
  },
  updateOrderStatus: async (orderId, status, note = "") => {
    const res = await axiosClient.put(`/orders/${orderId}`, {
      orderStatus: status,
      trackingNote: note,
    });
    return res.data;
  },
  requestReturn: async (orderId, returnReason, returnImage = "") => {
    const res = await axiosClient.post(`/orders/return-request/${orderId}`, {
      returnReason,
      returnImage,
    });
    return res.data;
  },
  respondReturn: async (orderId, action, adminComment = "") => {
    const res = await axiosClient.post(`/orders/return-respond/${orderId}`, {
      action,
      adminComment,
    });
    return res.data;
  },
};

export const settingService = {
  getSettings: async () => {
    try {
      const res = await axiosClient.get("/settings");
      return res.data;
    } catch (err) {
      console.error("Error fetching settings from API:", err.message);
      return null;
    }
  },
  updateSettings: async (newSettings) => {
    const res = await axiosClient.put("/settings", newSettings);
    return res.data;
  },
  getGoldHistory: async () => {
    try {
      const res = await axiosClient.get("/settings/gold-history");
      return res.data;
    } catch (err) {
      console.error("Error fetching gold history from API:", err.message);
      return [];
    }
  },
};

export const reviewService = {
  getReviews: async () => {
    try {
      const res = await axiosClient.get("/reviews");
      return res.data;
    } catch (err) {
      console.error("Error fetching reviews from API:", err.message);
      return [];
    }
  },
  submitReview: async (reviewData) => {
    const res = await axiosClient.post("/reviews", reviewData);
    return res.data;
  },
};

export const userService = {
  getUsers: async () => {
    try {
      const res = await axiosClient.get("/users");
      return res.data;
    } catch (err) {
      console.error("Error fetching users from API:", err.message);
      return [];
    }
  },
};

export const uploadService = {
  uploadDeviceFiles: async (files) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }
      const res = await axiosClient.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.urls || [];
    } catch (err) {
      console.error("Device file upload error:", err.message);
      throw err;
    }
  },
};

export const simulateCloudinaryUpload = async (files) => {
  return uploadService.uploadDeviceFiles(files);
};
