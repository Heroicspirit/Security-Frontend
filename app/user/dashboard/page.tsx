"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart, ArrowRight, Clock, CheckCircle2, X } from "lucide-react";
import Header from "../_components/Header";
import Link from "next/link";
import { getFeaturedProducts } from "@/lib/api/products";

export default function UserDashboardPage() {
  const [showToast, setShowToast] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getFeaturedProducts();
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0f1115] flex flex-col">
      <Header />
      <main className="flex-1 pb-16">
      
      {/* SUCCESS FLOATING TOAST NOTIFICATION */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#1f2635] border border-slate-800 rounded-xl p-4 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <div className="text-left pr-4">
            <p className="text-xs font-bold text-white">Plant added to cart!</p>
            <p className="text-[11px] text-slate-400">Your favorite plant is waiting for checkout.</p>
          </div>
          <button 
            onClick={() => setShowToast(false)} 
            className="text-slate-500 hover:text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#131722] to-[#0f1115] py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Exquisite Blooms for Every Moment
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-xl">
              Artisan floral arrangements and rare botanical collections delivered with care. Elevate your space with nature's finest artistry.
            </p>
            <div>
              <Link href="/user/plants" className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full transition shadow-lg shadow-green-600/20">
                Shop Selection
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="absolute inset-0 bg-green-600/10 blur-[120px] rounded-full max-w-md mx-auto"></div>
            <img 
              src="/images/flower.jpg" 
              alt="Flower Profile" 
              className="relative rounded-2xl max-h-[450px] object-cover drop-shadow-2xl mix-blend-lighten"
            />
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full">
        <h2 className="text-2xl font-bold mb-8 text-white">Shop by Category</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Big Card: bouquets */}
          <Link href="/user/bouquets" className="md:col-span-5 group relative overflow-hidden rounded-2xl bg-gradient-to-t from-black/80 to-transparent border border-slate-800 h-[380px] flex items-end p-6 cursor-pointer">
            <img 
              src="/images/flower.jpg" 
              alt="Flower bouquets" 
              className="absolute inset-0 w-full h-full object-cover -z-10 group-hover:scale-105 transition duration-500 brightness-[0.65]" 
            />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">bouquets</h3>
              <p className="text-sm text-slate-400">Fresh handcrafted flower bouquets</p>
            </div>
          </Link>

          {/* Split Container Right */}
          <div className="md:col-span-7 flex flex-col gap-6">
            {/* Top Row: Plants */}
            <Link href="/user/plants" className="group relative overflow-hidden rounded-2xl bg-gradient-to-t from-black/80 to-transparent border border-slate-800 h-[178px] flex items-end p-6 cursor-pointer">
              <img 
                src="/images/plants.jpg" 
                alt="Indoor Plants" 
                className="absolute inset-0 w-full h-full object-cover -z-10 group-hover:scale-105 transition duration-500 brightness-[0.55]" 
              />
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-white">Plants</h3>
              </div>
            </Link>

            {/* Bottom Row: Roses */}
            <Link href="/user/roses" className="group relative overflow-hidden rounded-2xl bg-gradient-to-t from-black/80 to-transparent border border-slate-800 h-[178px] flex items-end p-6 cursor-pointer">
              <img 
                src="/images/flower.jpg" 
                alt="Fresh Roses" 
                className="absolute inset-0 w-full h-full object-cover -z-10 group-hover:scale-105 transition duration-500 brightness-[0.5]" 
              />
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-white">Roses</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* POPULAR PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Popular Products</h2>
            <p className="text-sm text-slate-400 mt-1">Handpicked floral arrangements for every occasion.</p>
          </div>
          <Link href="/user/plants" className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1 font-medium group transition">
            View All Products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <div key={product._id || product.id} className="group bg-[#141822] border border-slate-800/60 rounded-2xl overflow-hidden p-4 flex flex-col justify-between hover:border-slate-700 transition">
              <div className="relative aspect-square w-full rounded-xl bg-slate-950 overflow-hidden mb-4 flex items-center justify-center">
                <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-full border border-slate-800">
                  {product.type || product.category}
                </span>
                <img src={product.image?.startsWith('http') ? product.image : `http://localhost:5001${product.image}`} alt={product.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-300" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">{product.type || product.category}</p>
                <h3 className="text-sm font-semibold text-slate-200 line-clamp-2 min-h-[40px] group-hover:text-white transition">{product.title}</h3>
                {product.stock > 0 && (
                  <span className="inline-block bg-slate-800/60 text-slate-400 text-[10px] font-medium px-2 py-0.5 rounded mt-1">
                    Available ({product.stock})
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-800/40">
                <span className="text-base font-bold text-white">Rs {product.price}</span>
                <button onClick={handleAddToCart} className="bg-green-600/10 hover:bg-green-600 text-green-400 hover:text-white p-2 rounded-full transition duration-200">
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FLASH SALE */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#17223b] via-[#111726] to-[#0f121d] border border-slate-800/80 p-8 sm:p-12 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-rose-400 font-semibold text-xs tracking-wider uppercase">
              <Clock className="w-4 h-4 text-rose-400 animate-pulse" /> Flash Sale Ending Soon
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Up to 40% Off Rare Botanical Plants
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Grab the best deals on premium indoor collections, exotic flowers, and plant maintenance essentials.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
              {/* Countdown Blocks */}
              {[
                { val: "08", label: "Hours" },
                { val: "42", label: "Mins" },
                { val: "15", label: "Secs" },
              ].map((timer, idx) => (
                <div key={idx} className="flex flex-col items-center bg-slate-950/60 border border-slate-800 px-4 py-2 rounded-xl min-w-[64px]">
                  <span className="text-xl font-bold text-white">{timer.val}</span>
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{timer.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="z-10 flex-shrink-0">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold text-base px-8 py-4 rounded-full transition shadow-xl shadow-green-600/10">
              Shop the Sale
            </button>
          </div>
        </div>
      </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/40 px-6 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="text-sm font-bold text-white tracking-tight">
              Plant<span className="text-green-400">Store</span>
            </div>
            <p>© 2026 PlantStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}