import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded ${isActive ? 'bg-indigo-500 text-white' : 'text-gray-700'}`

  return (
    <aside className="w-56 bg-gray-50 dark:bg-gray-900 p-4">
      <nav className="flex flex-col gap-2">
        <NavLink to="/" className={linkClass} end>
          Home
        </NavLink>
        <NavLink to="/topup" className={linkClass}>
          Top Up
        </NavLink>
        <NavLink to="/transaction" className={linkClass}>
          Transaction
        </NavLink>
        <NavLink to="/history" className={linkClass}>
          History
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          Profile
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
