'use client';
import { useState, useEffect } from 'react';
import Navbar from "@/components/layouts/Navbar";
import FileUpload from '@/components/forms/FileUpload';
import Link from 'next/link';

// --- IMPORT LIBRARY PDF READER ---
import * as pdfjs from 'pdfjs-dist';

// Setting Worker PDF.js (Wajib untuk Next.js)
// Menggunakan CDN agar tidak perlu setting config yang rumit
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// --- KONFIGURASI HARGA (TETAP SAMA) ---
const PRICING = {
  paperTypes: {
    hvs: { label: 'HVS 70-80gsm', basePrice: 500 },
    art_paper: { label: 'Art Paper 150gsm', basePrice: 2000 },
    matte: { label: 'Matte Paper', basePrice: 2500 },
    carton: { label: 'Art Carton 260gsm', basePrice: 3000 }
  },
  sizeMarkup: {
    a4: 0,
    a3: 2000,
    f4: 200
  },
  colorMarkup: {
    bw: 0,
    color: 1000
  },
  finishing: {
    none: { label: 'Tanpa Finishing', price: 0 },
    staples: { label: 'Staples Pojok', price: 200 },
    jilid_lakban: { label: 'Jilid Lakban', price: 3000 },
    jilid_spiral: { label: 'Jilid Spiral Kawat', price: 7000 },
    laminating: { label: 'Laminating (Panas)', price: 5000 }
  }
};

