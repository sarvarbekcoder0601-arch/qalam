'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { PenLine, Mail, User, ArrowRight, Loader2, CheckCircle2, Lock, Eye, EyeOff, Info, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { registerAccount, isUsernameTaken, isEmailTaken } from '@/lib/storage'

type Step = 'info' | 'otp' | 'password'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<Step>('info')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [demoNotice, setDemoNotice] = useState('')

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [expectedOtp, setExpectedOtp] = useState<string>('')

  function handleUsernameChange(val: string) {
    const clean = val.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9_]/g, '')
    setUsername(clean)

    if (clean.length > 0 && isUsernameTaken(clean)) {
      setUsernameError("Bu username band! Boshqa nom tanlang.")
    } else {
      setUsernameError('')
    }
  }

  function handleEmailChange(val: string) {
    setEmail(val)
    if (val.trim() && isEmailTaken(val.trim())) {
      setEmailError("Bunday email bilan akkaunt allaqachon mavjud!")
    } else {
      setEmailError('')
    }
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setDemoNotice('')

    if (isEmailTaken(email)) {
      setError("Bunday email allaqachon ro'yxatdan o'tgan! Tizimga kirish bo'limiga o'ting.")
      setLoading(false)
      return
    }

    if (usernameError || isUsernameTaken(username)) {
      setError("Bu username band! Iltimos, boshqa foydalanuvchi nomini kiriting.")
      setLoading(false)
      return
    }

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          data: { full_name: fullName, username },
        }
      })

      if (otpError) throw otpError
      setStep('otp')
    } catch {
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString()
      setExpectedOtp(mockCode)
      setDemoNotice(`Demo rejim: Emailingizga tasdiqlash kodi: ${mockCode}`)
      setStep('otp')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (expectedOtp && otp === expectedOtp) {
        setStep('password')
        return
      }

      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      })

      if (verifyError) {
        if (expectedOtp && otp === expectedOtp) {
          setStep('password')
          return
        }
        throw verifyError
      }

      setStep('password')
    } catch {
      if (expectedOtp && otp === expectedOtp) {
        setStep('password')
      } else {
        setError("Noto'g'ri kod. Qayta urinib ko'ring.")
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Parollar mos kelmadi.")
      return
    }
    if (password.length < 8) {
      setError("Parol kamida 8 ta belgidan iborat bo'lishi kerak.")
      return
    }
    setLoading(true)
    setError('')

    try {
      await supabase.auth.updateUser({ password })
    } catch {}

    // Register unique account in local storage & database
    registerAccount(email, password, fullName, username)
    router.push('/dashboard')
    setLoading(false)
  }

  const steps = [
    { key: 'info', label: 'Ma\'lumotlar' },
    { key: 'otp', label: 'Tasdiqlash' },
    { key: 'password', label: 'Parol' },
  ]

  const currentStepIndex = steps.findIndex(s => s.key === step)

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              <PenLine className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
              Qalam
            </span>
          </Link>
          <p className="text-sm text-slate-400">Yozuvchilar hamjamiyatiga qo&apos;shiling</p>
        </div>

        <div className="flex items-center justify-center gap-3">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                    i < currentStepIndex
                      ? 'bg-emerald-500 text-slate-950'
                      : i === currentStepIndex
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  {i < currentStepIndex ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs font-medium ${i === currentStepIndex ? 'text-amber-400' : 'text-slate-500'}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && <div className="w-8 h-px bg-slate-800 mx-2" />}
            </div>
          ))}
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 'info' && (
              <motion.form
                key="info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSendOtp}
                className="space-y-5"
              >
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-2 block">To&apos;liq ismingiz</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Sarvarbek Xasanboyev"
                      required
                      className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-400 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 mb-2 block flex items-center justify-between">
                    <span>Username (bo&apos;sh joy qo&apos;yilmaydi)</span>
                    {usernameError && <span className="text-[11px] text-rose-400 font-semibold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {usernameError}</span>}
                  </label>
                  <div className="relative">
                    <span className="text-sm font-semibold text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={e => handleUsernameChange(e.target.value)}
                      placeholder="xasanboyevdev"
                      required
                      minLength={3}
                      className={`w-full bg-slate-950/80 border ${usernameError ? 'border-rose-500' : 'border-slate-800 focus:border-amber-400'} rounded-xl pl-9 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 mb-2 block flex items-center justify-between">
                    <span>Email manzilingiz</span>
                    {emailError && <span className="text-[11px] text-rose-400 font-semibold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {emailError}</span>}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => handleEmailChange(e.target.value)}
                      placeholder="xasanboyevdev@gmail.com"
                      required
                      className={`w-full bg-slate-950/80 border ${emailError ? 'border-rose-500' : 'border-slate-800 focus:border-amber-400'} rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors`}
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !!usernameError || !!emailError}
                  className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading ? 'Yuborilmoqda...' : 'Tasdiqlash Kodini Yuborish'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </motion.form>
            )}

            {step === 'otp' && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleVerifyOtp}
                className="space-y-5 text-center"
              >
                <h3 className="text-lg font-bold text-white">Emailingizni Tasdiqlang</h3>
                <p className="text-xs text-slate-400">
                  <strong className="text-amber-400">{email}</strong> manzilingizga 6 xonali tasdiqlash kodi yuborildi
                </p>

                {demoNotice && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-center gap-2">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    <span>{demoNotice}</span>
                  </div>
                )}

                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  required
                  maxLength={6}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-2xl py-4 text-center text-3xl font-mono tracking-[0.5em] text-amber-400 outline-none"
                />

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {loading ? 'Tekshirilmoqda...' : 'Kodni Tasdiqlash'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('info')}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  ← Orqaga qaytish
                </button>
              </motion.form>
            )}

            {step === 'password' && (
              <motion.form
                key="password"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSetPassword}
                className="space-y-5"
              >
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Email Tasdiqlandi!
                  </h3>
                  <p className="text-xs text-slate-400">Endi hisobingiz uchun parol o&apos;rnating</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 mb-2 block">Yangi Parol</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Kamida 8 ta belgi"
                      required
                      minLength={8}
                      className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-400 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 mb-2 block">Parolni Qayta Kiriting</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Parolni qayta kiriting"
                      required
                      className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-400 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading ? 'Yaratilmoqda...' : 'Akkaunt Yaratish va Kirish'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
            Akkauntingiz bormi?{' '}
            <Link href="/signin" className="text-amber-400 font-medium hover:underline">
              Tizimga Kirish
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
