import { Work, Profile, Message, Comment, WorkCategory } from '@/types'

export interface RegisteredAccount {
  id: string
  email: string
  password: string
  profile: Profile
}

const DEFAULT_USERS: Profile[] = [
  {
    id: 'user-nilufar',
    username: 'nilufar_r',
    full_name: 'Nilufar Rashidova',
    bio: 'Dramaturg va ssenariynavis. Toshkent kino studiyasi hamkori.',
    avatar_url: null,
    website: null,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'user-bobur',
    username: 'bobur_shoir',
    full_name: 'Bobur Toshmatov',
    bio: 'Zamonaviy o\'zbek lirikasi va g\'azallar ijodkori.',
    avatar_url: null,
    website: null,
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: 'user-jasur',
    username: 'jasur_film',
    full_name: 'Jasur Karimov',
    bio: 'Badiiy filmlar va qisqa metrajli kinolar ssenariynavisi.',
    avatar_url: null,
    website: null,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
]

const COMMUNITY_WORKS: Work[] = [
  {
    id: 'comm-1',
    author_id: 'user-nilufar',
    title: 'Tungi Bekatda Qolgan Quyosh',
    content: '<h2>Tungi Bekatda Qolgan Quyosh</h2><p>INT. SHAHAR BEKATI - TUN. Yomg\'ir tinimsiz yog\'adi. Chiroqlar nurida ikki inson soyasi ko\'rinadi...</p>',
    category: 'scenario',
    tags: ['dramatizm', 'toshkent', 'kino'],
    is_published: true,
    view_count: 532,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    profiles: DEFAULT_USERS[0],
  },
  {
    id: 'comm-2',
    author_id: 'user-bobur',
    title: 'Samo va Tuproq Ghazali',
    content: '<h2>Samo va Tuproq Ghazali</h2><p>Osmon falakda yulduzlar so\'ndi bir-bir,<br/>Sening nigohingda yondim men bu tun...</p>',
    category: 'poetry',
    tags: ['ghazal', 'ishq', 'sher'],
    is_published: true,
    view_count: 310,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    profiles: DEFAULT_USERS[1],
  },
  {
    id: 'comm-3',
    author_id: 'user-jasur',
    title: 'So\'nggi Parvoz Ssenariysi',
    content: '<h2>So\'nggi Parvoz Ssenariysi</h2><p>INT. SAMOLYOT SALONI - TUN. Samolyot bulutlar ustidan uchib o\'tmoqda. Kapitan ovozi eshitiladi...</p>',
    category: 'scenario',
    tags: ['cinema', 'kino', 'parvoz'],
    is_published: true,
    view_count: 890,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    profiles: DEFAULT_USERS[2],
  },
]

const DEFAULT_PROFILE: Profile = {
  id: 'user-me',
  username: 'xasanboyevdev',
  full_name: 'Sarvarbek Xasanboyev',
  bio: 'Ssenariynavis va shoir. Qalam platformasida ijod qilaman.',
  avatar_url: null,
  website: 'https://qalam.uz',
  created_at: new Date().toISOString(),
}

export function getRegisteredAccounts(): RegisteredAccount[] {
  if (typeof window === 'undefined') return []
  const saved = localStorage.getItem('qalam_registered_accounts')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) return parsed
    } catch {}
  }
  return []
}

export function isEmailTaken(email: string): boolean {
  const clean = email.trim().toLowerCase()
  if (!clean) return false
  const accounts = getRegisteredAccounts()
  return accounts.some(acc => acc.email.toLowerCase() === clean)
}

export function isUsernameTaken(username: string): boolean {
  const clean = username.trim().toLowerCase()
  if (!clean) return false

  const accounts = getRegisteredAccounts()
  if (accounts.some(acc => acc.profile.username.toLowerCase() === clean)) return true

  const users = getCommunityUsers()
  return users.some(u => u.username.toLowerCase() === clean)
}

