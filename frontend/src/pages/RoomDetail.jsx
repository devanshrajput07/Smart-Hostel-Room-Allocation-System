import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoomDetail, resetRoom, deallocateStudent } from '../api/roomApi';
import Badge from '../components/Badge';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import {
    MdMeetingRoom, MdPeople, MdAcUnit, MdBathtub,
    MdArrowBack, MdRestartAlt, MdLogout, MdPerson,
} from 'react-icons/md';

const RoomDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await getRoomDetail(id);
            setRoom(data.data.room);
            setStudents(data.data.students);
        } catch (err) {
            toast.error('Failed to load room details');
            navigate('/rooms');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [id]);

    const handleReset = async () => {
        if (!window.confirm(`Reset Room ${room.roomNo}? All occupants will be removed.`)) return;
        try {
            await resetRoom(id);
            toast.success(`Room ${room.roomNo} has been reset`);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Reset failed');
        }
    };

    const handleDeallocate = async (studentId, studentName) => {
        if (!window.confirm(`Remove ${studentName} from Room ${room.roomNo}?`)) return;
        try {
            await deallocateStudent(studentId);
            toast.success(`${studentName} checked out`);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Checkout failed');
        }
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', minHeight: '60vh', alignItems: 'center' }}><Spinner size="lg" /></div>;
    if (!room) return null;

    const remaining = room.capacity - room.occupants;
    const isFull = remaining <= 0;
    const pct = Math.round((room.occupants / room.capacity) * 100);

    return (
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {/* Back */}
            <button onClick={() => navigate('/rooms')} className="btn btn-secondary" style={{ marginBottom: 20 }}>
                <MdArrowBack size={18} /> Back to Rooms
            </button>

            {/* Room Header Card */}
            <div className="card animate-fade-in-up" style={{ padding: 28, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
                            <MdMeetingRoom color="white" size={28} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Room #{room.roomNo}</h1>
                            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                                {room.hasAC ? <Badge variant="green">AC</Badge> : <Badge variant="gray">No AC</Badge>}
                                {room.hasAttachedWashroom ? <Badge variant="blue">Washroom</Badge> : <Badge variant="gray">Shared</Badge>}
                                {isFull ? <Badge variant="red">Full</Badge> : <Badge variant="green">Available ({remaining})</Badge>}
                            </div>
                        </div>
                    </div>
                    {students.length > 0 && (
                        <button onClick={handleReset} className="btn btn-danger">
                            <MdRestartAlt size={18} /> Reset Room
                        </button>
                    )}
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginTop: 24 }}>
                    {[
                        { icon: MdPeople, label: 'Capacity', value: room.capacity, color: '#6366f1' },
                        { icon: MdPerson, label: 'Occupants', value: room.occupants, color: '#7c3aed' },
                        { icon: MdAcUnit, label: 'AC', value: room.hasAC ? 'Yes' : 'No', color: '#0284c7' },
                        { icon: MdBathtub, label: 'Washroom', value: room.hasAttachedWashroom ? 'Yes' : 'No', color: '#16a34a' },
                    ].map(({ icon: Ic, label, value, color }) => (
                        <div key={label} style={{ background: '#f8fafc', borderRadius: 12, padding: 16, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                            <Ic size={20} style={{ color, margin: '0 auto 4px' }} />
                            <div style={{ fontSize: 11, color: '#64748b' }}>{label}</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: '#1e293b' }}>{value}</div>
                        </div>
                    ))}
                </div>

                {/* Occupancy bar */}
                <div style={{ marginTop: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Occupancy</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{pct}%</span>
                    </div>
                    <div style={{ width: '100%', height: 8, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 99, width: `${pct}%`, background: isFull ? '#e11d48' : pct > 60 ? '#f59e0b' : '#22c55e', transition: 'width 0.5s ease' }} />
                    </div>
                </div>
            </div>

            {/* Occupants Table */}
            <div className="card animate-fade-in" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Current Occupants ({students.length})</h2>
                </div>
                {students.length === 0 ? (
                    <div className="empty-state" style={{ padding: 48 }}>
                        <div className="empty-state-icon"><MdPerson size={32} /></div>
                        <div className="empty-state-title">No occupants</div>
                        <div className="empty-state-desc">This room is currently empty.</div>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Roll No</th>
                                    <th>Phone</th>
                                    <th>Allocated</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((s) => (
                                    <tr key={s._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 32, height: 32, borderRadius: 99, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <MdPerson size={16} color="#6366f1" />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>{s.name}</div>
                                                    {s.email && <div style={{ fontSize: 12, color: '#94a3b8' }}>{s.email}</div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td><span style={{ fontWeight: 600 }}>{s.rollNo}</span></td>
                                        <td>{s.phone || '—'}</td>
                                        <td style={{ fontSize: 13, color: '#64748b' }}>{s.allocatedAt ? new Date(s.allocatedAt).toLocaleDateString() : '—'}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button onClick={() => handleDeallocate(s._id, s.name)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 12 }}>
                                                <MdLogout size={14} /> Checkout
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomDetail;
