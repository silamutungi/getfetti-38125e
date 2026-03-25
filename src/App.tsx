import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import CreateEvent from './pages/CreateEvent'
import EventPage from './pages/EventPage'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-paper font-mono flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/e/:slug" element={<EventPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h1 className="font-serif text-4xl text-ink">Page not found</h1>
                <p className="text-dim font-mono">That invite link might have moved or expired.</p>
                <a href="/" className="bg-primary text-white font-mono px-6 py-3 rounded-lg min-h-[44px] flex items-center hover:bg-primary-dark transition-colors">Go home</a>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
