import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import SeedData from './components/SeedData'

function App() {
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Healthcare Staff Scheduling & Care Management</h1>
          <p className="text-gray-600 text-sm mt-1">Manage residents, staff schedules, task allocation with intelligent automation and real-time tracking.</p>
        </div>
        <SeedData onSeeded={() => window.location.reload()} />
      </div>
      <Dashboard />
    </Layout>
  )
}

export default App
