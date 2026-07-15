import React from "react";

export default function FeaturedCategories() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-2xl font-bold mb-8 text-white">
        Shop by Category
      </h2>

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
  );
}