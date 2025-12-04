'use client';

import React, { useMemo, useState, useEffect } from 'react';
import EditUserModal from '@/components/admin/EditUserModal';
// Import fungsi backend yang sudah kita buat sebelumnya
// Pastikan path-nya benar. Jika error, coba ganti '@/actions/userActions'
import { getUsers, updateUser, deleteUserAction } from '@/src/actions/userActions'; 

type User = {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  active: boolean;
};

export default function AdminUsersPage() {
  // 1. KITA HAPUS INITIAL_USERS. Default-nya array kosong []
  const [users, setUsers] = useState<User[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  
  const [q, setQ] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    joinedAt: '',
    active: true,
  });

  // 2. AMBIL DATA DARI DATABASE (Gantikan localStorage)
  // Kode ini otomatis jalan saat halaman dibuka
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getUsers(); // Memanggil server action
        setUsers(data);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  function openEdit(user: User) {
    setEditUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      joinedAt: user.joinedAt,
      active: user.active,
    });
  }

  function closeEdit() {
    setEditUser(null);
  }

  function handleEditChange(key: string, value: any) {
    setEditForm(prev => ({ ...prev, [key]: value }));
  }

  // 3. SIMPAN EDIT KE DATABASE
  async function saveEdit() {
    if (!editUser) return;
    
    // Ubah tampilan dulu biar cepat (Optimistic UI)
    setUsers(prev => prev.map(u => (u.id === editUser.id ? { ...u, ...editForm } : u)));
    closeEdit();

    // Kirim perubahan ke database di belakang layar
    await updateUser(editUser.id, editForm);
  }

  // 4. UPDATE STATUS KE DATABASE
  async function toggleActive(id: string) {
    const targetUser = users.find(u => u.id === id);
    if (!targetUser) return;
    
    const newStatus = !targetUser.active;

    // Update tampilan
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, active: newStatus } : u)));
    
    // Update database
    await updateUser(id, { ...targetUser, active: newStatus });
  }

  // 5. HAPUS DARI DATABASE
  async function deleteUser(id: string) {
    // Update tampilan
    setUsers(prev => prev.filter(u => u.id !== id));
    setDeleteConfirm(null);
    
    // Hapus permanen di database
    await deleteUserAction(id);
  }

  // -- LOGIKA FILTER & SEARCH (Tidak berubah) --
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return users;
    return users.filter(u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
  }, [users, q]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter(u => u.active).length,
      inactive: users.filter(u => !u.active).length,
    };
  }, [users]);

  // Tampilan Loading saat pertama kali buka
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fb]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#123891]"></div>
        <p className="mt-4 text-[#4f6596]">Mengambil data dari database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fb] via-white to-[#f0f2f8] py-8">
      {/* Header */}
      <div className="mb-8 px-6">
        <h1 className="text-4xl font-black text-[#0e121b] mb-2">Manajemen Pengguna</h1>
        <p className="text-lg text-[#4f6596]">Kelola semua pengguna terdaftar di platform CetakDigital</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 px-6">
        {[
          { label: 'Total Pengguna', value: stats.total, icon: '👥', color: 'from-[#123891] to-[#4f6596]' },
          { label: 'Pengguna Aktif', value: stats.active, icon: '✓', color: 'from-[#10b981] to-[#059669]' },
          { label: 'Pengguna Nonaktif', value: stats.inactive, icon: '✕', color: 'from-[#ef4444] to-[#dc2626]' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-[#e8ebf3] p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4f6596] font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-[#0e121b]">{stat.value}</p>
              </div>
              <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e8ebf3] p-6 mb-8 px-6 mx-6">
        <div className="relative max-w-3xl mx-auto">
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#4f6596]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            placeholder="Cari berdasarkan nama atau email..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#e8ebf3] focus:outline-none focus:ring-2 focus:ring-[#123891] focus:border-transparent bg-white text-[#0e121b] placeholder:text-[#4f6596]"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8ebf3] overflow-hidden hover:shadow-lg transition-all">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#f8f9fb] to-[#f0f2f8] border-b border-[#e8ebf3]">
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#0e121b]">Nama</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#0e121b]">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#0e121b]">Tanggal Bergabung</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#0e121b]">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-[#0e121b]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((u) => (
                    <tr key={u.id} className="border-b border-[#e8ebf3] hover:bg-[#f8f9fb] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#123891] to-[#4f6596] flex items-center justify-center text-white font-bold text-sm">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-[#0e121b]">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#4f6596]">{u.email}</td>
                      <td className="px-6 py-4 text-[#4f6596]">{u.joinedAt}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleActive(u.id)}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                            u.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {u.active ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEdit(u)}
                            className="px-4 py-2 rounded-lg bg-[#123891]/10 text-[#123891] hover:bg-[#123891]/20 font-medium text-sm transition-all"
                          >
                            ✎ Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(u.id)}
                            className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-medium text-sm transition-all"
                          >
                            🗑️ Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-4xl">👤</div>
                        <p className="text-lg font-semibold text-[#0e121b]">Tidak ada pengguna</p>
                        <p className="text-sm text-[#4f6596]">Pastikan database sudah diisi atau ubah pencarian Anda</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer stats */}
          <div className="bg-[#f8f9fb] border-t border-[#e8ebf3] px-6 py-4">
             <p className="text-sm text-[#4f6596] font-medium">
               Menampilkan <span className="text-[#0e121b] font-bold">{filtered.length}</span> dari <span className="text-[#0e121b] font-bold">{users.length}</span> pengguna
             </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#e8ebf3] p-8 max-w-md w-full animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-[#0e121b] mb-2">Hapus Pengguna?</h3>
            <p className="text-[#4f6596] mb-6">Anda yakin ingin menghapus pengguna ini? Tindakan ini menghapus data **permanen dari database**.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border border-[#e8ebf3] text-[#4f6596] hover:border-[#123891] font-medium"
              >
                Batal
              </button>
              <button
                onClick={() => deleteUser(deleteConfirm)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      <EditUserModal
        open={!!editUser}
        form={editForm}
        onChange={handleEditChange}
        onClose={closeEdit}
        onSave={saveEdit}
      />
    </div>
  );
}