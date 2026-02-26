import { useEffect, useState } from 'react';
import { getStats, getActivityLogs, getFeeStats } from '../api/roomApi';
import StatCard from '../components/StatCard';
import Spinner from '../components/Spinner';
import Badge from '../components/Badge';
import { Link } from 'react-router-dom';
import {
    MdMeetingRoom, MdPeople, MdAcUnit, MdBathtub,
    MdCheckCircle, MdBlock, MdArrowForward, MdErrorOutline,
    MdPerson, MdAttachMoney, MdHistory,
} from 'react-icons/md';

const actionIcons = {
    ALLOCATE: { bg: '#dcfce7', color: '#16a34a' },
    DEALLOCATE: { bg: '#fee2e2', color: '#e11d48' },
    ROOM_CREATED: { bg: '#eef2ff', color: '#6366f1' },
    ROOM_DELETED: { bg: '#fee2e2', color: '#e11d48' },
    ROOM_RESET: { bg: '#fef3c7', color: '#d97706' },
    FEE_CREATED: { bg: '#dbeafe', color: '#2563eb' },
    FEE_PAID: { bg: '#dcfce7', color: '#16a34a' },
};

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [feeStats, setFeeStats] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const [sRes, fRes, lRes] = await Promise.all([
                    getStats(),
                    getFeeStats().catch(() => ({ data: { data: null } })),
                    getActivityLogs(10).catch(() => ({ data: { data: [] } })),
                ]);
                setStats(sRes.data.data);
                setFeeStats(fRes.data.data);
                setLogs(lRes.data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}><Spinner size="lg" /></div>;

    if (error) return (
        <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center' }}>
            <div className="card" style={{ padding: 40 }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <MdErrorOutline size={32} color="#e11d48" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Connection Error</h3>
                <p style={{ fontSize: 14, color: '#64748b' }}>{error}</p>
            </div>
        </div>
    );

    const cards = [
        { icon: MdMeetingRoom, label: 'Total Rooms', value: stats.totalRooms, color: 'indigo' },
        { icon: MdPeople, label: 'Total Capacity', value: stats.totalCapacity, color: 'violet' },
        { icon: MdPerson, label: 'Students', value: stats.totalStudents, color: 'sky' },
        { icon: MdAcUnit, label: 'AC Rooms', value: stats.acRooms, color: 'emerald' },
        { icon: MdCheckCircle, label: 'Available', value: stats.availableRooms, color: 'amber' },
        { icon: MdBlock, label: 'Full', value: stats.fullRooms, color: 'rose' },
    ];

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Dashboard</h1>
                <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>Overview of hostel room inventory and allocation status</p>
            </div>

            {/* Stat Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
                {cards.map((c, i) => <StatCard key={c.label} {...c} className={`animate-fade-in-up stagger-${i + 1}`} />)}
            </div>

            {/* Fee Stats + Activity in 2 cols */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                {/* Fee Overview */}
                {feeStats && (
                    <div className="card animate-fade-in" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <MdAttachMoney size={20} color="#6366f1" />
                            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Fee Overview</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {[
                                { label: 'Total', value: `₹${feeStats.totalAmount.toLocaleString()}`, variant: 'purple' },
                                { label: 'Collected', value: `₹${feeStats.paidAmount.toLocaleString()}`, variant: 'green' },
                                { label: 'Pending', value: `₹${feeStats.pendingAmount.toLocaleString()}`, variant: 'amber' },
                                { label: 'Overdue', value: `₹${feeStats.overdueAmount.toLocaleString()}`, variant: 'red' },
                            ].map(({ label, value, variant }) => (
                                <div key={label} style={{ background: '#f8fafc', borderRadius: 10, padding: 14, border: '1px solid #e2e8f0' }}>
                                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>{label}</div>
                                    <div style={{ fontSize: 16, fontWeight: 800, color: '#1e293b' }}>{value}</div>
                                </div>
                            ))}
                        </div>
                        <Link to="/fees" style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 16, fontSize: 13, fontWeight: 600, color: '#6366f1', textDecoration: 'none' }}>
                            Manage Fees <MdArrowForward size={16} />
                        </Link>
                    </div>
                )}

                {/* Activity Log */}
                <div className="card animate-fade-in" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <MdHistory size={20} color="#6366f1" />
                        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Recent Activity</h2>
                    </div>
                    {logs.length === 0 ? (
                        <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: 20 }}>No activity yet</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {logs.slice(0, 8).map((log) => {
                                const ai = actionIcons[log.action] || { bg: '#f1f5f9', color: '#64748b' };
                                return (
                                    <div key={log._id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                                        <div style={{ width: 28, height: 28, borderRadius: 8, background: ai.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: 99, background: ai.color }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.4 }}>{log.description}</div>
                                            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{new Date(log.createdAt).toLocaleString()}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
                {[
                    { title: 'Add Room', desc: 'Register new rooms', to: '/add-room', color: '#6366f1' },
                    { title: 'Allocate', desc: 'Assign student to room', to: '/allocate', color: '#16a34a' },
                    { title: 'Students', desc: 'View all students', to: '/students', color: '#0284c7' },
                    { title: 'Fees', desc: 'Manage fee payments', to: '/fees', color: '#d97706' },
                ].map(({ title, desc, to, color }) => (
                    <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                        <div className="card" style={{ padding: 20, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: color }} />
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div><h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 2 }}>{title}</h3><p style={{ fontSize: 12, color: '#94a3b8' }}>{desc}</p></div>
                                <MdArrowForward size={18} color="#94a3b8" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