export default function BuatPesanan() {
  // --- STATE MANAGEMENT ---
  // Kita pisah antara Halaman (isi file) dan Copies (rangkap)
  const [pageCount, setPageCount] = useState(1); 
  const [copies, setCopies] = useState(1);
  
  const [paperType, setPaperType] = useState('hvs');
  const [paperSize, setPaperSize] = useState('a4');
  const [colorMode, setColorMode] = useState('bw');
  const [finishing, setFinishing] = useState('none');
  const [totalPrice, setTotalPrice] = useState(0);
  const [isReading, setIsReading] = useState(false);

  // --- LOGIKA BACA PDF OTOMATIS ---
  const handleFileSelect = async (file) => {
    if (!file) return;

    // Reset ke 1 dulu
    setPageCount(1);
    
    // Cek jika PDF
    if (file.type === 'application/pdf') {
      try {
        setIsReading(true);
        const buffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument(buffer).promise;
        
        // Update jumlah halaman otomatis sesuai isi file
        setPageCount(pdf.numPages);
        alert(`File terbaca: ${pdf.numPages} Halaman.`);
      } catch (err) {
        console.error(err);
        alert("Gagal membaca halaman PDF otomatis. Silakan isi manual.");
      } finally {
        setIsReading(false);
      }
    }
  };

  // --- HELPER: Format Rupiah ---
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  // --- LOGIKA HITUNG HARGA (useEffect) ---
  useEffect(() => {
    const base = PRICING.paperTypes[paperType].basePrice;
    const sizeAdd = PRICING.sizeMarkup[paperSize];
    const colorAdd = PRICING.colorMarkup[colorMode];
    const finishPrice = PRICING.finishing[finishing].price;

    // Rumus Total:
    // 1. Biaya Cetak = (Harga Kertas + Markup Ukuran + Markup Warna) x (Halaman x Rangkap)
    const totalSheets = pageCount * copies;
    const printCost = (base + sizeAdd + colorAdd) * totalSheets;

    // 2. Biaya Finishing = Harga Finishing x Jumlah Rangkap (Bukan per lembar)
    const finishingCost = finishPrice * copies;

    setTotalPrice(printCost + finishingCost);
  }, [pageCount, copies, paperType, paperSize, colorMode, finishing]);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-8 text-gray-800 border-l-4 border-[#123891] pl-4">
          Buat Pesanan Baru
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* === KOLOM KIRI: FORM INPUT === */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Bagian 1: Upload */}
            <section className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-[#123891]">1. Upload Dokumen</h2>
              {/* Tambahkan props onFileSelect */}
              <FileUpload onFileSelect={handleFileSelect} />
              {isReading ? (
                <p className="text-sm text-blue-600 mt-2 animate-pulse">Sedang menghitung halaman...</p>
              ) : (
                <p className="text-xs text-gray-400 mt-2">*Halaman PDF akan terhitung otomatis.</p>
              )}
            </section>

            {/* Bagian 2: Spesifikasi */}
            <section className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
              <h2 className="text-lg font-semibold mb-4 text-[#123891]">2. Spesifikasi Cetak</h2>

              {/* Grid Pilihan Ukuran & Warna (Tetap Sama) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="block text-sm font-bold mb-2 text-gray-700">Ukuran Kertas</span>
                  <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    {['a4', 'f4', 'a3'].map((size) => (
                      <button key={size} onClick={() => setPaperSize(size)} className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${paperSize === size ? 'bg-white text-[#123891] shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>{size.toUpperCase()}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="block text-sm font-bold mb-2 text-gray-700">Mode Warna</span>
                  <div className="flex gap-3">
                    <label className={`flex-1 border-2 p-3 rounded-lg cursor-pointer text-center transition-all ${colorMode === 'bw' ? 'border-gray-800 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="color" className="hidden" checked={colorMode === 'bw'} onChange={() => setColorMode('bw')}/>
                      <div className="w-6 h-6 bg-black rounded-full mx-auto mb-1"></div><span className="text-xs font-bold">Hitam Putih</span>
                    </label>
                    <label className={`flex-1 border-2 p-3 rounded-lg cursor-pointer text-center transition-all ${colorMode === 'color' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="color" className="hidden" checked={colorMode === 'color'} onChange={() => setColorMode('color')}/>
                      <div className="w-6 h-6 bg-gradient-to-tr from-blue-500 via-purple-500 to-red-500 rounded-full mx-auto mb-1"></div><span className="text-xs font-bold">Berwarna</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Dropdown Jenis Kertas & Finishing (Tetap Sama) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <label className="block">
                    <span className="text-sm font-bold mb-2 text-gray-700 block">Jenis Kertas</span>
                    <select value={paperType} onChange={(e) => setPaperType(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-[#123891] outline-none">
                    {Object.entries(PRICING.paperTypes).map(([key, item]) => (<option key={key} value={key}>{item.label} (+ {formatRupiah(item.basePrice)})</option>))}
                    </select>
                 </label>
                 <label className="block">
                    <span className="text-sm font-bold mb-2 text-gray-700 block">Finishing</span>
                    <select value={finishing} onChange={(e) => setFinishing(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-[#123891] outline-none">
                    {Object.entries(PRICING.finishing).map(([key, item]) => (<option key={key} value={key}>{item.label} {item.price > 0 ? `(+ ${formatRupiah(item.price)})` : ''}</option>))}
                    </select>
                 </label>
              </div>

              {/* --- BAGIAN JUMLAH (DIPERBARUI UNTUK DETEKSI HALAMAN) --- */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h3 className="text-sm font-bold text-[#123891] mb-3">Detail Kuantitas</h3>
                <div className="grid grid-cols-2 gap-4">
                    
                    {/* Input 1: Jumlah Halaman (Otomatis dari PDF) */}
                    <div>
                       <label className="block text-xs font-bold mb-1 text-gray-500">Halaman per File</label>
                       <input 
                         type="number" 
                         min="1"
                         value={pageCount} 
                         onChange={(e) => setPageCount(Math.max(1, Number(e.target.value)))}
                         className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#123891] outline-none font-bold text-gray-800" 
                       />
                       <p className="text-[10px] text-gray-500 mt-1">Terisi otomatis jika PDF</p>
                    </div>

                    {/* Input 2: Jumlah Rangkap (User mau berapa copy) */}
                    <div>
                       <label className="block text-xs font-bold mb-1 text-gray-500">Jumlah Rangkap (Copy)</label>
                       <div className="flex items-center">
                           <input 
                             type="number" 
                             min="1"
                             value={copies} 
                             onChange={(e) => setCopies(Math.max(1, Number(e.target.value)))}
                             className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#123891] outline-none font-bold text-gray-800" 
                           />
                           <span className="ml-2 text-sm font-bold text-gray-500">Set</span>
                       </div>
                       <p className="text-[10px] text-gray-500 mt-1">Total: {pageCount * copies} Lembar</p>
                    </div>

                </div>
              </div>

            </section>
          </div>

          {/* === KOLOM KANAN: RINGKASAN HARGA (Sticky) === */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border shadow-lg sticky top-8">
              <h3 className="font-bold text-lg mb-4 text-gray-800 pb-2 border-b">Ringkasan Pesanan</h3>
              
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                   <span>Isi File</span>
                   <span className="font-semibold text-gray-800">{pageCount} Halaman</span>
                </div>
                <div className="flex justify-between">
                   <span>Rangkap</span>
                   <span className="font-semibold text-gray-800">{copies} Kali</span>
                </div>
                
                <div className="border-t border-dashed my-2"></div>

                <div className="flex justify-between">
                  <span>Ukuran & Warna</span>
                  <span className="font-semibold text-gray-800 uppercase">{paperSize} - {colorMode}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bahan</span>
                  <span className="font-semibold text-gray-800">{PRICING.paperTypes[paperType].label}</span>
                </div>
                <div className="flex justify-between">
                  <span>Finishing</span>
                  <span className="font-semibold text-gray-800 truncate max-w-[150px] text-right">
                    {PRICING.finishing[finishing].label}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <span className="text-[#123891] font-bold">Total</span>
                <span className="text-2xl font-bold text-[#123891]">{formatRupiah(totalPrice)}</span>
              </div>

              {/* Kirim data detail ke halaman bayar */}
              <Link 
                href={{
                  pathname: '/pesanan/bayar',
                  query: { 
                    total: totalPrice,
                    qty: pageCount * copies, // Total lembar fisik
                    pages: pageCount,        // Info halaman per file
                    copies: copies,          // Info rangkap
                    spec: `${paperSize.toUpperCase()} - ${colorMode} - ${paperType}`,
                    finish: finishing
                  }
                }}
              >
                <button className="w-full bg-[#123891] hover:bg-[#0e2c75] transition-colors text-white py-3.5 rounded-lg font-bold shadow-md hover:shadow-lg transform active:scale-[0.98] duration-200">
                  Lanjut Pembayaran
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}