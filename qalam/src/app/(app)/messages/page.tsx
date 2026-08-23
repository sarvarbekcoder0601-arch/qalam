'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Send, Search, MessageSquare } from 'lucide-react'
import { Message, Profile } from '@/types'
import { formatDate, getInitials } from '@/lib/utils'
import {
  getLocalProfile, getCommunityUsers, getDirectMessages,
  saveDirectMessage, markConversationAsRead
} from '@/lib/storage'

function MessagesContent() {
  const searchParams = useSearchParams()
  const targetUsername = searchParams?.get('user')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [me, setMe] = useState<Profile>(getLocalProfile())
  const [users, setUsers] = useState<Profile[]>([])
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const currentProfile = getLocalProfile()
    setMe(currentProfile)

    const allUsers = getCommunityUsers().filter(u => u.id !== currentProfile.id && u.username !== currentProfile.username)
    setUsers(allUsers)

    if (targetUsername) {
      const match = allUsers.find(u => u.username.toLowerCase() === targetUsername.toLowerCase())
      if (match) {
        setSelectedUser(match)
        return
      }
    }

    if (allUsers.length > 0) {
      setSelectedUser(allUsers[0])
    }
  }, [targetUsername])

  useEffect(() => {
    if (!selectedUser) return
    loadConversation(selectedUser)
  }, [selectedUser])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function loadConversation(user: Profile) {
    // Automatically mark conversation as read!
    markConversationAsRead(user.id)

    const chat = getDirectMessages(user.id)
    if (chat.length > 0) {
      setMessages(chat)
    } else {
      const initialMsg: Message = {
        id: 'msg-init-' + user.id,
        sender_id: user.id,
        receiver_id: me.id,
        content: `Salom! Men ${user.full_name}. Qalam platformasida ko'rishganimdan xursandman!`,
        is_read: true,
        created_at: new Date().toISOString(),
      }
      setMessages([initialMsg])
    }
  }

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!inputMessage.trim() || !selectedUser) return

    const text = inputMessage.trim()
    setInputMessage('')

    const newMessage: Message = {
      id: Date.now().toString(),
      sender_id: me.id,
      receiver_id: selectedUser.id,
      content: text,
      is_read: false,
      created_at: new Date().toISOString(),
    }

    const updated = saveDirectMessage(selectedUser.id, newMessage)
    setMessages([...updated])
  }

  const filteredUsers = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="h-[calc(100vh-4rem)] md:h-screen flex bg-[#09090b] text-slate-100 overflow-hidden font-sans">
      {/* Left Contacts Sidebar */}
      <div className="w-full md:w-80 border-r border-slate-800 bg-[#0c0c0e] flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-slate-800 space-y-3">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" /> Xabarlar & Chat
          </h1>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Yozuvchini qidiring..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredUsers.map(user => {
            const isSelected = selectedUser?.id === user.id
            const chatMsgs = getDirectMessages(user.id)
            const unreadCount = chatMsgs.filter(m => m.receiver_id === me.id && !m.is_read).length

            return (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all text-left relative ${
                  isSelected ? 'bg-amber-500/10 border border-amber-500/20 text-white' : 'hover:bg-slate-900 text-slate-400'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-xs flex-shrink-0 relative">
                  {getInitials(user.full_name)}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-[#0c0c0e] animate-pulse" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm truncate text-white">{user.full_name}</h4>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">@{user.username}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Right Chat Area */}
      <div className="hidden md:flex flex-1 flex-col bg-[#09090b]">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="h-16 px-6 border-b border-slate-800 bg-[#0c0c0e] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-xs">
                  {getInitials(selectedUser.full_name)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{selectedUser.full_name}</h3>
                  <p className="text-[11px] text-amber-400/80 font-mono">@{selectedUser.username}</p>
                </div>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map(msg => {
                const isMe = msg.sender_id === me.id || msg.sender_id === 'user-me'
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md p-4 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? 'bg-amber-400 text-slate-950 font-medium rounded-br-none shadow-md shadow-amber-500/10'
                          : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-none'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <span className={`text-[10px] block mt-1 text-right ${isMe ? 'text-slate-900/70' : 'text-slate-500'}`}>
                        {formatDate(msg.created_at)}
                      </span>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-[#0c0c0e] flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder={`${selectedUser.full_name}ga xabar yozing...`}
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="px-5 py-3 rounded-xl bg-amber-400 text-slate-950 font-semibold hover:bg-amber-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-xs"
              >
                <Send className="w-4 h-4" /> Yuborish
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Muloqotni boshlash uchun yozuvchini tanlang
          </div>
        )}
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Chat yuklanmoqda...</div>}>
      <MessagesContent />
    </Suspense>
  )
}
