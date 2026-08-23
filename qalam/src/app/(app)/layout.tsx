'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  PenLine, LayoutDashboard, Edit3, BookOpen, Search,
  MessageSquare, User, Settings, LogOut, ChevronLeft, ChevronRight, Bell
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types'
import { getInitials } from '@/lib/utils'
import { getTotalUnreadMessagesCount, getLocalProfile } from '@/lib/storage'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Bosh sahifa' },
  { href: '/editor', icon: Edit3, label: 'Yozish Muharriri' },
  { href: '/search', icon: Search, label: 'Yozuvchi Izlash' },
  { href: '/explore', icon: BookOpen, label: 'Asarlar Kashfiyoti' },
  { href: '/messages', icon: MessageSquare, label: 'Xabarlar & Chat' },
  { href: '/profile', icon: User, label: 'Shaxsiy Profil' },
  { href: '/settings', icon: Settings, label: 'Sozlamalar' },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    async function load() {
      if (typeof window !== 'undefined') {
        const savedUser = localStorage.getItem('qalam_profile') || localStorage.getItem('qalam_user')
        if (!savedUser) {
          setAuthenticated(false)
          router.push('/signin')
          return
        }
        setAuthenticated(true)
      }

      try {
        const local = getLocalProfile()
        setProfile(local)
        setUnreadCount(getTotalUnreadMessagesCount())
      } catch (e) {
        console.warn("Layout load error:", e)
      }
    }
    load()

    const interval = setInterval(() => {
      setUnreadCount(getTotalUnreadMessagesCount())
    }, 2000)

    return () => clearInterval(interval)
  }, [pathname, router])

  async function handleLogout() {
    try {
      await supabase.auth.signOut()
    } catch {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('qalam_profile')
      localStorage.removeItem('qalam_user')
      localStorage.removeItem('qalam_active_account_id')
    }
    router.push('/signin')
  }

  if (authenticated === false) {
    return null
  }

  const profileHref = profile ? `/profile/${profile.username}` : '/profile'

  return (
    <div className="flex h-screen bg-[#09090b] text-slate-100 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-800 bg-[#0c0c0e] transition-all duration-300 flex-shrink-0 relative z-20`}
        style={{ width: collapsed ? '72px' : '250px' }}
      >
        {/* Header */}
        <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <PenLine className="w-5 h-5 text-amber-400" />
            </div>
            {!collapsed && (
              <span className="font-bold text-lg bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent tracking-tight whitespace-nowrap">
                Qalam
              </span>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors flex-shrink-0"
            title={collapsed ? "Kengaytirish" : "Yig'ish"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            const href = item.href === '/profile' ? profileHref : item.href

            return (
              <Link
                key={item.href}
                href={href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  {item.href === '/messages' && unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.href === '/messages' && unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Profile Info Footer */}
        <div className="p-3 border-t border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-xs flex-shrink-0">
              {profile ? getInitials(profile.full_name) : 'SX'}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{profile?.full_name || 'Sarvarbek Xasanboyev'}</p>
                  <p className="text-[11px] text-slate-500 truncate">@{profile?.username || 'xasanboyevdev'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Chiqish"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <header className="h-14 md:hidden px-4 bg-[#0c0c0e] border-b border-slate-800 flex items-center justify-between flex-shrink-0 z-30">
          <Link href="/dashboard" className="flex items-center gap-2">
            <PenLine className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-amber-400">Qalam</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/messages" className="relative p-1.5 text-slate-400">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              )}
            </Link>
            <button
              onClick={handleLogout}
              className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
              title="Chiqish"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0c0c0e]/95 backdrop-blur-lg border-t border-slate-800 flex items-center justify-around z-40 px-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            const href = item.href === '/profile' ? profileHref : item.href

            return (
              <Link
                key={item.href}
                href={href}
                className={`flex flex-col items-center gap-1 py-1 px-3 relative transition-colors ${
                  isActive ? 'text-amber-400' : 'text-slate-500'
                }`}
              >
                <div className="relative">
                  <item.icon className="w-5 h-5" />
                  {item.href === '/messages' && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 w-3 h-3 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
