import { useState } from 'react'
import AuthForm from './AuthForm'

export default function AuthPage({ onSuccess }) {
  const [mode, setMode] = useState('login')

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center px-4 py-12 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-300/30 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-300/30 blur-3xl rounded-full" />
      </div>

      <div className="relative w-full max-w-5xl grid md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-8 border border-white/40">
          <div className="mb-6">
            <p className="text-sm tracking-widest text-purple-700 font-semibold">WELCOME TO</p>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">RS GAME GHOR</h1>
            <p className="mt-2 text-gray-600">Pay with Nagad Send Money and receive your games within 2 hours via email.</p>
          </div>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2"><span className="mt-1 w-2 h-2 rounded-full bg-purple-600" />Secure login & registration</li>
            <li className="flex items-start gap-2"><span className="mt-1 w-2 h-2 rounded-full bg-purple-600" />Admin panel to manage all games</li>
            <li className="flex items-start gap-2"><span className="mt-1 w-2 h-2 rounded-full bg-purple-600" />Fast delivery within 2 hours</li>
          </ul>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6 border border-white/40">
          <div className="flex items-center gap-2 mb-4 p-1 bg-gray-100 rounded-lg">
            <button onClick={() => setMode('login')} className={`flex-1 py-2 rounded-md text-sm font-semibold ${mode==='login' ? 'bg-white shadow' : 'text-gray-600'}`}>Login</button>
            <button onClick={() => setMode('register')} className={`flex-1 py-2 rounded-md text-sm font-semibold ${mode==='register' ? 'bg-white shadow' : 'text-gray-600'}`}>Register</button>
          </div>
          <AuthForm mode={mode} onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  )
}
