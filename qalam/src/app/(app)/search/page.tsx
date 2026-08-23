'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, UserCheck, MessageSquare, ArrowRight, BookOpen, ShieldCheck, UserPlus, Users } from 'lucide-react'
import { Profile, Work } from '@/types'
import { getInitials } from '@/lib/utils'
import {
  getCommunityUsers, getLocalProfile, getAllPublishedWorks,
  isFollowingUser, toggleFollowUser, getFollowersCount
} from '@/lib/storage'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SearchWritersPage() {
  const router = useRouter()
  const [me, setMe] = useState<Profile>(getLocalProfile())
  const [users, setUsers] = useState<Profile[]>([])
  const [works, setWorks] = useState<Work[]>([])
  const [query, setQuery] = useState('')
  const [followState, setFollowState] = useState<Record<string, boolean>>({})
  const [followersMap, setFollowersMap] = useState<Record<string, number>>({})

  useEffect(() => {
    const current = getLocalProfile()
    setMe(current)

    const all = getCommunityUsers()
    setUsers(all)

    const pubWorks = getAllPublishedWorks()
    setWorks(pubWorks)

    const initialFollows: Record<string, boolean> = {}
    const initialCounts: Record<string, number> = {}
    all.forEach(u => {
      initialFollows[u.id] = isFollowingUser(u.id)
      initialCounts[u.id] = getFollowersCount(u.id)
    })
    setFollowState(initialFollows)
    setFollowersMap(initialCounts)
  }, [])

  function handleFollowToggle(userId: string) {
    const isNowFollowing = toggleFollowUser(userId)
    setFollowState(prev => ({ ...prev, [userId]: isNowFollowing }))
    setFollowersMap(prev => ({
      ...prev,
      [userId]: (prev[userId] || 0) + (isNowFollowing ? 1 : -1)
    }))
  }

  const searchClean = query.trim().toLowerCase()
  const filteredUsers = users.filter(u => {
    if (u.id === me.id || u.username === me.username) return false
    if (!searchClean) return true
    return (
      u.full_name.toLowerCase().includes(searchClean) ||
      u.username.toLowerCase().includes(searchClean) ||
      (u.bio && u.bio.toLowerCase().includes(searchClean))
    )
  })

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-8 font-sans">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Search className="w-8 h-8 text-amber-400" />
          Yozuvchilarni Izlash
        </h1>
        <p className="text-slate-400 text-sm">
          Platformadagi barcha mualliflarni izlang, ularga ergashing (Follow) va muloqotni boshlang
        </p>
      </div>

      {/* Main Search Bar */}
      <div className="relative max-w-2xl">
        <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Yozuvchining ismi yoki @username ni kiriting..."
          className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-2xl pl-12 pr-4 py-4 text-base text-slate-100 placeholder:text-slate-500 outline-none shadow-xl transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            Tozalash
          </button>
        )}
      </div>

      {/* User Cards Grid */}
      {filteredUsers.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-slate-900/40 rounded-3xl border border-slate-800">
          <UserCheck className="w-10 h-10 mx-auto mb-3 text-slate-600" />
          <p className="text-base">Foydalanuvchi topilmadi</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => {
            const userWorksCount = works.filter(w => w.author_id === user.id || w.profiles?.username === user.username).length
            const isFollowing = !!followState[user.id]
            const followerCount = followersMap[user.id] || 0

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1 shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-lg font-bold text-amber-400 flex-shrink-0">
                      {getInitials(user.full_name)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-base truncate flex items-center gap-1">
                        {user.full_name}
                        <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      </h3>
                      <p className="text-xs text-amber-400/80 font-mono">@{user.username}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 font-serif leading-relaxed">
                    {user.bio || 'Qalam platformasining ijodkor a\'zosi.'}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-amber-400" /> {userWorksCount} Asar</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-emerald-400" /> {followerCount} Kuzatuvchi</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => handleFollowToggle(user.id)}
                    className={`flex-1 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      isFollowing
                        ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-rose-500/10 hover:text-rose-400'
                        : 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md shadow-amber-500/10'
                    }`}
                  >
                    {isFollowing ? <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> : <UserPlus className="w-3.5 h-3.5" />}
                    {isFollowing ? 'Kuzatilyapti' : 'Follow'}
                  </button>

                  <button
                    onClick={() => router.push(`/messages?user=${user.username}`)}
                    className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-400 text-xs transition-colors"
                    title="Xabar yuborish"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  <Link
                    href={`/profile/${user.username}`}
                    className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs transition-colors"
                    title="Profilni ko'rish"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
