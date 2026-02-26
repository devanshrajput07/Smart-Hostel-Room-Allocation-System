const colorMap = {
    indigo: { bg: '#eef2ff', icon: '#6366f1' },
    emerald: { bg: '#dcfce7', icon: '#16a34a' },
    sky: { bg: '#e0f2fe', icon: '#0284c7' },
    amber: { bg: '#fef3c7', icon: '#d97706' },
    rose: { bg: '#fee2e2', icon: '#e11d48' },
    violet: { bg: '#ede9fe', icon: '#7c3aed' },
};

const StatCard = ({ icon: Icon, label, value, color = 'indigo', className = '' }) => {
    const c = colorMap[color] || colorMap.indigo;

    return (
        <div className={`stat-card ${className}`}>
            <div className="stat-card-icon" style={{ background: c.bg }}>
                <Icon size={22} style={{ color: c.icon }} />
            </div>
            <div>
                <div className="stat-card-value">{value}</div>
                <div className="stat-card-label">{label}</div>
            </div>
        </div>
    );
};

export default StatCard;
