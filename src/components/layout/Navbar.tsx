import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'
import logo from '../../assets/images/logo.png'

const links = [
    { label: 'Top Up', to: '/topup' },
    { label: 'Transaction', to: '/transaction' },
    { label: 'Akun', to: '/profile' },
]

export default function Navbar() {
    const [open, setOpen] = useState(false)
    return (
        <header className="w-full bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
                <Link to="/dashboard" className="flex items-center justify-center gap-3">
                    <img
                        src={logo}
                        alt="logo"
                        className="w-7"
                    />

                    <h1 className="text-lg font-bold text-gray-800">
                        SIMS PPOB
                    </h1>
                </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-lg text-sm font-medium transition ${isActive ? 'bg-linear-to-r from-red-500 to-rose-500 text-white' : 'text-slate-600 hover:bg-slate-100'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Mobile toggle */}
                    <div className="md:hidden">
                        <button
                            type="button"
                            aria-label="Toggle navigation"
                            onClick={() => setOpen((s) => !s)}
                            className="p-2 rounded-md text-slate-700 hover:bg-slate-100"
                        >
                            {open ? <HiOutlineX size={22} /> : <HiOutlineMenu size={22} />}
                        </button>
                    </div>
            </div>

            {/* Mobile menu dropdown */}
            <div className={`md:hidden ${open ? 'block' : 'hidden'} px-4 pb-4`}> 
                <nav className="flex flex-col gap-2">
                    {links.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setOpen(false)}
                            className="block px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    )
}