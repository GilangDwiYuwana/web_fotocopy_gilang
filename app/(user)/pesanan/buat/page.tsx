'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/layouts/Navbar";
import FileUpload from '@/components/forms/FileUpload';
import { useRouter } from 'next/navigation';
// Import Server Actions
import { getServicesForOrder, createOrder } from '@/src/actions/orderActions';

// --- IMPORT LIBRARY PDF READER (Pertahankan kode kamu) ---
import * as pdfjs from 'pdfjs-dist';
// @ts-ignore
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Service = { id: number; name: string; category: string; price: number };

export default function BuatPesanan() {
  const router = useRouter();

  // --- STATE DATABASE ---
  const [dbServices, setDbServices] = useState<Service[]>([]); // Semua data mentah
  const [loading, setLoading] = useState(true);

  // --- STATE FORM ---
  const [pageCount, setPageCount] = useState(1);
  const [copies, setCopies] = useState(1);
  const [isReading, setIsReading] = useState(false);

  // Pilihan User
  const [selectedPaperId, setSelectedPaperId] = useState<number>(0);
  const [selectedFinishingId, setSelectedFinishingId] = useState<number>(0);
  const [sizeMode, setSizeMode] = useState('a4'); // 'a4' | 'f4' | 'a3'
  const [colorMode, setColorMode] = useState('bw'); // 'bw' | 'color'
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Load Data dari Database
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getServicesForOrder();
        setDbServices(data);

        // Set Default Paper (Cari kategori kertas termurah/pertama)
        const papers = data.filter(s => s.category === 'kertas');
        if (papers.length > 0) setSelectedPaperId(papers[0].id);
      } catch (error) {
        console.error("Gagal load data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 2. Filter Data untuk UI
  const papers = dbServices.filter(s => s.category === 'kertas');
  const finishings = dbServices.filter(s => s.category === 'finishing');
  
  // Cari service add-on di database (misal: "Ukuran A3", "Warna")
  const addonA3 = dbServices.find(s => s.name.toLowerCase().includes('a3'));
  const addonF4 = dbServices.find(s => s.name.toLowerCase().includes('f4'));
  const addonColor = dbServices.find(s => s.category === 'warna');

  // 3. Kalkulasi Harga Real-time
  const selectedPaper = papers.find(p => p.id === selectedPaperId);
  const selectedFinishing = finishings.find(f => f.id === selectedFinishingId);

  // Harga Dasar
  let basePrice = selectedPaper ? selectedPaper.price : 0;
  
  // Tambahan Harga Ukuran (Jika ada di DB)
  let sizeMarkup = 0;
  if (sizeMode === 'a3' && addonA3) sizeMarkup = addonA3.price;
  if (sizeMode === 'f4' && addonF4) sizeMarkup = addonF4.price;

  // Tambahan Harga Warna (Jika ada di DB)
  let colorMarkup = 0;
  if (colorMode === 'color' && addonColor) colorMarkup = addonColor.price;

  const finishingPrice = selectedFinishing ? selectedFinishing.price : 0;
  
  // RUMUS: (Harga Kertas + Markup Ukuran + Markup Warna) * Total Lembar + (Finishing * Rangkap)
  const totalSheets = pageCount * copies;
  const printCost = (basePrice + sizeMarkup + colorMarkup) * totalSheets;
  const finishCost = finishingPrice * copies;
  const totalPrice = printCost + finishCost;

  // --- LOGIKA BACA PDF (Dari kode kamu) ---
  const handleFileSelect = async (file: File) => {
    if (!file) return;
    setPageCount(1);
    if (file.type === 'application/pdf') {
      try {
        setIsReading(true);
        const buffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument(buffer).promise;
        setPageCount(pdf.numPages);
        alert(`File terbaca: ${pdf.numPages} Halaman.`);
      } catch (err) {
        console.error(err);
        alert("Gagal membaca halaman PDF. Silakan isi manual.");
      } finally {
        setIsReading(false);
      }
    }
  };

  // --- SUBMIT KE DATABASE ---
  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      // Siapkan item yang mau disimpan ke DB
      const itemsToSave = [];

      // 1. Item Kertas (Utama)
      if (selectedPaperId) {
        itemsToSave.push({ 
            serviceId: selectedPaperId, 
            qty: totalSheets, 
            price: basePrice 
        });
      }

      // 2. Item Finishing (Jika ada)
      if (selectedFinishingId) {
        itemsToSave.push({ 
            serviceId: selectedFinishingId, 
            qty: copies, 
            price: finishingPrice 
        });
      }

      // 3. Item Addon Warna (Jika dipilih)
      if (colorMode === 'color' && addonColor) {
        itemsToSave.push({ 
            serviceId: addonColor.id, 
            qty: totalSheets, 
            price: addonColor.price 
        });
      }
      
      // 4. Item Addon Ukuran (Jika A3/F4)
      if (sizeMode === 'a3' && addonA3) itemsToSave.push({ serviceId: addonA3.id, qty: totalSheets, price: addonA3.price });
      if (sizeMode === 'f4' && addonF4) itemsToSave.push({ serviceId: addonF4.id, qty: totalSheets, price: addonF4.price });

      const dummyUserId = 1; // Ganti dengan user session nanti

      const orderId = await createOrder({
        userId: dummyUserId,
        items: itemsToSave,
        total: totalPrice
      });

      router.push(`/pembayaran/${orderId}`);

    } catch (error) {
      console.error(error);
      alert("Gagal membuat pesanan.");
      setIsSubmitting(false);
    }
  }

  const formatRupiah = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat Data Database...</div>;

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
              <FileUpload onFileSelect={handleFileSelect} />
              {isReading ? (
                <p className="text-sm text-blue-600 mt-2 animate-pulse">Sedang menghitung halaman...</p>
              ) : (
                <p className="text-xs text-gray-400 mt-2">*Halaman PDF akan terhitung otomatis.</p>
              )}
            </section>

            {/* Bagian 2: Spesifikasi (DINAMIS DARI DB) */}
            <section className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
              <h2 className="text-lg font-semibold mb-4 text-[#123891]">2. Spesifikasi Cetak</h2>

              {/* Pilihan Ukuran & Warna */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="block text-sm font-bold mb-2 text-gray-700">Ukuran Kertas</span>
                  <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    {['a4', 'f4', 'a3'].map((size) => (
                      <button key={size} onClick={() => setSizeMode(size)} 
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${sizeMode === size ? 'bg-white text-[#123891] shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                        {size.toUpperCase()}
                      </button>
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

              {/* Dropdown Kertas & Finishing (DATA DARI DB) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <label className="block">
                    <span className="text-sm font-bold mb-2 text-gray-700 block">Jenis Kertas</span>
                    <select value={selectedPaperId} onChange={(e) => setSelectedPaperId(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-[#123891] outline-none">
                    {papers.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} (+ {formatRupiah(p.price)})</option>
                    ))}
                    </select>
                 </label>
                 <label className="block">
                    <span className="text-sm font-bold mb-2 text-gray-700 block">Finishing</span>
                    <select value={selectedFinishingId} onChange={(e) => setSelectedFinishingId(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-[#123891] outline-none">
                    <option value={0}>Tanpa Finishing</option>
                    {finishings.map((f) => (
                        <option key={f.id} value={f.id}>{f.name} (+ {formatRupiah(f.price)})</option>
                    ))}
                    </select>
                 </label>
              </div>

              {/* Jumlah Halaman & Copy */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h3 className="text-sm font-bold text-[#123891] mb-3">Detail Kuantitas</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold mb-1 text-gray-500">Halaman per File</label>
                       <input type="number" min="1" value={pageCount} onChange={(e) => setPageCount(Math.max(1, Number(e.target.value)))} className="w-full border border-gray-300 rounded-lg p-2 font-bold text-gray-800" />
                       <p className="text-[10px] text-gray-500 mt-1">Terisi otomatis jika PDF</p>
                    </div>
                    <div>
                       <label className="block text-xs font-bold mb-1 text-gray-500">Jumlah Rangkap (Copy)</label>
                       <div className="flex items-center">
                           <input type="number" min="1" value={copies} onChange={(e) => setCopies(Math.max(1, Number(e.target.value)))} className="w-full border border-gray-300 rounded-lg p-2 font-bold text-gray-800" />
                           <span className="ml-2 text-sm font-bold text-gray-500">Set</span>
                       </div>
                    </div>
                </div>
              </div>

            </section>
          </div>

          {/* === KOLOM KANAN: RINGKASAN HARGA === */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border shadow-lg sticky top-24">
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
                  <span className="font-semibold text-gray-800 uppercase">{sizeMode} - {colorMode}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bahan</span>
                  <span className="font-semibold text-gray-800">{selectedPaper?.name || '-'}</span>
                </div>
                {selectedFinishing && (
                    <div className="flex justify-between">
                    <span>Finishing</span>
                    <span className="font-semibold text-gray-800">{selectedFinishing.name}</span>
                    </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <span className="text-[#123891] font-bold">Total</span>
                <span className="text-2xl font-bold text-[#123891]">{formatRupiah(totalPrice)}</span>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full text-white py-3.5 rounded-lg font-bold shadow-md transition-all ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#123891] hover:bg-[#0e2c75] hover:shadow-lg'}`}
              >
                {isSubmitting ? 'Menyimpan...' : 'Lanjut Pembayaran'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}