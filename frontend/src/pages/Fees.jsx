import { useEffect, useState } from 'react';
import { getFees, getFeeStats, createFee, markFeePaid, deleteFee, getStudents } from '../api/roomApi';
import Badge from '../components/Badge';
import Spinner from '../components/Spinner';
import StatCard from '../components/StatCard';
import toast from 'react-hot-toast';
import { MdPayment, MdCheckCircle, MdAdd, MdDelete, MdAttachMoney, MdWarning, MdPendingActions, MdInbox } from 'react-icons/md';

const Fees = () => {
    const [fees, setFees] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [students, setStudents] = useState([]);
    const [filter, setFilter] = useState('');
    const [form, setForm] = useState({ studentId: '', amount: '', description: 'Hostel Fee', dueDate: '' });

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [feesRes, statsRes] = await Promise.all([
                getFees(filter ? { status: filter } : {}),
                getFeeStats(),
            ]);
            setFees(feesRes.data.data);
            setStats(statsRes.data.data);
        } catch (err) {
            toast.error('Failed to load fee data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, [filter]);

    const openForm = async () => {
        try {
            const { data } = await getStudents({ allocated: 'true' });
            setStudents(data.data);
            setShowForm(true);
        } catch (err) {
            toast.error('Failed to load students');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.studentId || !form.amount || !form.dueDate) {
            toast.error('Fill all required fields');
            return;
        }
        try {
            await createFee({ studentId: form.studentId, amount: Number(form.amount), description: form.description, dueDate: form.dueDate });
            toast.success('Fee created');
            setShowForm(false);
            setForm({ studentId: '', amount: '', description: 'Hostel Fee', dueDate: '' });
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        }
    };

    const handlePay = async (id) => {
        try {
            await markFeePaid(id);
            toast.success('Fee marked as paid');
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this fee record?')) return;
        try {
            await deleteFee(id);
            toast.success('Fee deleted');
            fetchAll();
        } catch (err) {
            toast.error('Failed');
        }
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', minHeight: '60vh', alignItems: 'center' }}><Spinner size="lg" /></div>;

    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Fee Management</h1>
                    <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>Track and manage hostel fee payments</p>
                </div>
                <button onClick={openForm} className="btn btn-primary"><MdAdd size={18} /> Create Fee</button>
            </div>

            {/* Stats */}
            {stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
                    <StatCard icon={MdAttachMoney} label="Total Fees" value={`₹${stats.totalAmount.toLocaleString()}`} color="indigo" className="animate-fade-in-up stagger-1" />
                    <StatCard icon={MdCheckCircle} label={`Paid (${stats.paid})`} value={`₹${stats.paidAmount.toLocaleString()}`} color="emerald" className="animate-fade-in-up stagger-2" />
                    <StatCard icon={MdPendingActions} label={`Pending (${stats.pending})`} value={`₹${stats.pendingAmount.toLocaleString()}`} color="amber" className="animate-fade-in-up stagger-3" />
                    <StatCard icon={MdWarning} label={`Overdue (${stats.overdue})`} value={`₹${stats.overdueAmount.toLocaleString()}`} color="rose" className="animate-fade-in-up stagger-4" />
                </div>
            )}

            {/* Create Form Modal */}
            {showForm && (
                <div className="card animate-scale-in" style={{ padding: 28, marginBottom: 24 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 20 }}>New Fee Entry</h3>
                    <form onSubmit={handleCreate}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                            <div>
                                <label className="form-label">Student *</label>
                                <select className="form-input" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
                                    <option value="">Select student...</option>
                                    {students.map((s) => <option key={s._id} value={s._id}>{s.name} ({s.rollNo})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Amount (₹) *</label>
                                <input className="form-input" type="number" placeholder="e.g. 5000" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                            <div>
                                <label className="form-label">Description</label>
                                <input className="form-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                            </div>
                            <div>
                                <label className="form-label">Due Date *</label>
                                <input className="form-input" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button type="submit" className="btn btn-primary">Create Fee</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filter */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                {['', 'Pending', 'Paid', 'Overdue'].map((f) => (
                    <button key={f} onClick={() => setFilter(f)} className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '8px 14px', fontSize: 12 }}>
                        {f || 'All'}
                    </button>
                ))}
            </div>

            {/* Table */}
            {fees.length === 0 ? (
                <div className="card"><div className="empty-state"><div className="empty-state-icon"><MdInbox size={36} /></div><div className="empty-state-title">No fee records</div><div className="empty-state-desc">Create a fee entry to get started.</div></div></div>
            ) : (
                <div className="card animate-fade-in" style={{ overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fees.map((f) => (
                                    <tr key={f._id}>
                                        <td>
                                            <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>{f.student?.name || 'Unknown'}</div>
                                            <div style={{ fontSize: 12, color: '#94a3b8' }}>{f.student?.rollNo}</div>
                                        </td>
                                        <td>{f.description}</td>
                                        <td style={{ fontWeight: 700, color: '#1e293b' }}>₹{f.amount.toLocaleString()}</td>
                                        <td style={{ fontSize: 13, color: '#64748b' }}>{new Date(f.dueDate).toLocaleDateString()}</td>
                                        <td>
                                            <Badge variant={f.status === 'Paid' ? 'green' : f.status === 'Overdue' ? 'red' : 'amber'}>
                                                {f.status}
                                            </Badge>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                                {f.status !== 'Paid' && (
                                                    <button onClick={() => handlePay(f._id)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 12 }}>
                                                        <MdCheckCircle size={14} /> Pay
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(f._id)} className="btn btn-danger" style={{ padding: '6px 10px', fontSize: 12 }}>
                                                    <MdDelete size={14} />
                                                </button>
                                            </div>
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

export default Fees;
