import { useState, useRef, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { generateConciergeReply, type ChatMessage } from '@/lib/concierge-ai'
import { cn } from '@/lib/cn'

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    sender: 'ai',
    text: `Greetings. I am **Aura**, Northlight Studio's creative concierge.\n\nWhether you need bespoke package recommendations, wardrobe color harmony advice, or camera optical specifications, I am here to assist your visual journey.`,
    timestamp: 'Just now',
    actionCard: {
      type: 'package',
      buttonText: 'View Studio Offerings',
      linkUrl: '/packages',
    },
  },
]

const QUICK_PROMPTS = [
  'Recommend wedding package',
  'Wardrobe styling & colors',
  'Golden Hour lighting times',
  'What cameras do you use?',
  'Calculate bespoke budget',
]

export function ConciergeChatModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('northlight_concierge_chat')
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES
    } catch {
      return INITIAL_MESSAGES
    }
  })
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      sessionStorage.setItem('northlight_concierge_chat', JSON.stringify(messages))
    } catch {
      // Ignore storage errors
    }
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isTyping])

  const handleSend = (textToSend?: string) => {
    const query = (textToSend ?? input).trim()
    if (!query) return

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate natural AI thinking delay
    setTimeout(() => {
      const reply = generateConciergeReply(query)
      setMessages((prev) => [...prev, reply])
      setIsTyping(false)
    }, 450)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 rounded-full border border-brass/50 bg-ink px-5 py-3 text-cream shadow-2xl transition hover:border-brass hover:scale-105"
          title="Open AI Studio Concierge"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brass opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brass" />
          </span>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-[0.2em] text-brass font-medium">
              Studio AI Concierge
            </span>
            <span className="font-display text-sm font-semibold tracking-wide text-cream">
              Ask Aura
            </span>
          </div>
          <span className="ml-1 text-base text-brass transition group-hover:translate-x-0.5">
            ✦
          </span>
        </button>
      )}

      {/* Expanded Luxury Chat Modal */}
      {isOpen && (
        <div className="flex h-[560px] w-[360px] sm:w-[420px] flex-col overflow-hidden rounded border border-brass/40 bg-paper shadow-2xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line bg-ink px-5 py-4 text-cream">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brass/40 bg-brass/10 text-brass font-display text-base">
                ✦
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg tracking-wide text-cream font-medium">
                    Aura
                  </h3>
                  <span className="rounded bg-brass/20 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-brass font-semibold">
                    Studio AI
                  </span>
                </div>
                <p className="text-[10px] text-cream/70 uppercase tracking-widest">
                  Creative Concierge & Stylist
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMessages(INITIAL_MESSAGES)}
                className="text-[11px] text-cream/60 hover:text-cream px-2 py-1 transition"
                title="Reset conversation"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-cream/70 hover:bg-cream/10 hover:text-cream transition text-sm"
                title="Close Concierge"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex flex-col max-w-[88%] text-xs leading-relaxed',
                  msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start',
                )}
              >
                {/* Bubble */}
                <div
                  className={cn(
                    'rounded p-3.5 shadow-sm whitespace-pre-wrap',
                    msg.sender === 'user'
                      ? 'bg-ink text-cream rounded-br-none'
                      : 'bg-paper border border-line text-ink rounded-bl-none',
                  )}
                >
                  {msg.text}

                  {/* Interactive Action Card if present */}
                  {msg.actionCard && (
                    <div className="mt-3 pt-3 border-t border-line/60">
                      {/* Palette Preview */}
                      {msg.actionCard.palette && (
                        <div className="mb-2.5 flex items-center gap-1.5">
                          <span className="text-[10px] text-mute uppercase tracking-widest">Palette:</span>
                          <div className="flex items-center -space-x-1">
                            {msg.actionCard.palette.map((hex, i) => (
                              <span
                                key={i}
                                className="inline-block h-3.5 w-3.5 rounded-full border border-ink/20 shadow-sm"
                                style={{ backgroundColor: hex }}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      {msg.actionCard.linkUrl && (
                        msg.actionCard.linkUrl.startsWith('http') ? (
                          <a
                            href={msg.actionCard.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block rounded bg-brass px-3 py-1.5 text-[11px] font-semibold text-cream uppercase tracking-wider hover:bg-ink transition shadow-sm"
                          >
                            {msg.actionCard.buttonText} →
                          </a>
                        ) : (
                          <Link
                            to={msg.actionCard.linkUrl as any}
                            onClick={() => setIsOpen(false)}
                            className="inline-block rounded bg-brass px-3 py-1.5 text-[11px] font-semibold text-cream uppercase tracking-wider hover:bg-ink transition shadow-sm"
                          >
                            {msg.actionCard.buttonText} →
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
                <span className="mt-1 text-[9px] text-mute px-1">{msg.timestamp}</span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="mr-auto flex items-center gap-1.5 rounded border border-line bg-paper px-3 py-2 text-xs text-mute shadow-sm">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brass animate-bounce" />
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brass animate-bounce [animation-delay:0.2s]" />
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brass animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[10px] uppercase tracking-wider text-brass font-medium">Aura is consulting studio archives…</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="border-t border-line/60 bg-cream/70 px-3 py-2 overflow-x-auto flex gap-1.5 no-scrollbar">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap rounded border border-line bg-paper px-2.5 py-1 text-[10px] text-ink hover:border-ink hover:bg-cream transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2 border-t border-line bg-paper p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about packages, wardrobe, lighting…"
              className="flex-1 rounded border border-line bg-cream px-3 py-2 text-xs text-ink placeholder:text-mute/60 focus:border-ink focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="rounded bg-ink px-4 py-2 text-xs text-cream uppercase tracking-wider hover:bg-brass disabled:opacity-40 transition font-medium"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
