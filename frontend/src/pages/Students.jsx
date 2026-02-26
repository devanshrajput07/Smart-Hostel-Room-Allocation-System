import { useEffect, useState } from 'react';
import { getStudents, deallocateStudent, exportStudentsCSV } from '../api/roomApi';
import Badge from '../components/Badge';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import { MdSearch, MdPerson, MdLogout, MdInbox, MdDownload } from 'react-icons/md';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (filter === 'allocated') params.allocated = 'true';
            if (filter === 'unallocated') params.allocated = 'false';
            const { data } = await getStudents(params);
            setStudents(data.data);
        } catch (err) {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStudents(); }, [filter]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchStudents();
    };

    const handleDeallocate = async (id, name) => {
        if (!window.confirm(`Checkout ${name}?`)) return;
        try {
            await deallocateStudent(id);
            toast.success(`${name} checked out`);
            fetchStudents();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        }
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Students</h1>
                    <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>{students.length} students registered</p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <a href={exportStudentsCSV()} download className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                        <MdDownload size={16} /> Export CSV
                    </a>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="card" style={{ padding: 16, marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1, minWidth: 200 }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <MdSearch size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input className="form-input" style={{ paddingLeft: 36 }} placeholder="Search name or roll no..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>
                <div style={{ display: 'flex', gap: 4 }}>
                    {['all', 'allocated', 'unallocated'].map((f) => (
                        <button key={f} onClick={() => setFilter(f)} className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '8px 14px', fontSize: 12, textTransform: 'capitalize' }}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', minHeight: '40vh', alignItems: 'center' }}><Spinner size="lg" /></div>
            ) : students.length === 0 ? (
                <div className="card"><div className="empty-state"><div className="empty-state-icon"><MdInbox size={36} /></div><div className="empty-state-title">No students found</div><div className="empty-state-desc">Students appear here after allocation.</div></div></div>
            ) : (
                <div className="card animate-fade-in" style={{ overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Roll No</th>
                                    <th>Phone</th>
                                    <th>Room</th>
                                    <th>Since</th>
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
                                        <td>
                                            {s.room ? (
                                                <Badge variant="purple">Room #{s.room.roomNo}</Badge>
                                            ) : (
                                                <Badge variant="gray">Not Allocated</Badge>
                                            )}
                                        </td>
                                        <td style={{ fontSize: 13, color: '#64748b' }}>
                                            {s.allocatedAt ? new Date(s.allocatedAt).toLocaleDateString() : '—'}
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            {s.room ? (
                                                <button onClick={() => handleDeallocate(s._id, s.name)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 12 }}>
                                                    <MdLogout size={14} /> Checkout
                                                </button>
                                            ) : (
                                                <span style={{ fontSize: 12, color: '#94a3b8' }}>—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;
