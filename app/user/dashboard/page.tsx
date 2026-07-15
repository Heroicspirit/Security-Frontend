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
          <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
          <div className="text-left pr-4">
            <p className="text-xs font-bold text-white">Added to cart successfully!</p>
            <p className="text-[11px] text-slate-400">1 item added to your selection</p>
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
              <button className="bg-blue-400 hover:bg-blue-500 text-slate-950 font-semibold px-6 py-3 rounded-full transition shadow-lg shadow-blue-400/20">
                Shop
              </button>
            </div>
          </div>
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full max-w-md mx-auto"></div>
            <img 
              src="/images/flower.webp" 
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
          {/* Big Card - Bouquets */}
          <div className="md:col-span-5 group relative overflow-hidden rounded-2xl bg-gradient-to-t from-black/40 to-transparent border border-slate-800 h-[380px] flex items-end p-6">
            <img
              src="https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=600&q=80"
              alt="Flower Bouquets"
              className="absolute inset-0 w-full h-full object-cover -z-10 group-hover:scale-105 transition duration-500"
            />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">
                Bouquets
              </h3>
              <p className="text-sm text-slate-400">
                Fresh handcrafted flower bouquets
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="md:col-span-7 flex flex-col gap-6">
            {/* Plants */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-t from-black/40 to-transparent border border-slate-800 h-[178px] flex items-end p-6">
              <img
                src="/images/plants.webp"
                alt="Indoor Plants"
                className="absolute inset-0 w-full h-full object-cover -z-10 group-hover:scale-105 transition duration-500"
              />
              <div>
                <h3 className="text-lg font-bold text-white">
                  Plants
                </h3>
              </div>
            </div>

            {/* Roses */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-t from-black/40 to-transparent border border-slate-800 h-[178px] flex items-end p-6">
              <img
                src="https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80"
                alt="Fresh Roses"
                className="absolute inset-0 w-full h-full object-cover -z-10 group-hover:scale-105 transition duration-500"
              />
              <div>
                <h3 className="text-lg font-bold text-white">
                  Roses
                </h3>
              </div>
            </div>
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
          <a href="#" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium group transition">
            View All Products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <div key={product._id || product.id} className="group bg-[#141822] border border-slate-800/60 rounded-2xl overflow-hidden p-4 flex flex-col justify-between hover:border-slate-700 transition">
              <div className="relative aspect-square w-full rounded-xl bg-slate-950 overflow-hidden mb-4 flex items-center justify-center">
                <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-full border border-slate-800">
                  {product.brand}
                </span>
                <img src={product.image?.startsWith('http') ? product.image : `http://localhost:5001${product.image}`} alt={product.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-300" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">{product.category}</p>
                <h3 className="text-sm font-semibold text-slate-200 line-clamp-2 min-h-[40px] group-hover:text-white transition">{product.title}</h3>
                {product.stock > 0 && (
                  <span className="inline-block bg-slate-800/60 text-slate-400 text-[10px] font-medium px-2 py-0.5 rounded mt-1">
                    In Stock ({product.stock})
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-800/40">
                <span className="text-base font-bold text-white">Rs {product.price}</span>
                <button onClick={handleAddToCart} className="bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white p-2 rounded-full transition duration-200">
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/40 px-6 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="text-sm font-bold text-white tracking-tight">
              Moto<span className="text-blue-400">Parts</span>
            </div>
            <p>© 2026 Flowers. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}