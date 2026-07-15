import React from "react";
import { Clock } from "lucide-react";

export default function FlashSale() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="relative rounded-3xl bg-gradient-to-r from-[#17223b] via-[#111726] to-[#0f121d] border border-slate-800/80 p-8 sm:p-12 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 text-rose-400 font-semibold text-xs tracking-wider uppercase">
            <Clock className="w-4 h-4 text-rose-400 animate-pulse" /> Flash Sale Ending Soon
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Up to 40% Off Select Accessories
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Grab the best deals on premium riding gear, exhausts, and performance kits.
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
          <button className="bg-blue-400 hover:bg-blue-500 text-slate-950 font-bold text-base px-8 py-4 rounded-full transition shadow-xl shadow-blue-400/10">
            Shop the Sale
          </button>
        </div>
      </div>
    </section>
  );
}