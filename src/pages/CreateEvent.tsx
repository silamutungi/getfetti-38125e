import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).slice(2, 7)
}

export default function CreateEvent() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [privacy, setPrivacy] = useState<'public' | 'link_only' | 'invite_only'>('link_only')
  const [plusOne, setPlusOne] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!title.trim() || title.length > 120) { setError('Event title is required and must be under 120 characters.'); return }
    if (!date) { setError('Please pick a date and time.'); return }
    if (!location.trim() || location.length > 200) { setError('Location is required and must be under 200 characters.'); return }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('You must be signed in to create an event.'); setLoading(false); return }
    const slug = slugify(title)
    const { error: insertErr } = await supabase.from('events').insert({
      host_id: user.id,
      slug,
      title: title.trim(),
      date,
      location: location.trim(),
      description: description.trim(),
      privacy,
      plus_one_allowed: plusOne
    })
    setLoading(false)
    if (insertErr) { setError('Could not create your event. Please try again.'); return }
    navigate('/dashboard')
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl text-ink mb-2">Create an event.</h1>
      <p className="text-dim font-mono text-sm mb-8">Fill in the details. You can edit everything after publishing.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="font-mono text-sm text-ink">Event name</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} className="border border-dim rounded-lg px-4 py-3 font-mono text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]" required />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="date" className="font-mono text-sm text-ink">Date and time</label>
          <input id="date" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="border border-dim rounded-lg px-4 py-3 font-mono text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]" required />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="location" className="font-mono text-sm text-ink">Location</label>
          <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} maxLength={200} className="border border-dim rounded-lg px-4 py-3 font-mono text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]" required />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="font-mono text-sm text-ink">Description (optional)</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} rows={4} className="border border-dim rounded-lg px-4 py-3 font-mono text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="privacy" className="font-mono text-sm text-ink">Who can see this?</label>
          <select id="privacy" value={privacy} onChange={(e) => setPrivacy(e.target.value as typeof privacy)} className="border border-dim rounded-lg px-4 py-3 font-mono text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]">
            <option value="link_only">Anyone with the link</option>
            <option value="public">Public — searchable</option>
            <option value="invite_only">Invite only</option>
          </select>
        </div>
        <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
          <input type="checkbox" checked={plusOne} onChange={(e) => setPlusOne(e.target.checked)} className="w-5 h-5 accent-primary" />
          <span className="font-mono text-sm text-ink">Allow plus-ones</span>
        </label>
        {error && <p className="text-red-600 font-mono text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}
        <button type="submit" disabled={loading} className="bg-primary text-white font-mono font-medium px-6 py-4 rounded-xl min-h-[44px] hover:bg-primary-dark transition-colors disabled:opacity-50 text-base">
          {loading ? 'Creating...' : 'Create event'}
        </button>
      </form>
    </div>
  )
}
