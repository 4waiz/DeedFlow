"use client";

import { Deal } from "@/lib/types";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Home, DollarSign, Users } from "lucide-react";

interface MyPropertyProps {
  deal: Deal;
}

// Sample market comparison data
const marketData = [
  { month: "Jan", yourProperty: 2800000, marketAvg: 2700000, premium: 2900000 },
  { month: "Feb", yourProperty: 2850000, marketAvg: 2750000, premium: 2950000 },
  { month: "Mar", yourProperty: 2920000, marketAvg: 2800000, premium: 3050000 },
  { month: "Apr", yourProperty: 3000000, marketAvg: 2900000, premium: 3150000 },
  { month: "May", yourProperty: 3100000, marketAvg: 3000000, premium: 3250000 },
  { month: "Jun", yourProperty: 3200000, marketAvg: 3100000, premium: 3400000 },
];

// Price per square foot comparison
const pricePerSqftData = [
  { category: "Your Property", value: 3000, color: "#34d399" },
  { category: "Market Average", value: 2850, color: "#9ca3af" },
  { category: "Premium Market", value: 3400, color: "#fbbf24" },
];

export default function MyProperty({ deal }: MyPropertyProps) {
  const propertyAppreciation = (
    ((marketData[marketData.length - 1].yourProperty - marketData[0].yourProperty) /
      marketData[0].yourProperty) *
    100
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Property Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#141825] rounded-2xl border border-white/[0.06] p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Property Value</span>
            <Home size={16} className="text-emerald-400" />
          </div>
          <p className="text-lg font-bold text-white">
            AED {deal.totalValue.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-400 mt-1">+{propertyAppreciation}% YTD</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-[#141825] rounded-2xl border border-white/[0.06] p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Price/SqFt</span>
            <TrendingUp size={16} className="text-emerald-400" />
          </div>
          <p className="text-lg font-bold text-white">AED 3,000</p>
          <p className="text-xs text-gray-400 mt-1">+5.3% vs market</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#141825] rounded-2xl border border-white/[0.06] p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Total Shares</span>
            <DollarSign size={16} className="text-amber-400" />
          </div>
          <p className="text-lg font-bold text-white">{deal.totalShares}</p>
          <p className="text-xs text-gray-400 mt-1">@ AED {deal.sharePrice}/share</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#141825] rounded-2xl border border-white/[0.06] p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Investors</span>
            <Users size={16} className="text-blue-400" />
          </div>
          <p className="text-lg font-bold text-white">{deal.parties.length}</p>
          <p className="text-xs text-gray-400 mt-1">Active stakeholders</p>
        </motion.div>
      </div>

      {/* Market Comparison Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#141825] rounded-2xl border border-white/[0.06] p-6"
      >
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-6">
          Market Value Comparison
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={marketData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                background: "rgba(20, 24, 37, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#fff" }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Line
              type="monotone"
              dataKey="yourProperty"
              stroke="#34d399"
              strokeWidth={2.5}
              name="Your Property"
              dot={{ fill: "#34d399", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="marketAvg"
              stroke="#9ca3af"
              strokeWidth={2}
              name="Market Average"
              dot={{ fill: "#9ca3af", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="premium"
              stroke="#fbbf24"
              strokeWidth={2}
              name="Premium Market"
              dot={{ fill: "#fbbf24", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Price Comparison Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-[#141825] rounded-2xl border border-white/[0.06] p-6"
      >
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-6">
          Price Per Square Foot Comparison
        </h3>
        <div className="space-y-4">
          {pricePerSqftData.map((item, index) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">{item.category}</span>
                <span className="text-sm font-semibold text-white">AED {item.value}</span>
              </div>
              <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / 3400) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Market Insights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="bg-[#141825] rounded-2xl border border-white/[0.06] p-6">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">
            Your Advantage
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">✓</span>
              <span className="text-sm text-gray-400">Property outperforming market by 5.3%</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">✓</span>
              <span className="text-sm text-gray-400">Strong appreciation trajectory (14.3% YTD)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">✓</span>
              <span className="text-sm text-gray-400">Premium location in high-demand area</span>
            </li>
          </ul>
        </div>

        <div className="bg-[#141825] rounded-2xl border border-white/[0.06] p-6">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">
            Market Position
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span className="text-sm text-gray-400">Top 15% of market in appreciation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span className="text-sm text-gray-400">Competitive pricing vs premium segment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span className="text-sm text-gray-400">Strong investor interest (7 stakeholders)</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
