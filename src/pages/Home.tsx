import { Link } from 'react-router-dom'

export default function Home() {
  const features = [
    {
      icon: '📋',
      title: 'Host Brief',
      body: 'A calm daily view: likely attendance, unresolved maybes, and the three things to handle now. No dashboard noise.'
    },
    {
      icon: '🤔',
      title: 'Better Maybe',
      body: 'Guests choose a reason when they pick Maybe — schedule conflict, waiting on a plus-one, arriving late. Usable signal, not vague intent.'
    },
    {
      icon: '👁️',
      title: 'Dual View',
      body: 'One event, two modes. Vibe View for your close friends. Simple View for family and coworkers. Same link, right feel.'
    },
    {
      icon: '✨',
      title: 'Smart Themes',
      body: 'Dietary prompts for dinners, weather backup questions for rooftop parties, registry links for housewarmings. Your event knows what it needs.'
    }
  ]

  return (
    <div>
      <section className="bg-ink text-paper px-6 py-20 md:py-32">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-primary text-white font-mono text-xs px-3 py-1 rounded-full mb-6 tracking-wide uppercase">Now in early access</div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6">
            The invite app that actually helps you host.
          </h1>
          <p className="text-dim-dark font-mono text-lg md:text-xl mb-10 max-w-xl">
            Beautiful invites. Clearer RSVPs. A calm Host Brief that tells you who is coming, who is still a maybe, and what to do next.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/signup"
              className="bg-primary text-white font-mono font-medium px-8 py-4 rounded-xl min-h-[44px] flex items-center justify-center text-base hover:bg-primary-dark transition-colors"
            >
              Create your first event
            </Link>
            <Link
              to="/login"
              className="border border-dim-dark text-dim-dark font-mono font-medium px-8 py-4 rounded-xl min-h-[44px] flex items-center justify-center text-base hover:border-paper hover:text-paper transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4">Hosting is hard. Reading the room is harder.</h2>
        <p className="text-dim font-mono text-base mb-12 max-w-2xl">
          Every other invite tool gives you a dashboard. None gives you confidence. Getfetti turns RSVPs into real answers.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-8 border border-paper">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-serif text-xl text-ink mb-2">{f.title}</h3>
              <p className="text-dim font-mono text-sm leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-4xl text-paper mb-4">Your next event starts here.</h2>
          <p className="text-dim-dark font-mono mb-8">Free to start. No credit card. One link to share.</p>
          <Link
            to="/signup"
            className="bg-primary text-white font-mono font-medium px-10 py-4 rounded-xl min-h-[44px] inline-flex items-center justify-center text-base hover:bg-primary-dark transition-colors"
          >
            Start for free
          </Link>
        </div>
      </section>
    </div>
  )
}
