import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      updateUser: (updatedFields) => set((state) => ({ user: { ...state.user, ...updatedFields } })),
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('auth-storage');
      },

      login: async (email, password) => {
        try {
          const res = await axios.post('/api/auth/login', { email, password });
          const { user, accessToken } = res.data;
          set({ user, token: accessToken, isAuthenticated: true });
          return { success: true };
        } catch (error) {
          return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
      },

      register: async (userData) => {
        try {
          const res = await axios.post('/api/auth/register', userData);
          const { user, accessToken } = res.data;
          set({ user, token: accessToken, isAuthenticated: true });
          return { success: true };
        } catch (error) {
          return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
