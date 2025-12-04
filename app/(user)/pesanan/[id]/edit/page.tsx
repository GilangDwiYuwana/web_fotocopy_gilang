'use client';

import Navbar from "@/components/layouts/Navbar";
import { useRouter } from "next/navigation"; // Perhatikan import ini
import { useState, useEffect } from "react";
// Import Server Action (Pastikan path-nya benar, biasanya @/actions/...)
import { getPaymentDetails, submitPaymentProof } from "@/src/actions/paymentActions"; 

// Props 'params' otomatis didapat karena ini adalah file page.tsx di dalam folder [id]
export default function Pembayaran({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  // State Data Database
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State Form Upload
  const [file, setFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const danaNumber = "081261285727";
  const accountName = "Alga Arvino";

  // 1. Load Data Order saat halaman dibuka berdasarkan ID di URL
  useEffect(() => {
    async function loadData() {
      try {
        // params.id adalah 'ORD-XXXX' yang dikirim dari halaman Buat Pesanan
        const data = await getPaymentDetails(params.id);
        
        if (data) {
          setOrderData(data);
        } else {
          alert("Pesanan tidak ditemukan!");
          router.push("/"); // Redirect ke home jika ID salah
        }
      } catch (e) {
        console.error("Error loading order:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [params.id, router]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (f) setFile(f);
  }

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(danaNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  // 2. Fungsi Konfirmasi ke Database
  async function confirmPayment() {
    if (!orderData || !file) return;
    
    setIsSubmitting(true);
    try {
      // Panggil Server Action untuk simpan ke database
      await submitPaymentProof(
        orderData.id,        // ID Database (Integer)
        orderData.userId,    // ID User
        orderData.totalAmount, // Nominal
        file.name            // Nama file (Simulasi)
      );

      alert("Pembayaran berhasil dikirim! Menunggu verifikasi admin.");
      
      // Redirect ke halaman riwayat pesanan (atau home jika belum ada halaman riwayat)
      router.push("/pesanan"); 
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim konfirmasi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fb]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#123891]"></div>
            <p className="mt-4 text-[#4f6596]">Memuat tagihan...</p>
        </div>
    );
  }

  if (!orderData) return null;

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0e121b] mb-2">Konfirmasi Pembayaran</h1>
        <p className="text-[#4f6596] mb-6">ID Pesanan: <span className="font-bold text-[#123891]">#{orderData.orderId}</span></p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* KARTU KIRI: Info Transfer */}
          <div className="bg-white rounded-2xl border border-[#e8ebf3] p-6 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-sm text-[#4f6596] mb-2">Total Tagihan</p>
              {/* TAMPILKAN DATA ASLI DARI DATABASE */}
              <p className="text-2xl sm:text-3xl font-bold text-[#0e121b] mb-4">
                Rp {orderData.totalAmount.toLocaleString('id-ID')}
              </p>

              <p className="text-sm text-[#4f6596] mb-2">Metode Pembayaran</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#123891] to-[#4f6596] flex items-center justify-center text-white font-bold">
                  DANA
                </div>
                <div>
                  <p className="font-semibold text-[#0e121b] text-lg">{danaNumber}</p>
                  <p className="text-sm text-[#4f6596]">a.n. {accountName}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={copyNumber}
                className="flex-1 px-4 py-2 bg-[#123891] text-white rounded-lg font-medium hover:bg-[#0d2654] transition"
              >
                {copied ? "Nomor Disalin ✓" : "Salin Nomor DANA"}
              </button>
            </div>
          </div>

          {/* KARTU KANAN: Upload Bukti */}
          <div className="bg-white rounded-2xl border border-[#e8ebf3] p-6 shadow-sm">
            <div className="mb-4">
              <p className="text-sm text-[#4f6596] mb-2">Unggah Bukti Pembayaran</p>
              <label className="block">
                <div className="flex items-center gap-4 p-4 border-2 border-dashed border-[#e8ebf3] rounded-lg cursor-pointer hover:bg-[#f8f9fb] transition">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#f1f5f9] rounded text-[#4f6596] text-2xl">📁</div>
                  <div className="flex-1">
                    <p className="text-sm text-[#0e121b] font-medium">{file ? file.name : "Klik untuk memilih file"}</p>
                    <p className="text-xs text-[#9aa4b2]">JPG, PNG, atau PDF (Maks 10MB)</p>
                  </div>
                  <input type="file" accept=".png,.jpg,.jpeg,.pdf" onChange={handleFileChange} className="hidden" />
                </div>
              </label>
            </div>

            <div className="mt-4 text-sm text-[#4f6596]">
              <p className="mb-2">Catatan:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Transfer nominal pas <b>Rp {orderData.totalAmount.toLocaleString('id-ID')}</b>.</li>
                <li>Simpan bukti transfer, lalu unggah.</li>
                <li>Pesanan akan diproses setelah diverifikasi.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* TOMBOL AKSI */}
        <div className="flex gap-3">
          <button
            onClick={confirmPayment}
            disabled={!file || isSubmitting}
            className={`flex-1 px-6 py-3 rounded-lg font-bold text-white transition ${file && !isSubmitting ? 'bg-[#123891] hover:bg-[#0d2654]' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            {isSubmitting ? 'Mengirim...' : 'Konfirmasi Pembayaran'}
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-lg border border-[#e8ebf3] text-[#123891] font-medium hover:bg-[#f8f9fb] transition"
          >
            Kembali
          </button>
        </div>
      </div>
    </>
  );
}