"use client";

import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface Props {
  complianceScore: number;
  riskScore: number;
  estDays: number;
}

export default function ForecastChart({ complianceScore, riskScore, estDays }: Props) {
  const { lang } = useStore();

  // Generate forecast data points
  const data = Array.from({ length: 8 }, (_, i) => {
    const day = i * Math.ceil(estDays / 7);
    const compliance = Math.min(100, complianceScore + (i * (100 - complianceScore)) / 8 + (Math.random() * 5 - 2));
    const risk = Math.max(0, riskScore - (i * riskScore) / 8 + (Math.random() * 5 - 2));
    return {
      day: `D${day}`,
      compliance: Math.round(Math.max(0, Math.min(100, compliance))),
      risk: Math.round(Math.max(0, Math.min(100, risk))),
    };
  });

  return (
    <div>
      <h4 className="text-xs font-bold text-white mb-2">
        📈 {t("deal.forecast", lang)}
      </h4>
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="complianceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#6b7280" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "#6b7280" }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                fontSize: 10,
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(20, 24, 37, 0.95)",
                color: "#e5e7eb",
              }}
              labelStyle={{ fontSize: 10, fontWeight: "bold", color: "#e5e7eb" }}
            />
            <Area type="monotone" dataKey="compliance" stroke="#34d399" fill="url(#complianceGrad)" strokeWidth={2} name="Compliance" />
            <Area type="monotone" dataKey="risk" stroke="#fbbf24" fill="url(#riskGrad)" strokeWidth={2} name="Risk" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-4 mt-1">
        <span className="flex items-center gap-1 text-[10px] text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Compliance
        </span>
        <span className="flex items-center gap-1 text-[10px] text-amber-400">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> Risk
        </span>
      </div>
    </div>
  );
}
