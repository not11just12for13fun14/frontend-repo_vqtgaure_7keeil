import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import GameCard from './components/GameCard'
import AuthForm from './components/AuthForm'
import AuthPage from './components/AuthPage'

function Section({ title, children }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children}
    </section>
  )
}

function BuyModal({ game, onClose }) {
  const [form, setForm] = useState({ email_for_delivery: '', nagad_number: '', transaction_id: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ ...form, game_id: game.id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail || 'Order failed')
      setMessage(data.message || 'Order placed successfully. Delivery within 2 hours.')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!game) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow w-full max-w-md">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Buy: {game.title}</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>
        <form onSubmit={submit} className="p-4 space-y-3">
          <div>
            <label className="block text-sm mb-1">Email to receive game</label>
            <input type="email" className="w-full border rounded px-3 py-2" required value={form.email_for_delivery} onChange={e => setForm({ ...form, email_for_delivery: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm mb-1">Nagad number (Send Money)</label>
            <input className="w-full border rounded px-3 py-2" required value={form.nagad_number} onChange={e => setForm({ ...form, nagad_number: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm mb-1">Transaction ID</label>
            <input className="w-full border rounded px-3 py-2" required value={form.transaction_id} onChange={e => setForm({ ...form, transaction_id: e.target.value })} />
          </div>
          {message && <p className="text-sm">{message}</p>}
          <button disabled={loading} className="w-full bg-purple-600 text-white rounded py-2">{loading ? 'Placing...' : 'Place Order'}</button>
        </form>
      </div>
    </div>
  )
}

function AdminPanel({ onBack }) {
  const [tab, setTab] = useState('games')
  const [games, setGames] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState({ title: '', description: '', price: '', platform: 'PC', category: '', images: '' })
  const [status, setStatus] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const token = localStorage.getItem('token')

  const fetchAllGames = async () => {
    const res = await fetch(`${baseUrl}/games/all`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setGames(data)
  }

  const fetchOrders = async () => {
    const res = await fetch(`${baseUrl}/orders`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setOrders(data)
  }

  useEffect(() => { fetchAllGames(); fetchOrders() }, [])

  const addGame = async (e) => {
    e.preventDefault()
    setStatus('')
    try {
      const payload = { ...form, price: parseFloat(form.price || '0'), images: form.images ? form.images.split(',').map(s => s.trim()) : [] }
      const res = await fetch(`${baseUrl}/games`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail || 'Failed to add')
      setStatus('Game added')
      setForm({ title: '', description: '', price: '', platform: 'PC', category: '', images: '' })
      fetchAllGames()
    } catch (e) {
      setStatus(e.message)
    }
  }

  const toggleActive = async (g) => {
    const res = await fetch(`${baseUrl}/games/${g.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ is_active: !g.is_active })
    })
    await res.json()
    fetchAllGames()
  }

  const removeGame = async (g) => {
    await fetch(`${baseUrl}/games/${g.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    fetchAllGames()
  }

  const setOrderStatus = async (order, next) => {
    const res = await fetch(`${baseUrl}/orders/${order.id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: next })
    })
    await res.json()
    fetchOrders()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <button onClick={onBack} className="px-3 py-2 rounded bg-gray-200">Back</button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <button onClick={() => setTab('games')} className={`px-3 py-2 rounded ${tab==='games' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>Games</button>
        <button onClick={() => setTab('orders')} className={`px-3 py-2 rounded ${tab==='orders' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>Orders</button>
      </div>

      {tab === 'games' && (
        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={addGame} className="bg-white rounded-lg shadow p-4 space-y-3">
            <h3 className="font-semibold">Add new game</h3>
            <input placeholder="Title" className="w-full border rounded px-3 py-2" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            <textarea placeholder="Description" className="w-full border rounded px-3 py-2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Price" className="w-full border rounded px-3 py-2" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
              <select className="w-full border rounded px-3 py-2" value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
                <option>PC</option>
                <option>Mobile</option>
              </select>
            </div>
            <input placeholder="Category" className="w-full border rounded px-3 py-2" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            <input placeholder="Image URLs (comma separated)" className="w-full border rounded px-3 py-2" value={form.images} onChange={e => setForm({ ...form, images: e.target.value })} />
            {status && <p className="text-sm">{status}</p>}
            <button className="w-full bg-purple-600 text-white rounded py-2">Add Game</button>
          </form>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-3">All games</h3>
            <div className="space-y-3 max-h-[480px] overflow-auto">
              {games.map(g => (
                <div key={g.id} className="border rounded p-3 flex items-center gap-3">
                  <div className="flex-1">
                    <p className="font-medium">{g.title}</p>
                    <p className="text-sm text-gray-600">৳ {g.price} • {g.platform}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${g.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{g.is_active ? 'Active' : 'Inactive'}</span>
                  <button onClick={() => toggleActive(g)} className={`px-3 py-1 rounded ${g.is_active ? 'bg-yellow-500 text-white' : 'bg-green-600 text-white'}`}>{g.is_active ? 'Deactivate' : 'Activate'}</button>
                  <button onClick={() => removeGame(g)} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-3">Recent orders</h3>
          <div className="space-y-3 max-h-[600px] overflow-auto">
            {orders.map(o => (
              <div key={o.id} className="border rounded p-3 grid md:grid-cols-5 gap-3 items-center">
                <div className="md:col-span-2">
                  <p className="font-medium">{o.game_id}</p>
                  <p className="text-sm text-gray-600">{o.email_for_delivery}</p>
                </div>
                <div>
                  <p className="text-sm">Nagad: {o.nagad_number}</p>
                  <p className="text-sm">Txn: {o.transaction_id}</p>
                </div>
                <div>
                  <span className={`text-xs px-2 py-1 rounded ${o.status === 'completed' ? 'bg-green-100 text-green-700' : o.status === 'canceled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.status}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setOrderStatus(o, 'completed')} className="px-3 py-1 rounded bg-green-600 text-white">Complete</button>
                  <button onClick={() => setOrderStatus(o, 'canceled')} className="px-3 py-1 rounded bg-red-600 text-white">Cancel</button>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-sm text-gray-600">No orders yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [view, setView] = useState('home')
  const [games, setGames] = useState([])
  const [selected, setSelected] = useState(null)
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : null
  })

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const fetchGames = async (platformFilter) => {
    const res = await fetch(`${baseUrl}/games`)
    let data = await res.json()
    if (platformFilter) data = data.filter(g => (g.platform || '').toLowerCase() === platformFilter)
    setGames(data)
  }

  useEffect(() => { fetchGames() }, [])

  useEffect(() => {
    if (view === 'pc') fetchGames('pc')
    if (view === 'mobile') fetchGames('mobile')
    if (view === 'home') fetchGames()
  }, [view])

  const onLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setView('home')
  }

  const content = useMemo(() => {
    if (view === 'auth') return (
      <AuthPage onSuccess={({ user }) => { setUser(user); setView('home') }} />
    )

    if (view === 'admin') {
      if (!user?.is_admin) return <Section title="Admin">Login as admin to access this page.</Section>
      return <AdminPanel onBack={() => setView('home')} />
    }

    return (
      <>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8">
            <h1 className="text-3xl font-extrabold tracking-tight">RS GAME GHOR</h1>
            <p className="text-white/90 mt-2">Pay with Nagad Send Money, submit Transaction ID, and receive your game within 2 hours via email.</p>
          </div>
        </div>

        <Section title={view === 'pc' ? 'PC Games' : view === 'mobile' ? 'Mobile Games' : 'All Games'}>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {games.map(g => (
              <GameCard key={g.id} game={g} onBuy={(game) => setSelected(game)} />
            ))}
          </div>
        </Section>
      </>
    )
  }, [view, games, user])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navbar user={user} onLogout={onLogout} onNav={setView} />
      {content}
      <BuyModal game={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
