'use server';

import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';

// 1. Ambil Detail Order untuk Halaman Pembayaran
export async function getPaymentDetails(orderIdString: string) {
  const order = await prisma.orders.findUnique({
    where: { order_id: orderIdString },
    include: {
      users: true, // Kita butuh nama user kalau perlu
    },
  });

  if (!order) return null;

  return {
    id: order.id, // ID Int database
    orderId: order.order_id, // ID String (#ORD...)
    totalAmount: Number(order.total_amount),
    status: order.payment_status,
    customerName: order.users.name,
    userId: order.users.id
  };
}

// 2. Simpan Bukti Pembayaran (Konfirmasi)
export async function submitPaymentProof(
  orderIdInt: number, 
  userIdInt: number, 
  amount: number,
  fileName: string // Di real app, ini URL file dari cloud storage
) {
  // A. Buat record di tabel payments
  await prisma.payments.create({
    data: {
      order_id: orderIdInt,
      user_id: userIdInt,
      amount: amount,
      payment_method: 'DANA',
      status: 'Pending', // Menunggu verifikasi admin
      notes: `Bukti upload: ${fileName}`, // Simpan nama file sementara
      payment_date: new Date(),
    }
  });

  // B. Update status di tabel orders
  await prisma.orders.update({
    where: { id: orderIdInt },
    data: {
      payment_status: 'Pending', // Ubah status jadi pending
      status: 'Diproses' // Atau tetap 'Menunggu' tergantung flow bisnis kamu
    }
  });

  revalidatePath(`/pembayaran`);
}