'use server';

import { prisma } from '@/src/lib/prisma';

export async function getDashboardStats() {
  // 1. Tentukan rentang waktu (7 hari terakhir)
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  // 2. Ambil data orders dari database
  // Kita ambil semua order yang TIDAK dibatalkan
  const orders = await prisma.orders.findMany({
    where: {
      created_at: {
        gte: sevenDaysAgo, // Lebih besar atau sama dengan 7 hari lalu
      },
      status: {
        not: 'Dibatalkan', // Jangan hitung yang batal
      },
    },
    select: {
      created_at: true,
      total_amount: true,
    },
  });

  // 3. Siapkan wadah untuk hitung total per hari
  // Kita pakai Map agar mudah dijumlahkan
  const daysMap: Record<string, number> = {
    'Senin': 0, 'Selasa': 0, 'Rabu': 0, 'Kamis': 0, 'Jumat': 0, 'Sabtu': 0, 'Minggu': 0
  };

  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // 4. Looping data database & Masukkan ke hari yang tepat
  orders.forEach((order) => {
    const date = new Date(order.created_at);
    const dayName = dayNames[date.getDay()]; // Dapat nama hari (misal: 'Senin')
    
    if (daysMap[dayName] !== undefined) {
      daysMap[dayName] += Number(order.total_amount); // Tambahkan omset
    }
  });

  // 5. Susun ulang agar urutannya Rapi (Senin -> Minggu) untuk Grafik
  const orderedDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const chartData = orderedDays.map((day) => ({
    label: day,
    value: daysMap[day],
  }));

  // 6. Hitung total transaksi global (bukan cuma minggu ini, tapi total semua)
  const totalTxCount = await prisma.orders.count({
    where: { status: { not: 'Dibatalkan' } }
  });

  return {
    chartData,       // Data untuk grafik
    totalTxCount,    // Total jumlah transaksi seumur hidup
  };
}