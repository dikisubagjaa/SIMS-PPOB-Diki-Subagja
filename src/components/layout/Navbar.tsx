import { NavLink, Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const links = [
    { label: 'Top Up', to: '/topup' },
    { label: 'Transaction', to: '/transaction' },
    { label: 'Akun', to: '/profile' },
]

export default function Navbar() {
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

                <nav className="hidden md:flex items-center gap-1">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg text-sm font-medium transition ${isActive ? 'bg-linear-to-r from-red-500 to-rose-500 text-white' : 'text-slate-600 hover:bg-slate-100'
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    )
}