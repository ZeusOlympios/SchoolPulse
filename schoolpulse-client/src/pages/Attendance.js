import React, { useEffect, useState } from 'react';
import { attendanceService, learnerService, staffService } from '../services/api';

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [learners, setLearners] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    attendanceType: 'Learner',
    learnerId: '',
    staffId: '',
    status: '',
    reason: '',
    recordedBy: '',
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [att, learn, stf] = await Promise.all([
        attendanceService.getAll(),
        learnerService.getAll(),
        staffService.getAll(),
      ]);
      setAttendance(att.data);
      setLearners(learn.data);
      setStaff(stf.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        learnerId: form.attendanceType === 'Learner' ? parseInt(form.learnerId) : null,
        staffId: form.attendanceType === 'Staff' ? parseInt(form.staffId) : null,
      };
      await attendanceService.create(payload);
      setShowForm(false);
      resetForm();
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this attendance record?')) {
      await attendanceService.delete(id);
      fetchAll();
    }
  };

  const resetForm = () => setForm({
    date: new Date().toISOString().split('T')[0],
    attendanceType: 'Learner',
    learnerId: '',
    staffId: '',
    status: '',
    reason: '',
    recordedBy: '',
  });

  const statusColor = (status) => {
    const map = {
      Present: { background: '#F0FDF4', color: '#16A34A' },
      Absent: { background: '#FEF2F2', color: '#EF4444' },
      Late: { background: '#FFFBEB', color: '#D97706' },
      Excused: { background: '#EEF2FF', color: '#4F46E5' },
    };
    return map[status] || { background: '#F3F4F6', color: '#6B7280' };
  };

  if (loading) return <div style={styles.loading}>Loading attendance...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Attendance</h1>
          <p style={styles.sub}>{attendance.length} records</p>
        </div>
        <button style={styles.addBtn} onClick={() => { resetForm(); setShowForm(true); }}>
          + Mark Attendance
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Mark Attendance</h2>
          <div style={styles.formGrid}>
            <FormInput label="Date" type="date" value={form.date} onChange={v => setForm({ ...form, date: v })} />
            <FormSelect label="Type" value={form.attendanceType} onChange={v => setForm({ ...form, attendanceType: v })} options={['Learner', 'Staff']} />
            {form.attendanceType === 'Learner' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>Learner</label>
                <select value={form.learnerId} onChange={e => setForm({ ...form, learnerId: e.target.value })}
                  style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #E5E7EB', fontSize: 14 }}>
                  <option value="">Select learner...</option>
                  {learners.map(l => <option key={l.id} value={l.id}>{l.firstName} {l.lastName} — {l.grade}</option>)}
                </select>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>Staff Member</label>
                <select value={form.staffId} onChange={e => setForm({ ...form, staffId: e.target.value })}
                  style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #E5E7EB', fontSize: 14 }}>
                  <option value="">Select staff...</option>
                  {staff.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} — {s.jobTitle}</option>)}
                </select>
              </div>
            )}
            <FormSelect label="Status" value={form.status} onChange={v => setForm({ ...form, status: v })} options={['Present', 'Absent', 'Late', 'Excused']} />
            <FormInput label="Reason (optional)" value={form.reason} onChange={v => setForm({ ...form, reason: v })} />
            <FormInput label="Recorded By" value={form.recordedBy} onChange={v => setForm({ ...form, recordedBy: v })} />
          </div>
          <div style={styles.formActions}>
            <button style={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
            <button style={styles.saveBtn} onClick={handleSubmit}>Save</button>
          </div>
        </div>
      )}

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Reason</th>
              <th style={styles.th}>Recorded By</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length === 0 ? (
              <tr><td colSpan={7} style={styles.empty}>No attendance records yet.</td></tr>
            ) : (
              attendance.map((a) => (
                <tr key={a.id} style={styles.tr}>
                  <td style={styles.td}>{new Date(a.date).toLocaleDateString('en-ZA')}</td>
                  <td style={styles.td}>{a.attendanceType}</td>
                  <td style={styles.td}>
                    {a.learner ? `${a.learner.firstName} ${a.learner.lastName}` : ''}
                    {a.staff ? `${a.staff.firstName} ${a.staff.lastName}` : ''}
                  </td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...statusColor(a.status) }}>{a.status}</span>
                  </td>
                  <td style={styles.td}>{a.reason || '—'}</td>
                  <td style={styles.td}>{a.recordedBy}</td>
                  <td style={styles.td}>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(a.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FormInput({ label, value, onChange, type = 'text' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #E5E7EB', fontSize: 14, outline: 'none' }} />
    </div>
  );
}

function FormSelect({ label, value, onChange, options }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #E5E7EB', fontSize: 14, outline: 'none' }}>
        <option value="">Select...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

const styles = {
  page: { padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  heading: { fontSize: 24, fontWeight: 600, color: '#111827', margin: 0 },
  sub: { fontSize: 14, color: '#6B7280', margin: '4px 0 0' },
  addBtn: { background: '#4F46E5', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  formCard: { background: '#fff', borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  formTitle: { fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: '1rem' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: '1.5rem' },
  formActions: { display: 'flex', gap: 12, justifyContent: 'flex-end' },
  saveBtn: { background: '#4F46E5', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  cancelBtn: { background: '#fff', color: '#374151', border: '1px solid #E5E7EB', borderRadius: 8, padding: '10px 24px', fontSize: 14, cursor: 'pointer' },
  tableWrap: { background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#F9FAFB' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tr: { borderTop: '1px solid #F3F4F6' },
  td: { padding: '14px 16px', fontSize: 14, color: '#374151' },
  empty: { padding: '3rem', textAlign: 'center', color: '#9CA3AF', fontSize: 14 },
  badge: { padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 },
  deleteBtn: { background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer' },
  loading: { padding: '2rem', color: '#6B7280' },
};