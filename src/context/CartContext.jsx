import React, { createContext, useContext, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  getCartApi,
  addToCartApi,
  updateCartItemApi,
  removeCartItemApi,
  clearCartApi,
} from "../api/cartApi.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const { data } = await getCartApi();
      setCart(data.cart);
    } catch (err) {
      // silent fail; user might not be authenticated yet
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addItem = async (payload) => {
    try {
      const { data } = await addToCartApi(payload);
      setCart(data.cart);
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add to cart");
      throw err;
    }
  };

  const updateItem = async (itemId, quantity) => {
    const { data } = await updateCartItemApi(itemId, { quantity });
    setCart(data.cart);
  };

  const removeItem = async (itemId) => {
    const { data } = await removeCartItemApi(itemId);
    setCart(data.cart);
    toast.success("Item removed");
  };

  const clearCart = async () => {
    const { data } = await clearCartApi();
    setCart(data.cart);
  };

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const subtotal = cart.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, loading, itemCount, subtotal, refreshCart, addItem, updateItem, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
