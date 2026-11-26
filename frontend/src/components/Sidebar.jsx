import { Plus, X } from 'lucide-react'

const GROUPS = ['Today', 'Previous 7 Days', 'Previous 30 Days', 'Older']

function getThreadGroup(createdAt) {
  const timestamp = /(?:Z|[+-]\d{2}:\d{2})$/i.test(createdAt)
    ? createdAt
    : `${createdAt}Z`
  const createdDate = new Date(timestamp)
  const now = new Date()
  const createdDay = new Date(
    createdDate.getFullYear(),
    createdDate.getMonth(),
    createdDate.getDate(),
  )
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const daysAgo = Math.round((today - createdDay) / 86400000)

  if (daysAgo <= 0) return 'Today'
  if (daysAgo <= 7) return 'Previous 7 Days'
  if (daysAgo <= 30) return 'Previous 30 Days'
  return 'Older'
}

export default function Sidebar({
  threads,
  activeThreadId,
  isOpen,
  isBusy,
  onNewChat,
  onSelectThread,
  onClose,
}) {
  const groupedThreads = GROUPS.map((group) => ({
    group,
    threads: threads.filter((thread) => getThreadGroup(thread.created_at) === group),
  })).filter(({ threads: groupThreads }) => groupThreads.length > 0)

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close chat history"
          onClick={onClose}
          className="absolute inset-0 z-20 bg-slate-950/25 lg:hidden"
        />
      )}
      <aside
        aria-label="Chat history"
        className={`absolute inset-y-0 left-0 z-30 w-64 shrink-0 transition-transform duration-300 lg:relative lg:inset-auto lg:translate-x-0 lg:transition-[width] ${
          isOpen
            ? 'translate-x-0 lg:w-64'
            : '-translate-x-full lg:w-0 lg:overflow-hidden'
        }`}
      >
        <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
            <h2 className="text-sm font-semibold text-slate-800">Chat history</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat history"
              className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-200 lg:hidden"
            >
              <X size={17} />
            </button>
          </div>
          <div className="p-3">
            <button
              type="button"
              disabled={isBusy}
              onClick={onNewChat}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={17} />
              New Chat
            </button>
          </div>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-2 pb-4">
            {groupedThreads.map(({ group, threads: groupThreads }) => (
              <section key={group} aria-label={group}>
                <h3 className="px-2 pb-1.5 text-xs font-semibold text-slate-400">
                  {group}
                </h3>
                <div className="space-y-1">
                  {groupThreads.map((thread) => (
                    <button
                      key={thread.id}
                      type="button"
                      disabled={isBusy}
                      onClick={() => onSelectThread(thread.id)}
                      title={thread.title}
                      className={`w-full truncate rounded-lg px-2.5 py-2 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        thread.id === activeThreadId
                          ? 'bg-indigo-100 font-medium text-indigo-800'
                          : 'text-slate-600 hover:bg-white hover:text-slate-900'
                      }`}
                    >
                      {thread.title}
                    </button>
                  ))}
                </div>
              </section>
            ))}
            {threads.length === 0 && (
              <p className="px-2 text-xs leading-5 text-slate-400">
                Your conversations will appear here.
              </p>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
