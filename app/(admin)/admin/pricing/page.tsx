'use client';

import React, { useState, useEffect } from 'react';
import { getPricing, updatePricing } from '@/src/actions/pricingActions'; // Import action

type Service = {
  id: number; // Ubah string jadi number karena ID database itu INT
  category: string;
  name: string;
  price: number;
};

export default function AdminPricingPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // --- AMBIL DATA DARI DATABASE ---
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getPricing();
        setServices(data);
      } catch (error) {
        console.error("Gagal memuat harga:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Update state lokal saat mengetik (belum simpan ke DB)
  function handlePriceChange(id: number, newVal: number) {
    setServices(prev => prev.map(s => (s.id === id ? { ...s, price: Math.max(0, newVal) } : s)));
  }

  // --- SIMPAN KE DATABASE ---
  async function handleSave() {
    setSaving(true);
    try {
      // Kita simpan satu per satu (looping) agar sederhana
      // Untuk aplikasi besar bisa pakai Promise.all, tapi ini cukup untuk admin
      for (const service of services) {
        await updatePricing(service.id, service.price);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      alert("Gagal menyimpan perubahan. Cek konsol.");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fb]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#123891]"></div>
        <p className="mt-4 text-[#4f6596]">Memuat harga dari database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fb] via-white to-[#f0f2f8] py-8">
      {/* Header */}
      <div className="mb-8 max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-black text-[#0e121b] mb-2">Atur Harga Layanan</h1>
        <p className="text-lg text-[#4f6596]">Kelola harga dasar, markup ukuran, dan finishing (Database Real-time).</p>
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
              <p className="text-sm text-green-600">Harga terbaru telah disimpan ke database.</p>
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
              <p className="text-sm text-[#4f6596]">Harga ini akan dikalkulasikan otomatis dari database.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white border-b border-[#e8ebf3]">
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#0e121b]">Layanan</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-[#0e121b]">Harga (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((s, idx) => {
                    // Warna badge kategori
                    let badgeColor = 'bg-gray-100 text-gray-600';
                    const cat = s.category.toLowerCase();
                    if (cat === 'kertas') badgeColor = 'bg-blue-100 text-blue-700';
                    if (cat === 'finishing') badgeColor = 'bg-purple-100 text-purple-700';
                    if (cat === 'ukuran' || cat === 'warna') badgeColor = 'bg-orange-100 text-orange-700';

                    return (
                      <tr key={s.id} className={`border-b border-[#e8ebf3] hover:bg-[#f8f9fb] transition-colors group ${idx === services.length - 1 ? 'border-b-0' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
                              {s.category}
                            </div>
                            <div>
                              <p className="font-semibold text-[#0e121b]">{s.name}</p>
                              <p className="text-xs text-[#4f6596] font-mono">ID: {s.id}</p>
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
                              onChange={(e) => handlePriceChange(s.id, Number(e.target.value || 0))}
                              className="w-28 px-3 py-2 rounded-lg border border-[#e8ebf3] bg-white text-[#0e121b] font-bold text-right focus:outline-none focus:ring-2 focus:ring-[#123891] focus:border-transparent transition-all"
                            />
                          </div>
                        </td>
                      </tr>
                    );
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
                <p className="font-bold text-lg mb-2">Info Database</p>
                <p className="text-sm text-blue-100 leading-relaxed mb-4">
                  Data ini diambil langsung dari tabel <code>services</code> di MySQL.
                  <br />
                  Jika Anda menambah layanan baru di database, layanan tersebut akan otomatis muncul di sini.
                </p>
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
                    disabled={saving}
                    className={`w-full py-3 rounded-lg text-white font-bold transition-all flex items-center justify-center gap-2 ${
                    saving
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-[#123891] hover:bg-[#0e2c75] shadow-lg shadow-blue-900/20'
                    }`}
                >
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}