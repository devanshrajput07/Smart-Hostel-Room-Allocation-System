import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    MdDashboard, MdAddHome, MdMeetingRoom, MdSearch,
    MdPeople, MdPayment, MdHistory,
} from 'react-icons/md';
import { HiOutlineMenuAlt2, HiX } from 'react-icons/hi';

const navLinks = [
    { to: '/', label: 'Dashboard', icon: MdDashboard },
    { to: '/add-room', label: 'Add Room', icon: MdAddHome },
    { to: '/rooms', label: 'Rooms', icon: MdMeetingRoom },
    { to: '/allocate', label: 'Allocate', icon: MdSearch },
    { to: '/students', label: 'Students', icon: MdPeople },
    { to: '/fees', label: 'Fees', icon: MdPayment },
];

const Navbar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const pageTitle = navLinks.find((l) => l.to === location.pathname)?.label
        || (location.pathname.startsWith('/rooms/') ? 'Room Detail' : 'SmartHostel');

    return (
        <>
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-brand">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="sidebar-brand-logo">SH</div>
                        <div>
                            <div className="sidebar-brand-text">SmartHostel</div>
                            <div className="sidebar-brand-sub">Room Manager</div>
                        </div>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    <div style={{ marginBottom: 8, padding: '0 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)' }}>
                            Menu
                        </span>
                    </div>
                    {navLinks.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            <Icon className="sidebar-link-icon" />
                            {label}
                        </NavLink>
                    ))}
                </nav>
                <div className="sidebar-footer">© {new Date().getFullYear()} SmartHostel</div>
            </aside>

            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

            <div className="topbar">
                <button className="topbar-burger" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
                    {sidebarOpen ? <HiX size={22} /> : <HiOutlineMenuAlt2 size={22} />}
                </button>
                <span className="topbar-title">{pageTitle}</span>
            </div>
        </>
    );
};

export default Navbar;