export function registerAccount(email: string, password: string, fullName: string, username: string): Profile {
  const cleanEmail = email.trim().toLowerCase()
  const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9_]/g, '')

  const newProfile: Profile = {
    id: 'user-' + Date.now(),
    username: cleanUsername || 'yozuvchi_' + Math.floor(Math.random() * 1000),
    full_name: fullName.trim() || 'Yangi Yozuvchi',
    bio: 'Qalam platformasining yangi a\'zosi',
    avatar_url: null,
    website: null,
    created_at: new Date().toISOString(),
  }

  const newAcc: RegisteredAccount = {
    id: newProfile.id,
    email: cleanEmail,
    password,
    profile: newProfile,
  }

  if (typeof window !== 'undefined') {
    const accounts = getRegisteredAccounts()
    accounts.push(newAcc)
    localStorage.setItem('qalam_registered_accounts', JSON.stringify(accounts))

    switchActiveSession(newAcc)
  }

  return newProfile
}

export function authenticateAccount(email: string, password: string): RegisteredAccount | null {
  const cleanEmail = email.trim().toLowerCase()
  const accounts = getRegisteredAccounts()
  const found = accounts.find(a => a.email.toLowerCase() === cleanEmail && a.password === password)
  if (found) {
    switchActiveSession(found)
    return found
  }
  return null
}

export function switchActiveSession(acc: RegisteredAccount): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('qalam_active_account_id', acc.id)
  localStorage.setItem('qalam_profile', JSON.stringify(acc.profile))
  localStorage.setItem('qalam_user', JSON.stringify({ fullName: acc.profile.full_name, username: acc.profile.username, email: acc.email }))

  const users = getCommunityUsers()
  const idx = users.findIndex(u => u.id === acc.profile.id || u.username === acc.profile.username)
  if (idx >= 0) {
    users[idx] = acc.profile
  } else {
    users.push(acc.profile)
  }
  localStorage.setItem('qalam_all_users', JSON.stringify(users))
}

export function getLocalProfile(): Profile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE
  const saved = localStorage.getItem('qalam_profile')
  if (saved) {
    try { return JSON.parse(saved) } catch {}
  }
  return DEFAULT_PROFILE
}

export function saveLocalProfile(profileData: Partial<Profile>): Profile {
  const current = getLocalProfile()
  const updated = { ...current, ...profileData }
  if (typeof window !== 'undefined') {
    localStorage.setItem('qalam_profile', JSON.stringify(updated))
    localStorage.setItem('qalam_user', JSON.stringify({ fullName: updated.full_name, username: updated.username }))

    const accounts = getRegisteredAccounts()
    const accIdx = accounts.findIndex(a => a.id === updated.id || a.profile.username === updated.username)
    if (accIdx >= 0) {
      accounts[accIdx].profile = updated
      localStorage.setItem('qalam_registered_accounts', JSON.stringify(accounts))
    }

    const users = getCommunityUsers()
    const index = users.findIndex(u => u.id === updated.id || u.username === updated.username)
    if (index >= 0) {
      users[index] = updated
    } else {
      users.push(updated)
    }
    localStorage.setItem('qalam_all_users', JSON.stringify(users))
  }
  return updated
}

export function getCommunityUsers(): Profile[] {
  if (typeof window === 'undefined') return DEFAULT_USERS
  const saved = localStorage.getItem('qalam_all_users')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    } catch {}
  }
  return DEFAULT_USERS
}

export function getLocalWorks(): Work[] {
  if (typeof window === 'undefined') return []
  const me = getLocalProfile()
  const saved = localStorage.getItem(`qalam_my_works_${me.id}`)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) return parsed
    } catch {}
  }
  return []
}

