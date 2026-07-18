"use client";

import React, { useState, useEffect } from "react";
import { 
  Wallet, 
  Truck, 
  ShieldCheck, 
  User, 
  ArrowRight 
} from "lucide-react";
import Link from "next/link";
import Header from "../../_components/Header";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function PaymentMethodPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [selectedMethod, setSelectedMethod] = useState("cod");
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pendingOrder = sessionStorage.getItem('pendingOrder');
    if (!pendingOrder) {
      router.push('/user/cart');
      return;
    }
    setOrderData(JSON.parse(pendingOrder));
  }, [router]);

  const handleConfirmPayment = async () => {
    if (!orderData || loading) return;

    setLoading(true);

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];

      if (!token) {
        alert("Please login to continue.");
        router.push('/login');
        return;
      }

      const payload = {
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: selectedMethod,
        subtotal: orderData.subtotal ?? orderData.total,
        shippingCost: orderData.shippingCost ?? 0,
        total: orderData.total
      };

      const response = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        const finalOrder = {
          ...data.data,
          items: orderData.items,
          shippingAddress: orderData.shippingAddress,
          paymentMethod: selectedMethod,
          total: orderData.total
        };
        sessionStorage.setItem('pendingOrder', JSON.stringify(finalOrder));
        clearCart();
        router.push('/user/checkout/success');
      } else {
        alert(data.message || "Failed to create order");
      }
    } catch (error) {
      console.error('Failed to create order:', error);
      alert("Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) {
    return <div className="min-h-screen bg-[#0f1115] flex items-center justify-center text-white">Loading...</div>;
  }

  const { items, total } = orderData;

  return (
    <div className="min-h-screen bg-[#0f1115] flex flex-col">
      <Header />

      {/* MAIN BODY CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT CONTAINER: PAYMENT METHOD SELECTORS */}
          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold text-white tracking-wide">Select Payment Method</h1>
              <p className="text-xs text-slate-400">Choose your preferred secure payment option to complete the transaction.</p>
            </div>

            {/* Selector Option Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              
              {/* Option 1: Khalti / IME Pay */}
              <div 
                onClick={() => setSelectedMethod("wallet")}
                className={`cursor-pointer rounded-xl bg-[#11141e] border-2 p-8 flex flex-col items-center text-center justify-between space-y-6 transition-all h-64 select-none ${
                  selectedMethod === "wallet" ? "border-blue-500/80 shadow-md shadow-blue-500/5" : "border-slate-800/40 hover:border-slate-800"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#171b26] border border-slate-800 flex items-center justify-center text-slate-300">
                  <Wallet size={22} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white tracking-wide">Khalti / IME Pay</h3>
                  <p className="text-xs text-slate-400 max-w-[200px]">Fast & secure digital wallet payment</p>
                </div>
                {/* Custom Radio Node */}
                <div className="w-5 h-5 rounded-full border border-slate-700 bg-[#0a0c10] flex items-center justify-center">
                  {selectedMethod === "wallet" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-in zoom-in-50 duration-150" />
                  )}
                </div>
              </div>

              {/* Option 2: Cash on Delivery */}
              <div 
                onClick={() => setSelectedMethod("cod")}
                className={`cursor-pointer rounded-xl bg-[#11141e] border-2 p-8 flex flex-col items-center text-center justify-between space-y-6 transition-all h-64 select-none ${
                  selectedMethod === "cod" ? "border-blue-500/80 shadow-md shadow-blue-500/5" : "border-slate-800/40 hover:border-slate-800"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#171b26] border border-slate-800 flex items-center justify-center text-slate-300">
                  <Truck size={22} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white tracking-wide">Cash on Delivery</h3>
                  <p className="text-xs text-slate-400 max-w-[200px]">Pay when your order reaches your doorstep</p>
                </div>
                {/* Custom Radio Node */}
                <div className="w-5 h-5 rounded-full border border-slate-700 bg-[#0a0c10] flex items-center justify-center">
                  {selectedMethod === "cod" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-in zoom-in-50 duration-150" />
                  )}
                </div>
              </div>

            </div>

            {/* Bottom Safe Disclaimers Row */}
            <div className="flex flex-wrap gap-8 items-center border-t border-slate-900 pt-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-500/80" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-blue-500/80" />
                <span>Identity Protection</span>
              </div>
            </div>
          </div>

          {/* RIGHT CONTAINER: SIDEBAR ORDER SUMMARY */}
          <div className="lg:col-span-4">
            <div className="bg-[#11141e] border border-slate-800/80 rounded-xl p-6 lg:p-7 space-y-6">
              <h2 className="text-base font-bold text-white tracking-wide">Order Summary</h2>

              {/* Product Info Summary Row */}
              {items.slice(0, 1).map((item: any, index: number) => (
                <div key={index} className="flex gap-4 items-start py-2">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#0a0c10] border border-slate-900 shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover brightness-90"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs font-semibold text-slate-200 truncate">{item.title}</h4>
                    <div className="text-[11px] text-slate-400">Rs {(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}
              {items.length > 1 && (
                <div className="text-[11px] text-slate-400">+{items.length - 1} more items</div>
              )}

              {/* Price Calculation Breakdowns */}
              <div className="space-y-4 text-xs border-t border-b border-slate-900 py-5">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">Rs {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Shipping</span>
                  <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px]">Free</span>
                </div>
              </div>

              {/* Grand Total Row display block */}
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-base font-bold text-white">Total</span>
                <span className="text-xl font-black text-white">Rs {total.toFixed(2)}</span>
              </div>

              {/* Confirm Pay Submission Button CTA */}
              <button 
                onClick={handleConfirmPayment}
                disabled={loading}
                className="w-full bg-[#a2beff] hover:bg-[#8eb0ff] text-slate-900 font-bold text-xs py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 group shadow-md shadow-blue-500/5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Order...' : 'Confirm & Pay'} <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
              </button>

              {/* Mini Legal Copy Disclaimer links */}
              <div className="text-[10px] text-slate-500 text-center leading-relaxed">
                By clicking, you agree to our{" "}
                <Link href="/terms" className="underline hover:text-slate-400 transition">
                  Terms of Service
                </Link>
                .
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* SYSTEM MARGIN FOOTER */}
      <footer className="bg-[#090b10] border-t border-slate-900 text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="font-bold text-slate-400">MotoParts</span>
            <span>© 2024 MotoParts. Precision Engineering for Every Ride.</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/privacy" className="hover:text-slate-300 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition">Terms of Service</Link>
            <Link href="/contact" className="hover:text-slate-300 transition">Contact Us</Link>
            <Link href="/shipping-info" className="hover:text-slate-300 transition">Shipping Info</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}