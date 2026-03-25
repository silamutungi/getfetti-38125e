import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (authError) { setError('Those credentials did not work. Please try again.'); return }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="font-serif text-4xl text-ink mb-2">Welcome back.</h1>
        <p className="text-dim font-mono text-sm mb-8">Sign in to manage your events.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-mono text-sm text-ink">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              className="border border-dim rounded-lg px-4 py-3 font-mono text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-mono text-sm text-ink">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={128}
              className="border border-dim rounded-lg px-4 py-3 font-mono text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
              required
            />
          </div>
          {error && <p className="text-red-600 font-mono text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white font-mono font-medium px-6 py-3 rounded-xl min-h-[44px] hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="font-mono text-sm text-dim mt-6">No account? <Link to="/signup" className="text-primary hover:underline">Create one free</Link></p>
      </div>
    </div>
  )
}
