import { useState, useEffect, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Event, Rsvp, RsvpStatus, MaybeReason } from '../types'

const MAYBE_REASONS: { value: MaybeReason; label: string }[] = [
  { value: 'schedule_conflict', label: 'I have a scheduling conflict' },
  { value: 'waiting_on_plus_one', label: 'Waiting on my plus-one' },
  { value: 'arriving_late', label: 'I might arrive late' },
  { value: 'need_more_info', label: 'I need more info first' }
]

export default function EventPage() {
  const { slug } = useParams<{ slug: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [rsvps, setRsvps] = useState<Rsvp[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<RsvpStatus | ''>('')
  const [maybeReason, setMaybeReason] = useState<MaybeReason | ''>('')
  const [dietary, setDietary] = useState('')
  const [formError, setFormError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { if (slug) loadEvent(slug) }, [slug])

  async function loadEvent(s: string) {
    setLoading(true)
    const { data, error: err } = await supabase.from('events').select('*').eq('slug', s).is('deleted_at', null).single()
    if (err || !data) { setError('This invite could not be found. The link might be expired or incorrect.'); setLoading(false); return }
    setEvent(data as Event)
    const { data: rsvpData } = await supabase.from('rsvps').select('id, status').eq('event_id', data.id).is('deleted_at', null)
    setRsvps((rsvpData ?? []) as Rsvp[])
    setLoading(false)
  }

  async function handleRsvp(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!name.trim()) { setFormError('Please enter your name.'); return }
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) { setFormError('Please enter a valid email address.'); return }
    if (!status) { setFormError('Please choose yes, no, or maybe.'); return }
    if (status === 'maybe' && !maybeReason) { setFormError('Please pick a reason for your Maybe — it helps the host plan.'); return }
    setSubmitting(true)
    const { error: insertErr } = await supabase.from('rsvps').insert({
      event_id: event!.id,
      guest_name: name.trim(),
      guest_email: email.trim(),
      status,
      maybe_reason: status === 'maybe' ? maybeReason : null,
      dietary: dietary.trim() || null
    })
    setSubmitting(false)
    if (insertErr) { setFormError('Could not save your RSVP. Please try again.'); return }
    setSubmitted(true)
  }

  const yesCount = rsvps.filter((r) => r.status === 'yes').length
  const maybeCount = rsvps.filter((r) => r.status === 'maybe').length

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error || !event) return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <div className="text-5xl mb-4">🎈</div>
      <h1 className="font-serif text-3xl text-ink mb-3">Invite not found.</h1>
      <p className="font-mono text-dim">{error || 'This invite could not be found.'}</p>
    </div>
  )

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="bg-ink rounded-3xl p-8 mb-8 text-paper">
        <h1 className="font-serif text-4xl font-bold mb-3">{event.title}</h1>
        <p className="font-mono text-dim-dark text-sm mb-1">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at {new Date(event.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
        <p className="font-mono text-dim-dark text-sm mb-4">{event.location}</p>
        {event.description && <p className="font-mono text-sm text-paper leading-relaxed">{event.description}</p>}
        <div className="flex gap-4 mt-6">
          <span className="font-mono text-xs text-dim-dark">{yesCount} coming</span>
          <span className="font-mono text-xs text-dim-dark">{maybeCount} maybe</span>
        </div>
      </div>

      {submitted ? (
        <div className="bg-white rounded-2xl border border-paper p-8 text-center">
          <div className="text-4xl mb-3">{status === 'yes' ? '🎉' : status === 'maybe' ? '🤔' : '😢'}</div>
          <h2 className="font-serif text-2xl text-ink mb-2">{status === 'yes' ? "You're in!" : status === 'maybe' ? 'Got it — the host will follow up.' : "Thanks for letting them know."}</h2>
          <p className="font-mono text-sm text-dim">Your RSVP has been saved.</p>
        </div>
      ) : (
        <form onSubmit={handleRsvp} className="bg-white rounded-2xl border border-paper p-8 flex flex-col gap-5" noValidate>
          <h2 className="font-serif text-xl text-ink">RSVP</h2>
          <div className="flex flex-col gap-1">
            <label htmlFor="rname" className="font-mono text-sm text-ink">Your name</label>
            <input id="rname" type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} className="border border-dim rounded-lg px-4 py-3 font-mono text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]" required />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="remail" className="font-mono text-sm text-ink">Email</label>
            <input id="remail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} className="border border-dim rounded-lg px-4 py-3 font-mono text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]" required />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-sm text-ink">Are you coming?</span>
            <div className="flex gap-3">
              {(['yes', 'no', 'maybe'] as RsvpStatus[]).map((s) => (
                <button key={s} type="button" onClick={() => setStatus(s)} className={`flex-1 py-3 rounded-xl font-mono text-sm min-h-[44px] border-2 transition-colors capitalize ${
                  status === s ? 'bg-primary text-white border-primary' : 'border-dim text-ink hover:border-primary'
                }`}>{s}</button>
              ))}
            </div>
          </div>
          {status === 'maybe' && (
            <div className="flex flex-col gap-2">
              <span className="font-mono text-sm text-ink">What is holding you back? (helps the host plan)</span>
              {MAYBE_REASONS.map((r) => (
                <button key={r.value} type="button" onClick={() => setMaybeReason(r.value)} className={`text-left px-4 py-3 rounded-xl font-mono text-sm min-h-[44px] border-2 transition-colors ${
                  maybeReason === r.value ? 'bg-paper border-primary text-ink' : 'border-dim text-dim hover:border-ink hover:text-ink'
                }`}>{r.label}</button>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label htmlFor="dietary" className="font-mono text-sm text-ink">Dietary needs (optional)</label>
            <input id="dietary" type="text" value={dietary} onChange={(e) => setDietary(e.target.value)} maxLength={200} placeholder="e.g. vegetarian, nut allergy" className="border border-dim rounded-lg px-4 py-3 font-mono text-sm bg-white text-ink placeholder:text-[#767676] focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]" />
          </div>
          {formError && <p className="text-red-600 font-mono text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{formError}</p>}
          <button type="submit" disabled={submitting} className="bg-primary text-white font-mono font-medium px-6 py-4 rounded-xl min-h-[44px] hover:bg-primary-dark transition-colors disabled:opacity-50">
            {submitting ? 'Sending...' : 'Send RSVP'}
          </button>
        </form>
      )}
    </div>
  )
}
