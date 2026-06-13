import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Learners from './pages/Learners';
import Staff from './pages/Staff';
import Attendance from './pages/Attendance';
import Results from './pages/Results';
import Infrastructure from './pages/Infrastructure';
import Textbooks from './pages/Textbooks';

export default function App() {
  return (
    <BrowserRouter>
      <div style={styles.layout}>
        <Sidebar />
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/learners" element={<Learners />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/results" element={<Results />} />
            <Route path="/infrastructure" element={<Infrastructure />} />
            <Route path="/textbooks" element={<Textbooks />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: '#F9FAFB' },
  main: { marginLeft: 240, flex: 1, minHeight: '100vh' },
};