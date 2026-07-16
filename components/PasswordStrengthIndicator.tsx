"use client";

import { useEffect, useState } from "react";
import { API } from "@/lib/api/endpoints";
import axios from "axios";

interface PasswordStrengthResult {
  score: number;
  feedback: string[];
  isAcceptable: boolean;
}

interface PasswordStrengthIndicatorProps {
  password: string;
}

export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const [strength, setStrength] = useState<PasswordStrengthResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!password) {
      setStrength(null);
      return;
    }

    const checkStrength = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:5001/api/auth/check-password-strength",
          { password }
        );
        setStrength(response.data.data);
      } catch (error) {
        console.error("Error checking password strength:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(checkStrength, 300);
    return () => clearTimeout(debounceTimer);
  }, [password]);

  if (!password) return null;

  const getStrengthColor = (score: number) => {
    if (score <= 1) return "bg-red-500";
    if (score === 2) return "bg-orange-500";
    if (score === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthLabel = (score: number) => {
    if (score <= 1) return "Very Weak";
    if (score === 2) return "Weak";
    if (score === 3) return "Fair";
    if (score === 4) return "Strong";
    return "Very Strong";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strength ? getStrengthColor(strength.score) : "bg-slate-600"}`}
            style={{ width: strength ? `${(strength.score / 4) * 100}%` : "0%" }}
          />
        </div>
        {!loading && strength && (
          <span className={`text-[10px] font-medium ${strength.isAcceptable ? "text-green-400" : "text-slate-400"}`}>
            {getStrengthLabel(strength.score)}
          </span>
        )}
        {loading && <span className="text-[10px] text-slate-400">Checking...</span>}
      </div>
      {strength && strength.feedback.length > 0 && (
        <div className="space-y-1">
          {strength.feedback.map((feedback, index) => (
            <p key={index} className="text-[10px] text-slate-400">
              • {feedback}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
