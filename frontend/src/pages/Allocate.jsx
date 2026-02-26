import { useState } from 'react';
import { allocateStudent } from '../api/roomApi';
import ToggleSwitch from '../components/ToggleSwitch';
import Badge from '../components/Badge';
import toast from 'react-hot-toast';
import {
    MdSearch, MdCheckCircle, MdErrorOutline,
    MdMeetingRoom, MdPeople, MdAcUnit, MdBathtub, MdPerson,
} from 'react-icons/md';

const Allocate = () => {
    const [form, setForm] = useState({
        name: '', rollNo: '', phone: '', email: '',
        needsAC: false, needsWashroom: false,
    });
    const [errors, setErrors] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Student name is required';
        if (!form.rollNo.trim()) errs.rollNo = 'Roll number is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const { data } = await allocateStudent({
                name: form.name.trim(),
                rollNo: form.rollNo.trim(),
                phone: form.phone.trim(),
                email: form.email.trim(),
                needsAC: form.needsAC,
                needsWashroom: form.needsWashroom,
            });
            setResult(data);
            if (data.allocated) {
                toast.success(data.message);
                setForm({ name: '', rollNo: '', phone: '', email: '', needsAC: false, needsWashroom: false });
                setErrors({});
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Allocation failed');
            toast.error(err.response?.data?.message || 'Allocation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Smart Allocation</h1>
                <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>Enter student details and room requirements</p>
            </div>

            <div className="card animate-fade-in-up" style={{ padding: 32, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                        <MdPerson color="white" size={22} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Student & Room Details</h2>
                        <p style={{ fontSize: 12, color: '#94a3b8' }}>Required fields marked with *</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Student Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label className="form-label">Student Name *</label>
                            <input className={`form-input ${errors.name ? 'form-input-error' : ''}`} placeholder="e.g. Rahul Sharma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            {errors.name && <p style={{ fontSize: 12, color: '#e11d48', marginTop: 4 }}>⚠ {errors.name}</p>}
                        </div>
                        <div>
                            <label className="form-label">Roll Number *</label>
                            <input className={`form-input ${errors.rollNo ? 'form-input-error' : ''}`} placeholder="e.g. 2024CS001" value={form.rollNo} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} />
                            {errors.rollNo && <p style={{ fontSize: 12, color: '#e11d48', marginTop: 4 }}>⚠ {errors.rollNo}</p>}
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                        <div>
                            <label className="form-label">Phone</label>
                            <input className="form-input" placeholder="e.g. 9876543210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                        </div>
                        <div>
                            <label className="form-label">Email</label>
                            <input className="form-input" type="email" placeholder="e.g. rahul@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        </div>
                    </div>

                    {/* Toggles */}
                    <div style={{ padding: 20, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <ToggleSwitch id="needsAC" label="Requires Air Conditioning" enabled={form.needsAC} onChange={(v) => setForm({ ...form, needsAC: v })} />
                        <div style={{ borderTop: '1px solid #e2e8f0' }} />
                        <ToggleSwitch id="needsWashroom" label="Requires Attached Washroom" enabled={form.needsWashroom} onChange={(v) => setForm({ ...form, needsWashroom: v })} />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                        {loading ? (
                            <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Finding best room...</>
                        ) : (
                            <><MdSearch size={20} /> Allocate Student</>
                        )}
                    </button>
                </form>
            </div>

            {/* Error */}
            {error && (
                <div className="result-error animate-scale-in" style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <MdErrorOutline size={24} color="#e11d48" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#991b1b' }}>Error</h3>
                            <p style={{ fontSize: 14, color: '#be123c', marginTop: 2 }}>{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Success */}
            {result && !error && result.allocated && (
                <div className="result-success animate-scale-in">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(34,197,94,0.3)' }}>
                            <MdCheckCircle color="white" size={26} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#166534' }}>Room Allocated!</h3>
                            <p style={{ fontSize: 13, color: '#15803d' }}>{result.message}</p>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
                        {[
                            { icon: MdPerson, label: 'Student', value: result.data.name, color: '#7c3aed' },
                            { icon: MdMeetingRoom, label: 'Room', value: `#${result.room.roomNo}`, color: '#6366f1' },
                            { icon: MdPeople, label: 'Capacity', value: result.room.capacity, color: '#0284c7' },
                            { icon: MdAcUnit, label: 'AC', value: result.room.hasAC ? 'Yes' : 'No', color: '#0891b2' },
                        ].map(({ icon: Ic, label, value, color }) => (
                            <div key={label} style={{ background: 'white', borderRadius: 12, padding: 16, textAlign: 'center', border: '1px solid #dcfce7' }}>
                                <Ic size={20} style={{ color, margin: '0 auto 6px' }} />
                                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>{label}</div>
                                <div style={{ fontSize: 16, fontWeight: 800, color: '#1e293b' }}>{value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No room */}
            {result && !error && !result.allocated && (
                <div className="result-error animate-scale-in">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#f43f5e,#e11d48)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MdErrorOutline color="white" size={26} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#991b1b' }}>No Room Available</h3>
                            <p style={{ fontSize: 13, color: '#be123c' }}>{result.message}</p>
                        </div>
                    </div>
                    <div style={{ padding: 12, background: '#fee2e2', borderRadius: 10 }}>
                        <p style={{ fontSize: 13, color: '#991b1b' }}>Tip: Try removing AC or Washroom requirements.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Allocate;
