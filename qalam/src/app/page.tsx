'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  PenLine, BookOpen, MessageSquare, Star, ArrowRight,
  Feather, Film, BookMarked, Sparkles, Users, CheckCircle2, Shield, Heart
} from 'lucide-react'

const features = [
  {
    icon: Film,
    title: 'Ssenariy Yozish',
    desc: 'Professional ssenariynavislar uchun sahna, personaj va dialogni qulay tahrirlash vositalari.',
    color: '#f59e0b',
  },
  {
    icon: Feather,
    title: "She'r & G'azal Ijodi",
    desc: "Vazn, qofiya va vazn o'lchamlarini erkin ifodalash uchun maxsus shoirona muhit.",
    color: '#a855f7',
  },
  {
    icon: BookMarked,
    title: 'Hikoya & Roman',
    desc: "Uzun hikoyalar va romanlarni bobma-bob tartiblash, boblar orasida oson o'tish.",
    color: '#10b981',
  },
  {
    icon: MessageSquare,
    title: 'Real-time Chat',
    desc: "Ijodkorlar bilan muloqot qiling, tajriba almashing va bir-biringizni ilhomlantiring.",
    color: '#3b82f6',
  },
  {
    icon: Users,
    title: 'Yozuvchilar Hamjamiyati',
    desc: "Asarlaringizni nashr eting, samimiy kitobxonlar va taqrizchilardan munosabat oling.",
    color: '#ec4899',
  },
  {
    icon: Sparkles,
    title: 'Ilhom & Sinonimlar',
    desc: "Tasodifiy g'oyalar generatori va o'zbek tili shoirona sinonimlar lug'ati yordamchisi.",
    color: '#eab308',
  },
]

const testimonials = [
  {
    name: 'Nilufar Rashidova',
    role: 'Ssenariynavis',
    text: "Qalam platformasidagi sinonimlar va ssenariy muharriri tufayli film ssenariysi ustida ishlashim ikki barobar tezlashdi.",
    avatar: 'N',
  },
  {
    name: 'Bobur Toshmatov',
    role: "Shoir",
    text: "She'rlarimni tartibli saqlash va boshqa shoirlar bilan suhbatlashish uchun eng mukammal joy!",
    avatar: 'B',
  },
  {
    name: 'Malika Yusupova',
    role: 'Romannavis',
    text: "Avtomatik saqlash va tasodifiy mavzu generatori ijodiy inqirozlardan chiqishga juda katta yordam beradi.",
    avatar: 'M',
  },
]

const stats = [
  { value: '3,200+', label: 'Faol Yozuvchi' },
  { value: '24,000+', label: 'Yozilgan Asar' },
  { value: '120,000+', label: 'O\'qishlar Soni' },
  { value: '4.9 / 5', label: 'Yozuvchilar Bahosi' },
]

