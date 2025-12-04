'use client'

import React, { useState, useEffect } from 'react'

type Service = {
  id: string
  category: string // Saya tambah kategori biar rapi
  name: string
  price: number
}

// DATA BARU: Sesuai dengan halaman BuatPesanan sebelumnya
const initialServices: Service[] = [
  // --- 1. HARGA DASAR KERTAS ---
  { id: 'p_hvs', category: 'Kertas', name: 'HVS 70-80gsm', price: 500 },
  { id: 'p_art', category: 'Kertas', name: 'Art Paper 150gsm', price: 2000 },
  { id: 'p_matte', category: 'Kertas', name: 'Matte Paper', price: 2500 },
  { id: 'p_carton', category: 'Kertas', name: 'Art Carton 260gsm', price: 3000 },

  // --- 2. TAMBAHAN UKURAN (MARKUP) ---
  // A4 harganya 0 (standar), jadi tidak perlu dimasukkan ke list edit, 
  // tapi F4 dan A3 perlu biaya tambahan.
  { id: 's_f4', category: 'Ukuran', name: 'Add-on: Ukuran F4', price: 200 },
  { id: 's_a3', category: 'Ukuran', name: 'Add-on: Ukuran A3', price: 2000 },

  // --- 3. TAMBAHAN WARNA ---
  { id: 'c_color', category: 'Warna', name: 'Add-on: Warna (Full Color)', price: 1000 },

  // --- 4. FINISHING ---
  { id: 'f_staples', category: 'Finishing', name: 'Staples Pojok', price: 200 },
  { id: 'f_lakban', category: 'Finishing', name: 'Jilid Lakban', price: 3000 },
  { id: 'f_spiral', category: 'Finishing', name: 'Jilid Spiral Kawat', price: 7000 },
  { id: 'f_laminating', category: 'Finishing', name: 'Laminating (Panas)', price: 5000 },
]

// Ganti key ke v2 agar data baru muncul (bypass cache lama)
const STORAGE_KEY = 'admin_pricing_services_v2'

export default function AdminPricingPage() {
  // Menggunakan useEffect untuk akses localStorage agar aman dari hydration error Next.js
  const [services, setServices] = useState<Service[]>(initialServices)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setServices(JSON.parse(raw))
      }
    } catch (e) {
      console.error("Gagal memuat data", e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  function updatePrice(id: string, value: number) {
    setServices(prev => prev.map(s => (s.id === id ? { ...s, price: Math.max(0, value) } : s)))
  }

  async function handleSave() {
    setSaving(true)
    try {
      // simulate save delay
      await new Promise(res => setTimeout(res, 600))

      // persist to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(services))

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  // Helper untuk reset data jika ingin kembali ke default
  const handleReset = () => {
    if(confirm('Yakin ingin mereset harga ke pengaturan awal?')) {
      setServices(initialServices)
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const hasChanges = JSON.stringify(services) !== JSON.stringify(initialServices)

  if (!isLoaded) return <div className="p-8 text-center text-gray-500">Memuat data...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fb] via-white to-[#f0f2f8] py-8">
      {/* Header */}
      <div className="mb-8 max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-black text-[#0e121b] mb-2">Atur Harga Layanan</h1>
        <p className="text-lg text-[#4f6596]">Kelola harga dasar, markup ukuran, dan finishing.</p>
      </div>

      {/* Success Alert */}
      {saveSuccess && (
        <div className="max-w-6xl mx-auto px-4 mb-6">
            <div className="p-4 rounded-xl bg-green-100 border border-green-200 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </div>
            <div>
                <p className="font-bold text-green-700">Berhasil!</p>
                <p className="text-sm text-green-600">Perubahan harga telah disimpan ke sistem.</p>
            </div>
            </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pricing Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-[#e8ebf3] overflow-hidden hover:shadow-lg transition-all">
            <div className="bg-gradient-to-r from-[#f8f9fb] to-[#f0f2f8] border-b border-[#e8ebf3] px-8 py-6">
              <h2 className="text-xl font-bold text-[#0e121b] mb-1">Daftar Komponen Harga</h2>
              <p className="text-sm text-[#4f6596]">Harga ini akan dikalkulasikan otomatis saat user memesan.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white border-b border-[#e8ebf3]">
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#0e121b]">Layanan</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-[#0e121b]">Harga (Rp)</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-[#0e121b]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((s, idx) => {
                    // Cek apakah harga berubah dari default
                    const defaultItem = initialServices.find(x => x.id === s.id)
                    const isChanged = defaultItem ? s.price !== defaultItem.price : true

                    // Warna badge kategori
                    let badgeColor = 'bg-gray-100 text-gray-600'
                    if (s.category === 'Kertas') badgeColor = 'bg-blue-100 text-blue-700'
                    if (s.category === 'Finishing') badgeColor = 'bg-purple-100 text-purple-700'
                    if (s.category === 'Ukuran' || s.category === 'Warna') badgeColor = 'bg-orange-100 text-orange-700'

                    return (
                      <tr key={s.id} className={`border-b border-[#e8ebf3] hover:bg-[#f8f9fb] transition-colors group ${idx === services.length - 1 ? 'border-b-0' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
                                {s.category}
                            </div>
                            <div>
                              <p className="font-semibold text-[#0e121b]">{s.name}</p>
                              <p className="text-xs text-[#4f6596] font-mono">{s.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-[#4f6596] font-medium text-sm">Rp</span>
                            <input
                              type="number"
                              min={0}
                              value={s.price}
                              onChange={(e) => updatePrice(s.id, Number(e.target.value || 0))}
                              className="w-28 px-3 py-2 rounded-lg border border-[#e8ebf3] bg-white text-[#0e121b] font-bold text-right focus:outline-none focus:ring-2 focus:ring-[#123891] focus:border-transparent transition-all"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {isChanged ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 text-xs" title="Harga diubah dari default">
                              ✎
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-50 text-gray-300 text-xs">
                              -
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

        {/* Sidebar Summary & Info */}
        <div className="space-y-6">
            
          {/* Info Card */}
          <div className="bg-gradient-to-br from-[#123891] to-[#0e2c75] rounded-2xl shadow-lg p-6 text-white">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                <span className="text-xl">💡</span>
              </div>
              <div>
                <p className="font-bold text-lg mb-2">Cara Kerja Harga</p>
                <p className="text-sm text-blue-100 leading-relaxed mb-4">
                  Sistem menggunakan rumus:
                  <br />
                  <code className="bg-white/20 px-1 rounded text-xs">Total = (Kertas + Ukuran + Warna + Finishing) x Jumlah</code>
                </p>
                <div className="text-xs text-blue-200 border-t border-white/20 pt-3">
                  Contoh: Jika Anda mengubah harga "HVS" menjadi 600, maka semua pesanan HVS akan naik Rp 100/lembar.
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl border border-[#e8ebf3] p-6 shadow-sm">
             <h3 className="font-bold text-gray-800 mb-4">Aksi</h3>
             <div className="space-y-3">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                    className={`w-full py-3 rounded-lg text-white font-bold transition-all flex items-center justify-center gap-2 ${
                    saving || !hasChanges
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-[#123891] hover:bg-[#0e2c75] shadow-lg shadow-blue-900/20'
                    }`}
                >
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>

                <button
                    type="button"
                    onClick={handleReset}
                    className="w-full py-3 rounded-lg border border-[#e8ebf3] text-[#4f6596] font-bold hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                    ↻ Reset ke Default
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}