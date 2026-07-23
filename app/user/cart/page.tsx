"use client";

import React from "react";
import { ShoppingCart, ArrowLeft, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import Header from "../_components/Header";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-[#0f1115] flex flex-col">
      <Header />
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/user/dashboard" className="p-2 rounded-full hover:bg-slate-800 transition">
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Shopping Cart</h1>
            <span className="text-sm text-slate-400">({cartItems.length} items)</span>
          </div>

          {cartItems.length === 0 ? (
            /* Empty Cart State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-6">
                <ShoppingCart className="w-12 h-12 text-slate-600" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Your cart is empty</h2>
              <p className="text-slate-400 mb-6">Add some products to your cart to continue shopping</p>
              <Link 
                href="/user/dashboard"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-green-600/10"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            /* Cart Items */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product} className="bg-[#111319] border border-slate-900 rounded-2xl p-4 flex gap-4 hover:border-slate-800 transition duration-150">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#0a0c10] shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover brightness-90"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200 leading-snug">{item.title}</h3>
                        <p className="text-base font-bold text-white mt-1">Rs {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product, item.quantity - 1)}
                            className="p-1.5 rounded-lg bg-[#181d29] border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-white font-semibold w-8 text-center text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product, item.quantity + 1)}
                            className="p-1.5 rounded-lg bg-[#181d29] border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product)}
                          className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-[#111319] border border-slate-900 rounded-2xl p-6 sticky top-8 space-y-6">
                  <h2 className="text-base font-bold text-white uppercase tracking-wide border-b border-slate-900 pb-2">Order Summary</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Subtotal</span>
                      <span className="text-white font-semibold">Rs {cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Shipping</span>
                      <span className="text-green-400 font-medium">Free</span>
                    </div>
                    <div className="border-t border-slate-900 pt-3 flex justify-between text-white font-bold text-sm">
                      <span>Total</span>
                      <span className="text-green-400">Rs {cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Link
                      href="/user/checkout"
                      className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-xs py-3 rounded-xl transition text-center shadow-md shadow-green-600/10"
                    >
                      Proceed to Checkout
                    </Link>
                    <button
                      onClick={clearCart}
                      className="block w-full text-slate-500 hover:text-slate-400 text-xs font-medium py-2 transition"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FIXED FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/40 px-6 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="text-sm font-bold text-white tracking-tight">
              Flora<span className="text-green-500">Boutique</span>
            </div>
            <p>© 2026 FloraBoutique. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}