export function getAllPublishedWorks(): Work[] {
  const myWorks = getLocalWorks().filter(w => w.is_published)

  if (typeof window === 'undefined') return [...myWorks, ...COMMUNITY_WORKS]
  const savedGlobal = localStorage.getItem('qalam_global_published_works')
  let globalWorks: Work[] = COMMUNITY_WORKS
  if (savedGlobal) {
    try {
      const parsed = JSON.parse(savedGlobal)
      if (Array.isArray(parsed) && parsed.length > 0) globalWorks = parsed
    } catch {}
  }

  const map = new Map<string, Work>()
  globalWorks.forEach(w => map.set(w.id, w))
  myWorks.forEach(w => map.set(w.id, w))

  return Array.from(map.values()).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function saveLocalWork(workData: {
  id?: string | null
  title: string
  content: string
  category: WorkCategory
  tags: string[]
  is_published: boolean
}): Work {
  const works = getLocalWorks()
  const author = getLocalProfile()
  const now = new Date().toISOString()

  let targetId = workData.id
  if (!targetId || targetId === 'new') {
    targetId = 'work-' + Date.now()
  }

  const existingIndex = works.findIndex(w => w.id === targetId)
  let updatedWork: Work

  if (existingIndex >= 0) {
    updatedWork = {
      ...works[existingIndex],
      title: workData.title || 'Nomsiz asar',
      content: workData.content,
      category: workData.category,
      tags: workData.tags,
      is_published: workData.is_published,
      updated_at: now,
      profiles: author,
    }
    works[existingIndex] = updatedWork
  } else {
    updatedWork = {
      id: targetId,
      author_id: author.id,
      title: workData.title || 'Nomsiz asar',
      content: workData.content,
      category: workData.category,
      tags: workData.tags,
      is_published: workData.is_published,
      view_count: 1,
      created_at: now,
      updated_at: now,
      profiles: author,
    }
    works.unshift(updatedWork)
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(`qalam_my_works_${author.id}`, JSON.stringify(works))

    if (updatedWork.is_published) {
      const allPub = getAllPublishedWorks()
      const pubIndex = allPub.findIndex(w => w.id === updatedWork.id)
      if (pubIndex >= 0) allPub[pubIndex] = updatedWork
      else allPub.unshift(updatedWork)
      localStorage.setItem('qalam_global_published_works', JSON.stringify(allPub))
    }
  }

  return updatedWork
}

export function getWorkById(id: string): Work | undefined {
  const allPub = getAllPublishedWorks()
  const foundInPub = allPub.find(w => w.id === id)
  if (foundInPub) return foundInPub

  const myWorks = getLocalWorks()
  return myWorks.find(w => w.id === id)
}

export function deleteWorkById(id: string): void {
  const me = getLocalProfile()
  const works = getLocalWorks().filter(w => w.id !== id)
  if (typeof window !== 'undefined') {
    localStorage.setItem(`qalam_my_works_${me.id}`, JSON.stringify(works))

    const pub = getAllPublishedWorks().filter(w => w.id !== id)
    localStorage.setItem('qalam_global_published_works', JSON.stringify(pub))
  }
}

// Persistent Likes System per Work
interface WorkLikeState {
  count: number
  likedUsers: string[]
}

export function getWorkLikesState(workId: string): WorkLikeState {
  if (typeof window === 'undefined') return { count: 0, likedUsers: [] }
  const saved = localStorage.getItem(`qalam_likes_${workId}`)
  if (saved) {
    try { return JSON.parse(saved) } catch {}
  }
  return { count: 0, likedUsers: [] }
}

export function toggleWorkLike(workId: string): { count: number; isLiked: boolean } {
  const me = getLocalProfile()
  const state = getWorkLikesState(workId)
  const userIndex = state.likedUsers.indexOf(me.id)

  let isNowLiked = false
  if (userIndex >= 0) {
    state.likedUsers.splice(userIndex, 1)
    state.count = Math.max(0, state.count - 1)
    isNowLiked = false
  } else {
    state.likedUsers.push(me.id)
    state.count += 1
    isNowLiked = true
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(`qalam_likes_${workId}`, JSON.stringify(state))
  }

  return { count: state.count, isLiked: isNowLiked }
}

// Persistent Comments System per Work + Auto Notification to Author
export function getWorkComments(workId: string): Comment[] {
  if (typeof window === 'undefined') return []
  const saved = localStorage.getItem(`qalam_comments_${workId}`)
  if (saved) {
    try { return JSON.parse(saved) } catch {}
  }
  return []
}

export function saveWorkComment(
  workId: string,
  commenter: Profile,
  content: string,
  workTitle: string,
  authorId?: string
): Comment[] {
  const comments = getWorkComments(workId)
  const newComment: Comment = {
    id: 'comment-' + Date.now(),
    work_id: workId,
    author_id: commenter.id,
    content,
    created_at: new Date().toISOString(),
    profiles: commenter,
  }

  comments.push(newComment)
  if (typeof window !== 'undefined') {
    localStorage.setItem(`qalam_comments_${workId}`, JSON.stringify(comments))

    if (authorId && authorId !== commenter.id) {
      const notificationMsg: Message = {
        id: 'notif-' + Date.now(),
        sender_id: commenter.id,
        receiver_id: authorId,
        content: `💬 [Yangi Izoh]: ${commenter.full_name} sizning "${workTitle}" nomli asaringizga izoh qoldirdi: "${content}"`,
        is_read: false,
        created_at: new Date().toISOString(),
      }
      saveDirectMessage(authorId, notificationMsg)
    }
  }

  return comments
}

// Two-way Direct Messaging Key
function getChatStorageKey(userA: string, userB: string): string {
  const ids = [userA, userB].sort()
  return `qalam_chat_pair_${ids[0]}_${ids[1]}`
}

export function getDirectMessages(otherUserId: string): Message[] {
  if (typeof window === 'undefined') return []
  const me = getLocalProfile()
  const key = getChatStorageKey(me.id, otherUserId)
  const saved = localStorage.getItem(key)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {}
  }
  return []
}

