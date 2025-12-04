'use client';
import React, { useRef, useState } from 'react';

// 1. Kita buat Interface untuk mendefinisikan tipe props
// Ini wajib di TypeScript agar dia tau onFileSelect itu fungsi apa
interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

// 2. Masukkan props ke dalam fungsi component
export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      setFileName(file.name);
      // 3. PENTING: Kirim file asli ke parent (BuatPesanan) 
      // agar bisa dibaca oleh PDF.js
      onFileSelect(file);
    }
  };

  return (
    <div 
      className="flex flex-col p-8 bg-[#f8f9fb] border-2 border-dashed border-[#d0d7e6] rounded-xl items-center gap-4 hover:bg-blue-50 transition-colors cursor-pointer group"
      onClick={() => fileInputRef.current?.click()} // Klik div pun bisa trigger upload
    >
      <div className="w-12 h-12 bg-blue-100 text-[#123891] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      </div>

      <div className="text-center">
        <p className="font-bold text-lg text-gray-700">{fileName ? 'File Terpilih' : 'Unggah File'}</p>
        <p className="text-sm text-gray-500 mt-1">{fileName || 'PDF, DOCX, JPG (Max 10MB)'}</p>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.jpg,.jpeg,.png,.docx" // Membatasi tipe file di window explorer
      />

      <button 
        type="button" // Penting biar gak submit form kalau ada di dalam form
        onClick={(e) => {
          e.stopPropagation(); // Biar gak bentrok sama klik div
          fileInputRef.current?.click();
        }} 
        className="px-6 py-2 bg-white border border-gray-300 rounded-lg font-bold text-sm text-[#123891] hover:bg-[#123891] hover:text-white transition-all shadow-sm"
      >
        {fileName ? 'Ganti File' : 'Pilih File'}
      </button>
    </div>
  );
}