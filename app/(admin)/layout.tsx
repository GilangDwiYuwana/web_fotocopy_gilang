import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fb] font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-[#0e121b] to-[#1a1f2e] text-white flex flex-col fixed h-full shadow-2xl border-r border-gray-700/50">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-[#123891] to-[#4f6596] bg-opacity-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#123891] to-[#4f6596] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">CetakDigital</h2>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2 mt-6 mb-2">Main Menu</p>
          
          <Link href="/admin/dashboard" className="group flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-[#123891]/20 hover:to-transparent transition-all duration-300 text-gray-300 hover:text-white">
            <svg className="w-5 h-5 group-hover:text-[#4f9fff] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l4-4m0 0l4 4m-4-4V5" />
            </svg>
            <span className="font-medium">Dashboard</span>
            <div className="ml-auto w-2 h-2 rounded-full bg-[#4f9fff] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>

          <Link href="/admin/orders" className="group flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-[#123891]/20 hover:to-transparent transition-all duration-300 text-gray-300 hover:text-white">
            <svg className="w-5 h-5 group-hover:text-[#4f9fff] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span className="font-medium">Kelola Pesanan</span>
            <div className="ml-auto w-2 h-2 rounded-full bg-[#4f9fff] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>

          <Link href="/admin/pricing" className="group flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-[#123891]/20 hover:to-transparent transition-all duration-300 text-gray-300 hover:text-white">
            <svg className="w-5 h-5 group-hover:text-[#4f9fff] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Atur Harga</span>
            <div className="ml-auto w-2 h-2 rounded-full bg-[#4f9fff] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>

          <Link href="/admin/users" className="group flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-[#123891]/20 hover:to-transparent transition-all duration-300 text-gray-300 hover:text-white">
            <svg className="w-5 h-5 group-hover:text-[#4f9fff] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 8.646 4 4 0 010-8.646M12 20H7a3 3 0 00-3 3v-2a6 6 0 0112 0v2a3 3 0 01-3-3h5a3 3 0 01-3 3z" />
            </svg>
            <span className="font-medium">Pengguna</span>
            <div className="ml-auto w-2 h-2 rounded-full bg-[#4f9fff] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-700/50 space-y-3">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-[#123891]/10 to-[#4f6596]/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#123891] to-[#4f6596] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Admin</p>
              <p className="text-xs text-gray-400 truncate">admin@cetakdigital.com</p>
            </div>
          </div>

          <Link href="/login" className="group w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-300 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Keluar
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}