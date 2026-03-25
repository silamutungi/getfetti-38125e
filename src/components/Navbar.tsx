import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav className="bg-ink text-paper sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif text-xl font-bold tracking-tight text-paper hover:text-dim-dark transition-colors">Getfetti 🎉</Link>
        <div className="hidden sm:flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="font-mono text-sm text-dim-dark hover:text-paper transition-colors">Dashboard</Link>
              <Link to="/create" className="bg-primary text-white font-mono text-sm px-4 py-2 rounded-lg min-h-[44px] flex items-center hover:bg-primary-dark transition-colors">+ New event</Link>
              <button onClick={signOut} className="font-mono text-sm text-dim-dark hover:text-paper transition-colors min-h-[44px]">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-mono text-sm text-dim-dark hover:text-paper transition-colors">Sign in</Link>
              <Link to="/signup" className="bg-primary text-white font-mono text-sm px-4 py-2 rounded-lg min-h-[44px] flex items-center hover:bg-primary-dark transition-colors">Get started</Link>
            </>
          )}
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden text-paper min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Toggle menu">
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
      {menuOpen && (
        <div className="sm:hidden bg-ink border-t border-white/10 px-4 py-4 flex flex-col gap-3">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="font-mono text-sm text-dim-dark">Dashboard</Link>
              <Link to="/create" onClick={() => setMenuOpen(false)} className="font-mono text-sm text-dim-dark">+ New event</Link>
              <button onClick={() => { signOut(); setMenuOpen(false) }} className="font-mono text-sm text-dim-dark text-left">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="font-mono text-sm text-dim-dark">Sign in</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="font-mono text-sm text-dim-dark">Get started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
