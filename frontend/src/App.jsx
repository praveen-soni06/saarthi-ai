import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
  ArrowDownLeft,
  ArrowRight,
  Bell,
  Bus,
  ChevronDown,
  CircleHelp,
  Clock3,
  FileText,
  GraduationCap,
  Home,
  MapPin,
  MessageCircle,
  Plus,
  Send,
  Sparkles,
  Users,
  Wallet,
  Paperclip,
} from 'lucide-react'
import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom'
import './App.css'

const navigation = [
  { label: 'Dashboard', path: '/dashboard', icon: Home },
  { label: 'AI Chat', path: '/chat', icon: MessageCircle },
  { label: 'Groups', path: '/groups', icon: Users },
  { label: 'Expenses', path: '/expenses', icon: Wallet },
  { label: 'Bus tracking', path: '/bus', icon: Bus },
]

const features = [
  {
    title: 'Campus AI',
    description: 'Get answers about classes, campus life, and more.',
    path: '/chat',
    icon: Sparkles,
    tone: 'bg-indigo-50 text-indigo-600',
  },
  {
    title: 'Group chat',
    description: 'Stay in the loop with your classmates.',
    path: '/groups',
    icon: Users,
    tone: 'bg-sky-50 text-sky-600',
  },
  {
    title: 'Expense manager',
    description: 'Keep shared expenses simple and balanced.',
    path: '/expenses',
    icon: Wallet,
    tone: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Bus tracking',
    description: 'Check your route and the next campus shuttle.',
    path: '/bus',
    icon: Bus,
    tone: 'bg-amber-50 text-amber-600',
  },
]

function Brand({ compact = false }) {
  return (
    <Link to="/dashboard" className="flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm">
        <GraduationCap size={22} strokeWidth={2.2} />
      </span>
      {!compact && (
        <span className="text-lg font-bold tracking-tight text-slate-900">
          SAARTHI <span className="text-indigo-600">AI</span>
        </span>
      )}
    </Link>
  )
}

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white px-5 py-6 lg:flex">
      <Brand />
      <p className="mb-3 mt-10 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Workspace
      </p>
      <nav className="space-y-1">
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl bg-slate-50 p-4">
        <div className="mb-2 flex size-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
          <CircleHelp size={18} />
        </div>
        <p className="text-sm font-semibold text-slate-800">Need a hand?</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Ask Saarthi anything about your campus.
        </p>
        <Link
          to="/chat"
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Start a chat <ArrowRight size={14} />
        </Link>
      </div>
    </aside>
  )
}

