const ToggleSwitch = ({ label, enabled, onChange, id }) => {
    return (
        <label
            htmlFor={id}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '2px 0' }}
        >
            <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{label}</span>
            <div
                className={`toggle-track ${enabled ? 'active' : ''}`}
                onClick={() => onChange(!enabled)}
            >
                <div className="toggle-thumb" />
            </div>
            <input
                type="checkbox"
                id={id}
                checked={enabled}
                onChange={(e) => onChange(e.target.checked)}
                style={{ display: 'none' }}
            />
        </label>
    );
};

export default ToggleSwitch;
