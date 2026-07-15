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
        // Fetch related products from same category
        fetchRelatedProducts(response.data.category, id);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Failed to fetch product:', err);
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
        // Filter out current product and limit to 4
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1115] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-slate-400">Loading product...</div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#0f1115] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-slate-400 mb-4">{error || 'Product not found'}</div>
            <Link href="/user/bikeparts" className="text-blue-400 hover:underline">
              Back to Products
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const specs = product.specs || [];

  return (
    <div className="min-h-screen bg-[#0f1115] flex flex-col">
      <Header />
      <main className="flex-1 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* BACK TO BROWSE ACTION TIMELINE */}
        <div className="flex items-center justify-between border-b border-slate-900 pb-4">
          <Link href="/user/bikeparts" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
            <ArrowLeft size={14} /> Back to Catalog
          </Link>
          <span className="text-[11px] text-slate-500 font-medium">Product Reference: #{product._id?.slice(-6) || product.id?.slice(-6)}</span>
        </div>

        {/* COMPONENT LAYOUT MATRIX SPLIT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* LEFT: IMAGE VIEWPORT GALLERY STACK */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-[#111319] border border-slate-900 aspect-square flex items-center justify-center">
              {product.featured && (
                <span className="absolute top-4 left-4 z-10 bg-blue-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
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
                src={images[activeImgIdx]?.startsWith('http') ? images[activeImgIdx] : `http://localhost:5001${images[activeImgIdx]}`}
                alt={product.title}
                className="w-full h-full object-cover brightness-95"
              />
            </div>

            {/* Gallery Mini Previews Row */}
            <div className="grid grid-cols-3 gap-4">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden bg-[#111319] border transition-all ${
                    activeImgIdx === idx ? "border-blue-500 ring-1 ring-blue-500" : "border-slate-900 hover:border-slate-800"
                  }`}
                >
                  <img src={img?.startsWith('http') ? img : `http://localhost:5001${img}`} alt="Thumbnail preview" className="w-full h-full object-cover brightness-75" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: META INFO, PRICE, TECHNICAL SPECS TABLE */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
                {product.brand}
              </span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                {product.title}
              </h1>
              
              {/* Reviews & Star Rating Row */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center text-blue-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} className="stroke-none" />
                  ))}
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  ({product.reviewsCount || 0} Reviews)
                </span>
              </div>
            </div>

            {/* Pricing Section Details */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl font-black text-white">
                Rs {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-600 line-through">
                  Rs {product.originalPrice}
                </span>
              )}
              {product.discountBadge && (
                <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black px-2 py-0.5 rounded">
                  {product.discountBadge}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                product.stock > 0 
                  ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
              </span>
            </div>

            {/* TECHNICAL SPECIFICATIONS TABLE COMPONENT */}
            {specs.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-900">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Technical Specifications
                </h3>
                <div className="bg-[#111319]/50 rounded-xl border border-slate-900 overflow-hidden divide-y divide-slate-900/60 text-xs">
                  {specs.map((spec: any, idx: number) => (
                    <div key={idx} className="flex justify-between p-3.5 px-4 items-center">
                      <span className="text-slate-400 font-medium">{spec.label}</span>
                      <span className="text-slate-200 font-semibold text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="space-y-2 pt-4 border-t border-slate-900">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Description
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* PURCHASE & ACTIONS COUNTER HUD */}
            <div className="flex items-center gap-3 pt-6">
              {/* Incremental Stepper */}
              <div className="flex items-center bg-[#111319] border border-slate-900 rounded-xl h-11">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3.5 text-slate-500 hover:text-white text-sm font-bold transition"
                >
                  -
                </button>
                <span className="w-6 text-center text-xs font-bold text-white select-none">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3.5 text-slate-500 hover:text-white text-sm font-bold transition"
                >
                  +
                </button>
              </div>

              {/* Add to selection basket */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 font-bold text-xs h-11 px-4 rounded-xl transition flex items-center justify-center gap-2"
              >
                <ShoppingCart size={14} /> Add to Cart
              </button>

              {/* Immediate Checkout Trigger */}
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs h-11 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/10"
              >
                <ShoppingBag size={14} /> Buy Now
              </button>
            </div>
          </div>

        </div>

        {/* RECOMMENDATION BLOCK (YOU MAY ALSO LIKE) */}
        {relatedProducts.length > 0 && (
          <section className="space-y-6 pt-12 border-t border-slate-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white tracking-tight">You may also like</h2>
              <Link href="/user/bikeparts" className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1 transition">
                View all components <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item: any) => (
                <div key={item._id || item.id} className="group bg-[#111319] border border-slate-900 rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:border-slate-800 transition">
                  <div className="relative rounded-xl overflow-hidden aspect-square bg-[#0a0c10]">
                    <img 
                      src={item.image?.startsWith('http') ? item.image : `http://localhost:5001${item.image}`} 
                      alt={item.title} 
                      className="w-full h-full object-cover brightness-90 group-hover:scale-102 transition duration-300" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">{item.brand}</span>
                      <h4 className="text-xs font-semibold text-slate-200 line-clamp-1 pt-0.5 group-hover:text-white transition">{item.title}</h4>
                    </div>
                    
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-white">Rs {item.price}</span>
                      <button className="p-2.5 bg-[#181d29] hover:bg-blue-500 text-slate-400 hover:text-white rounded-xl border border-slate-800/80 transition">
                        <ShoppingCart size={13} />
                      </button>
                    </div>
                  </div>
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