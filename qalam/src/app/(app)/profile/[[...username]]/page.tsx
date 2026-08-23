'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookOpen, Edit, Calendar, UserPlus, UserCheck } from 'lucide-react'
import { Profile, Work, CATEGORY_LABELS } from '@/types'
import { formatDate, getInitials } from '@/lib/utils'
import {
  getLocalProfile, getLocalWorks, getCommunityUsers,
  isFollowingUser, toggleFollowUser, getFollowersCount, getFollowingCount, getAllPublishedWorks
} from '@/lib/storage'
import Link from 'next/link'

export default function ProfilePage() {
  const params = useParams()
  const usernameParam = (params?.username as string[])?.[0] || params?.username as string

  const [me, setMe] = useState<Profile>(getLocalProfile())
  const [profile, setProfile] = useState<Profile>(getLocalProfile())
  const [works, setWorks] = useState<Work[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)

  useEffect(() => {
    const currentMe = getLocalProfile()
    setMe(currentMe)

    let targetProfile = currentMe

    if (usernameParam && usernameParam !== currentMe.username) {
      const allUsers = getCommunityUsers()
      const found = allUsers.find(u => u.username.toLowerCase() === usernameParam.toLowerCase())
      if (found) {
        targetProfile = found
      }
    }

    setProfile(targetProfile)
    setIsFollowing(isFollowingUser(targetProfile.id))
    setFollowersCount(getFollowersCount(targetProfile.id))
    setFollowingCount(getFollowingCount(targetProfile.id))

    if (targetProfile.id === currentMe.id) {
      setWorks(getLocalWorks())
    } else {
      const allPub = getAllPublishedWorks().filter(w => w.author_id === targetProfile.id || w.profiles?.username === targetProfile.username)
      setWorks(allPub)
    }
  }, [usernameParam])

  function handleToggleFollow() {
    if (profile.id === me.id) return
    const nowFollowing = toggleFollowUser(profile.id)
    setIsFollowing(nowFollowing)
    setFollowersCount(prev => nowFollowing ? prev + 1 : prev - 1)
  }

  const isSelf = profile.id === me.id || profile.username === me.username
  const publishedWorks = works.filter(w => w.is_published)
  const totalViews = works.reduce((acc, w) => acc + (w.view_count || 0), 0)

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-8 font-sans">
      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left shadow-xl"
      >
        <div className="w-24 h-24 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-3xl font-bold text-amber-400 flex-shrink-0 shadow-lg shadow-amber-500/10">
          {getInitials(profile.full_name)}
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{profile.full_name}</h1>
              <p className="text-xs font-mono text-amber-400">@{profile.username}</p>
            </div>

            <div className="flex items-center gap-3 justify-center">
              {isSelf ? (
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition-colors"
                >
                  <Edit className="w-4 h-4" /> Tahrirlash
                </Link>
              ) : (
                <button
                  onClick={handleToggleFollow}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isFollowing
                      ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30'
                      : 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md shadow-amber-500/10'
                  }`}
                >
                  {isFollowing ? <UserCheck className="w-4 h-4 text-emerald-400" /> : <UserPlus className="w-4 h-4" />}
                  {isFollowing ? 'Kuzatilyapti' : 'Kuzatish (Follow)'}
                </button>
              )}
            </div>
          </div>

          <p className="text-sm font-serif text-slate-300 leading-relaxed">
            {profile.bio || "Hali tarjimai hol kiritilmagan."}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
            <div><strong className="text-white text-sm">{works.length}</strong> Jami Asar</div>
            <div><strong className="text-amber-400 text-sm">{followersCount}</strong> Kuzatuvchi</div>
            <div><strong className="text-white text-sm">{followingCount}</strong> Kuzatmoqda</div>
            <div><strong className="text-white text-sm">{totalViews}</strong> O&apos;qildi</div>
            <div className="flex items-center gap-1"><Calendar className="w-4 h-4 text-amber-400" /> 2026-yildan a&apos;zo</div>
          </div>
        </div>
      </motion.div>

      {/* Published Works list */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          Ijodiy Asarlar
        </h2>

        {works.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-500 font-sans">
            Hali hech qanday asar joylanmagan.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {works.map((work) => (
              <Link
                key={work.id}
                href={isSelf ? `/editor/${work.id}` : `/works/${work.id}`}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all block space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-semibold">
                    {CATEGORY_LABELS[work.category]}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${work.is_published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                    {work.is_published ? 'Nashr' : 'Qoralama'}
                  </span>
                </div>
                <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors">
                  {work.title}
                </h3>
                <div
                  className="text-xs text-slate-400 line-clamp-2 font-serif"
                  dangerouslySetInnerHTML={{ __html: work.content }}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
