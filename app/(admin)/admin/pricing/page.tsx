'use client'

import React, { useState } from 'react'

type Service = {
  id: string
  name: string
  price: number
}

const initialServices: Service[] = [
  { id: 's1', name: 'Kertas HVS A4', price: 500 },
  { id: 's2', name: 'Warna', price: 1000 },
  { id: 's3', name: 'Ukuran A3', price: 750 },
  { id: 's4', name: 'Finishing', price: 250 },
  { id: 's5', name: 'Jumlah Halaman', price: 100 },
]

export default function AdminPricingPage() {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  function updatePrice(id: string, value: number) {
    setServices(prev => prev.map(s => (s.id === id ? { ...s, price: Math.max(0, value) } : s)))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await new Promise(res => setTimeout(res, 600))
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const totalPrice = services.reduce((sum, s) => sum + s.price, 0)
  const hasChanges = JSON.stringify(services) !== JSON.stringify(initialServices)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fb] via-white to-[#f0f2f8] py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-[#0e121b] mb-2">Atur Harga</h1>
        <p className="text-lg text-[#4f6596]">Kelola harga layanan cetak Anda</p>
      </div>

      {/* Success Alert */}
      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-green-100 border border-green-200 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-green-700">Berhasil!</p>
            <p className="text-sm text-green-600">Perubahan harga telah disimpan</p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pricing Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-[#e8ebf3] overflow-hidden hover:shadow-lg transition-all">
            <div className="bg-gradient-to-r from-[#f8f9fb] to-[#f0f2f8] border-b border-[#e8ebf3] px-8 py-6">
              <h2 className="text-xl font-bold text-[#0e121b] mb-1">Komponen Harga</h2>
              <p className="text-sm text-[#4f6596]">Perbarui harga untuk setiap komponen layanan</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white border-b border-[#e8ebf3]">
                    <th className="px-8 py-4 text-left text-sm font-bold text-[#0e121b]">Komponen</th>
                    <th className="px-8 py-4 text-right text-sm font-bold text-[#0e121b]">Harga</th>
                    <th className="px-8 py-4 text-center text-sm font-bold text-[#0e121b]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((s, idx) => {
                    const isChanged = s.price !== initialServices.find(x => x.id === s.id)?.price
                    return (
                      <tr key={s.id} className={`border-b border-[#e8ebf3] hover:bg-[#f8f9fb] transition-colors group ${idx === services.length - 1 ? 'border-b-0' : ''}`}>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#123891]/20 to-[#4f6596]/20 flex items-center justify-center">
                              <span className="text-lg">💳</span>
                            </div>
                            <div>
                              <p className="font-semibold text-[#0e121b]">{s.name}</p>
                              <p className="text-xs text-[#4f6596]">ID: {s.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-[#4f6596] font-medium">Rp</span>
                            <input
                              type="number"
                              min={0}
                              value={s.price}
                              onChange={(e) => updatePrice(s.id, Number(e.target.value || 0))}
                              className="w-32 px-4 py-2 rounded-lg border border-[#e8ebf3] bg-white text-[#0e121b] font-bold focus:outline-none focus:ring-2 focus:ring-[#123891] focus:border-transparent transition-all"
                              aria-label={`Harga ${s.name}`}
                            />
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          {isChanged ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                              ⚠️ Berubah
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                              ✓ Tetap
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="space-y-4">
          {/* Total Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#e8ebf3] p-6 hover:shadow-lg transition-all">
            <h3 className="text-lg font-bold text-[#0e121b] mb-6">Ringkasan</h3>
            
            <div className="space-y-4">
              <div className="pb-4 border-b border-[#e8ebf3]">
                <p className="text-sm text-[#4f6596] mb-1">Total Harga</p>
                <p className="text-3xl font-black bg-gradient-to-r from-[#123891] to-[#4f6596] bg-clip-text text-transparent">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#4f6596]">Jumlah Item</span>
                  <span className="font-bold text-[#0e121b]">{services.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#4f6596]">Rata-rata</span>
                  <span className="font-bold text-[#0e121b]">Rp {Math.round(totalPrice / services.length).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#4f6596]">Terendah</span>
                  <span className="font-bold text-[#0e121b]">Rp {Math.min(...services.map(s => s.price)).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#4f6596]">Tertinggi</span>
                  <span className="font-bold text-[#0e121b]">Rp {Math.max(...services.map(s => s.price)).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-gradient-to-br from-[#123891]/10 to-[#4f6596]/10 rounded-2xl border border-[#123891]/20 p-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#123891] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-[#0e121b] mb-1">Tips</p>
                <p className="text-sm text-[#4f6596] leading-relaxed">
                  Harga ditambahkan secara otomatis untuk setiap pesanan berdasarkan komponen yang dipilih pelanggan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-8">
        <button
          type="button"
          onClick={() => {
            setServices(initialServices)
            setSaveSuccess(false)
          }}
          className="px-6 py-3 rounded-lg border border-[#e8ebf3] text-[#4f6596] font-bold hover:border-[#123891] hover:text-[#123891] hover:bg-[#f8f9fb] transition-all text-lg"
        >
          ↻ Reset
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className={`px-6 py-3 rounded-lg text-white font-bold text-lg transition-all flex items-center gap-2 ${
            saving || !hasChanges
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#123891] to-[#4f6596] hover:shadow-lg hover:shadow-[#123891]/30'
          }`}
        >
          {saving ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Menyimpan...
            </>
          ) : (
            <>
              ✓ Simpan Perubahan
            </>
          )}
        </button>
      </div>
    </div>
  )
}