import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Menu, Send, Sparkles } from 'lucide-react'

import Sidebar from '../../components/Sidebar'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const USER_ID = 'demo-student'
const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: 'Hi Praveen! I’m Saarthi, your campus assistant. What can I help you with today?',
}

function getErrorMessage(error, fallback) {
  return (
    error.response?.data?.detail ||
    error.message ||
    fallback
  )
}

export default function ChatPage() {
  const [threads, setThreads] = useState([])
  const [activeThreadId, setActiveThreadId] = useState(null)
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [question, setQuestion] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [error, setError] = useState('')
  const [historyError, setHistoryError] = useState('')
  const listRef = useRef(null)
  const historyRequestRef = useRef(null)

  useEffect(() => {
    let isMounted = true

    axios
      .get(`${API_URL}/threads/${encodeURIComponent(USER_ID)}`)
      .then(({ data }) => {
        if (isMounted) setThreads(data)
      })
      .catch((requestError) => {
        if (isMounted) {
          setHistoryError(getErrorMessage(requestError, 'Could not load chat history.'))
        }
      })

    return () => {
      isMounted = false
      historyRequestRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, isTyping])

  async function refreshThreads() {
    try {
      const { data } = await axios.get(
        `${API_URL}/threads/${encodeURIComponent(USER_ID)}`,
      )
      setThreads(data)
      setHistoryError('')
    } catch (requestError) {
      setHistoryError(getErrorMessage(requestError, 'Could not refresh chat history.'))
    }
  }

  function startNewChat() {
    historyRequestRef.current?.abort()
    historyRequestRef.current = null
    setActiveThreadId(null)
    setMessages([WELCOME_MESSAGE])
    setQuestion('')
    setError('')
    setIsLoadingHistory(false)
    setSidebarOpen(false)
  }

  async function selectThread(threadId) {
    if (isTyping) return

    historyRequestRef.current?.abort()
    const controller = new AbortController()
    historyRequestRef.current = controller
    setActiveThreadId(threadId)
    setMessages([])
    setError('')
    setIsLoadingHistory(true)
    setSidebarOpen(false)

    try {
      const { data } = await axios.get(
        `${API_URL}/threads/${encodeURIComponent(threadId)}/messages`,
        {
          params: { user_id: USER_ID },
          signal: controller.signal,
        },
      )
      setMessages(
        data.map((message) => ({
          id: message.id,
          role: message.role === 'user' ? 'user' : 'assistant',
          content: message.content,
        })),
      )
    } catch (requestError) {
      if (!axios.isCancel(requestError)) {
        setError(getErrorMessage(requestError, 'Could not load this conversation.'))
      }
    } finally {
      if (historyRequestRef.current === controller) {
        historyRequestRef.current = null
        setIsLoadingHistory(false)
      }
    }
  }

  async function sendMessage(event) {
    event.preventDefault()
    const text = question.trim()
    if (!text || isTyping || isLoadingHistory) return

    setMessages((current) => [
      ...current.filter((message) => message.id !== 'welcome'),
      { id: crypto.randomUUID(), role: 'user', content: text },
    ])
    setQuestion('')
    setError('')
    setIsTyping(true)

    try {
      const { data } = await axios.post(`${API_URL}/chat/`, {
        question: text,
        user_id: USER_ID,
        thread_id: activeThreadId,
      })
      if (typeof data.answer !== 'string' || !data.answer.trim()) {
        throw new Error('The assistant returned an empty response. Please try again.')
      }
      setActiveThreadId(data.thread_id)
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: 'assistant', content: data.answer },
      ])
      await refreshThreads()
    } catch (requestError) {
      const persistedThreadId = requestError.response?.headers?.['x-thread-id']
      if (persistedThreadId) setActiveThreadId(persistedThreadId)
      setError(getErrorMessage(requestError, 'Could not reach Saarthi. Please try again.'))
      await refreshThreads()
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="relative flex min-h-[calc(100dvh-11rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:min-h-[calc(100dvh-9rem)]">
      <Sidebar
        threads={threads}
        activeThreadId={activeThreadId}
        isOpen={sidebarOpen}
        isBusy={isTyping}
        onNewChat={startNewChat}
        onSelectThread={selectThread}
        onClose={() => setSidebarOpen(false)}
      />
      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
          <button
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? 'Close chat history' : 'Open chat history'}
            aria-expanded={sidebarOpen}
            className="grid size-9 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            <Menu size={19} />
          </button>
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white">
            <Sparkles size={19} />
          </span>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-slate-900">Campus AI</h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="size-1.5 rounded-full bg-emerald-500" /> Here to help
            </p>
          </div>
        </div>
        {historyError && (
          <p role="status" className="border-b border-amber-100 bg-amber-50 px-4 py-2 text-xs text-amber-800">
            {historyError}
          </p>
        )}
        <div ref={listRef} className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
          {isLoadingHistory && (
            <p className="text-center text-sm text-slate-400">Loading conversation…</p>
          )}
          {!isLoadingHistory &&
            messages.map(({ id, role, content }) => (
              <div key={id} className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${
                    role === 'user'
                      ? 'rounded-br-md bg-indigo-600 text-white'
                      : 'rounded-bl-md bg-slate-100 text-slate-700'
                  }`}
                >
                  {content}
                </div>
              </div>
            ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm text-slate-500">
                <span className="flex gap-1" aria-hidden="true">
                  <i className="typing-dot" />
                  <i className="typing-dot animation-delay-150" />
                  <i className="typing-dot animation-delay-300" />
                </span>
                Saarthi is typing
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-slate-100 p-3 sm:p-4">
          {error && (
            <p role="alert" className="mx-auto mb-2 max-w-4xl rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          )}
          <form onSubmit={sendMessage} className="mx-auto flex max-w-4xl items-center gap-2">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask anything about your campus..."
              aria-label="Your message"
              className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            />
            <button
              type="submit"
              disabled={!question.trim() || isTyping || isLoadingHistory}
              aria-label="Send message"
              className="grid size-11 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={17} />
            </button>
          </form>
          <p className="mt-2 text-center text-[11px] text-slate-400">
            Saarthi AI can make mistakes. Check important information with your college.
          </p>
        </div>
      </section>
    </div>
  )
}
