import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Event, Rsvp } from '../types'

function buildBrief(rsvps: Rsvp[]) {
  const yes = rsvps.filter((r) => r.status === 'yes' && !r.deleted_at)
  const maybe = rsvps.filter((r) => r.status === 'maybe' && !r.deleted_at)
  const items: string[] = []
  if (maybe.length > 0) items.push(`Follow up with ${maybe.length} maybe${maybe.length > 1 ? 's' : ''}`)
  if (yes.length === 0) items.push('Share your invite link to get RSVPs')
  if (yes.length > 0 && yes.length < 5) items.push('Your guest list is growing — keep sharing!')
  return { likely_count: yes.length, maybe_count: maybe.length, action_items: items }
}

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [rsvpMap, setRsvpMap] = useState<Record<string, Rsvp[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { loadEvents() }, [])

  async function loadEvents() {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not signed in.'); setLoading(false); return }
    const { data: evData, error: evErr } = await supabase
      .from('events')
      .select('*')
      .eq('host_id', user.id)
      .is('deleted_at', null)
      .order('date', { ascending: true })
    if (evErr) { setError('Could not load your events. Please refresh.'); setLoading(false); return }
    const evList = (evData ?? []) as Event[]
    setEvents(evList)
    if (evList.length > 0) {
      const ids = evList.map((e) => e.id)
      const { data: rsvpData } = await supabase
        .from('rsvps')
        .select('*')
        .in('event_id', ids)
        .is('deleted_at', null)
      const map: Record<string, Rsvp[]> = {}
      for (const ev of evList) map[ev.id] = []
      for (const r of (rsvpData ?? []) as Rsvp[]) {
        if (map[r.event_id]) map[r.event_id].push(r)
      }
      setRsvpMap(map)
    }
    setLoading(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <p className="font-mono text-red-600 mb-4">{error}</p>
      <button onClick={loadEvents} className="bg-primary text-white font-mono px-6 py-3 rounded-xl min-h-[44px] hover:bg-primary-dark transition-colors">Try again</button>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-ink">Your events</h1>
        <Link to="/create" className="bg-primary text-white font-mono text-sm px-5 py-3 rounded-xl min-h-[44px] flex items-center hover:bg-primary-dark transition-colors">+ New event</Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-paper p-12 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="font-serif text-2xl text-ink mb-2">No events yet.</h2>
          <p className="text-dim font-mono text-sm mb-6">Create your first invite and share it in one link.</p>
          <Link to="/create" className="bg-primary text-white font-mono px-8 py-3 rounded-xl min-h-[44px] inline-flex items-center hover:bg-primary-dark transition-colors">Create an event</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {events.map((ev) => {
            const brief = buildBrief(rsvpMap[ev.id] ?? [])
            return (
              <div key={ev.id} className="bg-white rounded-2xl border border-paper p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="font-serif text-xl text-ink">{ev.title}</h2>
                    <p className="font-mono text-sm text-dim">{new Date(ev.date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })} &middot; {ev.location}</p>
                  </div>
                  <Link to={`/e/${ev.slug}`} className="border border-primary text-primary-dark font-mono text-xs px-4 py-2 rounded-lg min-h-[44px] flex items-center whitespace-nowrap hover:bg-primary hover:text-white transition-colors">View invite</Link>
                </div>
                <div className="bg-paper rounded-xl p-4">
                  <p className="font-mono text-xs text-dim uppercase tracking-wide mb-3">Host Brief</p>
                  <div className="flex gap-6 mb-3">
                    <div className="text-center">
                      <div className="font-serif text-3xl text-ink">{brief.likely_count}</div>
                      <div className="font-mono text-xs text-dim">confirmed</div>
                    </div>
                    <div className="text-center">
                      <div className="font-serif text-3xl text-ink">{brief.maybe_count}</div>
                      <div className="font-mono text-xs text-dim">maybe</div>
                    </div>
                  </div>
                  {brief.action_items.length > 0 && (
                    <ul className="flex flex-col gap-1">
                      {brief.action_items.map((item, i) => (
                        <li key={i} className="font-mono text-xs text-ink flex items-start gap-2">
                          <span className="text-primary mt-px">&#8594;</span> {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
