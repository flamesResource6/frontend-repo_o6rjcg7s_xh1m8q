import { useEffect, useState } from 'react'

const api = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Stat({ label, value, hint }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
    </div>
  )
}

function Section({ title, children, action }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState({ residents: 0, staff: 0, shifts: 0, tasks: 0 })
  const [residents, setResidents] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [assigning, setAssigning] = useState(false)

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [r, s, sh, t] = await Promise.all([
        fetch(`${api}/residents`).then(r => r.json()),
        fetch(`${api}/staff`).then(r => r.json()),
        fetch(`${api}/shifts`).then(r => r.json()),
        fetch(`${api}/tasks`).then(r => r.json()),
      ])
      setStats({ residents: r.length, staff: s.length, shifts: sh.length, tasks: t.length })
      setResidents(r)
      setTasks(t.slice(0, 5))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const triggerAutoAssign = async () => {
    try {
      setAssigning(true)
      await fetch(`${api}/assign/auto`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      await fetchAll()
    } catch (e) {
      console.error(e)
    } finally {
      setAssigning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Residents" value={stats.residents} />
        <Stat label="Staff" value={stats.staff} />
        <Stat label="Shifts" value={stats.shifts} />
        <Stat label="Open Tasks" value={stats.tasks} />
      </div>

      <Section title="Quick Actions" action={<button onClick={triggerAutoAssign} className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50" disabled={assigning}>{assigning ? 'Assigning...' : 'Auto-Assign Shifts'}</button>}>
        <p className="text-gray-600 text-sm">Automatically assigns available staff to open shifts based on role, availability, and hours.</p>
      </Section>

      <Section title="Recent Residents">
        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : residents.length === 0 ? (
          <div className="text-sm text-gray-500">No residents yet.</div>
        ) : (
          <ul className="divide-y">
            {residents.slice(0, 5).map(r => (
              <li key={r.id} className="py-2 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-800">{r.first_name} {r.last_name}</div>
                  <div className="text-xs text-gray-500">Room {r.room || 'N/A'} · Care {r.care_level}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Upcoming Tasks">
        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : tasks.length === 0 ? (
          <div className="text-sm text-gray-500">No tasks.</div>
        ) : (
          <ul className="divide-y">
            {tasks.map(t => (
              <li key={t.id} className="py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">{t.title}</div>
                    <div className="text-xs text-gray-500">Priority {t.priority} · Status {t.status}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  )
}
