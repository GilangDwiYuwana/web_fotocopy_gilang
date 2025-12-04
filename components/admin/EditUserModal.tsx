'use client';
import React from 'react';

type Form = {
  name: string;
  email: string;
  joinedAt: string;
  active: boolean;
};

type Props = {
  open: boolean;
  form: Form;
  onChange: (key: keyof Form, value: any) => void;
  onClose: () => void;
  onSave: () => void;
};

export default function EditUserModal({ open, form, onChange, onClose, onSave }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#e8ebf3] p-6 max-w-lg w-full">
        <h3 className="text-xl font-bold text-[#0e121b] mb-4">Edit Pengguna</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#4f6596] mb-1">Nama</label>
            <input
              value={form.name}
              onChange={(e) => onChange('name', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e8ebf3] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-[#4f6596] mb-1">Email</label>
            <input
              value={form.email}
              onChange={(e) => onChange('email', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e8ebf3] focus:outline-none"
            />
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="block text-sm text-[#4f6596] mb-1">Tanggal Bergabung</label>
              <input
                type="date"
                value={form.joinedAt}
                onChange={(e) => onChange('joinedAt', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#e8ebf3] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-[#4f6596]">Aktif</label>
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => onChange('active', e.target.checked)}
                className="w-5 h-5"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#e8ebf3] text-[#4f6596] hover:border-[#123891] hover:text-[#123891] font-medium transition-all"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 rounded-lg bg-[#123891] text-white hover:bg-[#0d2654] font-medium transition-all"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}