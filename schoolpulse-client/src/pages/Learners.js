import React, { useEffect, useState } from 'react';
import { learnerService } from '../services/api';

export default function Learners() {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    firstName: '', lastName: '', gender: '', dateOfBirth: '',
    nationality: 'South African', homeLanguage: '', grade: '',
    className: '', guardianName: '', guardianPhone: '',
    guardianEmail: '', guardianRelationship: '',
    address: '', town: '', province: '',
  });

  useEffect(() => { fetchLearners(); }, []);

  const fetchLearners = async () => {
    try {
      const res = await learnerService.getAll();
      setLearners(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const val = e.target.value;
    setSearch(val);
    if (val.length > 1) {
      const res = await learnerService.search(val);
      setLearners(res.data);
    } else {
      fetchLearners();
    }
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await learnerService.update(editing.id, { ...form, id: editing.id });
      } else {
        await learnerService.create(form);
      }
      setShowForm(false);
      setEditing(null);
      resetForm();
      fetchLearners();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (learner) => {
    setEditing(learner);
    setForm({
      firstName: learner.firstName, lastName: learner.lastName,
      gender: learner.gender, dateOfBirth: learner.dateOfBirth?.split('T')[0],
      nationality: learner.nationality, homeLanguage: learner.homeLanguage,
      grade: learner.grade, className: learner.className,
      guardianName: learner.guardianName, guardianPhone: learner.guardianPhone,
      guardianEmail: learner.guardianEmail, guardianRelationship: learner.guardianRelationship,
      address: learner.address, town: learner.town, province: learner.province,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this learner?')) {
      await learnerService.delete(id);
      fetchLearners();
    }
  };

  const resetForm = () => setForm({
    firstName: '', lastName: '', gender: '', dateOfBirth: '',
    nationality: 'South African', homeLanguage: '', grade: '',
    className: '', guardianName: '', guardianPhone: '',
    guardianEmail: '', guardianRelationship: '',
    address: '', town: '', province: '',
  });

  const grades = ['Grade R', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'];
  const provinces = ['Gauteng', 'Mpumalanga', 'Limpopo', 'KwaZulu-Natal', 'Western Cape', 'Eastern Cape', 'Northern Cape', 'North West', 'Free State'];

  if (loading) return <div style={styles.loading}>Loading learners...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Learners</h1>
          <p style={styles.sub}>{learners.length} registered learners</p>
        </div>
        <button style={styles.addBtn} onClick={() => { resetForm(); setEditing(null); setShowForm(true); }}>
          + Add Learner
        </button>
      </div>

      <input
        style={styles.search}
        placeholder="Search by name..."
        value={search}
        onChange={handleSearch}
      />

      {/* Form */}
      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>{editing ? 'Edit Learner' : 'Add New Learner'}</h2>
          <div style={styles.formGrid}>
            <FormInput label="First Name" value={form.firstName} onChange={v => setForm({ ...form, firstName: v })} />
            <FormInput label="Last Name" value={form.lastName} onChange={v => setForm({ ...form, lastName: v })} />
            <FormSelect label="Gender" value={form.gender} onChange={v => setForm({ ...form, gender: v })} options={['Male', 'Female', 'Other']} />
            <FormInput label="Date of Birth" type="date" value={form.dateOfBirth} onChange={v => setForm({ ...form, dateOfBirth: v })} />
            <FormInput label="Nationality" value={form.nationality} onChange={v => setForm({ ...form, nationality: v })} />
            <FormInput label="Home Language" value={form.homeLanguage} onChange={v => setForm({ ...form, homeLanguage: v })} />
            <FormSelect label="Grade" value={form.grade} onChange={v => setForm({ ...form, grade: v })} options={grades} />
            <FormInput label="Class Name" value={form.className} onChange={v => setForm({ ...form, className: v })} />
            <FormInput label="Guardian Name" value={form.guardianName} onChange={v => setForm({ ...form, guardianName: v })} />
            <FormInput label="Guardian Phone" value={form.guardianPhone} onChange={v => setForm({ ...form, guardianPhone: v })} />
            <FormInput label="Guardian Email" value={form.guardianEmail} onChange={v => setForm({ ...form, guardianEmail: v })} />
            <FormInput label="Guardian Relationship" value={form.guardianRelationship} onChange={v => setForm({ ...form, guardianRelationship: v })} />
            <FormInput label="Address" value={form.address} onChange={v => setForm({ ...form, address: v })} />
            <FormInput label="Town" value={form.town} onChange={v => setForm({ ...form, town: v })} />
            <FormSelect label="Province" value={form.province} onChange={v => setForm({ ...form, province: v })} options={provinces} />
          </div>
          <div style={styles.formActions}>
            <button style={styles.cancelBtn} onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
            <button style={styles.saveBtn} onClick={handleSubmit}>{editing ? 'Update' : 'Save'}</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Grade</th>
              <th style={styles.th}>Class</th>
              <th style={styles.th}>Gender</th>
              <th style={styles.th}>Guardian</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {learners.length === 0 ? (
              <tr><td colSpan={7} style={styles.empty}>No learners found. Add your first learner above.</td></tr>
            ) : (
              learners.map((l) => (
                <tr key={l.id} style={styles.tr}>
                  <td style={styles.td}>{l.firstName} {l.lastName}</td>
                  <td style={styles.td}>{l.grade}</td>
                  <td style={styles.td}>{l.className}</td>
                  <td style={styles.td}>{l.gender}</td>
                  <td style={styles.td}>{l.guardianName}</td>
                  <td style={styles.td}>{l.guardianPhone}</td>
                  <td style={styles.td}>
                    <button style={styles.editBtn} onClick={() => handleEdit(l)}>Edit</button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(l.id)}>Remove</button>
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
  search: { width: '100%', maxWidth: 400, padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 14, marginBottom: '1.5rem', outline: 'none' },
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
  editBtn: { background: '#EEF2FF', color: '#4F46E5', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', marginRight: 8 },
  deleteBtn: { background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer' },
  loading: { padding: '2rem', color: '#6B7280' },
};