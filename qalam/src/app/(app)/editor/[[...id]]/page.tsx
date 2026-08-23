'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Save, ArrowLeft, Tag, Globe, Lock, Loader2, Check, FileText, Trash2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { RichEditor } from '@/components/RichEditor'
import { WorkCategory, CATEGORY_LABELS } from '@/types'
import { getWorkById, saveLocalWork, deleteWorkById } from '@/lib/storage'

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const workId = (params?.id as string[])?.[0]

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<WorkCategory>('story')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedStatus, setSavedStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [loading, setLoading] = useState(true)
  const [currentWorkId, setCurrentWorkId] = useState<string | null>(workId || null)

  useEffect(() => {
    if (workId) {
      const existing = getWorkById(workId)
      if (existing) {
        setTitle(existing.title || '')
        setContent(existing.content || '')
        setCategory(existing.category || 'story')
        setTags(existing.tags || [])
        setIsPublished(existing.is_published || false)
        setCurrentWorkId(existing.id)
      }
    }
    setLoading(false)
  }, [workId])

  // Auto-save logic
  useEffect(() => {
    if (loading) return
    setSavedStatus('unsaved')

    const timer = setTimeout(() => {
      handleSaveWork()
    }, 2000)

    return () => clearTimeout(timer)
  }, [title, content, category, tags, isPublished])

  function handleSaveWork() {
    if (!title && !content) return
    setSavedStatus('saving')

    try {
      const savedWork = saveLocalWork({
        id: currentWorkId,
        title: title || 'Nomsiz asar',
        content,
        category,
        tags,
        is_published: isPublished,
      })

      if (!currentWorkId) {
        setCurrentWorkId(savedWork.id)
      }
      setSavedStatus('saved')
    } catch {
      setSavedStatus('saved')
    }
  }

  function handlePublishToggle() {
    const nextState = !isPublished
    setIsPublished(nextState)
    saveLocalWork({
      id: currentWorkId,
      title: title || 'Nomsiz asar',
      content,
      category,
      tags,
      is_published: nextState,
    })
  }

  function handleDeleteWork() {
    if (currentWorkId && confirm("Ushbu asarni o'chirmoqchimisiz?")) {
      deleteWorkById(currentWorkId)
      router.push('/dashboard')
    }
  }

  function handleAddTag(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  function handleRemoveTag(tagToRemove: string) {
    setTags(tags.filter(t => t !== tagToRemove))
  }

  function handleApplyPrompt(prompt: { title: string; description: string; category: string }) {
    setTitle(prompt.title)
    if (['scenario', 'poetry', 'story', 'essay'].includes(prompt.category)) {
      setCategory(prompt.category as WorkCategory)
    }
    setContent(`<h2>${prompt.title}</h2><p><em>${prompt.description}</em></p><p>Ijodingizni bu yerdan davom ettiring...</p>`)
  }

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4 bg-[#09090b] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        <p className="text-sm">Muharrir yuklanmoqda...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-slate-100 overflow-hidden font-sans">
      {/* Top Header Controls Bar */}
      <header className="h-16 px-4 md:px-6 bg-[#0c0c0e] border-b border-slate-800 flex items-center justify-between flex-shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Dashboardga qaytish"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-5 w-px bg-slate-800 hidden sm:block" />
          <span className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5 font-medium">
            {savedStatus === 'saving' && <><Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" /> Saqlanmoqda...</>}
            {savedStatus === 'saved' && <><Check className="w-3.5 h-3.5 text-emerald-400" /> Saqlandi</>}
            {savedStatus === 'unsaved' && <><FileText className="w-3.5 h-3.5 text-slate-500" /> Tahrirlanmoqda...</>}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {currentWorkId && (
            <button
              onClick={handleDeleteWork}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Asarni o'chirish"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handlePublishToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              isPublished
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {isPublished ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            {isPublished ? 'Nashr etilgan' : 'Qoralama'}
          </button>

          <button
            onClick={handleSaveWork}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 transition-all shadow-md shadow-amber-500/10"
          >
            <Save className="w-3.5 h-3.5" />
            Saqlash
          </button>
        </div>
      </header>

      {/* Editor Meta Bar */}
      <div className="px-6 md:px-12 py-4 bg-[#09090b] border-b border-slate-800/80 flex flex-col md:flex-row md:items-center gap-4 flex-shrink-0">
        <select
          value={category}
          onChange={e => setCategory(e.target.value as WorkCategory)}
          className="bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-xl px-3 py-2 text-xs font-semibold text-amber-400 outline-none transition-colors w-fit"
        >
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key} className="bg-slate-900 text-slate-200">
              {label}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Asar sarlavhasini kiriting..."
          className="flex-1 bg-transparent text-xl md:text-2xl font-bold text-white placeholder:text-slate-600 outline-none"
        />
      </div>

      {/* Tags Bar */}
      <div className="px-6 md:px-12 py-2 bg-[#09090b] border-b border-slate-800/50 flex items-center gap-2 flex-wrap">
        <Tag className="w-3.5 h-3.5 text-slate-500" />
        {tags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
          >
            #{tag}
            <button onClick={() => handleRemoveTag(tag)} className="hover:text-rose-400 text-slate-500">×</button>
          </span>
        ))}
        <input
          type="text"
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="+ Teg qo'shish (Enter)"
          className="bg-transparent text-xs text-slate-400 placeholder:text-slate-600 outline-none w-36"
        />
      </div>

      {/* Rich Editor */}
      <div className="flex-1 overflow-hidden">
        <RichEditor
          content={content}
          onChange={setContent}
          onApplyPrompt={handleApplyPrompt}
          placeholder={
            category === 'poetry'
              ? "She'ringizni yozing..."
              : category === 'scenario'
              ? "SAHNA 1: Joy nomi..."
              : "Ijodingizni shu yerda boshlang..."
          }
        />
      </div>
    </div>
  )
}
