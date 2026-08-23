'use client'

import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { Bold, Italic, Heading1, Heading2, Quote, Minus, List, Undo, Redo, Sparkles } from 'lucide-react'
import { InspirationModal } from '@/components/InspirationModal'
import { WritingPrompt } from '@/data/promptsAndSynonyms'

interface EditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  onApplyPrompt?: (prompt: WritingPrompt) => void
}

export function RichEditor({ content, onChange, placeholder, onApplyPrompt }: EditorProps) {
  const [isInspirationOpen, setIsInspirationOpen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || "Ijodingizni boshlang...",
      }),
      CharacterCount,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'ProseMirror',
      },
    },
  })

  if (!editor) return null

  const tools = [
    { icon: Undo, action: () => editor.chain().focus().undo().run(), title: 'Orqaga', disabled: !editor.can().undo() },
    { icon: Redo, action: () => editor.chain().focus().redo().run(), title: 'Oldinga', disabled: !editor.can().redo() },
    null, // divider
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), title: 'Qalin', active: editor.isActive('bold') },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), title: 'Kursiv', active: editor.isActive('italic') },
    null,
    { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), title: 'Sarlavha 1', active: editor.isActive('heading', { level: 1 }) },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), title: 'Sarlavha 2', active: editor.isActive('heading', { level: 2 }) },
    null,
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), title: 'Iqtibos', active: editor.isActive('blockquote') },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), title: 'Ro\'yxat', active: editor.isActive('bulletList') },
    { icon: Minus, action: () => editor.chain().focus().setHorizontalRule().run(), title: 'Ajratgich' },
  ]

  const wordCount = editor.storage.characterCount?.words() || 0
  const charCount = editor.storage.characterCount?.characters() || 0

  function handleInsertWord(word: string) {
    editor?.chain().focus().insertContent(` ${word} `).run()
  }

  function handleSelectPrompt(prompt: WritingPrompt) {
    if (onApplyPrompt) {
      onApplyPrompt(prompt)
    } else {
      editor?.chain().focus().insertContent(`<h2>${prompt.title}</h2><p><em>${prompt.description}</em></p><br/>`).run()
    }
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Toolbar */}
      <div
        className="flex items-center gap-1 px-4 py-2 border-b flex-wrap flex-shrink-0"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
      >
        {tools.map((tool, i) => {
          if (tool === null) {
            return (
              <div
                key={i}
                className="w-px h-5 mx-1"
                style={{ background: 'var(--border)' }}
              />
            )
          }
          return (
            <button
              key={i}
              onClick={tool.action}
              disabled={'disabled' in tool ? tool.disabled : false}
              title={tool.title}
              className="p-2 rounded-lg text-sm transition-all hover:opacity-80 disabled:opacity-30"
              style={{
                background: ('active' in tool && tool.active) ? 'var(--accent-dim)' : 'transparent',
                color: ('active' in tool && tool.active) ? 'var(--accent)' : 'var(--text-muted)',
                border: ('active' in tool && tool.active) ? '1px solid rgba(201,168,76,0.3)' : '1px solid transparent',
              }}
            >
              <tool.icon className="w-4 h-4" />
            </button>
          )
        })}

        {/* Random Prompt & Synonyms Assistant Button */}
        <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />
        <button
          onClick={() => setIsInspirationOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105 animate-pulse-glow"
          style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(201,168,76,0.4)' }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          🎲 Ilhom & Sinonimlar
        </button>

        <div className="flex-1" />
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {wordCount} so&apos;z · {charCount} belgi
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12">
        <div className="max-w-2xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Inspiration Modal */}
      <InspirationModal
        isOpen={isInspirationOpen}
        onClose={() => setIsInspirationOpen(false)}
        onSelectPrompt={handleSelectPrompt}
        onInsertWord={handleInsertWord}
      />
    </div>
  )
}
