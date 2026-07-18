"use client";

import React, { useState, useEffect } from "react";
import { Star, ShoppingCart, ShoppingBag, ArrowLeft, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Header from "../../_components/Header";
import Footer from "../../../(public)/_components/Footer";
import { useCart } from "@/context/CartContext";
import { getProductById, getProductsByCategory } from "@/lib/api/products";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProductById(id);
      if (response.success && response.data) {
        setProduct(response.data);
        fetchRelatedProducts(response.data.category, id);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category: string, currentId: string) => {
    try {
      const response = await getProductsByCategory(category);
      if (response.success) {
        const products = response.data || response.products || [];
        const related = products
          .filter((p: any) => (p._id || p.id) !== currentId)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (err) {
      console.error('Failed to fetch related products:', err);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      product: product._id || product.id,
      title: product.title,
      image: product.images?.[0]?.startsWith('http') ? product.images[0] : `http://localhost:5001${product.images?.[0] || product.image}`,
      price: parseFloat(product.price),
      quantity,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/user/checkout');
  };

  if (loading) return <div className="min-h-screen bg-[#0f1115] flex items-center justify-center text-slate-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0f1115] flex flex-col">
      <Header />
      <main className="flex-1 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* NAVIGATION */}
          <div className="flex items-center justify-between border-b border-slate-900 pb-4">
            <Link href="/user/shop" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-green-500 transition">
              <ArrowLeft size={14} /> Back to Collection
            </Link>
            <span className="text-[11px] text-slate-500 font-medium">Ref: #{product._id?.slice(-6)}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* IMAGE GALLERY */}
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-[#111319] border border-slate-900 aspect-square flex items-center justify-center">
                {product.featured && (
                  <span className="absolute top-4 left-4 z-10 bg-green-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Featured
                  </span>
                )}
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-4 right-4 z-10 p-2 bg-[#0a0c10]/60 backdrop-blur-md rounded-xl text-slate-400 hover:text-rose-500 transition"
                >
                  <Heart size={16} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "text-rose-500" : ""} />
                </button>
                <img 
                  src={product.images?.[activeImgIdx]?.startsWith('http') ? product.images[activeImgIdx] : `http://localhost:5001${product.images?.[activeImgIdx]}`}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* DETAILS */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-green-500 tracking-wider uppercase">{product.brand}</span>
                <h1 className="text-3xl font-extrabold text-white">{product.title}</h1>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-white">Rs {product.price}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-1 rounded ${product.stock > 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">{product.description}</p>

              {/* ACTIONS */}
              <div className="flex items-center gap-3 pt-6">
                <div className="flex items-center bg-[#111319] border border-slate-900 rounded-xl h-11">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 text-slate-500">-</button>
                  <span className="text-white font-bold w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="px-4 text-slate-500">+</button>
                </div>
                <button onClick={handleAddToCart} className="flex-1 bg-green-500/10 text-green-400 border border-green-500/20 font-bold text-xs h-11 rounded-xl transition">Add to Cart</button>
                <button onClick={handleBuyNow} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-xs h-11 rounded-xl transition">Buy Now</button>
              </div>
            </div>
          </div>

          {/* RELATED */}
          {relatedProducts.length > 0 && (
            <section className="space-y-6 pt-12 border-t border-slate-900">
              <h2 className="text-lg font-bold text-white">More from {product.category || "Collection"}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((item: any) => (
                  <div key={item._id} className="bg-[#111319] border border-slate-900 rounded-2xl p-4">
                    <img src={`http://localhost:5001${item.image}`} className="rounded-xl w-full aspect-square object-cover mb-4" />
                    <h4 className="text-xs font-semibold text-slate-200">{item.title}</h4>
                    <p className="text-green-400 font-bold text-sm mt-1">Rs {item.price}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <Footer />
      </main>
    </div>
  );
}