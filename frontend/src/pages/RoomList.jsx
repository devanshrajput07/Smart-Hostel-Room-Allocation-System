import { useEffect, useState } from 'react';
import { getRooms, deleteRoom, exportRoomsCSV } from '../api/roomApi';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import { MdSearch, MdDeleteOutline, MdMeetingRoom, MdInbox, MdDownload, MdFilterList } from 'react-icons/md';
import { TbAirConditioning } from 'react-icons/tb';
import { FaShower } from 'react-icons/fa';

const RoomList = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ hasAC: '', hasAttachedWashroom: '', availability: '' });

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (filters.hasAC) params.hasAC = filters.hasAC;
            if (filters.hasAttachedWashroom) params.hasAttachedWashroom = filters.hasAttachedWashroom;
            if (filters.availability) params.availability = filters.availability;
            const { data } = await getRooms(params);
            setRooms(data.data);
        } catch (err) {
            toast.error('Failed to fetch rooms');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRooms(); }, [filters]);

    const handleSearch = (e) => { e.preventDefault(); fetchRooms(); };

    const handleDelete = async (e, id, roomNo) => {
        e.stopPropagation();
        if (!window.confirm(`Delete Room ${roomNo}?`)) return;
        try { await deleteRoom(id); toast.success(`Room ${roomNo} deleted`); fetchRooms(); }
        catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    };

    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Room Inventory</h1>
                    <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>{rooms.length} rooms</p>
                </div>
                <a href={exportRoomsCSV()} download className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                    <MdDownload size={16} /> Export CSV
                </a>
            </div>

            {/* Search & Filters */}
            <div className="card" style={{ padding: 16, marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1, minWidth: 180 }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <MdSearch size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input className="form-input" style={{ paddingLeft: 36 }} type="number" placeholder="Room number..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary">Search</button>
                    {search && <button type="button" className="btn btn-secondary" onClick={() => { setSearch(''); fetchRooms(); }}>Clear</button>}
                </form>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    <MdFilterList size={16} color="#94a3b8" />
                    <select className="form-input" style={{ width: 'auto', padding: '8px 12px', fontSize: 12 }} value={filters.hasAC} onChange={(e) => setFilters({ ...filters, hasAC: e.target.value })}>
                        <option value="">All AC</option>
                        <option value="true">AC Only</option>
                        <option value="false">Non-AC</option>
                    </select>
                    <select className="form-input" style={{ width: 'auto', padding: '8px 12px', fontSize: 12 }} value={filters.hasAttachedWashroom} onChange={(e) => setFilters({ ...filters, hasAttachedWashroom: e.target.value })}>
                        <option value="">All Washroom</option>
                        <option value="true">Attached</option>
                        <option value="false">Shared</option>
                    </select>
                    <select className="form-input" style={{ width: 'auto', padding: '8px 12px', fontSize: 12 }} value={filters.availability} onChange={(e) => setFilters({ ...filters, availability: e.target.value })}>
                        <option value="">All Status</option>
                        <option value="available">Available</option>
                        <option value="full">Full</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', minHeight: '40vh', alignItems: 'center' }}><Spinner size="lg" /></div>
            ) : rooms.length === 0 ? (
                <div className="card"><div className="empty-state"><div className="empty-state-icon"><MdInbox size={36} /></div><div className="empty-state-title">No rooms found</div><div className="empty-state-desc">{search ? 'Try different filters.' : 'Add your first room.'}</div></div></div>
            ) : (
                <div className="card animate-fade-in" style={{ overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead><tr><th>Room</th><th>Capacity</th><th>Occupancy</th><th>Amenities</th><th>Status</th><th style={{ textAlign: 'right' }}>Action</th></tr></thead>
                            <tbody>
                                {rooms.map((room) => {
                                    const remaining = room.capacity - room.occupants;
                                    const isFull = remaining <= 0;
                                    const pct = Math.round((room.occupants / room.capacity) * 100);
                                    return (
                                        <tr key={room._id} onClick={() => navigate(`/rooms/${room._id}`)} style={{ cursor: 'pointer' }}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        <MdMeetingRoom color="white" size={16} />
                                                    </div>
                                                    <span style={{ fontWeight: 700, color: '#1e293b' }}>#{room.roomNo}</span>
                                                </div>
                                            </td>
                                            <td><span style={{ fontWeight: 600 }}>{room.capacity}</span> <span style={{ color: '#94a3b8' }}>beds</span></td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%`, background: isFull ? '#e11d48' : pct > 60 ? '#f59e0b' : '#22c55e' }} /></div>
                                                    <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{room.occupants}/{room.capacity}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                    {room.hasAC ? <Badge variant="green"><TbAirConditioning size={12} /> AC</Badge> : <Badge variant="gray">No AC</Badge>}
                                                    {room.hasAttachedWashroom ? <Badge variant="blue"><FaShower size={10} /> Washroom</Badge> : <Badge variant="gray">Shared</Badge>}
                                                </div>
                                            </td>
                                            <td>{isFull ? <Badge variant="red">Full</Badge> : <Badge variant="green">Available ({remaining})</Badge>}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button onClick={(e) => handleDelete(e, room._id, room.roomNo)} className="btn btn-danger" style={{ padding: '6px 10px' }} title="Delete">
                                                    <MdDeleteOutline size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomList;