function MobileNavigation() {
  const items = navigation.filter(({ label }) => label !== 'Groups')
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-slate-200 bg-white px-2 pb-[env(safe-area-inset-bottom)] pt-2 lg:hidden">
      {items.map(({ label, path, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 text-[10px] font-medium ${
              isActive ? 'text-indigo-600' : 'text-slate-500'
            }`
          }
        >
          <Icon size={20} />
          {label === 'AI Chat' ? 'Chat' : label === 'Bus tracking' ? 'Bus' : label}
        </NavLink>
      ))}
    </nav>
  )
}

function AppLayout() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <Brand compact />
            <span className="text-sm font-bold text-slate-800">SAARTHI AI</span>
          </div>
          <p className="hidden text-sm text-slate-500 lg:block">
            Your campus, made simpler.
          </p>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="relative grid size-10 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-indigo-600 ring-2 ring-white" />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-2 rounded-full p-1.5 pr-2 hover:bg-slate-50"
              aria-expanded={menuOpen}
            >
              <span className="grid size-9 place-items-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                AS
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold leading-4 text-slate-800">
                  Aanya Sharma
                </span>
                <span className="text-xs text-slate-500">Student</span>
              </span>
              <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
            </button>
            {menuOpen && (
              <div className="absolute right-4 top-[62px] z-40 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-8 sm:py-8 lg:pb-10">
          <Outlet />
        </main>
      </div>
      <MobileNavigation />
    </div>
  )
}

function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="mb-2 text-sm font-semibold text-indigo-600">{eyebrow}</p>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>
        {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  )
}

function Dashboard() {
  const [today] = useState(
    () =>
      new Intl.DateTimeFormat('en', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }).format(new Date()),
  )

  return (
    <>
      <PageHeading
        eyebrow={today}
        title="Good morning, Aanya!"
        description="Here’s what’s happening around your campus today."
      />
      <section aria-label="Campus tools" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {features.map(({ title, description, path, icon: Icon, tone }) => (
          <Link
            key={title}
            to={path}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
          >
            <span className={`mb-5 grid size-11 place-items-center rounded-xl ${tone}`}>
              <Icon size={21} />
            </span>
            <h2 className="font-semibold text-slate-900">{title}</h2>
            <p className="mt-1.5 min-h-10 text-sm leading-5 text-slate-500">
              {description}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
              Open <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </section>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Today’s snapshot</h2>
              <p className="mt-1 text-sm text-slate-500">A little overview for your day</p>
            </div>
            <span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <FileText size={19} />
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="flex items-center gap-3 py-4">
              <span className="grid size-9 place-items-center rounded-full bg-amber-50 text-amber-600">
                <Clock3 size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800">Submit your Design assignment</p>
                <p className="mt-0.5 text-xs text-slate-500">Due today at 5:00 PM</p>
              </div>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                Today
              </span>
            </div>
            <div className="flex items-center gap-3 py-4">
              <span className="grid size-9 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                <ArrowDownLeft size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800">Lunch with Priya</p>
                <p className="mt-0.5 text-xs text-slate-500">Priya paid ₹240 · You owe ₹120</p>
              </div>
              <Link to="/expenses" className="text-xs font-semibold text-indigo-600">
                Settle
              </Link>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-2xl bg-indigo-600 p-6 text-white shadow-sm">
          <div className="relative z-10">
            <span className="mb-4 grid size-10 place-items-center rounded-xl bg-white/15">
              <Bus size={20} />
            </span>
            <p className="text-sm font-medium text-indigo-100">Next campus shuttle</p>
            <h2 className="mt-1 text-2xl font-bold">In 8 minutes</h2>
            <p className="mt-2 text-sm text-indigo-100">Library stop · Route A</p>
            <Link
              to="/bus"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
            >
              Track bus <ArrowRight size={15} />
            </Link>
          </div>
          <div className="pointer-events-none absolute -bottom-16 -right-10 size-56 rounded-full border-[30px] border-white/10" />
        </section>
      </div>
    </>
  )
}

function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi Aanya! I’m Saarthi, your campus assistant. What can I help you with today?',
    },
  ])
  const [question, setQuestion] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, isTyping])

  async function sendMessage(event) {
    event.preventDefault()
    const text = question.trim()
    if (!text || isTyping) return

    setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'user', content: text }])
    setQuestion('')
    setError('')
    setIsTyping(true)

    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const { data } = await axios.post(`${baseURL}/chat/`, {
        question: text,
        userId: 'demo-student',
      })
      if (typeof data.answer !== 'string' || !data.answer.trim()) {
        throw new Error('The assistant returned an empty response. Please try again.')
      }
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: 'assistant', content: data.answer },
      ])
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          requestError.message ||
          'Could not reach Saarthi. Please try again.',
      )
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-11rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:min-h-[calc(100dvh-9rem)]">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <span className="grid size-10 place-items-center rounded-xl bg-indigo-600 text-white">
          <Sparkles size={19} />
        </span>
        <div>
          <h1 className="text-sm font-semibold text-slate-900">Campus AI</h1>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="size-1.5 rounded-full bg-emerald-500" /> Here to help
          </p>
        </div>
      </div>
      <div ref={listRef} className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
        {messages.map(({ id, role, content }) => (
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
          <button
            type="button"
            title="File attachments are not available yet"
            aria-label="File attachments are not available yet"
            onClick={() => setError('File attachments are not supported by the current chat API yet.')}
            className="grid size-10 shrink-0 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"
          >
            <Paperclip size={19} />
          </button>
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask anything about your campus..."
            aria-label="Your message"
            className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
          />
          <button
            type="submit"
            disabled={!question.trim() || isTyping}
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
    </div>
  )
}

function Groups() {
  const groups = [
    { name: 'Design cohort', detail: '12 members · 3 new messages', initials: 'DC', color: 'bg-violet-100 text-violet-700' },
    { name: 'Roommates', detail: '4 members · Last active 10m ago', initials: 'RM', color: 'bg-emerald-100 text-emerald-700' },
    { name: 'Campus events', detail: '28 members · Last active yesterday', initials: 'CE', color: 'bg-amber-100 text-amber-700' },
  ]
  return (
    <>
      <PageHeading
        eyebrow="Your people"
        title="Groups"
        description="Keep up with the conversations that matter."
        action={
          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            <Plus size={17} /> New group
          </button>
        }
      />
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {groups.map((group, index) => (
          <button
            type="button"
            key={group.name}
            className={`flex w-full items-center gap-4 p-5 text-left hover:bg-slate-50 ${index ? 'border-t border-slate-100' : ''}`}
          >
            <span className={`grid size-12 shrink-0 place-items-center rounded-2xl text-sm font-bold ${group.color}`}>
              {group.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-slate-800">{group.name}</span>
              <span className="mt-1 block truncate text-sm text-slate-500">{group.detail}</span>
            </span>
            <ArrowRight size={17} className="text-slate-400" />
          </button>
        ))}
      </section>
    </>
  )
}

function Expenses() {
  const friends = [
    { name: 'Priya Mehta', detail: 'Paid for lunch · Today', amount: '+ ₹120.00', positive: true, initials: 'PM' },
    { name: 'Rohan Das', detail: 'Movie tickets · Yesterday', amount: '− ₹350.00', positive: false, initials: 'RD' },
    { name: 'Meera Iyer', detail: 'Groceries · Monday', amount: '+ ₹85.00', positive: true, initials: 'MI' },
  ]
  return (
    <>
      <PageHeading
        eyebrow="Shared, not stressful"
        title="Expenses"
        description="See what you owe and keep up with shared costs."
        action={
          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            <Plus size={17} /> Add expense
          </button>
        }
      />
      <section className="mb-5 rounded-2xl bg-indigo-600 p-6 text-white shadow-sm sm:p-8">
        <p className="text-sm font-medium text-indigo-100">Your total balance</p>
        <p className="mt-2 text-3xl font-bold">₹ 645.00</p>
        <p className="mt-2 text-sm text-indigo-100">You are owed ₹205.00 · You owe ₹440.00</p>
        <button type="button" className="mt-5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">
          Settle up
        </button>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">Recent activity</h2>
            <p className="mt-1 text-sm text-slate-500">Your latest shared expenses</p>
          </div>
          <button type="button" className="text-sm font-semibold text-indigo-600">See all</button>
        </div>
        <div className="divide-y divide-slate-100">
          {friends.map((friend) => (
            <div key={friend.name} className="flex items-center gap-3 py-4">
              <span className="grid size-10 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                {friend.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800">{friend.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">{friend.detail}</p>
              </div>
              <span className={`text-sm font-semibold ${friend.positive ? 'text-emerald-600' : 'text-slate-700'}`}>
                {friend.amount}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function BusTracking() {
  return (
    <>
      <PageHeading
        eyebrow="Getting there"
        title="Bus tracking"
        description="Campus shuttle locations and arrival estimates."
      />
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <section className="campus-map relative min-h-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-[#eaf2ee] shadow-sm sm:min-h-[480px]" aria-label="Campus map preview">
          <div className="map-road map-road-one" />
          <div className="map-road map-road-two" />
          <div className="map-road map-road-three" />
          <div className="map-block map-block-one">LIBRARY</div>
          <div className="map-block map-block-two">CAMPUS<br />CENTER</div>
          <div className="map-block map-block-three">SCIENCE<br />HALL</div>
          <div className="map-route" />
          <span className="map-pin map-pin-stop"><MapPin size={16} /><span>Library stop</span></span>
          <span className="map-pin map-pin-bus"><Bus size={17} /></span>
          <div className="absolute left-4 top-4 rounded-lg bg-white/90 px-3 py-2 text-xs font-medium text-slate-600 shadow-sm">
            Campus map preview
          </div>
        </section>
        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Next arrival</p>
                <h2 className="mt-1 text-3xl font-bold text-slate-900">8 min</h2>
              </div>
              <span className="grid size-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <Bus size={21} />
              </span>
            </div>
            <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">Route A</p>
                <p className="mt-0.5 text-xs text-slate-500">Library → Main Gate</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                On time
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">Nearby stops</h2>
            <div className="mt-3 space-y-1">
              {[
                ['Library stop', '8 min'],
                ['Student center', '14 min'],
                ['Main gate', '22 min'],
              ].map(([stop, eta]) => (
                <div key={stop} className="flex items-center justify-between rounded-lg px-2 py-3 text-sm">
                  <span className="flex items-center gap-2 text-slate-600"><MapPin size={15} />{stop}</span>
                  <span className="font-medium text-slate-800">{eta}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

function AuthPage({ signup = false }) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    navigate('/dashboard')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <div className="mb-8 flex flex-col items-center text-center">
          <Brand />
          <h1 className="mt-7 text-2xl font-bold tracking-tight text-slate-900">
            {signup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {signup ? 'Join your campus community with Saarthi.' : 'Sign in to your campus companion.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <span className="text-base font-bold text-indigo-600">G</span>
          Continue with Google
        </button>
        <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" /> OR CONTINUE WITH EMAIL <span className="h-px flex-1 bg-slate-200" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {signup && (
            <label className="block text-sm font-medium text-slate-700">
              Full name
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
              />
            </label>
          )}
          <label className="block text-sm font-medium text-slate-700">
            College email
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@college.edu"
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
            />
          </label>
          {!signup && (
            <div className="flex justify-end">
              <button type="button" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                Forgot password?
              </button>
            </div>
          )}
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            {signup ? 'Create account' : 'Sign in'} <ArrowRight size={16} />
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          {signup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <Link to={signup ? '/login' : '/signup'} className="font-semibold text-indigo-600 hover:text-indigo-700">
            {signup ? 'Sign in' : 'Sign up'}
          </Link>
        </p>
        <p className="mt-6 text-center text-xs leading-5 text-slate-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </section>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage signup />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/bus" element={<BusTracking />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
