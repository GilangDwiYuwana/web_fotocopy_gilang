'use server';

import { prisma } from '@/src/lib/prisma';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

// ==========================================
// TIPE DATA (Ditambahkan sesuai permintaan)
// ==========================================
type LoginResult = {
    success: boolean;
    message?: string;
    user?: {
        id: number;
        name: string;
        email: string;
        role: 'user' | 'admin';
    }
}

// ==========================================
// 1. FUNGSI REGISTER
// ==========================================
export async function registerUser(fullName: string, email: string, passwordPlain: string) {
    try {
        // 1. Cek apakah email sudah terdaftar
        const existingUser = await prisma.users.findUnique({
            where: { email: email },
        });

        if (existingUser) {
            return { success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain.' };
        }

        // 2. Hashing Password
        const hashedPassword = await bcrypt.hash(passwordPlain, 10);

        // 3. Simpan ke Database
        await prisma.users.create({
            data: {
                name: fullName,
                email: email,
                password: hashedPassword,
                role: 'user', // Default role
                is_active: true,
            },
        });

        return { success: true, message: 'Pendaftaran berhasil!' };
    
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
             return { success: false, message: 'Email sudah terdaftar.' };
        }
        console.error("REGISTER ERROR:", e);
        return { success: false, message: 'Terjadi kesalahan server saat mendaftar.' };
    }
}

// ==========================================
// 2. FUNGSI LOGIN (Dengan Tipe Data Baru)
// ==========================================
export async function loginUser(email: string, passwordPlain: string): Promise<LoginResult> {
    try {
        // 1. Cari pengguna berdasarkan email
        const user = await prisma.users.findUnique({
            where: { email: email },
        });

        if (!user) {
            return { success: false, message: 'Email tidak ditemukan.' };
        }

        // 2. Bandingkan password
        const passwordMatch = await bcrypt.compare(passwordPlain, user.password);

        if (!passwordMatch) {
            return { success: false, message: 'Password salah.' };
        }

        // 3. Kembalikan data user sesuai tipe LoginResult
        return { 
            success: true, 
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                // Kita gunakan "as" karena di database tipenya String, 
                // tapi di TypeScript kita membatasinya jadi 'user' | 'admin'
                role: user.role as 'user' | 'admin', 
            },
        };

    } catch (e) {
        console.error("LOGIN ERROR:", e);
        return { success: false, message: 'Terjadi kesalahan server saat masuk.' };
    }
}