import { useState } from 'react';
import { createRoom } from '../api/roomApi';
import ToggleSwitch from '../components/ToggleSwitch';
import toast from 'react-hot-toast';
import { MdAddHome, MdCheckCircle } from 'react-icons/md';

const AddRoom = () => {
    const [form, setForm] = useState({
        roomNo: '',
        capacity: '',
        hasAC: false,
        hasAttachedWashroom: false,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errs = {};
        if (!form.roomNo || isNaN(form.roomNo) || Number(form.roomNo) <= 0)
            errs.roomNo = 'Enter a valid room number';
        if (!form.capacity || isNaN(form.capacity) || Number(form.capacity) < 1)
            errs.capacity = 'Capacity must be at least 1';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await createRoom({
                roomNo: Number(form.roomNo),
                capacity: Number(form.capacity),
                hasAC: form.hasAC,
                hasAttachedWashroom: form.hasAttachedWashroom,
            });
            toast.success(`Room ${form.roomNo} created successfully!`);
            setForm({ roomNo: '', capacity: '', hasAC: false, hasAttachedWashroom: false });
            setErrors({});
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add room');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    Add Room
                </h1>
                <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>
                    Register a new room to the hostel inventory
                </p>
            </div>

            {/* Form Card */}
            <div className="card animate-fade-in-up" style={{ padding: 32 }}>
                {/* Card Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                    <div style={{
                        width: 42, height: 42, borderRadius: 12,
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
                    }}>
                        <MdAddHome color="white" size={22} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Room Details</h2>
                        <p style={{ fontSize: 12, color: '#94a3b8' }}>Fill in the room information</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Room Number */}
                    <div style={{ marginBottom: 20 }}>
                        <label className="form-label" htmlFor="roomNo">Room Number</label>
                        <input
                            id="roomNo"
                            type="number"
                            placeholder="e.g. 101"
                            value={form.roomNo}
                            onChange={(e) => setForm({ ...form, roomNo: e.target.value })}
                            className={`form-input ${errors.roomNo ? 'form-input-error' : ''}`}
                        />
                        {errors.roomNo && (
                            <p style={{ fontSize: 12, color: '#e11d48', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                                ⚠ {errors.roomNo}
                            </p>
                        )}
                    </div>

                    {/* Capacity */}
                    <div style={{ marginBottom: 20 }}>
                        <label className="form-label" htmlFor="capacity">Capacity (beds)</label>
                        <input
                            id="capacity"
                            type="number"
                            placeholder="e.g. 4"
                            value={form.capacity}
                            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                            className={`form-input ${errors.capacity ? 'form-input-error' : ''}`}
                        />
                        {errors.capacity && (
                            <p style={{ fontSize: 12, color: '#e11d48', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                                ⚠ {errors.capacity}
                            </p>
                        )}
                    </div>

                    {/* Toggles */}
                    <div style={{
                        padding: 20, borderRadius: 12, background: '#f8fafc',
                        border: '1px solid #e2e8f0', marginBottom: 24,
                        display: 'flex', flexDirection: 'column', gap: 16,
                    }}>
                        <ToggleSwitch
                            id="hasAC"
                            label="Air Conditioning (AC)"
                            enabled={form.hasAC}
                            onChange={(val) => setForm({ ...form, hasAC: val })}
                        />
                        <div style={{ borderTop: '1px solid #e2e8f0' }} />
                        <ToggleSwitch
                            id="hasWashroom"
                            label="Attached Washroom"
                            enabled={form.hasAttachedWashroom}
                            onChange={(val) => setForm({ ...form, hasAttachedWashroom: val })}
                        />
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                        {loading ? (
                            <>
                                <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                                Adding Room...
                            </>
                        ) : (
                            <>
                                <MdCheckCircle size={20} />
                                Add Room
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddRoom;
