"use client";

import { useState } from "react";
import Header from "../_components/Header";
import MfaSettings from "../_components/MfaSettings";
import ProfileSettings from "../_components/ProfileSettings";
import { X } from "lucide-react";

export default function SettingsPage() {
  const [showMfaModal, setShowMfaModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f1115] flex flex-col">
      <Header onOpenMfaSettings={() => setShowMfaModal(true)} />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-slate-400">Manage your account security and profile preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <ProfileSettings />
          
          {/* MFA Settings */}
          <MfaSettings />
        </div>
      </main>

      {/* MFA Modal */}
      {showMfaModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141822] border border-slate-800 rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Security Settings</h2>
              <button
                onClick={() => setShowMfaModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <MfaSettings />
          </div>
        </div>
      )}
    </div>
  );
}
