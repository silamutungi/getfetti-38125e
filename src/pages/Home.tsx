import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  const [visible, setVisible] = useState(false)
  const featureRefs = useRef<(HTMLDivElement | null)[]>([])
  const [featureVisible, setFeatureVisible] = useState<boolean[]>([false, false, false, false])
  const pricingRef = useRef<HTMLDivElement>(null)
  const [pricingVisible, setPricingVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    featureRefs.current.forEach((ref, i) => {
      if (!ref) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setFeatureVisible(prev => {
              const next = [...prev]
              next[i] = true
              return next
            })
            obs.disconnect()
          }
        },
        { threshold: 0.15 }
      )
      obs.observe(ref)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  useEffect(() => {
    if (!pricingRef.current) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPricingVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(pricingRef.current)
    return () => obs.disconnect()
  }, [])

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

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'For the occasional host who wants a beautiful invite without the friction.',
      features: [
        'Up to 3 events per year',
        'Beautiful invite pages',
        'Standard RSVP tracking',
        'Guest messaging',
        'Mobile-optimised links',
      ],
      cta: 'Get started free',
      ctaLink: '/signup',
      highlight: false,
    },
    {
      name: 'Host',
      price: '$9',
      period: 'per month',
      description: 'For the person who hosts regularly and wants real clarity before every event.',
      features: [
        'Unlimited events',
        'Host Brief — daily clarity digest',
        'Better Maybe with reason tracking',
        'Dual View (Vibe + Simple)',
        'Smart Themes for every event type',
        'Priority guest support',
      ],
      cta: 'Start free trial',
      ctaLink: '/signup',
      highlight: true,
    },
    {
      name: 'Studio',
      price: '$29',
      period: 'per month',
      description: 'For event planners and teams managing multiple hosts and events at once.',
      features: [
        'Everything in Host',
        'Up to 10 team members',
        'Shared event dashboard',
        'Custom branding & domain',
        'Analytics export',
        'Dedicated support',
      ],
      cta: 'Talk to us',
      ctaLink: '/signup',
      highlight: false,
    }
  ]

  return (
    <div>
      <section
        style={{
          backgroundImage: 'url(https://loremflickr.com/1600/900/party,celebration,confetti)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/55 to-black/25" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 w-full">
          <div
            className={`transition-all duration-700 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="inline-block bg-primary text-white font-mono text-xs px-3 py-1 rounded-full mb-6 tracking-wide uppercase shadow-lg">
              Now in early access
            </div>
            <h1 className="font-serif text-6xl md:text-8xl font-bold leading-tight mb-6 text-white max-w-3xl drop-shadow-lg">
              The invite app that actually helps you host.
            </h1>
            <p className="text-white/80 font-mono text-lg md:text-xl mb-10 max-w-xl leading-relaxed drop-shadow">
              Beautiful invites. Clearer RSVPs. A calm Host Brief that tells you who is coming, who is still a maybe, and what to do next.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                className="bg-primary text-white font-mono font-medium px-8 py-4 rounded-xl min-h-[44px] flex items-center justify-center text-base hover:bg-primary-dark transition-all duration-300 active:scale-[0.97] shadow-xl shadow-primary/30"
              >
                Create your first event
              </Link>
              <Link
                to="/login"
                className="border border-white/40 bg-white/10 backdrop-blur-sm text-white font-mono font-medium px-8 py-4 rounded-xl min-h-[44px] flex items-center justify-center text-base hover:bg-white/20 hover:border-white/70 transition-all duration-300 active:scale-[0.97]"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <div className="w-px h-10 bg-gradient-to-b from-white/0 to-white/40 animate-pulse" />
        </div>
      </section>

      <section className="px-6 py-20 md:py-32 max-w-5xl mx-auto">
        <div
          className={`transition-all duration-700 delay-200 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4">
            Hosting is hard. Reading the room is harder.
          </h2>
          <p className="text-dim font-mono text-base mb-12 max-w-2xl leading-relaxed">
            Every other invite tool gives you a dashboard. None gives you confidence. Getfetti turns RSVPs into real answers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                ref={el => { featureRefs.current[i] = el }}
                className={`bg-white rounded-2xl p-8 border border-paper shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 ${
                  featureVisible[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-serif text-xl text-ink mb-2">{f.title}</h3>
                <p className="text-dim font-mono text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper px-6 py-20 md:py-32">
        <div className="max-w-5xl mx-auto" ref={pricingRef}>
          <div
            className={`transition-all duration-700 ${
              pricingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="mb-14">
              <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4">
                Simple pricing. No surprises.
              </h2>
              <p className="text-dim font-mono text-base max-w-xl leading-relaxed">
                Start free. Upgrade when hosting becomes a regular part of your life.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {plans.map((plan, i) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-8 border transition-all duration-500 ${
                    plan.highlight
                      ? 'bg-ink border-ink shadow-2xl shadow-ink/20 md:-translate-y-3'
                      : 'bg-white border-paper shadow-sm'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {plan.highlight && (
                    <div className="inline-block bg-primary text-white font-mono text-xs px-3 py-1 rounded-full mb-5 tracking-wide uppercase">
                      Most popular
                    </div>
                  )}
                  <div className="mb-6">
                    <p className={`font-mono text-sm uppercase tracking-widest mb-2 ${plan.highlight ? 'text-white/50' : 'text-dim'}`}>
                      {plan.name}
                    </p>
                    <div className="flex items-end gap-2 mb-3">
                      <span className={`font-serif text-5xl font-bold ${plan.highlight ? 'text-white' : 'text-ink'}`}>
                        {plan.price}
                      </span>
                      <span className={`font-mono text-sm pb-2 ${plan.highlight ? 'text-white/50' : 'text-dim'}`}>
                        {plan.period}
                      </span>
                    </div>
                    <p className={`font-mono text-sm leading-relaxed ${plan.highlight ? 'text-white/70' : 'text-dim'}`}>
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex items-start gap-3">
                        <span className={`mt-0.5 text-sm flex-shrink-0 ${plan.highlight ? 'text-primary' : 'text-primary'}`}>✓</span>
                        <span className={`font-mono text-sm leading-relaxed ${plan.highlight ? 'text-white/80' : 'text-dim'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={plan.ctaLink}
                    className={`w-full font-mono font-medium px-6 py-3 rounded-xl min-h-[44px] flex items-center justify-center text-sm transition-all duration-300 active:scale-[0.97] ${
                      plan.highlight
                        ? 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/30'
                        : 'border border-paper bg-white text-ink hover:bg-paper hover:border-ink/20'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>

            <p className="text-center font-mono text-sm text-dim mt-10">
              All plans include a 14-day free trial. No credit card required to start.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-ink px-6 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-paper mb-4 leading-tight">
            Your next event starts here.
          </h2>
          <p className="text-dim-dark font-mono mb-10 text-lg">
            Free to start. No credit card. One link to share.
          </p>
          <Link
            to="/signup"
            className="bg-primary text-white font-mono font-medium px-12 py-4 rounded-xl min-h-[44px] inline-flex items-center justify-center text-base hover:bg-primary-dark transition-all duration-300 active:scale-[0.97] shadow-xl shadow-primary/20"
          >
            Start for free
          </Link>
        </div>
      </section>
    </div>
  )
}