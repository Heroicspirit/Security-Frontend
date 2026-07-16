"use client";

import { useState } from "react";
import { Shield, ShieldCheck, ShieldX, Loader2, Copy, Check } from "lucide-react";
import { generateMfaSecret, enableMfa, disableMfa } from "@/lib/api/auth";

export default function MfaSettings() {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleGenerateSecret = async () => {
    try {
      setLoading(true);
      const response = await generateMfaSecret();
      if (response.success && response.data) {
        setQrCode(response.data.qrCode);
        setSecret(response.data.secret);
        showMessage("success", "QR code generated. Scan with your authenticator app.");
      }
    } catch (error: any) {
      showMessage("error", error.message || "Failed to generate MFA secret");
    } finally {
      setLoading(false);
    }
  };

  const handleEnableMfa = async () => {
    if (!token || token.length !== 6) {
      showMessage("error", "Please enter a valid 6-digit code");
      return;
    }

    try {
      setLoading(true);
      const response = await enableMfa(token);
      if (response.success) {
        setMfaEnabled(true);
        setQrCode(null);
        setSecret(null);
        setToken("");
        showMessage("success", "MFA enabled successfully!");
      }
    } catch (error: any) {
      showMessage("error", error.message || "Failed to enable MFA");
    } finally {
      setLoading(false);
    }
  };

  const handleDisableMfa = async () => {
    if (!confirm("Are you sure you want to disable MFA? This will make your account less secure.")) {
      return;
    }

    try {
      setLoading(true);
      const response = await disableMfa();
      if (response.success) {
        setMfaEnabled(false);
        showMessage("success", "MFA disabled successfully");
      }
    } catch (error: any) {
      showMessage("error", error.message || "Failed to disable MFA");
    } finally {
      setLoading(false);
    }
  };

  const handleCopySecret = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-[#141822] border border-slate-800/60 rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {mfaEnabled ? (
            <ShieldCheck className="w-6 h-6 text-green-400" />
          ) : (
            <ShieldX className="w-6 h-6 text-slate-500" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
            <p className="text-sm text-slate-400">
              {mfaEnabled ? "MFA is enabled on your account" : "Add an extra layer of security"}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          mfaEnabled 
            ? "bg-green-500/10 text-green-400 border border-green-500/20" 
            : "bg-slate-800 text-slate-400"
        }`}>
          {mfaEnabled ? "Enabled" : "Disabled"}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-3 rounded-xl text-sm font-medium ${
          message.type === "success" 
            ? "bg-green-500/10 border border-green-500/20 text-green-400" 
            : "bg-red-500/10 border border-red-500/20 text-red-400"
        }`}>
          {message.text}
        </div>
      )}

      {/* QR Code Display */}
      {qrCode && (
        <div className="bg-[#0f1115] border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-center">
            <img src={qrCode} alt="MFA QR Code" className="w-48 h-48" />
          </div>
          {secret && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Secret Key (backup)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={secret}
                  readOnly
                  className="flex-1 bg-[#181d29] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 font-mono"
                />
                <button
                  onClick={handleCopySecret}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                </button>
              </div>
            </div>
          )}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Enter 6-digit code from authenticator app
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="w-full bg-[#181d29] border border-slate-800 rounded-lg px-4 py-3 text-center text-2xl tracking-widest text-white font-mono outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleEnableMfa}
              disabled={loading || token.length !== 6}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              Enable MFA
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!qrCode && (
        <div className="flex items-center gap-3">
          {!mfaEnabled ? (
            <button
              onClick={handleGenerateSecret}
              disabled={loading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              Enable MFA
            </button>
          ) : (
            <button
              onClick={handleDisableMfa}
              disabled={loading}
              className="flex-1 bg-red-500/10 hover:bg-red-500/20 disabled:bg-slate-800 disabled:text-slate-500 text-red-400 hover:text-red-300 font-semibold py-3 rounded-xl border border-red-500/20 transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldX className="w-4 h-4" />}
              Disable MFA
            </button>
          )}
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 space-y-2">
        <p className="text-xs text-slate-400">
          <span className="font-semibold text-blue-400">How it works:</span> Use an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator to scan the QR code and generate 6-digit codes for login.
        </p>
      </div>
    </div>
  );
}
