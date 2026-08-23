'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Loader2, Check } from 'lucide-react'
import { Profile } from '@/types'
import { getInitials } from '@/lib/utils'
import { getLocalProfile, saveLocalProfile } from '@/lib/storage'

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile>(getLocalProfile())
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const p = getLocalProfile()
    setProfile(p)
    setFullName(p.full_name || '')
    setBio(p.bio || '')
    setWebsite(p.website || '')
  }, [])

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const updated = saveLocalProfile({
      full_name: fullName,
      bio,
      website,
    })

    setProfile(updated)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto space-y-8 font-sans">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Sozlamalar</h1>
        <p className="text-slate-400 text-sm">Profil ma&apos;lumotlaringizni yangilang</p>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-xl font-bold text-amber-400">
            {getInitials(fullName)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{fullName}</h2>
            <p className="text-xs text-slate-400">@{profile.username}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="text-xs font-medium text-slate-400 mb-2 block">To&apos;liq ismingiz</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 mb-2 block">Bio (O&apos;zingiz haqingizda)</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none transition-colors resize-none font-serif"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 mb-2 block">Vebsayt yoki portfel</label>
            <input
              type="url"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="https://..."
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/10 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saqlanmoqda...' : saved ? 'Saqlandi!' : 'O\'zgarishlarni Saqlash'}
          </button>
        </form>
      </div>
    </div>
  )
}
