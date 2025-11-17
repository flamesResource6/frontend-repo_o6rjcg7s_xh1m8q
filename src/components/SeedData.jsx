import { useState } from 'react'

const api = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function SeedData({ onSeeded }) {
  const [loading, setLoading] = useState(false)

  const seed = async () => {
    try {
      setLoading(true)
      // Create sample staff
      const staff = [
        { first_name: 'Alice', last_name: 'Nguyen', email: 'alice@example.com', role: 'rn', preferred_shift: 'day', availability: [ { day: 'mon', start: '07:00', end: '15:00' }, { day: 'tue', start: '07:00', end: '15:00' }, { day: 'wed', start: '07:00', end: '15:00' } ], skills: ['wound care']},
        { first_name: 'Ben', last_name: 'Patel', email: 'ben@example.com', role: 'cna', preferred_shift: 'evening', availability: [ { day: 'mon', start: '15:00', end: '23:00' }, { day: 'tue', start: '15:00', end: '23:00' } ], skills: ['mobility']},
        { first_name: 'Cara', last_name: 'Johnson', email: 'cara@example.com', role: 'lpn', preferred_shift: 'night', availability: [ { day: 'mon', start: '23:00', end: '07:00' }, { day: 'tue', start: '23:00', end: '07:00' } ], skills: ['med pass']},
      ]
      for (const s of staff) {
        await fetch(`${api}/staff`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) })
      }

      // Create sample residents
      const residents = [
        { first_name: 'John', last_name: 'Doe', dob: new Date().toISOString(), room: '101', care_level: 'assisted' },
        { first_name: 'Mary', last_name: 'Smith', dob: new Date().toISOString(), room: '102', care_level: 'memory_care' },
      ]
      for (const r of residents) {
        await fetch(`${api}/residents`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(r) })
      }

      // Create sample shifts (today)
      const today = new Date()
      const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const toISODate = (d) => new Date(d).toISOString()
      const shifts = [
        { date: toISODate(dayStart), type: 'day', start_time: '07:00', end_time: '15:00', required_role: 'rn', required_count: 1 },
        { date: toISODate(dayStart), type: 'evening', start_time: '15:00', end_time: '23:00', required_role: 'cna', required_count: 1 },
        { date: toISODate(dayStart), type: 'night', start_time: '23:00', end_time: '07:00', required_role: 'lpn', required_count: 1 },
      ]
      for (const sh of shifts) {
        await fetch(`${api}/shifts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sh) })
      }

      // Create sample tasks
      const resList = await fetch(`${api}/residents`).then(r => r.json())
      const staffList = await fetch(`${api}/staff`).then(r => r.json())
      if (resList.length > 0) {
        const t = { resident_id: resList[0].id, title: 'Morning vitals', category: 'vitals', priority: 'medium', assigned_to_staff_id: staffList[0]?.id }
        await fetch(`${api}/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(t) })
      }

      onSeeded && onSeeded()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={seed} className="bg-green-600 text-white text-sm px-3 py-1.5 rounded hover:bg-green-700 disabled:opacity-50" disabled={loading}>
      {loading ? 'Seeding...' : 'Seed Sample Data'}
    </button>
  )
}
