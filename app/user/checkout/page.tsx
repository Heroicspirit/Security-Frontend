"use client";

import React, { useState } from "react";
import { Lock, Truck, ShoppingBag, ArrowRight, ShieldCheck, RefreshCcw, ShoppingCart, Trash2 } from "lucide-react";
import Header from "../_components/Header";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, removeFromCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add arrangements before checkout.");
      return;
    }

    const { firstName, lastName, phone, city, address } = formData;
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !city.trim() || !address.trim()) {
      alert("Please fill in all delivery details before continuing.");
      return;
    }

    const pendingOrder = {
      items: cartItems.map(item => ({
        product: item.product,
        title: item.title,
        image: item.image,
        price: item.price,
        quantity: item.quantity
      })),
      shippingAddress: formData,
      subtotal: cartTotal,
      shippingCost: 0,
      total: cartTotal
    };

    sessionStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));
    router.push('/user/checkout/review');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#0f1115] flex flex-col">
      <Header />

      {/* MAIN CHECKOUT GRID */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 pb-12 pt-6">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingCart className="w-16 h-16 text-slate-600 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Your cart is empty</h2>
            <p className="text-slate-400 mb-6">Add some beautiful bouquets or plants to continue checkout</p>
            <button
              onClick={() => router.push('/user/shop')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-md shadow-green-900/20"
            >
              Explore Collections
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN (Shipping & Review Items) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Shipping Information Section */}
              <div className="bg-[#151923] border border-slate-800 rounded-xl p-6 lg:p-8 space-y-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-3">
                  <Truck size={20} className="text-slate-300" /> Delivery Information
                </h2>
                
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* First Name */}
                    <div className="space-y-1.5">
                      <label className="text-sm text-slate-300">First Name</label>
                      <input 
                        type="text" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter first name" 
                        className="w-full bg-[#1b202c] border border-slate-800 rounded-lg p-3 text-sm text-white outline-none focus:ring-2 focus:ring-green-500/50 transition" 
                      />
                    </div>
                    {/* Last Name */}
                    <div className="space-y-1.5">
                      <label className="text-sm text-slate-300">Last Name</label>
                      <input 
                        type="text" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter last name" 
                        className="w-full bg-[#1b202c] border border-slate-800 rounded-lg p-3 text-sm text-white outline-none focus:ring-2 focus:ring-green-500/50 transition" 
                      />
                    </div>
                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="text-sm text-slate-300">Phone Number</label>
                      <input 
                        type="text" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange} 
                        placeholder="Enter phone number" 
                        className="w-full bg-[#1b202c] border border-slate-800 rounded-lg p-3 text-sm text-white outline-none focus:ring-2 focus:ring-green-500/50 transition" 
                      />
                    </div>
                    {/* City */}
                    <div className="space-y-1.5">
                      <label className="text-sm text-slate-300">City / District</label>
                      <input 
                        type="text" 
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g., Kathmandu" 
                        className="w-full bg-[#1b202c] border border-slate-800 rounded-lg p-3 text-sm text-white outline-none focus:ring-2 focus:ring-green-500/50 transition" 
                      />
                    </div>
                  </div>
                  {/* Full Address */}
                  <div className="space-y-1.5">
                    <label className="text-sm text-slate-300">Tole, Street Name & House/Apartment Number</label>
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Detailed delivery landmark address" 
                      className="w-full bg-[#1b202c] border border-slate-800 rounded-lg p-3 text-sm text-white outline-none focus:ring-2 focus:ring-green-500/50 transition" 
                    />
                  </div>
                </form>
              </div>

              {/* Review Items Section */}
              <div className="bg-[#151923] border border-slate-800 rounded-xl p-6 lg:p-8 space-y-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-3">
                  <ShoppingBag size={20} className="text-slate-300" /> Selected Items
                </h2>

                <div className="divide-y divide-slate-800/60 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.product} className="bg-[#1b202c] rounded-xl p-4 flex flex-col sm:flex-row gap-5 items-center sm:items-start border border-slate-800/60 first:mt-0 mt-4">
                      <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-[#0a0c10]">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover brightness-95"
                        />
                      </div>
                      <div className="flex-1 space-y-3 w-full">
                        <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <span className="inline-flex items-center justify-center px-3 py-1 bg-slate-800/80 rounded-full text-xs font-medium text-slate-300 border border-slate-700/50 self-start">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-sm font-bold text-white">Rs {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product)}
                          className="inline-flex items-center gap-2 text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition"
                        >
                          <Trash2 size={14} /> Remove item
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN (Order Summary) */}
            <div className="lg:col-span-4">
              <div className="bg-[#151923] border border-slate-800 rounded-xl p-6 lg:p-8 space-y-6 sticky top-8">
                <h2 className="text-lg font-semibold text-white">Order Summary</h2>

                {/* Mini Cart Items */}
                {cartItems.slice(0, 2).map((item) => (
                  <div key={item.product} className="flex items-center gap-4 pb-4 border-b border-slate-800 last:border-0">
                    <div className="w-16 h-12 rounded bg-[#0a0c10] overflow-hidden shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover brightness-90"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-slate-200 truncate">{item.title}</h4>
                      <div className="flex justify-between items-center pt-1 text-xs">
                        <span className="text-slate-400">Qty: {item.quantity}</span>
                        <span className="text-slate-400">Rs {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {cartItems.length > 2 && (
                  <div className="text-xs text-slate-400 pb-4 border-b border-slate-800">
                    +{cartItems.length - 2} more items
                  </div>
                )}

                {/* Totals Breakdown */}
                <div className="space-y-3 text-sm border-b border-slate-800 pb-6">
                  <div className="flex justify-between text-slate-300">
                    <span>Items Total</span>
                    <span className="text-white">Rs {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Delivery Fee</span>
                    <span className="text-green-400 font-medium">FREE</span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="flex items-baseline justify-between pt-2">
                  <span className="text-xl font-bold text-white">Total</span>
                  <span className="text-xl font-bold text-green-400">Rs {cartTotal.toFixed(2)}</span>
                </div>

                {/* Action Button */}
                <button 
                  type="submit"
                  form="checkout-form"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 mt-4 text-center shadow-lg shadow-green-900/20"
                >
                  CONTINUE TO REVIEW <ArrowRight size={16} />
                </button>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-4 pt-4 text-[10px] sm:text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-green-500 shrink-0" />
                    <span>SSL Encrypted<br/>Secure Check</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCcw size={16} className="text-green-500 shrink-0" />
                    <span>Freshness & Quality<br/>100% Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}