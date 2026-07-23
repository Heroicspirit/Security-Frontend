"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  Search, 
  ShoppingCart, 
  User, 
  CheckCircle2, 
  Calendar, 
  Truck, 
  MapPin, 
  ArrowLeft 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrderSuccessPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const pendingOrder = sessionStorage.getItem('pendingOrder');
    if (!pendingOrder) {
      router.push('/user/cart');
      return;
    }
    setOrderData(JSON.parse(pendingOrder));
    sessionStorage.removeItem('pendingOrder');
  }, [router]);

  if (!orderData) {
    return <div className="min-h-screen bg-[#0d0f12] flex items-center justify-center text-white">Loading your order details...</div>;
  }

  const { orderNumber, items, shippingAddress, total, createdAt, paymentMethod } = orderData;
  const orderDate = createdAt ? new Date(createdAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-[#0d0f12] text-slate-200 antialiased font-sans flex flex-col justify-between">
      
      {/* HEADER NAVIGATION BAR */}
      <nav className="bg-[#0d0f12] border-b border-slate-900/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Category Links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tight text-white serif font-serif">
              Petals<span className="text-emerald-500 font-sans font-light">&amp;Stems</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-400 tracking-wide uppercase">
              <Link href="/user/bouquets" className="hover:text-white transition">bouquets</Link>
              <Link href="/user/plants" className="hover:text-white transition">Plants</Link>
              <Link href="/user/roses" className="hover:text-white transition">Roses</Link>
              <Link href="/brands" className="hover:text-white transition">Curations</Link>
              <Link href="/offers" className="hover:text-white transition">Offers</Link>
            </div>
          </div>

          {/* Search Bar & Toolbar Icons */}
          <div className="flex items-center gap-6 flex-1 max-w-md justify-end md:flex-initial">
            <div className="relative w-full max-w-[240px] hidden sm:block">
              <input 
                type="text" 
                placeholder="Search collections..." 
                className="w-full bg-[#141822] border border-slate-800/80 rounded-full py-2 pl-9 pr-4 text-xs text-slate-300 outline-none focus:border-emerald-700/50 transition"
              />
              <Search className="absolute left-3 top-2.5 text-slate-500" size={13} />
            </div>
            
            <div className="flex items-center gap-4 text-slate-400">
              <Link href="/user/cart" className="hover:text-white transition relative">
                <ShoppingCart size={18} />
              </Link>
              <Link href="/user/dashboard" className="hover:text-white transition">
                <User size={18} />
              </Link>
            </div>
          </div>

        </div>
      </nav>

      {/* MAIN BODY CONTENT CONTAINER */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* CENTERED SUCCESS HERO STATEMENT */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
            <CheckCircle2 size={28} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white font-serif">Thank you for your order.</h1>
            <p className="text-xs text-slate-400 font-medium">Your handcrafted arrangements are being prepared by our master florists.</p>
          </div>
        </div>

        {/* CORE INTERFACE HUB GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SECTION BLOCKS */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* ORDER IDENTIFIER BANNER */}
            <div className="bg-[#141822] border border-slate-800/40 rounded-xl p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">Order Identifier</span>
                <h3 className="text-base font-bold text-slate-100 tracking-wide">#{orderNumber || 'PS-' + Math.random().toString(36).substr(2, 9).toUpperCase()}</h3>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 pt-0.5">
                  <Calendar size={12} className="text-slate-500" /> Order Date: {orderDate}
                </span>
              </div>
              {/* Dynamic Status Pill Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-[11px] font-bold text-emerald-400">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                Status: Confirmed
              </div>
            </div>

            {/* PURCHASED ITEMS STACK VIEW BOX */}
            <div className="bg-[#141822] border border-slate-800/40 rounded-xl p-6 space-y-5">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Purchased Curations</h2>

              {items.map((item: any, index: number) => (
                <div key={index} className="bg-[#0e111a] rounded-lg p-3 flex gap-4 items-center border border-slate-900">
                  <div className="w-16 h-16 rounded overflow-hidden bg-[#1a1f2c] shrink-0 border border-slate-800">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover brightness-95"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs font-semibold text-slate-200 truncate">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 font-medium truncate">Qty: {item.quantity}</p>
                    <div className="text-xs font-bold text-white pt-0.5">Rs {(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ESTIMATED DELIVERY BLOCK METRIC */}
            <div className="bg-[#141822] border border-slate-800/40 rounded-xl p-6 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-[#1a1f2c] border border-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                <Truck size={18} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">Estimated Delivery</span>
                <h3 className="text-sm font-bold text-white">Same-Day / Scheduled Delivery</h3>
                <p className="text-xs text-slate-400">Freshness-Guaranteed Temperature Controlled Transit</p>
              </div>
            </div>

          </div>

          {/* RIGHT SECTION SIDEBAR BLOCKS */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* SHIPPING DESTINATION CARD VIEW */}
            <div className="bg-[#141822] border border-slate-800/40 rounded-xl p-6 space-y-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={13} className="text-slate-400" /> Hand-Delivering To
              </h3>
              
              {/* Formatted Address Information Text */}
              <div className="text-xs text-slate-300 space-y-1 leading-relaxed pl-1">
                <div className="font-bold text-white text-xs pb-0.5">{shippingAddress.firstName} {shippingAddress.lastName}</div>
                <div>{shippingAddress.address}</div>
                <div>{shippingAddress.city}</div>
                <div>{shippingAddress.phone}</div>
              </div>

              {/* Payment Method */}
              <div className="text-xs text-slate-400 pt-2">
                <span className="font-bold text-white">Payment Method:</span> {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'wallet' ? 'Khalti / IME Pay' : paymentMethod}
              </div>
            </div>

            {/* ORDER TOTAL SUMMARY DETAIL PANEL */}
            <div className="bg-[#141822] border border-slate-800/40 rounded-xl p-6 space-y-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Total</h3>

              {/* Pricing breakdown arrays */}
              <div className="space-y-4 text-xs border-b border-slate-900 pb-5">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">Rs {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Delivery Fee</span>
                  <span className="text-emerald-400 font-bold tracking-wide text-[10px]">COMPLIMENTARY</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Vat / Luxury Tax</span>
                  <span className="text-white font-medium">Rs. 0</span>
                </div>
              </div>

              {/* Total Final Paid Block Display */}
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-xs font-medium text-slate-400">Total Amount Paid</span>
                <span className="text-xl font-black text-emerald-400">Rs {total.toFixed(2)}</span>
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM REDIRECT ACTION LINK */}
        <div className="flex justify-center pt-4">
          <Link href="/user/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition group">
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition" /> Return to My Dashboard
          </Link>
        </div>

      </main>

      {/* SYSTEM BAR FOOTER */}
      <footer className="bg-[#0a0d14] border-t border-slate-900 text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="font-bold text-slate-400 font-serif">Petals &amp; Stems Curation</span>
            <span>© 2026 Petals &amp; Stems. Handcrafted Elegance for Every Occasion.</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/privacy" className="hover:text-slate-300 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition">Terms of Service</Link>
            <Link href="/contact" className="hover:text-slate-300 transition">Contact Care</Link>
            <Link href="/shipping-info" className="hover:text-slate-300 transition">Delivery Info</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}