export interface Profile {
  id: string
  username: string
  full_name: string
  bio: string | null
  avatar_url: string | null
  website: string | null
  created_at: string
}

export interface Work {
  id: string
  author_id: string
  title: string
  content: string
  category: 'scenario' | 'poetry' | 'story' | 'essay' | 'other'
  tags: string[]
  is_published: boolean
  view_count: number
  created_at: string
  updated_at: string
  profiles?: Profile
  likes_count?: number
  comments_count?: number
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  is_read: boolean
  created_at: string
  sender?: Profile
  receiver?: Profile
}

export interface Conversation {
  partner: Profile
  last_message: Message | null
  unread_count: number
}

export interface Comment {
  id: string
  work_id: string
  author_id: string
  content: string
  created_at: string
  profiles?: Profile
}

export interface Follow {
  follower_id: string
  following_id: string
  created_at: string
}

export type WorkCategory = 'scenario' | 'poetry' | 'story' | 'essay' | 'other'

export const CATEGORY_LABELS: Record<WorkCategory, string> = {
  scenario: '🎬 Ssenariy',
  poetry: '🌸 She\'r',
  story: '📖 Hikoya',
  essay: '✍️ Esse',
  other: '📝 Boshqa',
}
