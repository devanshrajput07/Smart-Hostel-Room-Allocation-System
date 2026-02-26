import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddRoom from './pages/AddRoom';
import RoomList from './pages/RoomList';
import RoomDetail from './pages/RoomDetail';
import Allocate from './pages/Allocate';
import Students from './pages/Students';
import Fees from './pages/Fees';

function App() {
    return (
        <Router>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3500,
                    style: {
                        fontFamily: '"Inter", sans-serif',
                        fontSize: 14,
                        borderRadius: 12,
                        padding: '12px 16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    },
                    success: {
                        style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' },
                        iconTheme: { primary: '#16a34a', secondary: '#f0fdf4' },
                    },
                    error: {
                        style: { background: '#fff1f2', color: '#9f1239', border: '1px solid #fecdd3' },
                        iconTheme: { primary: '#e11d48', secondary: '#fff1f2' },
                    },
                }}
            />
            <div className="app-shell">
                <Navbar />
                <div className="main-content has-sidebar">
                    <div className="page-wrapper">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/add-room" element={<AddRoom />} />
                            <Route path="/rooms" element={<RoomList />} />
                            <Route path="/rooms/:id" element={<RoomDetail />} />
                            <Route path="/allocate" element={<Allocate />} />
                            <Route path="/students" element={<Students />} />
                            <Route path="/fees" element={<Fees />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;
