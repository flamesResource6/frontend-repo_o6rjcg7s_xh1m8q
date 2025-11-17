import { Link } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold text-gray-800">CareOps</Link>
          <nav className="space-x-4 text-sm">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            <a href="/test" className="text-gray-600 hover:text-gray-900">Health</a>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="text-center text-xs text-gray-400 py-6">© {new Date().getFullYear()} CareOps</footer>
    </div>
  )
}
