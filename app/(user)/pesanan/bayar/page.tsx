'use client';
import Navbar from "@/components/layouts/Navbar";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Pembayaran() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);

  const danaNumber = "081261285727";
  const accountName = "Alga Arvino";

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

  function confirmPayment() {
    // TODO: upload proof file to server before navigate
    router.push("/pesanan/123");
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0e121b] mb-6">Konfirmasi Pembayaran</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-[#e8ebf3] p-6 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-sm text-[#4f6596] mb-2">Total Tagihan</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#0e121b] mb-4">Rp 5.000</p>

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

              <button
                onClick={() => alert('Silakan lakukan transfer menggunakan aplikasi DANA dengan nomor di samping. Setelah transfer, unggah bukti pembayaran.')}
                className="px-4 py-2 border border-[#e8ebf3] rounded-lg text-[#123891] font-medium hover:bg-[#f8f9fb] transition"
              >
                Info Singkat
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e8ebf3] p-6 shadow-sm">
            <div className="mb-4">
              <p className="text-sm text-[#4f6596] mb-2">Unggah Bukti Pembayaran</p>
              <label className="block">
                <div className="flex items-center gap-4 p-4 border-2 border-dashed border-[#e8ebf3] rounded-lg cursor-pointer hover:bg-[#f8f9fb] transition">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#f1f5f9] rounded text-[#4f6596] text-2xl">📁</div>
                  <div className="flex-1">
                    <p className="text-sm text-[#0e121b] font-medium">{file ? file.name : "Klik untuk memilih bukti pembayaran (PNG / JPG / PDF)"}</p>
                    <p className="text-xs text-[#9aa4b2]">Ukuran maksimal 10MB. Pastikan terlihat nama & nominal transfer.</p>
                  </div>
                  <input type="file" accept=".png,.jpg,.jpeg,.pdf" onChange={handleFileChange} className="hidden" />
                </div>
              </label>
            </div>

            <div className="mt-4 text-sm text-[#4f6596]">
              <p className="mb-2">Catatan:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Transfer hanya via DANA ke nomor yang tertera.</li>
                <li>Simpan bukti transfer, lalu unggah pada form.</li>
                <li>Konfirmasi akan diverifikasi oleh tim kami dalam 1-2 jam kerja.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={confirmPayment}
            disabled={!file}
            className={`flex-1 px-6 py-3 rounded-lg font-bold text-white transition ${file ? 'bg-[#123891] hover:bg-[#0d2654]' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            Konfirmasi Pembayaran
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