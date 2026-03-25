import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Please enter your name.'); return }
    if (!email) { setError('Please enter your email address.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })
    setLoading(false)
    if (authError) { setError('Could not create your account. That email may already be in use.'); return }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="font-serif text-4xl text-ink mb-2">Create your account.</h1>
        <p className="text-dim font-mono text-sm mb-8">Free to start. No card required.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="font-mono text-sm text-ink">Your name</label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              className="border border-dim rounded-lg px-4 py-3 font-mono text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
              required
            />
          </div>
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={128}
              className="border border-dim rounded-lg px-4 py-3 font-mono text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
              required
            />
            <p className="text-dim font-mono text-xs">At least 8 characters.</p>
          </div>
          {error && <p className="text-red-600 font-mono text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white font-mono font-medium px-6 py-3 rounded-xl min-h-[44px] hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="font-mono text-sm text-dim mt-6">Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link></p>
      </div>
    </div>
  )
}
