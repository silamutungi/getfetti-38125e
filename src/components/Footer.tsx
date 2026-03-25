import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-ink text-dim-dark border-t border-white/10 py-10 px-4 mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-serif text-paper text-lg">Getfetti 🎉</span>
        <nav className="flex gap-6" aria-label="Footer navigation">
          <Link to="/privacy" className="font-mono text-xs hover:text-paper transition-colors">Privacy</Link>
          <Link to="/terms" className="font-mono text-xs hover:text-paper transition-colors">Terms</Link>
          <a href="mailto:hello@getfetti.com" className="font-mono text-xs hover:text-paper transition-colors">Contact</a>
        </nav>
        <p className="font-mono text-xs">&copy; {new Date().getFullYear()} Getfetti. All rights reserved.</p>
      </div>
    </footer>
  )
}