export default function LandingPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('qalam_profile') || localStorage.getItem('qalam_user')
      setIsLoggedIn(!!user)
    }
  }, [])

  function handleActionClick(targetHref: string) {
    if (!isLoggedIn) {
      router.push('/signin')
    } else {
      router.push(targetHref)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 selection:bg-amber-500/20 selection:text-amber-300 font-sans">
      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              <PenLine className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              Qalam
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#imkoniyatlar" className="hover:text-amber-400 transition-colors">Imkoniyatlar</a>
            <a href="#muharrir" className="hover:text-amber-400 transition-colors">Muharrir</a>
            <a href="#jamoa" className="hover:text-amber-400 transition-colors">Hamjamiyat</a>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <button
                onClick={() => router.push('/dashboard')}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
              >
                Kabinetga O&apos;tish
              </button>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Kirish
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
                >
                  Boshlash
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400"
              >
                <Sparkles className="w-4 h-4" />
                Yozuvchilar, Shoirlar va Ssenariynavislar uchun
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]"
              >
                Ijodingizni{' '}
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  Qalam
                </span>{' '}
                bilan yuksaklarga ko&apos;taring
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 font-serif leading-relaxed"
              >
                Ssenariylar, she&apos;rlar va romanlar yozish uchun maxsus yaratilgan professional platforma. Avtomatik saqlash, real-time chat va sinonimlar yordamchisi bir joyda.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <button
                  onClick={() => handleActionClick('/signup')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-xl shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 transition-all hover:scale-105 flex items-center justify-center gap-2 group"
                >
                  Bepul Ro&apos;yxatdan O&apos;tish
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => handleActionClick('/explore')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  Asarlarni O&apos;qish
                </button>
              </motion.div>

              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Bepul foydalanish</span>
                <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-amber-500" /> Maxfiylik kafolati</span>
                <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-rose-500" /> Uzbekiston bo&apos;ylab</span>
              </div>
            </div>

            {/* Hero Preview Card */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl shadow-black/80 backdrop-blur-xl relative overflow-hidden cursor-pointer"
                onClick={() => handleActionClick('/editor')}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="ml-2 text-xs font-medium text-slate-400">Qalam Editor · Ssenariy</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                    ● Auto-Save
                  </span>
                </div>

                <div className="font-serif space-y-4 text-slate-300">
                  <h3 className="text-xl font-bold text-white font-sans">SAHNA 1: Tungi Bekat</h3>
                  <p className="text-sm italic text-amber-200/80">
                    INT. BEKAT - TUN
                  </p>
                  <p className="text-sm leading-relaxed text-slate-300">
                    Yomg&apos;ir shiddat bilan yog&apos;moqda. Eskirgan chiroq nuri ostida Olim ko&apos;ylagining yoqasini ko&apos;targanicha kutmoqda.
                  </p>
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs space-y-1 font-mono text-slate-400">
                    <p className="text-amber-400 font-bold text-center">OLIM</p>
                    <p className="text-center italic">&quot;Ketishdan oldin so&apos;nggi bor uning ko&apos;zlariga qarashim kerak edi...&quot;</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>342 so&apos;z</span>
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Sinonimlar yordamchisi yoqilgan
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 text-center backdrop-blur-sm"
              >
                <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1 bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="imkoniyatlar" className="py-24 bg-slate-950/60 border-y border-slate-800/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Yozuvchi uchun barcha{' '}
              <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                qulayliklar
              </span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Ssenariynavislar, shoirlar va adiblar ehtiyojidan kelib chiqib loyihalashtirilgan maxsus funksiyalar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                onClick={() => handleActionClick('/editor')}
                className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-8 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5 group cursor-pointer"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}
                >
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editor Showcase Section */}
      <section id="muharrir" className="py-28 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Mukammal{' '}
              <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                Muharrir
              </span>
            </h2>
            <p className="text-slate-400">
              Diqqatingizni faqat ijodga qaratuvchi, minimalist va zamonaviy tahrirlash paneli.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  🎬 Ssenariy Mode
                </span>
                <span className="text-xs text-slate-500">· Toshkent Kechasi</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>Avtosaqlash: <strong className="text-emerald-400">Yoqilgan</strong></span>
                <button
                  onClick={() => handleActionClick('/editor')}
                  className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-semibold hover:bg-amber-300"
                >
                  Sinab Ko&apos;rish
                </button>
              </div>
            </div>

            <div className="p-8 sm:p-14 font-serif text-slate-200 leading-relaxed text-lg max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold font-sans text-white text-center mb-8">Oftob Nuri Ostida</h2>
              <p>
                Eski hovli o&apos;rtasida ulkan yong&apos;oq daraxti qad rostlagan. Uning soyasida bobom har kuni kitob o&apos;qir va menga o&apos;tmishdagi qiziqarli voqealarni so&apos;zlab berardi.
              </p>
              <blockquote className="border-l-4 border-amber-400 pl-4 italic text-amber-200/90 my-6">
                &quot;Kimki so&apos;zning qadriga yetsa, u vaqtning ustidan hukmronlik qiladi.&quot;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-10 sm:p-16 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <PenLine className="w-8 h-8" />
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
                Ijodiy Yo&apos;lingizni Bugun Boshlang
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                Platformadan foydalanish to&apos;liq bepul. Ro&apos;yxatdan o&apos;ting va birinchi asaringizni yozishni boshlang.
              </p>
              <button
                onClick={() => handleActionClick('/signup')}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-500/20 transition-all hover:scale-105"
              >
                Bepul Ro&apos;yxatdan O&apos;tish
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 border-t border-slate-800/80 text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <PenLine className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-white text-base">Qalam</span>
            <span>— Yozuvchilar Platformasi</span>
          </div>
          <p>© 2026 Qalam. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>
    </div>
  )
}
