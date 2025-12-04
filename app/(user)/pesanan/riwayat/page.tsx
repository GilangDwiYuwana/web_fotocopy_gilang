'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Navbar from "@/components/layouts/Navbar";
import { getUserOrders } from '@/src/actions/orderActions'; // Import server actions
import { useRouter } from 'next/navigation';

type Order = {
  id: string;
  date: string;
  items?: number;
  total: number;
  status: 'Menunggu Pembayaran' | 'Dibayar' | 'Diproses' | 'Selesai' | 'Dibatalkan';
};

export default function Riwayat() {
  const router = useRouter();
  
  // State Data
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Filter & UI
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [page, setPage] = useState(1);
  const perPage = 6;

  // 1. AMBIL DATA DARI DATABASE SAAT LOAD
  useEffect(() => {
    async function loadData() {
      try {
        const dummyUserId = 1; // Sesuaikan dengan user login nanti
        const data = await getUserOrders(dummyUserId);
        // @ts-ignore: Memastikan tipe data cocok
        setOrders(data);
      } catch (error) {
        console.error("Gagal memuat riwayat:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // 2. LOGIKA STATISTIK
  const stats = useMemo(() => ({
    total: orders.length,
    selesai: orders.filter(o => o.status === 'Selesai').length,
    diproses: orders.filter(o => o.status === 'Diproses').length,
    menunggu: orders.filter(o => o.status === 'Menunggu Pembayaran' || o.status === 'Menunggu').length,
  }), [orders]);

  // 3. LOGIKA FILTERING (Client Side)
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return orders.filter(o => {
      const matchQ = !term ||
        o.id.toLowerCase().includes(term) ||
        (o.items !== undefined && o.items.toString().includes(term)) ||
        o.total.toString().includes(term) ||
        o.date.toLowerCase().includes(term);
      const matchStatus = statusFilter === 'Semua' || o.status === statusFilter;
      return matchQ && matchStatus;
    });
  }, [orders, q, statusFilter]);

  // 4. LOGIKA PAGINATION
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  // 5. FITUR ULANGI PESANAN (RE-ORDER)
  // Untuk sekarang kita redirect ke pembayaran saja, atau bisa dikembangkan untuk Clone Order
  function repeatOrder(id: string) {
    // Cari ordernya
    const target = orders.find(o => o.id === id);
    if(target && (target.status === 'Menunggu Pembayaran' || target.status === 'Menunggu')) {
       // Jika belum bayar, arahkan ke bayar
       router.push(`/pembayaran/${id}`);
    } else {
       // Jika sudah selesai, idealnya clone order. 
       // Untuk simpelnya sekarang kita arahkan buat baru dulu.
       alert("Untuk memesan ulang, silakan buat pesanan baru dengan spesifikasi yang sama.");
       router.push('/pesanan/buat');
    }
  }

  function refreshData() {
    window.location.reload();
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Memuat riwayat...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-8 space-y-6">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Riwayat Pesanan</h1>
            <p className="text-sm text-slate-500 mt-1">Daftar transaksi Anda yang tersimpan di database.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex gap-2 bg-white rounded-lg p-2 border border-slate-100 shadow-sm">
              <input
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
                placeholder="Cari ID, tanggal, atau total..."
                className="px-3 py-2 w-64 text-sm outline-none bg-transparent"
              />
              <button
                onClick={() => { setQ(''); setStatusFilter('Semua'); setPage(1); }}
                className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800"
              >
                Reset
              </button>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-xs text-slate-500">Total Pesanan</p>
            <p className="text-xl font-bold text-slate-800">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-xs text-slate-500">Selesai</p>
            <p className="text-xl font-bold text-green-600">{stats.selesai}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-xs text-slate-500">Diproses</p>
            <p className="text-xl font-bold text-amber-600">{stats.diproses}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Menunggu</p>
              <p className="text-xl font-bold text-slate-800">{stats.menunggu}</p>
            </div>
            <button onClick={refreshData} className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-md border border-blue-100 hover:bg-blue-100">
              Refresh
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {['Semua', 'Menunggu Pembayaran', 'Diproses', 'Selesai', 'Dibatalkan'].map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                statusFilter === s ? 'bg-[#123891] text-white' : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-sm text-slate-600">ID Pesanan</th>
                  <th className="p-4 text-sm text-slate-600">Tanggal</th>
                  <th className="p-4 text-sm text-slate-600">Jml Item</th>
                  <th className="p-4 text-sm text-slate-600">Total Harga</th>
                  <th className="p-4 text-sm text-slate-600">Status</th>
                  <th className="p-4 text-sm text-slate-600 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-500">
                      <p className="text-lg">📭</p>
                      Belum ada riwayat pesanan yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  paged.map((o, i) => (
                    <tr key={o.id} className={`border-t border-slate-50 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                      <td className="p-4 font-bold text-[#123891]">{o.id}</td>
                      <td className="p-4 text-slate-600">
                        {new Date(o.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-4 text-slate-600">{o.items ?? 0} Pcs</td>
                      <td className="p-4 font-semibold text-slate-800">Rp {o.total.toLocaleString('id-ID')}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          o.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                          o.status === 'Diproses' ? 'bg-purple-100 text-purple-700' :
                          o.status === 'Menunggu Pembayaran' ? 'bg-orange-100 text-orange-700' :
                          o.status === 'Dibatalkan' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {o.status === 'Menunggu Pembayaran' ? (
                            <button
                                onClick={() => repeatOrder(o.id)}
                                className="text-sm px-4 py-1.5 rounded-lg bg-[#123891] text-white hover:bg-[#0d2654] transition-all shadow-sm"
                            >
                                Bayar
                            </button>
                        ) : (
                            <button
                                onClick={() => repeatOrder(o.id)}
                                className="text-sm px-3 py-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
                            >
                                Detail
                            </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-slate-500">Menampilkan {filtered.length} pesanan</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-md border border-slate-100 bg-white disabled:opacity-50 hover:bg-slate-50"
            >
              ←
            </button>
            <span className="text-sm px-3 py-1 text-slate-600">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-md border border-slate-100 bg-white disabled:opacity-50 hover:bg-slate-50"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}