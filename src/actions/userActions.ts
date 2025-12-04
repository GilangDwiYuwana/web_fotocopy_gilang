'use server';

import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';

// 1. AMBIL DATA USER (GET)
export async function getUsers() {
  const users = await prisma.users.findMany({
    orderBy: { created_at: 'desc' }, // Urutkan dari yang terbaru
  });

  // MAPPING: Ubah format database agar cocok dengan frontend
  return users.map((user) => ({
    id: String(user.id),            // Ubah Angka (DB) jadi String (Frontend)
    name: user.name,
    email: user.email,
    joinedAt: user.created_at.toISOString().split('T')[0], // created_at -> joinedAt
    active: user.is_active ?? true, // is_active -> active (jika null dianggap true)
  }));
}

// 2. UPDATE USER
export async function updateUser(idString: string, data: any) {
  const id = parseInt(idString); // Balikin String ke Angka untuk database

  await prisma.users.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      is_active: data.active, // Update kolom is_active
    },
  });
  revalidatePath('/admin/users');
}

// 3. HAPUS USER
export async function deleteUserAction(idString: string) {
  const id = parseInt(idString); // Balikin String ke Angka

  await prisma.users.delete({
    where: { id },
  });
  revalidatePath('/admin/users');
}