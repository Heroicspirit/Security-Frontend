"use client";

import RegisterForm from "../_components/RegisterForm";

export default function Page() {
  return (
    <div 
      className="w-full h-full flex items-center justify-center px-6 md:px-12 transition-colors duration-200" 
      style={{ backgroundColor: '#51638F' }}
    >
      {/* Retain layout structure bounds safely at page level */}
      <div className="w-full max-w-[400px]">
        <RegisterForm />
      </div>
    </div>
  );
}