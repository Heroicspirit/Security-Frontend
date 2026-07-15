"use client";

import React, { useState, useEffect } from "react";
import { 
  Heart, 
  ShoppingCart, 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  X 
} from "lucide-react";
import Header from "../_components/Header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { getProductsByCategory } from "@/lib/api/products";

const MAX_PRICE = 2000;

type SortOption = "default" | "priceHigh" | "priceLow";

const SORT_LABELS: Record<SortOption, string> = {
  default: "Featured",
  priceHigh: "Highest Price",
  priceLow: "Lowest Price",
};

export default function BikePartsPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<(string | number)[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(MAX_PRICE);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProductsByCategory('bikeparts');
      if (response.success) {
        setProducts(response.data || response.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: string | number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddToCart = (product: any) => {
    if (!product.stock || product.stock <= 0) return;

    addToCart({
      product: product._id || product.id,
      title: product.title,
      image: product.image?.startsWith('http') ? product.image : `http://localhost:5001${product.image}`,
      price: parseFloat(product.price),
      quantity: 1
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const resetFilters = () => {
    setSelectedBrand("");
    setMaxPrice(MAX_PRICE);
    setInStockOnly(false);
  };

  // Combined filters: brand, price range, and stock availability
  const filteredProducts = products.filter((product: any) => {
    if (selectedBrand && product.brand?.toLowerCase() !== selectedBrand.toLowerCase()) {
      return false;
    }

    const price = parseFloat(product.price);
    // Treat MAX_PRICE as "no upper limit" (i.e. "Rs 2000+")
    if (maxPrice < MAX_PRICE && !isNaN(price) && price > maxPrice) {
      return false;
    }

    if (inStockOnly && (!product.stock || product.stock <= 0)) {
      return false;
    }

    return true;
  });

  // Apply sorting on top of the filtered results (doesn't mutate the original array)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parseFloat(a.price) || 0;
    const priceB = parseFloat(b.price) || 0;

    if (sortOption === "priceHigh") return priceB - priceA;
    if (sortOption === "priceLow") return priceA - priceB;
    return 0; // "default" — keep original order
  });

  return (
    <div className="min-h-screen bg-[#0f1115] flex flex-col">
      <Header />
      <main className="flex-1 p-6 lg:p-10">
      
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

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR FILTERS */}
        <aside className="w-full lg:w-60 shrink-0 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-900">
            <h3 className="text-sm font-bold tracking-wider uppercase text-white">Filters</h3>
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          </div>

          {/* Brand Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Brand</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="space-y-2.5 pl-0.5">
              {["Brembo", "Akrapovič", "Öhlins"].map((brand) => (
                <label key={brand} className="flex items-center gap-3 text-xs text-slate-400 hover:text-slate-200 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={selectedBrand === brand}
                    onChange={() => setSelectedBrand(prev => prev === brand ? "" : brand)}
                    className="w-4 h-4 rounded border-slate-800 bg-[#111319] text-blue-500 focus:ring-0 accent-blue-500" 
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Price Range</span>
              <button
                onClick={resetFilters}
                className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 transition"
              >
                Show All
              </button>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min={0}
                max={MAX_PRICE}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-medium text-slate-500">
                <span>Rs 0</span>
                <span>{maxPrice >= MAX_PRICE ? `Rs ${MAX_PRICE}+` : `Rs ${maxPrice}`}</span>
              </div>
            </div>
          </div>

          {/* Compatibility Selector drop list */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Compatibility</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <button className="w-full bg-[#111319] border border-slate-800/80 rounded-xl px-3 py-2.5 flex items-center justify-between text-xs text-slate-400 hover:border-slate-700 transition">
              <span>Select Bike Model</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          {/* Availability Toggle options */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Availability</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <label className="flex items-center gap-3 text-xs text-slate-400 hover:text-slate-200 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-800 bg-[#111319] text-blue-500 focus:ring-0 accent-blue-500" 
              />
              <span>In Stock</span>
            </label>
          </div>
        </aside>

        {/* PRODUCTS CATALOG MODULE */}
        <div className="flex-1 space-y-6">
          
          {/* List Toolbar Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Bike Parts</h1>
              <p className="text-xs text-slate-500 pt-0.5">
                Showing {sortedProducts.length} of {products.length} results
              </p>
            </div>

            {/* Catalog Sorting Options Selector */}
            <div className="relative flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-slate-500">Sort by:</span>
              <button
                onClick={() => setSortMenuOpen((v) => !v)}
                className="bg-[#111319] border border-slate-800/80 rounded-xl px-4 py-2 flex items-center gap-3 text-xs font-semibold text-white hover:border-slate-700 transition"
              >
                <span>{SORT_LABELS[sortOption]}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${sortMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {sortMenuOpen && (
                <>
                  {/* Backdrop to close menu on outside click */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setSortMenuOpen(false)} 
                  />
                  <div className="absolute top-full right-0 mt-2 w-40 bg-[#111319] border border-slate-800 rounded-xl overflow-hidden z-20 shadow-xl">
                    {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortOption(option);
                          setSortMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-medium transition ${
                          sortOption === option 
                            ? "bg-blue-500/10 text-blue-400" 
                            : "text-slate-300 hover:bg-slate-800/60"
                        }`}
                      >
                        {SORT_LABELS[option]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center text-slate-500 text-sm py-12">
              Loading products...
            </div>
          )}

          {/* Empty State */}
          {!loading && sortedProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 text-center text-slate-500 text-sm py-12">
              <span>No products found for the selected filters.</span>
              <button
                onClick={resetFilters}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition"
              >
                Show All Products
              </button>
            </div>
          )}

          {/* Products Cards System Response Grid */}
          {!loading && sortedProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product: any) => {
                const productId = product._id || product.id;
                const isFavorite = favorites.includes(productId);
                const isOutOfStock = !product.stock || product.stock <= 0;

                return (
                  <div key={productId} className="group bg-[#111319] border border-slate-900 rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:border-slate-800 transition duration-150">
                    
                    {/* Image Section Frame with Action Badge Layering */}
                    <div className="relative rounded-xl overflow-hidden aspect-square bg-[#0a0c10] flex items-center justify-center">
                      {product.tag && (
                        <span className="absolute top-3 left-3 z-10 bg-blue-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                          {product.tag}
                        </span>
                      )}
                      {product.discount && (
                        <span className="absolute top-3 left-3 z-10 bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {product.discount}
                        </span>
                      )}
                      
                      {/* Heart Wishlist Trigger */}
                      <button 
                        onClick={() => toggleFavorite(productId)}
                        className="absolute top-3 right-3 z-10 p-1.5 bg-[#0a0c10]/40 backdrop-blur-sm rounded-full text-slate-400 hover:text-rose-500 hover:scale-105 transition"
                      >
                        <Heart 
                          className={`w-4 h-4 ${isFavorite ? "text-rose-500" : ""}`}
                          fill={isFavorite ? "currentColor" : "none"}
                        />
                      </button>

                      <img 
                        src={product.image?.startsWith('http') ? product.image : `http://localhost:5001${product.image}`} 
                        alt={product.title} 
                        className={`w-full h-full object-cover brightness-90 group-hover:scale-102 transition duration-300 ${isOutOfStock ? "opacity-40 grayscale" : ""}`}
                      />
                    </div>

                    {/* Information content block */}
                    <div className="space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                          {product.brand}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-200 line-clamp-2 leading-snug group-hover:text-white transition">
                          {product.title}
                        </h4>
                        {isOutOfStock ? (
                          <span className="inline-block bg-rose-950/60 text-rose-400 text-[10px] font-medium px-2 py-0.5 rounded mt-1">
                            Out of Stock
                          </span>
                        ) : (
                          <span className="inline-block bg-slate-800/60 text-slate-400 text-[10px] font-medium px-2 py-0.5 rounded mt-1">
                            In Stock
                          </span>
                        )}
                      </div>

                      {/* Pricing Matrix & Purchase Trigger */}
                      <div className="space-y-3 pt-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-bold text-white">
                            Rs {product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-slate-600 line-through">
                              Rs {product.originalPrice}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {isOutOfStock ? (
                            <span className="flex-1 bg-slate-800 text-slate-500 font-semibold text-xs py-2.5 px-4 rounded-xl text-center cursor-not-allowed">
                              Out of Stock
                            </span>
                          ) : (
                            <Link href={`/user/bikeparts/${productId}`} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition shadow-sm shadow-blue-500/5 text-center">
                              Buy Now
                            </Link>
                          )}
                          <button 
                            onClick={() => handleAddToCart(product)}
                            disabled={isOutOfStock}
                            className="p-2.5 bg-[#181d29] hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl border border-slate-800/80 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#181d29] disabled:hover:text-slate-400"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Pagination Interface Control Footer */}
          <div className="flex items-center justify-center gap-2 pt-8">
            <button className="p-2 bg-[#111319] border border-slate-900 rounded-xl text-slate-500 hover:text-slate-300 transition disabled:opacity-40" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center shadow-md shadow-blue-500/10">
              1
            </button>
            <button className="w-8 h-8 bg-[#111319] border border-slate-900 text-slate-400 hover:text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center transition">
              2
            </button>
            <button className="w-8 h-8 bg-[#111319] border border-slate-900 text-slate-400 hover:text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center transition">
              3
            </button>
            <button className="p-2 bg-[#111319] border border-slate-900 rounded-xl text-slate-400 hover:text-slate-200 transition">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
      </main>

    </div>
  );
}