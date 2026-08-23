'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Dices, BookMarked, Search, X, Copy, Check, ArrowRight } from 'lucide-react'
import { WRITING_PROMPTS, SYNONYMS_DICTIONARY, WritingPrompt, SynonymGroup } from '@/data/promptsAndSynonyms'

interface InspirationModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectPrompt?: (prompt: WritingPrompt) => void
  onInsertWord?: (word: string) => void
}

export function InspirationModal({ isOpen, onClose, onSelectPrompt, onInsertWord }: InspirationModalProps) {
  const [tab, setTab] = useState<'prompt' | 'synonym'>('prompt')
  const [currentPrompt, setCurrentPrompt] = useState<WritingPrompt>(WRITING_PROMPTS[0])
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [isRolling, setIsRolling] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedWord, setCopiedWord] = useState<string | null>(null)

  function handleRollPrompt() {
    setIsRolling(true)
    setTimeout(() => {
      const filtered = categoryFilter === 'all'
        ? WRITING_PROMPTS
        : WRITING_PROMPTS.filter(p => p.category === categoryFilter)

      const randomPrompt = filtered[Math.floor(Math.random() * filtered.length)] || WRITING_PROMPTS[0]
      setCurrentPrompt(randomPrompt)
      setIsRolling(false)
    }, 400)
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
    setCopiedWord(text)
    if (onInsertWord) onInsertWord(text)
    setTimeout(() => setCopiedWord(null), 2000)
  }

  const filteredSynonyms = SYNONYMS_DICTIONARY.filter(item =>
    item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.synonyms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
    item.poetic.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-2xl rounded-3xl overflow-hidden glass-strong flex flex-col max-h-[85vh]"
          style={{ border: '1px solid var(--border)' }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              <h2 className="font-bold text-lg gradient-text">Yozuvchi Yordamchisi</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:opacity-80 transition-opacity"
              style={{ color: 'var(--text-muted)', background: 'var(--bg-hover)' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div
            className="flex border-b px-6 flex-shrink-0"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
          >
            <button
              onClick={() => setTab('prompt')}
              className="flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all"
              style={{
                borderColor: tab === 'prompt' ? 'var(--accent)' : 'transparent',
                color: tab === 'prompt' ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              <Dices className="w-4 h-4" />
              Tasodifiy Mavzu Generator
            </button>
            <button
              onClick={() => setTab('synonym')}
              className="flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all"
              style={{
                borderColor: tab === 'synonym' ? 'var(--accent)' : 'transparent',
                color: tab === 'synonym' ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              <BookMarked className="w-4 h-4" />
              Sinonimlar & Badiiy Iboralar
            </button>
          </div>

          {/* Tab Body */}
          <div className="p-6 overflow-y-auto flex-1">
            {tab === 'prompt' ? (
              <div className="space-y-6">
                {/* Category filter */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Kategoriya:</span>
                  <div className="flex gap-2">
                    {[
                      { key: 'all', label: 'Hammasi' },
                      { key: 'story', label: 'Hikoya' },
                      { key: 'poetry', label: "She'r" },
                      { key: 'scenario', label: 'Ssenariy' },
                    ].map(c => (
                      <button
                        key={c.key}
                        onClick={() => setCategoryFilter(c.key)}
                        className="px-3 py-1 rounded-lg text-xs transition-all"
                        style={{
                          background: categoryFilter === c.key ? 'var(--accent-dim)' : 'var(--bg-card)',
                          color: categoryFilter === c.key ? 'var(--accent)' : 'var(--text-muted)',
                          border: categoryFilter === c.key ? '1px solid rgba(201,168,76,0.3)' : '1px solid var(--border)',
                        }}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt Card */}
                <motion.div
                  key={currentPrompt.id}
                  animate={{ scale: isRolling ? 0.97 : 1, rotate: isRolling ? [0, -1, 1, 0] : 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 rounded-2xl relative overflow-hidden"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  <div
                    className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-semibold"
                    style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                  >
                    {currentPrompt.genre || 'Mavzu'}
                  </div>

                  <h3 className="text-2xl font-bold mb-3 pr-16">{currentPrompt.title}</h3>
                  <p className="text-sm font-writing leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                    {currentPrompt.description}
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleRollPrompt}
                      disabled={isRolling}
                      className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-98"
                      style={{ background: 'var(--accent)', color: '#0a0a0f' }}
                    >
                      <Dices className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
                      Yangi Tasodifiy Mavzu
                    </button>

                    {onSelectPrompt && (
                      <button
                        onClick={() => {
                          onSelectPrompt(currentPrompt)
                          onClose()
                        }}
                        className="py-3 px-4 rounded-xl text-sm font-medium flex items-center gap-2 transition-all hover:opacity-80"
                        style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                      >
                        Yozish <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="So'z kiritib sinonim va iboralarni qidiring (masalan: osmon, yurak, quyosh)..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>

                {/* Synonym Cards */}
                <div className="space-y-4">
                  {filteredSynonyms.map((item) => (
                    <div
                      key={item.word}
                      className="p-5 rounded-2xl space-y-3"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold gradient-text capitalize">{item.word}</span>
                        {item.description && (
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.description}</span>
                        )}
                      </div>

                      {/* Regular Synonyms */}
                      <div>
                        <span className="text-xs block mb-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>
                          Sinonimlar:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.synonyms.map(syn => (
                            <button
                              key={syn}
                              onClick={() => handleCopy(syn)}
                              className="px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-all hover:scale-105"
                              style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                              title="Nusxalash yoki kiritish"
                            >
                              {syn}
                              {copiedWord === syn ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 opacity-40" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Poetic Forms */}
                      {item.poetic.length > 0 && (
                        <div>
                          <span className="text-xs block mb-1.5 font-medium" style={{ color: 'var(--accent)' }}>
                            🌸 Badiiy / Shoirona shakllari:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.poetic.map(p => (
                              <button
                                key={p}
                                onClick={() => handleCopy(p)}
                                className="px-2.5 py-1 rounded-lg text-xs font-writing flex items-center gap-1 transition-all hover:scale-105"
                                style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(201,168,76,0.3)' }}
                                title="Nusxalash yoki kiritish"
                              >
                                &ldquo;{p}&rdquo;
                                {copiedWord === p ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 opacity-60" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
