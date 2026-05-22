import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
    return (
        <div className="min-h-screen text-slate-900">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-6">
                <Outlet />
            </main>
        </div>
    )
}