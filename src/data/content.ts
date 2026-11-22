export type Project = {
  title: string
  category: string
  year: string
  accent: string
  image: string
  description: string
  tags: string[]
  metric: string
}

export const projects: Project[] = [
  {
    title: 'Lumen',
    category: 'Spatial Computing',
    year: '2026',
    accent: '#8b5cf6',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1800&q=88',
    description: 'A spatial intelligence platform that turns complex urban data into calm, cinematic decisions.',
    tags: ['Product design', '3D systems', 'React'],
    metric: '42% faster planning',
  },
  {
    title: 'Serein',
    category: 'Future Wellness',
    year: '2025',
    accent: '#10b981',
    image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1800&q=88',
    description: 'A deeply personal wellbeing companion where adaptive rituals meet intelligent biometrics.',
    tags: ['Brand system', 'Mobile', 'AI'],
    metric: '3.2× engagement',
  },
  {
    title: 'Northstar',
    category: 'Climate Intelligence',
    year: '2026',
    accent: '#38bdf8',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1800&q=88',
    description: 'Mission-critical satellite intelligence translated into decisive climate action.',
    tags: ['Data experience', 'Strategy', 'WebGL'],
    metric: '18 regions mapped',
  },
  {
    title: 'Monocle',
    category: 'Editorial Commerce',
    year: '2025',
    accent: '#f59e0b',
    image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1800&q=88',
    description: 'A sensory commerce experience for objects made slowly and remembered for years.',
    tags: ['Art direction', 'Commerce', 'Motion'],
    metric: '71% repeat intent',
  },
  {
    title: 'Aperture',
    category: 'Creative Tools',
    year: '2026',
    accent: '#ec4899',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1800&q=88',
    description: 'An expressive generative workspace built for artists, directors, and new media studios.',
    tags: ['Creative coding', 'SaaS', 'Identity'],
    metric: '2.4× output',
  },
]

export const bentoCards = [
  { title: 'Projects shipped', value: '84', suffix: '+', category: 'Studio', kind: 'stat' },
  { title: 'Global partners', value: '12', suffix: ' markets', category: 'Studio', kind: 'orbit' },
  { title: 'Live systems', value: '99.99', suffix: '%', category: 'Technology', kind: 'toggle' },
  { title: 'Design awards', value: '27', suffix: '', category: 'Recognition', kind: 'stat' },
]
