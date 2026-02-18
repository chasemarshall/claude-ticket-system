import { FamilyMember, Category } from './types'

export const ADMIN_NAME = 'Chase'

export const FAMILY_MEMBERS: FamilyMember[] = [
  {
    name: 'Chase',
    emoji: '👨‍💻',
    color: '#D4A853',
    colorDim: 'rgba(212,168,83,0.12)',
    colorBorder: 'rgba(212,168,83,0.35)',
    isAdmin: true,
  },
  {
    name: 'Mom',
    emoji: '👩',
    color: '#C47A6A',
    colorDim: 'rgba(196,122,106,0.12)',
    colorBorder: 'rgba(196,122,106,0.35)',
    isAdmin: false,
  },
  {
    name: 'Dad',
    emoji: '👨',
    color: '#6A94C4',
    colorDim: 'rgba(106,148,196,0.12)',
    colorBorder: 'rgba(106,148,196,0.35)',
    isAdmin: false,
  },
  {
    name: 'Livia',
    emoji: '👧',
    color: '#A47AC4',
    colorDim: 'rgba(164,122,196,0.12)',
    colorBorder: 'rgba(164,122,196,0.35)',
    isAdmin: false,
  },
  {
    name: 'A.J.',
    emoji: '👦',
    color: '#7FB069',
    colorDim: 'rgba(127,176,105,0.12)',
    colorBorder: 'rgba(127,176,105,0.35)',
    isAdmin: false,
  },
]

export const CATEGORIES: Category[] = [
  {
    id: 'smart-home',
    name: 'Smart Home',
    emoji: '🏠',
    colorDim: 'rgba(106,148,196,0.15)',
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions',
    emoji: '📦',
    colorDim: 'rgba(127,176,105,0.15)',
  },
  {
    id: 'water-hq',
    name: 'Water HQ',
    emoji: '🚿',
    colorDim: 'rgba(106,148,196,0.12)',
  },
  {
    id: 'grocery',
    name: 'Grocery',
    emoji: '🛒',
    colorDim: 'rgba(196,122,106,0.15)',
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    emoji: '🔧',
    colorDim: 'rgba(212,168,83,0.15)',
  },
  {
    id: 'other',
    name: 'Other',
    emoji: '📋',
    colorDim: 'rgba(122,98,69,0.2)',
  },
]
