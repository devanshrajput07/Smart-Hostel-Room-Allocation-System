# 🏨 Smart Hostel Room Allocation System

A full-stack hostel management dashboard built with the **MERN stack**. Features smart room allocation using an O(n) best-fit algorithm, student tracking, fee management, and activity logging.

---

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS v4     |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB (Mongoose ODM)              |
| Styling   | Custom CSS Design System            |
| Extras    | React Router, Axios, React Hot Toast, React Icons |

---

## 📁 Folder Structure

```
Smart-Hostel-Room-Allocation-System/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── roomController.js
│   │   ├── studentController.js
│   │   ├── feeController.js
│   │   └── activityController.js
│   ├── middleware/errorHandler.js
│   ├── models/
│   │   ├── Room.js
│   │   ├── Student.js
│   │   ├── Fee.js
│   │   └── ActivityLog.js
│   ├── routes/
│   │   ├── roomRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── feeRoutes.js
│   │   └── activityRoutes.js
│   ├── utils/allocator.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/roomApi.js
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── ToggleSwitch.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AddRoom.jsx
│   │   │   ├── RoomList.jsx
│   │   │   ├── RoomDetail.jsx
│   │   │   ├── Allocate.jsx
│   │   │   ├── Students.jsx
│   │   │   └── Fees.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### 1. Clone the repo
```bash
git clone https://github.com/devanshrajput07/Smart-Hostel-Room-Allocation-System.git
cd Smart-Hostel-Room-Allocation-System
```

### 2. Backend setup
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

The app will be running at **http://localhost:5173**

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=         # leave empty for dev, set backend URL for production
```

---

## 🌐 Live Demo

> _Coming soon — deploy backend on Render and frontend on Vercel._

---

## 👤 Author

**Devansh Rajput**  
GitHub: [@devanshrajput07](https://github.com/devanshrajput07)
