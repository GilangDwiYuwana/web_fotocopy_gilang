import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const conn = await pool.getConnection();
    await conn.query('SELECT 1');
    conn.release();
    return NextResponse.json({ success: true, message: 'DB connected' });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message || 'Unknown error' },
      { status: 500 }
    );
  }
}