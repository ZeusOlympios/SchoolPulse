import React, { useEffect, useState } from 'react';
import { learnerService, staffService, attendanceService, infrastructureService, textbookService } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function Dashboard() {
  const [learnerStats, setLearnerStats] = useState(null);
  const [staffStats, setStaffStats] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [infraStats, setInfraStats] = useState(null);
  const [textbookStats, setTextbookStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [learner, staff, attendance, infra, textbook] = await Promise.all([
          learnerService.getStats(),
          staffService.getStats(),
          attendanceService.getStats(),
          infrastructureService.getStats(),
          textbookService.getStats(),
        ]);
        setLearnerStats(learner.data);
        setStaffStats(staff.data);
        setAttendanceStats(attendance.data);
        setInfraStats(infra.data);
        setTextbookStats(textbook.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return (
    <div style={styles.loadingWrap}>
      <div style={styles.loadingText}>Loading SchoolPulse dashboard...</div>
    </div>
  );

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Dashboard</h1>
      <p style={styles.subheading}>School overview at a glance</p>

      {/* Stat Cards */}
      <div style={styles.cardGrid}>
        <StatCard label="Total Learners" value={learnerStats?.total ?? 0} color="#4F46E5" />
        <StatCard label="Total Staff" value={staffStats?.total ?? 0} color="#10B981" />
        <StatCard label="Educators" value={staffStats?.educators ?? 0} color="#06B6D4" />
        <StatCard label="Present Today" value={attendanceStats?.presentToday ?? 0} color="#F59E0B" />
        <StatCard label="Absent Today" value={attendanceStats?.absentToday ?? 0} color="#EF4444" />
        <StatCard label="Facilities" value={infraStats?.total ?? 0} color="#8B5CF6" />
      </div>

      {/* Charts */}
      <div style={styles.chartGrid}>
        {/* Learners by Grade */}
        {learnerStats?.byGrade?.length > 0 && (
          <div style={styles.chartCard}>
            <h2 style={styles.chartTitle}>Learners by grade</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={learnerStats.byGrade}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="grade" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Learners by Gender */}
        {learnerStats?.byGender?.length > 0 && (
          <div style={styles.chartCard}>
            <h2 style={styles.chartTitle}>Learners by gender</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={learnerStats.byGender} dataKey="count" nameKey="gender" cx="50%" cy="50%" outerRadius={80} label>
                  {learnerStats.byGender.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Infrastructure by Condition */}
        {infraStats?.byCondition?.length > 0 && (
          <div style={styles.chartCard}>
            <h2 style={styles.chartTitle}>Facilities by condition</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={infraStats.byCondition}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="condition" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Textbook Stock Summary */}
        {textbookStats && (
          <div style={styles.chartCard}>
            <h2 style={styles.chartTitle}>Textbook stock summary</h2>
            <div style={styles.stockGrid}>
              <StockItem label="Total Stock" value={textbookStats.totalStock} color="#4F46E5" />
              <StockItem label="Issued" value={textbookStats.totalIssued} color="#10B981" />
              <StockItem label="Damaged" value={textbookStats.totalDamaged} color="#F59E0B" />
              <StockItem label="Lost" value={textbookStats.totalLost} color="#EF4444" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ ...styles.statCard, borderTop: `4px solid ${color}` }}>
      <p style={styles.statValue}>{value}</p>
      <p style={styles.statLabel}>{label}</p>
    </div>
  );
}

function StockItem({ label, value, color }) {
  return (
    <div style={styles.stockItem}>
      <p style={{ ...styles.stockValue, color }}>{value}</p>
      <p style={styles.stockLabel}>{label}</p>
    </div>
  );
}

const styles = {
  page: { padding: '2rem' },
  heading: { fontSize: 24, fontWeight: 600, color: '#111827', marginBottom: 4 },
  subheading: { fontSize: 14, color: '#6B7280', marginBottom: '2rem' },
  loadingWrap: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' },
  loadingText: { fontSize: 16, color: '#6B7280' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: '2rem' },
  statCard: { background: '#fff', borderRadius: 8, padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  statValue: { fontSize: 32, fontWeight: 700, color: '#111827', margin: 0 },
  statLabel: { fontSize: 13, color: '#6B7280', margin: '4px 0 0' },
  chartGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 },
  chartCard: { background: '#fff', borderRadius: 8, padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  chartTitle: { fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: '1rem' },
  stockGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  stockItem: { textAlign: 'center', padding: '1rem', background: '#F9FAFB', borderRadius: 8 },
  stockValue: { fontSize: 28, fontWeight: 700, margin: 0 },
  stockLabel: { fontSize: 12, color: '#6B7280', margin: '4px 0 0' },
};