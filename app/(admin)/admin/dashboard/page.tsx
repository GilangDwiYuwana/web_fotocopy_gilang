'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { getDashboardStats } from '@/src/actions/reportActions'; // Import action baru

type DayPoint = { label: string; value: number };

export default function AdminReportsPage() {
  const [data, setData] = useState<DayPoint[]>([]);
  const [txCount, setTxCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // --- AMBIL DATA DARI SERVER ---
  useEffect(() => {
    async function loadStats() {
      try {
        const stats = await getDashboardStats();
        setData(stats.chartData);
        setTxCount(stats.totalTxCount);
      } catch (error) {
        console.error("Gagal memuat laporan:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  // --- KALKULASI STATISTIK (Otomatis dari data database) ---
  const max = useMemo(() => Math.max(...data.map(d => d.value), 1), [data]);
  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);
  const avgPerDay = useMemo(() => (data.length > 0 ? Math.round(total / data.length) : 0), [total, data]);

  // Cari hari dengan penjualan tertinggi
  const bestDay = useMemo(() => {
    if (data.length === 0) return '-';
    const sorted = [...data].sort((a, b) => b.value - a.value);
    return sorted[0].value > 0 ? sorted[0].label : '-';
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fb]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#123891]"></div>
        <p className="mt-4 text-[#4f6596]">Menghitung omset mingguan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fb] via-white to-[#f0f2f8] py-8">
      {/* Header */}
      <div className="mb-12 px-6">
        <h1 className="text-4xl font-black text-[#0e121b] mb-2">Dashboard</h1>
        <p className="text-lg text-[#4f6596]">Pantau performa penjualan mingguan Anda (Data Real-time)</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 px-6">
        {[
          {
            label: 'Pendapatan (7 Hari)',
            value: `Rp ${total.toLocaleString('id-ID')}`,
            icon: '💰',
            color: 'from-[#123891] to-[#4f6596]',
            lightBg: 'bg-[#123891]/10'
          },
          {
            label: 'Total Transaksi (All Time)',
            value: txCount.toString(),
            icon: '📊',
            color: 'from-[#4f6596] to-[#6b8cc9]',
            lightBg: 'bg-[#4f6596]/10'
          },
          {
            label: 'Rata-rata / Hari',
            value: `Rp ${avgPerDay.toLocaleString('id-ID')}`,
            icon: '📈',
            color: 'from-[#2e5090] to-[#4f6596]',
            lightBg: 'bg-[#2e5090]/10'
          },
          {
            label: 'Hari Terbaik',
            value: bestDay,
            icon: '⭐',
            color: 'from-[#f59e0b] to-[#d97706]',
            lightBg: 'bg-[#f59e0b]/10'
          }
        ].map((stat, idx) => (
          <div key={idx} className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-[#e8ebf3] hover:border-[#123891]">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-[#4f6596] mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#0e121b]">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.lightBg} flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 px-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#e8ebf3] p-8 hover:shadow-lg transition-all duration-300">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#0e121b] mb-2">Omset Mingguan</h2>
            <p className="text-sm text-[#4f6596]">Pendapatan per hari dalam seminggu terakhir</p>
          </div>

          <div className="flex items-end justify-between h-64 gap-3 px-2 py-4 bg-gradient-to-br from-[#f8f9fb] to-white rounded-xl">
            {data.map((d) => {
              const heightPercent = max > 0 ? (d.value / max) * 100 : 0;
              return (
                <div key={d.label} className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="w-full flex flex-col items-center">
                    <div className="relative w-full h-48 flex items-end justify-center mb-2 group">
                      {/* Bar Chart */}
                      <div
                        className="w-full bg-gradient-to-t from-[#123891] to-[#4f6596] rounded-t-lg transition-all duration-300 group-hover:shadow-lg group-hover:from-[#0d2654] group-hover:to-[#3d4f7d] cursor-pointer relative"
                        style={{
                          height: `${Math.max(2, heightPercent)}%`, // Minimal 2% agar bar terlihat walau 0
                        }}
                      >
                        {/* Tooltip saat hover */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0e121b] text-white text-xs font-bold px-3 py-1 rounded-lg whitespace-nowrap z-10">
                          Rp {(d.value / 1000).toFixed(0)}k
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-[#0e121b]">{d.label}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Info Cards Sidebar */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#123891] to-[#0e2c75] rounded-xl shadow-lg p-6 text-white">
             <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-full text-2xl">💡</div>
                <div>
                   <h3 className="font-bold text-lg">Info Grafik</h3>
                   <p className="text-sm text-blue-100 mt-1">Grafik ini menampilkan total uang masuk dari pesanan yang tidak dibatalkan selama 7 hari ke belakang.</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8ebf3] p-8 hover:shadow-lg transition-all duration-300">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#0e121b] mb-2">Detail Harian</h3>
            <p className="text-sm text-[#4f6596]">Rincian omset untuk setiap hari</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e8ebf3]">
                  <th className="text-left py-4 px-4 font-semibold text-[#0e121b] text-sm">Hari</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#0e121b] text-sm">Omset</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#0e121b] text-sm">Persentase</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#0e121b] text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d, idx) => {
                  const percentage = total > 0 ? Math.round((d.value / total) * 100) : 0;
                  const isAboveAvg = d.value >= avgPerDay;
                  return (
                    <tr key={idx} className="border-b border-[#e8ebf3] hover:bg-[#f8f9fb] transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-semibold text-[#0e121b]">{d.label}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-[#123891]">Rp {d.value.toLocaleString('id-ID')}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-[#e8ebf3] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#123891] to-[#4f6596]"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-[#4f6596]">{percentage}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          isAboveAvg && d.value > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {isAboveAvg && d.value > 0 ? '📈 Baik' : '📉 Normal'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}