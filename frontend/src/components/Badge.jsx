const Badge = ({ variant = 'gray', children }) => {
    return <span className={`badge badge-${variant}`}>{children}</span>;
};

export default Badge;
