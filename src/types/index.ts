export type Privacy = 'public' | 'link_only' | 'invite_only'
export type MaybeReason = 'schedule_conflict' | 'waiting_on_plus_one' | 'arriving_late' | 'need_more_info'
export type RsvpStatus = 'yes' | 'no' | 'maybe'
export type ViewMode = 'vibe' | 'simple'

export interface Event {
  id: string
  host_id: string
  slug: string
  title: string
  date: string
  location: string
  description: string
  cover_image_url: string | null
  privacy: Privacy
  plus_one_allowed: boolean
  theme: string | null
  created_at: string
  deleted_at: string | null
}

export interface Rsvp {
  id: string
  event_id: string
  user_id: string | null
  guest_name: string
  guest_email: string
  status: RsvpStatus
  maybe_reason: MaybeReason | null
  plus_one_name: string | null
  dietary: string | null
  created_at: string
  deleted_at: string | null
}

export interface HostBrief {
  likely_count: number
  maybe_count: number
  unresolved_maybes: Rsvp[]
  action_items: string[]
}
