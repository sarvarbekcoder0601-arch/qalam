'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Heart, MessageSquare, ArrowLeft, Share2, Eye, Calendar, Send, Edit3 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Work, Comment, Profile, CATEGORY_LABELS } from '@/types'
import { formatDate, getInitials } from '@/lib/utils'
import {
  getWorkById, getLocalProfile, getWorkLikesState, toggleWorkLike,
  getWorkComments, saveWorkComment
} from '@/lib/storage'
import Link from 'next/link'

export default function WorkReaderPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const workId = (params?.id as string[])?.[0] || params?.id as string

  const [work, setWork] = useState<Work | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [likesCount, setLikesCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [me, setMe] = useState<Profile>(getLocalProfile())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWork()
  }, [workId])

  async function loadWork() {
    setLoading(true)
    const p = getLocalProfile()
    setMe(p)

    if (workId) {
      // Load persistent likes state
      const likeState = getWorkLikesState(workId)
      setLikesCount(likeState.count)
      setIsLiked(likeState.likedUsers.includes(p.id))

      // Load persistent comments
      const savedComments = getWorkComments(workId)
      setComments(savedComments)

      const localWork = getWorkById(workId)
      if (localWork) {
        setWork(localWork)
        setLoading(false)
        return
      }
    }

    try {
      const { data: workData } = await supabase
        .from('works')
        .select('*, profiles(*)')
        .eq('id', workId)
        .single()

      if (workData) {
        setWork(workData)
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false)
    }
  }

  function handleToggleLike() {
    if (!workId) return
    const res = toggleWorkLike(workId)
    setLikesCount(res.count)
    setIsLiked(res.isLiked)
  }

  function handleAddComment(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim() || !work) return

    const text = newComment.trim()
    setNewComment('')

    const authorId = work.author_id || work.profiles?.id
    const updatedComments = saveWorkComment(workId, me, text, work.title, authorId)
    setComments([...updatedComments])
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="h-12 w-3/4 rounded-xl shimmer bg-slate-900 animate-pulse" />
        <div className="h-64 rounded-2xl shimmer bg-slate-900 animate-pulse" />
      </div>
    )
  }

  if (!work) {
    return (
      <div className="p-16 text-center text-slate-500 font-sans">
        <p className="text-lg font-medium">Asar topilmadi</p>
        <button onClick={() => router.push('/dashboard')} className="mt-4 px-4 py-2 bg-amber-400 text-slate-950 font-semibold rounded-xl text-xs">
          Bosh sahifaga qaytish
        </button>
      </div>
    )
  }

  const isAuthor = work.author_id === me.id || work.profiles?.username === me.username

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 font-sans">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-[#0c0c0e]/90 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Orqaga
        </button>

        <div className="flex items-center gap-3">
          {/* Edit Button ONLY visible if the user is the author! */}
          {isAuthor && (
            <Link
              href={`/editor/${work.id}`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-all shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" /> Tahrirlash
            </Link>
          )}

          <button
            onClick={handleToggleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
              isLiked
                ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-md shadow-rose-500/10'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            {likesCount}
          </button>

          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                navigator.clipboard.writeText(window.location.href)
                alert("Asar havolasi nusxalandi!")
              }
            }}
            className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reader Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Category & Title */}
        <div className="text-center mb-8 space-y-4">
          <span className="inline-block text-xs px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
            {CATEGORY_LABELS[work.category]}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            {work.title}
          </h1>

          {/* Author info */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-sm font-bold text-amber-400">
              {getInitials(work.profiles?.full_name || me.full_name)}
            </div>
            <div className="text-left">
              <span className="font-semibold text-sm text-slate-200 block">
                {work.profiles?.full_name || me.full_name}
              </span>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(work.created_at)}</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{work.view_count || 1} marta o&apos;qildi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Work Body */}
        <div
          className="p-8 md:p-12 rounded-3xl bg-slate-900/90 border border-slate-800 font-serif text-lg md:text-xl leading-relaxed text-slate-100 mb-12 shadow-2xl"
          dangerouslySetInnerHTML={{ __html: work.content }}
        />

        {/* Comments Section */}
        <div className="pt-8 border-t border-slate-800">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
            <MessageSquare className="w-6 h-6 text-amber-400" />
            Izohlar ({comments.length})
          </h2>

          <form onSubmit={handleAddComment} className="flex gap-3 mb-8">
            <input
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Fikringizni qoldiring..."
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-5 py-3 rounded-xl bg-amber-400 text-slate-950 font-semibold hover:bg-amber-300 transition-colors disabled:opacity-50 flex items-center gap-2 text-xs"
            >
              <Send className="w-4 h-4" /> Yuborish
            </button>
          </form>

          {/* Comments list */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-400 flex-shrink-0">
                  {getInitials(comment.profiles?.full_name || commenterName(comment))}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">{comment.profiles?.full_name || commenterName(comment)}</span>
                    <span className="text-[10px] text-slate-500">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="text-sm text-slate-300">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function commenterName(c: Comment): string {
  return c.profiles?.full_name || 'Muallif'
}
