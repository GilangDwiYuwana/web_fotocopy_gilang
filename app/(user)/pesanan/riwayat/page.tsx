// ...existing code...
'use client';
import React, { useMemo, useState } from 'react';
import Navbar from "@/components/layouts/Navbar";

type Order = {
  id: string;
  date: string;
  items?: number;
  total: number;
  status: 'Menunggu' | 'Diproses' | 'Selesai' | 'Dibatalkan';
};

const SAMPLE_ORDERS: Order[] = [
  { id: '#101', date: '2024-05-20', items: 3, total: 45000, status: 'Selesai' },
  { id: '#102', date: '2024-06-02', items: 1, total: 15000, status: 'Diproses' },
  { id: '#103', date: '2024-06-18', items: 5, total: 75000, status: 'Menunggu' },
  { id: '#104', date: '2024-07-01', items: 2, total: 30000, status: 'Dibatalkan' },
  { id: '#105', date: '2024-07-05', items: 4, total: 60000, status: 'Selesai' },
];

export default function Riwayat() {
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | Order['status']>('Semua');
  const [page, setPage] = useState(1);
  const perPage = 6;

  const stats = useMemo(() => ({
    total: orders.length,
    selesai: orders.filter(o => o.status === 'Selesai').length,
    diproses: orders.filter(o => o.status === 'Diproses').length,
    menunggu: orders.filter(o => o.status === 'Menunggu').length,
  }), [orders]);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  function repeatOrder(id: string) {
    const orig = orders.find(o => o.id === id);
    if (!orig) return;
    const copy: Order = {
      ...orig,
      id: `#${Math.floor(Math.random() * 90000) + 20000}`,
      date: new Date().toISOString().slice(0, 10),
      status: 'Menunggu',
    };
    setOrders(prev => [copy, ...prev]);
    setPage(1);
  }

  function clearHistory() {
    setOrders([]);
    setPage(1);
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-8 space-y-6">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Riwayat Pesanan</h1>
            <p className="text-sm text-slate-500 mt-1">Ringkasan pesanan Anda — cari, filter, dan ulangi pesanan dengan mudah.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex gap-2 bg-white rounded-lg p-2 border border-slate-100 shadow-sm">
              <input
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
                placeholder="Cari ID, tanggal, item, atau total..."
                className="px-3 py-2 w-64 text-sm outline-none bg-transparent"
                aria-label="Cari riwayat pesanan"
              />
              <button
                onClick={() => { setQ(''); setStatusFilter('Semua'); setPage(1); }}
                className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800"
                aria-label="Reset filter"
                type="button"
              >
                Reset
              </button>
            </div>
          </div>
        </header>

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
            <button
              onClick={clearHistory}
              className="text-sm px-3 py-1 bg-red-50 text-red-600 rounded-md border border-red-100"
              aria-label="Bersihkan riwayat"
              type="button"
            >
              Bersihkan
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {(['Semua', 'Selesai', 'Diproses', 'Menunggu', 'Dibatalkan'] as const).map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s as any); setPage(1); }}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                statusFilter === s ? 'bg-[#123891] text-white' : 'bg-white border border-slate-100 text-slate-600'
              }`}
              type="button"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-sm text-slate-600">ID</th>
                <th className="p-4 text-sm text-slate-600">Tanggal</th>
                <th className="p-4 text-sm text-slate-600">Item</th>
                <th className="p-4 text-sm text-slate-600">Total</th>
                <th className="p-4 text-sm text-slate-600">Status</th>
                <th className="p-4 text-sm text-slate-600 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Tidak ada riwayat pesanan. Coba ubah filter atau buat pesanan baru.
                  </td>
                </tr>
              ) : (
                paged.map((o, i) => (
                  <tr key={o.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-4 font-medium text-slate-700">{o.id}</td>
                    <td className="p-4 text-slate-600">{new Date(o.date).toLocaleDateString()}</td>
                    <td className="p-4 text-slate-600">{o.items ?? '-'}</td>
                    <td className="p-4 font-semibold text-slate-800">Rp {o.total.toLocaleString('id-ID')}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        o.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                        o.status === 'Diproses' ? 'bg-amber-100 text-amber-700' :
                        o.status === 'Menunggu' ? 'bg-slate-100 text-slate-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => repeatOrder(o.id)}
                        className="text-sm px-3 py-1 rounded-md bg-white border border-slate-100 hover:bg-slate-50"
                        aria-label={`Ulangi pesanan ${o.id}`}
                        type="button"
                      >
                        Ulangi
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-slate-500">Menampilkan {filtered.length} hasil</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-md border border-slate-100 bg-white disabled:opacity-50"
              type="button"
            >
              ←
            </button>
            <span className="text-sm px-3 py-1">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-md border border-slate-100 bg-white disabled:opacity-50"
              type="button"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
// ...existing code...