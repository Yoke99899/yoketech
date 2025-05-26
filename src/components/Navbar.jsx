import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const navItem = ({ isActive }) =>
    `px-3 py-2 rounded-md font-medium transition ${
      isActive ? 'bg-white text-blue-700' : 'text-white hover:bg-blue-600'
    }`

  return (
    <header className="bg-blue-700 shadow">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">📊 WhatsApp Bot Panel</h1>
        <nav className="flex gap-4">
          <NavLink to="/" className={navItem}>Inbox</NavLink>
          <NavLink to="/export" className={navItem}>Export</NavLink>
          <NavLink to="/dashboard" className={navItem}>Dashboard</NavLink>
        </nav>
      </div>
    </header>
  )
}
