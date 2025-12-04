'use server';

import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';

// Data default untuk mengisi database jika kosong (Auto-Seed)
const DEFAULT_SERVICES = [
  { name: 'HVS 70-80gsm', price: 500, category: 'kertas' },
  { name: 'Art Paper 150gsm', price: 2000, category: 'kertas' },
  { name: 'Matte Paper', price: 2500, category: 'kertas' },
  { name: 'Art Carton 260gsm', price: 3000, category: 'kertas' },
  { name: 'Add-on: Ukuran F4', price: 200, category: 'ukuran' },
  { name: 'Add-on: Ukuran A3', price: 2000, category: 'ukuran' },
  { name: 'Add-on: Warna (Full Color)', price: 1000, category: 'warna' },
  { name: 'Staples Pojok', price: 200, category: 'finishing' },
  { name: 'Jilid Lakban', price: 3000, category: 'finishing' },
  { name: 'Jilid Spiral Kawat', price: 7000, category: 'finishing' },
  { name: 'Laminating (Panas)', price: 5000, category: 'finishing' },
];

export async function getPricing() {
  // 1. Cek apakah tabel services kosong?
  const count = await prisma.services.count();

  // 2. Jika kosong, isi dengan data default dulu
  // 2. Jika kosong, isi dengan data default dulu
  if (count === 0) {
    await prisma.services.createMany({
      data: DEFAULT_SERVICES.map(s => ({
        name: s.name,
        price: s.price,
        // TAMBAHKAN 'as any' DI SINI AGAR MERAHNYA HILANG
        category: s.category as any, 
        is_active: true
      }))
    });
  }

  // 3. Ambil data dari database
  const services = await prisma.services.findMany({
    orderBy: { category: 'asc' }
  });

  // 4. Mapping ke format frontend
  return services.map(s => ({
    id: s.id, // ID sekarang berupa Integer dari DB
    name: s.name,
    price: Number(s.price), // Decimal ke Number
    category: capitalize(s.category || 'lainnya'), // 'kertas' -> 'Kertas'
  }));
}

export async function updatePricing(id: number, newPrice: number) {
  await prisma.services.update({
    where: { id },
    data: { price: newPrice }
  });
  revalidatePath('/admin/pricing');
}

// Helper kecil untuk merapikan huruf depan
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}