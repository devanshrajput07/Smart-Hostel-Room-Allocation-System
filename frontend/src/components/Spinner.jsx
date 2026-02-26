const Spinner = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: { width: 20, height: 20 },
        md: { width: 32, height: 32 },
        lg: { width: 44, height: 44 },
    };
    const s = sizes[size] || sizes.md;

    return (
        <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner" style={{ width: s.width, height: s.height }} />
        </div>
    );
};

export default Spinner;
