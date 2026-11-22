import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Preload, useTexture } from '@react-three/drei'
import Lenis from 'lenis'
import { AnimatePresence, motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Menu,
  Play,
  Plus,
  X,
} from 'lucide-react'
import * as THREE from 'three'
import { bentoCards, projects, type Project } from './data/content'

function MagneticButton({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  return (
    <motion.div
      ref={ref}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 180, damping: 15, mass: 0.25 }}
      onPointerMove={(event) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        setPosition({
          x: (event.clientX - rect.left - rect.width / 2) * 0.16,
          y: (event.clientY - rect.top - rect.height / 2) * 0.16,
        })
      }}
      onPointerLeave={() => setPosition({ x: 0, y: 0 })}
      className={className}
    >
      <motion.button whileTap={{ scale: 0.96 }} onClick={onClick} className="w-full">
        {children}
      </motion.button>
    </motion.div>
  )
}

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('Work')
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = ['Work', 'Studio', 'Services', 'Journal']
  const scrollTo = (label: string) => {
    setActive(label)
    const id = label === 'Work' ? 'work' : label === 'Studio' ? 'studio' : label === 'Services' ? 'services' : 'contact'
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`nav-shell ${scrolled ? 'nav-scrolled' : ''}`}
      >
        <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="brand-mark"><span /></span>
          AETHER
        </button>
        <nav className="nav-links">
          {links.map((link) => (
            <button key={link} onClick={() => scrollTo(link)} className={active === link ? 'active' : ''}>
              {active === link && <motion.span layoutId="nav-active" className="nav-active" />}
              <span>{link}</span>
            </button>
          ))}
        </nav>
        <MagneticButton className="nav-cta">
          <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="button-small">
            Start a project <ArrowUpRight size={14} />
          </button>
        </MagneticButton>
        <button className="menu-button" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <Menu size={20} />
        </button>
      </motion.header>
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <button className="menu-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
              {links.map((link, index) => (
                <motion.button
                  key={link}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.06 }}
                  onClick={() => scrollTo(link)}
                >
                  {link} <ArrowUpRight />
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Hero() {
  const [spot, setSpot] = useState({ x: 70, y: 40 })
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  return (
    <section
      className="hero"
      onPointerMove={(event) => {
        setSpot({ x: event.clientX, y: event.clientY })
      }}
      style={{ '--spot-x': `${spot.x}px`, '--spot-y': `${spot.y}px` } as React.CSSProperties}
    >
      <div className="hero-grid" />
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="hero-content">
        <motion.div
          className="eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <span className="status-dot" /> Independent creative technology studio
        </motion.div>
        <h1>
          {['We design', 'what moves', 'tomorrow.'].map((line, i) => (
            <span className="reveal-line" key={line}>
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.45 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div
          className="hero-bottom"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.7 }}
        >
          <p>Strategy, identity, and digital products for the ambitious. Built with clarity. Made to endure.</p>
          <div className="hero-actions">
            <MagneticButton>
              <button className="button-primary" onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore work <ArrowRight size={16} />
              </button>
            </MagneticButton>
            <MagneticButton>
              <button className="button-secondary" onClick={() => document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' })}>
                <span className="play-icon"><Play size={12} fill="currentColor" /></span> Our studio
              </button>
            </MagneticButton>
          </div>
        </motion.div>
      </div>
      <motion.div
        ref={cardRef}
        className="hero-preview"
        initial={{ opacity: 0, scale: 0.92, rotateY: -12 }}
        animate={{ opacity: 1, scale: 1, rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        onPointerMove={(event) => {
          const rect = cardRef.current?.getBoundingClientRect()
          if (!rect) return
          setTilt({
            x: ((event.clientY - rect.top) / rect.height - 0.5) * -8,
            y: ((event.clientX - rect.left) / rect.width - 0.5) * 10,
          })
        }}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      >
        <div className="preview-window">
          <div className="preview-bar"><span /><span /><span /></div>
          <div className="preview-art">
            <div className="preview-ring ring-a" />
            <div className="preview-ring ring-b" />
            <div className="preview-core" />
          </div>
          <div className="preview-copy"><span>OBJECT / 04</span><strong>Resonance</strong></div>
        </div>
      </motion.div>
    </section>
  )
}

function SlidePlane({ project, position, active, onClick }: { project: Project; position: number; active: boolean; onClick: () => void }) {
  const group = useRef<THREE.Group>(null)
  const texture = useTexture(project.image)
  texture.colorSpace = THREE.SRGBColorSpace
  useFrame((state, delta) => {
    if (!group.current) return
    const distance = position
    const targetX = distance * 3.15
    const targetZ = -Math.abs(distance) * 1.15
    const targetRot = -distance * 0.42
    const targetScale = active ? 1.08 : Math.max(0.72, 1 - Math.abs(distance) * 0.13)
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, targetX, 5, delta)
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, targetZ, 5, delta)
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetRot, 5, delta)
    const scale = THREE.MathUtils.damp(group.current.scale.x, targetScale, 5, delta)
    group.current.scale.setScalar(scale)
  })

  return (
    <group ref={group} onClick={(event) => { event.stopPropagation(); onClick() }}>
      <mesh>
        <planeGeometry args={[3.15, 4.05, 32, 32]} />
        <meshBasicMaterial map={texture} toneMapped={false} transparent opacity={active ? 1 : 0.72} />
      </mesh>
      <mesh position={[0, 0, -0.015]}>
        <planeGeometry args={[3.2, 4.1]} />
        <meshBasicMaterial color="#09090b" transparent opacity={0.18} />
      </mesh>
    </group>
  )
}

function CarouselScene({ active, onActive, onOpen }: { active: number; onActive: (index: number) => void; onOpen: (project: Project) => void }) {
  const textures = projects.map((project) => project.image)
  useTexture.preload(textures)
  return (
    <>
      <ambientLight intensity={1} />
      {projects.map((project, index) => {
        let relative = index - active
        if (relative > projects.length / 2) relative -= projects.length
        if (relative < -projects.length / 2) relative += projects.length
        return (
          <SlidePlane
            key={project.title}
            project={project}
            position={relative}
            active={relative === 0}
            onClick={() => relative === 0 ? onOpen(project) : onActive(index)}
          />
        )
      })}
    </>
  )
}

function ProjectCarousel({ active, setActive, onOpen }: { active: number; setActive: React.Dispatch<React.SetStateAction<number>>; onOpen: (project: Project) => void }) {
  const [paused, setPaused] = useState(false)
  const [dragStart, setDragStart] = useState<number | null>(null)
  const [fallback, setFallback] = useState(false)
  const progress = useSpring(0, { stiffness: 40, damping: 20 })

  useEffect(() => {
    const lowPower = window.matchMedia('(max-width: 760px), (prefers-reduced-motion: reduce)').matches
    setFallback(lowPower)
  }, [])

  useEffect(() => {
    if (paused || fallback) return
    progress.set(0)
    const interval = window.setInterval(() => setActive((value) => (value + 1) % projects.length), 5200)
    const animation = window.requestAnimationFrame(() => progress.set(1))
    return () => { window.clearInterval(interval); window.cancelAnimationFrame(animation) }
  }, [active, paused, fallback, progress])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') setActive((value) => (value + 1) % projects.length)
      if (event.key === 'ArrowLeft') setActive((value) => (value - 1 + projects.length) % projects.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const go = (direction: number) => setActive((value) => (value + direction + projects.length) % projects.length)

  if (fallback) {
    return (
      <div className="css-carousel" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
        <div className="css-track" style={{ transform: `translateX(calc(50% - ${(active + 0.5) * 72}%))` }}>
          {projects.map((project, index) => (
            <motion.button
              key={project.title}
              className={`css-slide ${index === active ? 'css-active' : ''}`}
              onClick={() => index === active ? onOpen(project) : setActive(index)}
              whileTap={{ scale: 0.98 }}
              style={{ backgroundImage: `linear-gradient(180deg, transparent 45%, rgba(9,9,11,.9)), url(${project.image})` }}
            >
              <span>{project.category}</span><strong>{project.title}</strong>
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className="webgl-carousel"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onPointerDown={(event) => setDragStart(event.clientX)}
      onPointerUp={(event) => {
        if (dragStart !== null && Math.abs(event.clientX - dragStart) > 45) go(event.clientX < dragStart ? 1 : -1)
        setDragStart(null)
      }}
      onWheel={(event) => {
        if (Math.abs(event.deltaX) > 20 || Math.abs(event.deltaY) > 20) go(event.deltaX > 0 || event.deltaY > 0 ? 1 : -1)
      }}
      style={{ '--active-accent': projects[active].accent } as React.CSSProperties}
    >
      <div className="carousel-aura" />
      <Canvas camera={{ position: [0, 0, 7], fov: 38 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <CarouselScene active={active} onActive={setActive} onOpen={onOpen} />
        <Preload all />
      </Canvas>
    </div>
  )
}

  function WorkSection({ onOpen }: { onOpen: (project: Project) => void }) {
    const [active, setActive] = useState(0)
    return (
      <section id="work" className="work-section">
        <div className="section-heading">
          <div>
            <span className="section-index">01 / SELECTED WORK</span>
            <h2>Built for the<br /><em>culture ahead.</em></h2>
          </div>
          <p>We partner with category-defining teams to turn bold ambition into experiences people choose to feel.</p>
        </div>
        <div className="carousel-frame" onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect()
          const intensity = (event.clientX - rect.left) / rect.width
          event.currentTarget.style.setProperty('--cursor-x', `${intensity * 100}%`)
        }}>
          <ProjectCarousel active={active} setActive={setActive} onOpen={onOpen} />
          <button className="carousel-arrow arrow-left" onClick={() => setActive((active - 1 + projects.length) % projects.length)} aria-label="Previous project"><ArrowLeft /></button>
          <button className="carousel-arrow arrow-right" onClick={() => setActive((active + 1) % projects.length)} aria-label="Next project"><ArrowRight /></button>
        </div>
        <div className="carousel-meta">
          <div>
            {projects.map((project, index) => (
              <button key={project.title} className={index === active ? 'selected' : ''} onClick={() => setActive(index)}>
                <span>{project.title}</span>
                {index === active && <motion.i layoutId="project-line" />}
              </button>
            ))}
          </div>
          <div className="carousel-progress"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 5.2, repeat: Infinity, ease: 'linear' }} /></div>
        </div>
      </section>
    )
  }

  function BentoCard({ card, index }: { card: (typeof bentoCards)[number]; index: number }) {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })
    const [toggle, setToggle] = useState(true)
    const [glow, setGlow] = useState({ x: 50, y: 50 })

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: index * 0.08, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className={`bento-card bento-${index + 1}`}
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect()
          setGlow({ x: event.clientX - rect.left, y: event.clientY - rect.top })
        }}
        style={{ '--glow-x': `${glow.x}px`, '--glow-y': `${glow.y}px` } as React.CSSProperties}
      >
        <div className="bento-glow" />
        <div className="bento-top"><span>{card.category}</span><Plus size={16} /></div>
        {card.kind === 'orbit' ? (
          <div className="orbit-widget">
            <div className="orbit orbit-1"><span /></div>
            <div className="orbit orbit-2"><span /></div>
            <div className="orbit-core" />
          </div>
        ) : card.kind === 'toggle' ? (
          <button className={`system-toggle ${toggle ? 'on' : ''}`} onClick={() => setToggle((value) => !value)} aria-label="Toggle live system">
            <motion.span animate={{ x: toggle ? 34 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
          </button>
        ) : (
          <div className="stat-orbit"><i /><i /><i /></div>
        )}
        <div className="bento-copy">
          <strong>{card.value}<small>{card.suffix}</small></strong>
          <span>{card.title}</span>
        </div>
      </motion.div>
    )
  }

  function StudioSection() {
    const [filter, setFilter] = useState('All')
    const filters = ['All', 'Studio', 'Technology', 'Recognition']
    const visible = bentoCards.filter((card) => filter === 'All' || card.category === filter)
    return (
      <section id="studio" className="studio-section">
        <div className="section-heading compact">
          <div>
            <span className="section-index">02 / THE STUDIO</span>
            <h2>Small team.<br /><em>Outsized impact.</em></h2>
          </div>
          <div className="filter-pills" aria-label="Filter studio metrics">
            {filters.map((item) => (
              <button key={item} onClick={() => setFilter(item)} className={filter === item ? 'active' : ''}>
                {filter === item && <motion.span layoutId="filter-pill" />}
                <span>{item}</span>
              </button>
            ))}
          </div>
        </div>
        <motion.div layout className="bento-grid">
          <AnimatePresence mode="popLayout">
            {visible.map((card) => (
              <BentoCard key={card.title} card={card} index={bentoCards.indexOf(card)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    )
  }

  function ServicesSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
    const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 22 })
    const leftY = useTransform(progress, [0, 1], ['8%', '-18%'])
    const rightY = useTransform(progress, [0, 1], ['-12%', '10%'])

    return (
      <section id="services" ref={sectionRef} className="services-section">
        <div className="marquee" aria-hidden="true">
          <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}>
            BRAND SYSTEMS · DIGITAL PRODUCTS · CREATIVE TECHNOLOGY · SPATIAL EXPERIENCES ·
            BRAND SYSTEMS · DIGITAL PRODUCTS · CREATIVE TECHNOLOGY · SPATIAL EXPERIENCES ·
          </motion.div>
        </div>
        <div className="services-grid">
          <motion.div className="services-visual" style={{ y: leftY }}>
            <div className="visual-halo" />
            <div className="visual-object">
              <div className="object-slice slice-a" />
              <div className="object-slice slice-b" />
              <div className="object-sphere" />
            </div>
            <span>FORM / 02</span>
          </motion.div>
          <motion.div className="services-copy" style={{ y: rightY }}>
            <span className="section-index">03 / OUR PRACTICE</span>
            <h2>From the first<br />question to the<br /><em>final signal.</em></h2>
            <div className="service-list">
              {[
                ['01', 'Strategy & Positioning', 'Finding the sharpest truth and the clearest route forward.'],
                ['02', 'Brand Identity', 'Building distinctive systems that flex across every expression.'],
                ['03', 'Digital Products', 'Creating useful, intuitive products with a memorable point of view.'],
                ['04', 'Creative Technology', 'Making emerging technology feel natural, expressive, and alive.'],
              ].map(([number, title, description]) => (
                <motion.button key={title} whileHover={{ x: 8 }} className="service-row">
                  <span>{number}</span>
                  <div><strong>{title}</strong><p>{description}</p></div>
                  <ArrowUpRight />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  function ContactSection() {
    const [submitted, setSubmitted] = useState(false)
    const [values, setValues] = useState({ name: '', email: '', brief: '' })
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
    const errors = {
      name: !values.name.trim(),
      email: !validEmail,
      brief: values.brief.trim().length < 12,
    }

    const submit = (event: React.FormEvent) => {
      event.preventDefault()
      setTouched({ name: true, email: true, brief: true })
      if (!errors.name && !errors.email && !errors.brief) setSubmitted(true)
    }

    return (
      <section id="contact" className="contact-section">
        <div className="contact-glow" />
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}>
          <span className="section-index">04 / START SOMETHING</span>
          <h2>Make the future<br /><em>feel inevitable.</em></h2>
        </motion.div>
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div key="success" className="success-state" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}><Check /></motion.div>
              <h3>Signal received.</h3>
              <p>We’ll return with a focused response within two business days.</p>
              <button onClick={() => { setSubmitted(false); setValues({ name: '', email: '', brief: '' }); setTouched({}) }}>Send another note</button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} className="contact-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <label>
                <span>Your name</span>
                <input value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} onBlur={() => setTouched({ ...touched, name: true })} placeholder="Ada Lovelace" />
                {touched.name && errors.name && <small>Tell us what to call you.</small>}
              </label>
              <label>
                <span>Work email</span>
                <input value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} onBlur={() => setTouched({ ...touched, email: true })} placeholder="ada@future.co" />
                {touched.email && errors.email && <small>Enter a valid email address.</small>}
              </label>
              <label className="full">
                <span>What are we making?</span>
                <textarea value={values.brief} onChange={(event) => setValues({ ...values, brief: event.target.value })} onBlur={() => setTouched({ ...touched, brief: true })} placeholder="A few words about the ambition, timeline, or challenge..." />
                {touched.brief && errors.brief && <small>Add at least 12 characters.</small>}
              </label>
              <MagneticButton className="submit-button">
                <button type="submit">Send inquiry <ArrowUpRight /></button>
              </MagneticButton>
            </motion.form>
          )}
        </AnimatePresence>
      </section>
    )
  }

  function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
    useEffect(() => {
      if (!project) return
      const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
      return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
    }, [project, onClose])

    return (
      <AnimatePresence>
        {project && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
            <motion.div
              className="project-modal"
              layoutId={`project-${project.title}`}
              initial={{ y: 60, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 30, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button className="modal-close" onClick={onClose} aria-label="Close project"><X /></button>
              <div className="modal-image" style={{ backgroundImage: `linear-gradient(135deg, ${project.accent}33, transparent), url(${project.image})` }}>
                <span>{project.category}</span>
              </div>
              <div className="modal-copy">
                <span className="section-index">{project.year} / CASE STUDY</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="modal-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="modal-metric"><span>Outcome</span><strong>{project.metric}</strong></div>
                <MagneticButton>
                  <button className="button-primary">View case study <ArrowUpRight /></button>
                </MagneticButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  export default function App() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)

    useEffect(() => {
      const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
      let frame = 0
      const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf) }
      frame = requestAnimationFrame(raf)
      return () => { cancelAnimationFrame(frame); lenis.destroy() }
    }, [])

    return (
      <main>
        <Nav />
        <Hero />
        <WorkSection onOpen={setSelectedProject} />
        <StudioSection />
        <ServicesSection />
        <ContactSection />
        <footer>
          <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><span className="brand-mark"><span /></span>AETHER</button>
          <span>© 2026 Aether Studio</span>
          <div><a href="#">Instagram</a><a href="#">LinkedIn</a><a href="#">Vimeo</a></div>
        </footer>
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      </main>
    )
  }

