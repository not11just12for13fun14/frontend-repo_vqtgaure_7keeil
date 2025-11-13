import { useState } from 'react'

export default function AuthForm({ onSuccess, mode = 'login' }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const url = mode === 'register' ? `${baseUrl}/auth/register` : `${baseUrl}/auth/login`
      const payload = mode === 'register' ? { name: form.name, email: form.email, password: form.password } : { email: form.email, password: form.password }
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail || 'Failed')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, is_admin: data.is_admin }))
      onSuccess({ token: data.token, user: { name: data.name, email: data.email, is_admin: data.is_admin } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 w-full max-w-sm">
      <h2 className="text-xl font-semibold mb-4">{mode === 'register' ? 'Create an account' : 'Login'}</h2>
      {mode === 'register' && (
        <div className="mb-3">
          <label className="block text-sm mb-1">Full name</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded px-3 py-2" required />
        </div>
      )}
      <div className="mb-3">
        <label className="block text-sm mb-1">Email</label>
        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border rounded px-3 py-2" required />
      </div>
      <div className="mb-4">
        <label className="block text-sm mb-1">Password</label>
        <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full border rounded px-3 py-2" required />
      </div>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <button disabled={loading} className="w-full bg-blue-600 text-white rounded py-2">{loading ? 'Please wait...' : (mode === 'register' ? 'Register' : 'Login')}</button>
    </form>
  )
}
