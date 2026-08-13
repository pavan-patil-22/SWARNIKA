import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

const DEFAULT_USER_ADDRESSES = [
  {
    id: "addr-1",
    fullName: "Valued Customer",
    phone: "+91 98765 43210",
    street: "42 Golden Avenue, Jubilee Hills",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500033",
    isDefault: true
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aureate_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('aureate_addresses');
    return saved ? JSON.parse(saved) : DEFAULT_USER_ADDRESSES;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('aureate_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aureate_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('aureate_addresses', JSON.stringify(addresses));
  }, [addresses]);

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      setUser(res);
      return res;
    } catch (err) {
      console.error("Authentication login error:", err);
      throw err;
    }
  };

  const register = async (name, email, password, otp) => {
    try {
      const res = await authService.register(name, email, password, otp);
      setUser(res);
      return res;
    } catch (err) {
      console.error("Authentication registration error:", err);
      throw err;
    }
  };

  const clearMustChangePasswordFlag = () => {
    if (user) {
      setUser(prev => ({ ...prev, mustChangePassword: false }));
    }
  };

  const logout = () => {
    setUser(null);
  };

  const addAddress = (newAddr) => {
    const addrObj = {
      id: `addr-${Date.now()}`,
      isDefault: addresses.length === 0,
      ...newAddr
    };
    if (addrObj.isDefault) {
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })).concat(addrObj));
    } else {
      setAddresses(prev => [...prev, addrObj]);
    }
  };

  const updateAddress = (id, updatedData) => {
    setAddresses(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
  };

  const deleteAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const setDefaultAddress = (id) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      clearMustChangePasswordFlag,
      addresses,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
