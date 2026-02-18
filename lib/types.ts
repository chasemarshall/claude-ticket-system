export type TicketStatus = 'open' | 'in-progress' | 'pending' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high'
export type TicketCategory =
  | 'smart-home'
  | 'subscriptions'
  | 'water-hq'
  | 'grocery'
  | 'maintenance'
  | 'other'

export interface Ticket {
  id: string
  title: string
  description: string | null
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  author: string
  created_at: string
  updated_at: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  pinned: boolean
  created_at: string
}

export interface FamilyMember {
  name: string
  emoji: string
  color: string
  colorDim: string
  colorBorder: string
  isAdmin: boolean
}

export interface Category {
  id: TicketCategory
  name: string
  emoji: string
  colorDim: string
}
