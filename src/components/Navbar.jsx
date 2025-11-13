import { LogIn, LogOut, ShoppingCart, Shield, Store } from 'lucide-react'

export default function Navbar({ user, onLogout, onNav }) {
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={() => onNav('home')} className="flex items-center gap-2 font-bold text-xl">
          <Store className="w-6 h-6 text-purple-600" />
          <span>GameZone</span>
        </button>
        <nav className="flex items-center gap-3">
          <button onClick={() => onNav('pc')} className="px-3 py-2 rounded hover:bg-gray-100">PC</button>
          <button onClick={() => onNav('mobile')} className="px-3 py-2 rounded hover:bg-gray-100">Mobile</button>
          {user?.is_admin && (
            <button onClick={() => onNav('admin')} className="px-3 py-2 rounded hover:bg-purple-50 text-purple-700 flex items-center gap-1">
              <Shield className="w-4 h-4" /> Admin
            </button>
          )}
          {!user ? (
            <button onClick={() => onNav('login')} className="px-3 py-2 rounded bg-blue-600 text-white flex items-center gap-1">
              <LogIn className="w-4 h-4" /> Login
            </button>
          ) : (
            <button onClick={onLogout} className="px-3 py-2 rounded bg-gray-800 text-white flex items-center gap-1">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