export function saveDirectMessage(otherUserId: string, message: Message): Message[] {
  const me = getLocalProfile()
  const current = getDirectMessages(otherUserId)
  current.push(message)
  if (typeof window !== 'undefined') {
    const key = getChatStorageKey(me.id, otherUserId)
    localStorage.setItem(key, JSON.stringify(current))
  }
  return current
}

export function markConversationAsRead(otherUserId: string): void {
  if (typeof window === 'undefined') return
  const me = getLocalProfile()
  const messages = getDirectMessages(otherUserId)
  let updated = false
  messages.forEach(m => {
    if (m.receiver_id === me.id && !m.is_read) {
      m.is_read = true
      updated = true
    }
  })
  if (updated) {
    const key = getChatStorageKey(me.id, otherUserId)
    localStorage.setItem(key, JSON.stringify(messages))
  }
}

export function getTotalUnreadMessagesCount(): number {
  if (typeof window === 'undefined') return 0
  const me = getLocalProfile()
  const users = getCommunityUsers()
  let unread = 0

  users.forEach(u => {
    if (u.id !== me.id) {
      const chat = getDirectMessages(u.id)
      unread += chat.filter(m => m.receiver_id === me.id && !m.is_read).length
    }
  })

  return unread
}

// Real-time Follow System
interface FollowRecord {
  follower_id: string
  following_id: string
}

export function getFollowRecords(): FollowRecord[] {
  if (typeof window === 'undefined') return []
  const saved = localStorage.getItem('qalam_follows')
  if (saved) {
    try { return JSON.parse(saved) } catch {}
  }
  return [
    { follower_id: 'user-nilufar', following_id: 'user-me' },
    { follower_id: 'user-bobur', following_id: 'user-me' },
  ]
}

export function isFollowingUser(targetUserId: string): boolean {
  const me = getLocalProfile()
  const follows = getFollowRecords()
  return follows.some(f => f.follower_id === me.id && f.following_id === targetUserId)
}

export function toggleFollowUser(targetUserId: string): boolean {
  const me = getLocalProfile()
  let follows = getFollowRecords()
  const index = follows.findIndex(f => f.follower_id === me.id && f.following_id === targetUserId)

  let isNowFollowing = false
  if (index >= 0) {
    follows.splice(index, 1)
    isNowFollowing = false
  } else {
    follows.push({ follower_id: me.id, following_id: targetUserId })
    isNowFollowing = true
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('qalam_follows', JSON.stringify(follows))
  }

  return isNowFollowing
}

export function getFollowersCount(userId: string): number {
  const follows = getFollowRecords()
  return follows.filter(f => f.following_id === userId).length
}

export function getFollowingCount(userId: string): number {
  const follows = getFollowRecords()
  return follows.filter(f => f.follower_id === userId).length
}

export function getFollowersList(userId: string): Profile[] {
  const follows = getFollowRecords()
  const followerIds = follows.filter(f => f.following_id === userId).map(f => f.follower_id)
  const users = getCommunityUsers()
  return users.filter(u => followerIds.includes(u.id))
}

export function getFollowingList(userId: string): Profile[] {
  const follows = getFollowRecords()
  const followingIds = follows.filter(f => f.follower_id === userId).map(f => f.following_id)
  const users = getCommunityUsers()
  return users.filter(u => followingIds.includes(u.id))
}
