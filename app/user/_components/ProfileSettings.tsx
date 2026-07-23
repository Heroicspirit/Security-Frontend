"use client";

import { useState } from "react";
import { Download, Upload, Loader2, FileText, CheckCircle2 } from "lucide-react";
import { handleExportProfile, handleImportProfile } from "@/lib/actions/auth-action";

export default function ProfileSettings() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [importData, setImportData] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await handleExportProfile();
      if (response.success && response.data) {
        // Create and download JSON file
        const dataStr = JSON.stringify(response.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `profile-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showMessage("success", "Profile exported successfully!");
      } else {
        showMessage("error", response.message || "Failed to export profile");
      }
    } catch (error: any) {
      showMessage("error", error.message || "Failed to export profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      showMessage("error", "Please paste profile data");
      return;
    }

    try {
      const parsedData = JSON.parse(importData);
      if (!parsedData.name && !parsedData.profilePicture) {
        showMessage("error", "Invalid profile data format");
        return;
      }

      setLoading(true);
      const response = await handleImportProfile(parsedData);
      if (response.success) {
        showMessage("success", "Profile imported successfully!");
        setImportData("");
        setShowImportModal(false);
      } else {
        showMessage("error", response.message || "Failed to import profile");
      }
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        showMessage("error", "Invalid JSON format");
      } else {
        showMessage("error", error.message || "Failed to import profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setImportData(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-[#141822] border border-slate-800/60 rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-blue-400" />
        <div>
          <h3 className="text-lg font-semibold text-white">Profile Export/Import</h3>
          <p className="text-sm text-slate-400">Backup and restore your profile data</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
          message.type === "success" 
            ? "bg-green-500/10 border border-green-500/20 text-green-400" 
            : "bg-red-500/10 border border-red-500/20 text-red-400"
        }`}>
          {message.type === "success" && <CheckCircle2 className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {/* Export Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white">Export Profile</h4>
            <p className="text-xs text-slate-400">Download your profile data as a JSON file</p>
          </div>
          <button
            onClick={handleExport}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2 text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white">Import Profile</h4>
            <p className="text-xs text-slate-400">Restore profile data from a JSON file</p>
          </div>
          <button
            onClick={() => setShowImportModal(true)}
            disabled={loading}
            className="bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2 text-sm border border-slate-700"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141822] border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-white">Import Profile</h4>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportData("");
                }}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Upload JSON file
                </span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="mt-1 block w-full text-sm text-slate-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-500 file:text-white
                    hover:file:bg-blue-600
                    cursor-pointer"
                />
              </label>

              <div className="text-center text-xs text-slate-500">— or paste JSON directly —</div>

              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder='{"name": "John Doe", "profilePicture": "..."}'
                rows={6}
                className="w-full bg-[#0f1115] border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-300 font-mono outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleImport}
                disabled={loading || !importData.trim()}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Import Profile
              </button>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportData("");
                }}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition"
              >
                Cancel
              </button>
            </div>

            <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-3">
              <p className="text-xs text-slate-400">
                <span className="font-semibold text-yellow-400">Warning:</span> Importing will update your profile with the data from the file. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 space-y-2">
        <p className="text-xs text-slate-400">
          <span className="font-semibold text-blue-400">Export includes:</span> Name, profile picture, favorite songs, MFA status, and account timestamps. Sensitive data like passwords and email are never exported.
        </p>
      </div>
    </div>
  );
}
