"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/api/products";

export default function PopularProducts() {
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

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Popular Products</h2>
          <p className="text-sm text-slate-400 mt-1">The most trusted components chosen by experts.</p>
        </div>
        <a href="#" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium group transition">
          View All Products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
        </a>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-400">Loading...</div>
      ) : (
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
                <button className="bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white p-2 rounded-full transition duration-200">
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}