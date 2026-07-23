"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from "./AuthContext";

interface CartItem {
  product: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  _id?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Returns a user-specific localStorage key so carts don't leak between users.
 * Uses "cart_guest" when not logged in.
 */
function getCartKey(userId?: string): string {
  return userId ? `cart_${userId}` : 'cart_guest';
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?._id || user?.id;
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Build the current localStorage key from user ID
  const cartKey = getCartKey(userId);

  // Load cart from localStorage whenever the user changes
  useEffect(() => {
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  }, [cartKey]);

  // Save cart to localStorage whenever items change (using the user-specific key)
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, cartKey]);

  const addToCart = useCallback((item: CartItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => i.product === item.product);
      if (existingItem) {
        return prev.map(i =>
          i.product === item.product
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prev => prev.filter(item => item.product !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    // Also clear from localStorage immediately
    localStorage.removeItem(cartKey);
  }, [cartKey]);

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
