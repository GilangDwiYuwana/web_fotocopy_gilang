'use client';

import React, { useMemo, useState } from 'react';
import EditUserModal from '@/components/admin/EditUserModal';

type User = {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  active: boolean;
};

const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Clara Anderson', email: 'clara.anderson@email.com', joinedAt: '2023-01-15', active: true },
  { id: 'u2', name: 'Ethan Carter', email: 'ethan.carter@email.com', joinedAt: '2023-02-20', active: true },
  { id: 'u3', name: 'Olivia Bennett', email: 'olivia.bennett@email.com', joinedAt: '2023-03-10', active: false },
  { id: 'u4', name: 'Liam Foster', email: 'liam.foster@email.com', joinedAt: '2023-04-05', active: true },
  { id: 'u5', name: 'Sophia Hayes', email: 'sophia.hayes@email.com', joinedAt: '2023-05-12', active: true },
  { id: 'u6', name: 'Noah Jenkins', email: 'noah.jenkins@email.com', joinedAt: '2023-06-18', active: false },
  { id: 'u7', name: 'Ava Parker', email: 'ava.parker@email.com', joinedAt: '2023-07-22', active: true },
  { id: 'u8', name: 'Jackson Reed', email: 'jackson.reed@email.com', joinedAt: '2023-08-30', active: true },
  { id: 'u9', name: 'Isabella Scott', email: 'isabella.scott@email.com', joinedAt: '2023-09-14', active: false },
  { id: 'u10', name: 'Lucas Turner', email: 'lucas.turner@email.com', joinedAt: '2023-10-01', active: true },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [q, setQ] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // edit state and handlers (kept as requested)
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; email: string; joinedAt: string; active: boolean }>({
    name: '',
    email: '',
    joinedAt: '',
    active: true,
  });

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

  function handleEditChange<K extends keyof typeof editForm>(key: K, value: typeof editForm[K]) {
    setEditForm(prev => ({ ...prev, [key]: value }));
  }

  function saveEdit() {
    if (!editUser) return;
    setUsers(prev => prev.map(u => (u.id === editUser.id ? { ...u, ...editForm } : u)));
    closeEdit();
  }

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return users;
    return users.filter(u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
  }, [users, q]);

  function toggleActive(id: string) {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, active: !u.active } : u)));
  }

  function deleteUser(id: string) {
    setUsers(prev => prev.filter(u => u.id !== id));
    setDeleteConfirm(null);
  }

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter(u => u.active).length,
      inactive: users.filter(u => !u.active).length,
    };
  }, [users]);

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
              <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e8ebf3] p-6 mb-8 px-6">
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
                          {u.active ? (
                            <>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Aktif
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              Nonaktif
                            </>
                          )}
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
                        <p className="text-sm text-[#4f6596]">Coba ubah pencarian Anda</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
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
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M6.343 17.657l1.414-1.414m2.828 2.828l1.414 1.414m2.828-2.828l1.414 1.414M9.171 9.171L7.757 7.757m2.828-2.828l1.414-1.414m2.828 2.828l1.414-1.414m2.828-2.828l1.414 1.414" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0e121b] mb-2">Hapus Pengguna?</h3>
              <p className="text-[#4f6596]">Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.</p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border border-[#e8ebf3] text-[#4f6596] hover:border-[#123891] hover:text-[#123891] font-medium transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => deleteUser(deleteConfirm)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-all"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal component (kept functions) */}
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