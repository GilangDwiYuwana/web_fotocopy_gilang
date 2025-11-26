'use client'

import React, { useMemo } from 'react'

type DayPoint = { label: string; value: number }

const SAMPLE_DATA: DayPoint[] = [
  { label: 'Senin', value: 1200000 },
  { label: 'Selasa', value: 850000 },
  { label: 'Rabu', value: 1500000 },
  { label: 'Kamis', value: 950000 },
  { label: 'Jumat', value: 400000 },
  { label: 'Sabtu', value: 1100000 },
  { label: 'Minggu', value: 700000 },
]

export default function AdminReportsPage() {
  const data = useMemo(() => SAMPLE_DATA, [])
  const max = useMemo(() => Math.max(...data.map(d => d.value), 1), [data])
  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data])
  const txCount = useMemo(() => 250, [])
  const avgPerDay = useMemo(() => Math.round(total / data.length), [total, data])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fb] via-white to-[#f0f2f8] py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-black text-[#0e121b] mb-2">Dashboard</h1>
        <p className="text-lg text-[#4f6596]">Pantau performa penjualan mingguan Anda</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: 'Total Pendapatan',
            value: `Rp ${total.toLocaleString('id-ID')}`,
            icon: '💰',
            color: 'from-[#123891] to-[#4f6596]',
            lightBg: 'bg-[#123891]/10'
          },
          {
            label: 'Jumlah Transaksi',
            value: txCount.toString(),
            icon: '📊',
            color: 'from-[#4f6596] to-[#6b8cc9]',
            lightBg: 'bg-[#4f6596]/10'
          },
          {
            label: 'Rata-rata per Hari',
            value: `Rp ${avgPerDay.toLocaleString('id-ID')}`,
            icon: '📈',
            color: 'from-[#2e5090] to-[#4f6596]',
            lightBg: 'bg-[#2e5090]/10'
          },
          {
            label: 'Hari Terbaik',
            value: 'Rabu',
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#e8ebf3] p-8 hover:shadow-lg transition-all duration-300">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#0e121b] mb-2">Omset Mingguan</h2>
            <p className="text-sm text-[#4f6596]">Pendapatan per hari dalam seminggu terakhir</p>
          </div>

          <div className="flex items-end justify-between h-64 gap-3 px-2 py-4 bg-gradient-to-br from-[#f8f9fb] to-white rounded-xl">
            {data.map((d) => {
              const heightPercent = (d.value / max) * 100
              return (
                <div key={d.label} className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="w-full flex flex-col items-center">
                    <div className="relative w-full h-48 flex items-end justify-center mb-2 group">
                      <div
                        className="w-full bg-gradient-to-t from-[#123891] to-[#4f6596] rounded-t-lg transition-all duration-300 group-hover:shadow-lg group-hover:from-[#0d2654] group-hover:to-[#3d4f7d] cursor-pointer relative"
                        style={{
                          height: `${Math.max(10, heightPercent)}%`,
                        }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0e121b] text-white text-xs font-bold px-3 py-1 rounded-lg whitespace-nowrap">
                          Rp {(d.value / 1000000).toFixed(1)}M
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

        {/* Info Cards */}
        <div className="space-y-4">
          {[
            {
              title: 'Performa',
              value: '↑ 24%',
              desc: 'Naik dari minggu lalu',
              icon: '📈',
              color: 'text-green-500'
            },
            {
              title: 'Pelanggan Baru',
              value: '47',
              desc: 'Pengguna baru minggu ini',
              icon: '👥',
              color: 'text-blue-500'
            },
            {
              title: 'Rating',
              value: '4.8',
              desc: 'Dari 250 ulasan',
              icon: '⭐',
              color: 'text-yellow-500'
            }
          ].map((card, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-[#e8ebf3] p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-[#4f6596] font-medium mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-[#0e121b]">{card.value}</p>
                </div>
                <span className="text-2xl">{card.icon}</span>
              </div>
              <p className="text-xs text-[#4f6596]">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Table */}
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
                const percentage = Math.round((d.value / total) * 100)
                const isAboveAvg = d.value >= avgPerDay
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
                        isAboveAvg
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {isAboveAvg ? '📈 Baik' : '📉 Normal'}
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
  )
}