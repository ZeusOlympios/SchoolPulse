import React, { useEffect, useState } from 'react';
import { staffService } from '../services/api';

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    firstName: '', lastName: '', gender: '', dateOfBirth: '',
    idNumber: '', nationality: 'South African', homeLanguage: '',
    staffType: '', jobTitle: '', department: '',
    employmentStatus: '', appointmentDate: '', persal: '',
    qualificationLevel: '', subjectsTaught: '', gradesTaught: '',
    phone: '', email: '', address: '', province: '',
  });

  useEffect(() => { fetchStaff(); }, []);

  const fetchStaff = async () => {
    try {
      const res = await staffService.getAll();
      setStaff(res.data);
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
      const res = await staffService.search(val);
      setStaff(res.data);
    } else {
      fetchStaff();
    }
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await staffService.update(editing.id, { ...form, id: editing.id });
      } else {
        await staffService.create(form);
      }
      setShowForm(false);
      setEditing(null);
      resetForm();
      fetchStaff();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (member) => {
    setEditing(member);
    setForm({
      firstName: member.firstName, lastName: member.lastName,
      gender: member.gender, dateOfBirth: member.dateOfBirth?.split('T')[0],
      idNumber: member.idNumber, nationality: member.nationality,
      homeLanguage: member.homeLanguage, staffType: member.staffType,
      jobTitle: member.jobTitle, department: member.department,
      employmentStatus: member.employmentStatus,
      appointmentDate: member.appointmentDate?.split('T')[0],
      persal: member.persal, qualificationLevel: member.qualificationLevel || '',
      subjectsTaught: member.subjectsTaught || '',
      gradesTaught: member.gradesTaught || '',
      phone: member.phone, email: member.email,
      address: member.address, province: member.province,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this staff member?')) {
      await staffService.delete(id);
      fetchStaff();
    }
  };

  const resetForm = () => setForm({
    firstName: '', lastName: '', gender: '', dateOfBirth: '',
    idNumber: '', nationality: 'South African', homeLanguage: '',
    staffType: '', jobTitle: '', department: '',
    employmentStatus: '', appointmentDate: '', persal: '',
    qualificationLevel: '', subjectsTaught: '', gradesTaught: '',
    phone: '', email: '', address: '', province: '',
  });

  const provinces = ['Gauteng', 'Mpumalanga', 'Limpopo', 'KwaZulu-Natal', 'Western Cape', 'Eastern Cape', 'Northern Cape', 'North West', 'Free State'];

  if (loading) return <div style={styles.loading}>Loading staff...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Staff</h1>
          <p style={styles.sub}>{staff.length} staff members</p>
        </div>
        <button style={styles.addBtn} onClick={() => { resetForm(); setEditing(null); setShowForm(true); }}>
          + Add Staff
        </button>
      </div>

      <input
        style={styles.search}
        placeholder="Search by name..."
        value={search}
        onChange={handleSearch}
      />

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>{editing ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
          <div style={styles.formGrid}>
            <FormInput label="First Name" value={form.firstName} onChange={v => setForm({ ...form, firstName: v })} />
            <FormInput label="Last Name" value={form.lastName} onChange={v => setForm({ ...form, lastName: v })} />
            <FormSelect label="Gender" value={form.gender} onChange={v => setForm({ ...form, gender: v })} options={['Male', 'Female', 'Other']} />
            <FormInput label="Date of Birth" type="date" value={form.dateOfBirth} onChange={v => setForm({ ...form, dateOfBirth: v })} />
            <FormInput label="ID Number" value={form.idNumber} onChange={v => setForm({ ...form, idNumber: v })} />
            <FormInput label="Nationality" value={form.nationality} onChange={v => setForm({ ...form, nationality: v })} />
            <FormInput label="Home Language" value={form.homeLanguage} onChange={v => setForm({ ...form, homeLanguage: v })} />
            <FormSelect label="Staff Type" value={form.staffType} onChange={v => setForm({ ...form, staffType: v })} options={['Educator', 'Non-Educator']} />
            <FormInput label="Job Title" value={form.jobTitle} onChange={v => setForm({ ...form, jobTitle: v })} />
            <FormInput label="Department" value={form.department} onChange={v => setForm({ ...form, department: v })} />
            <FormSelect label="Employment Status" value={form.employmentStatus} onChange={v => setForm({ ...form, employmentStatus: v })} options={['Permanent', 'Contract', 'Substitute']} />
            <FormInput label="Appointment Date" type="date" value={form.appointmentDate} onChange={v => setForm({ ...form, appointmentDate: v })} />
            <FormInput label="PERSAL Number" value={form.persal} onChange={v => setForm({ ...form, persal: v })} />
            {form.staffType === 'Educator' && (
              <>
                <FormInput label="Qualification Level" value={form.qualificationLevel} onChange={v => setForm({ ...form, qualificationLevel: v })} />
                <FormInput label="Subjects Taught" value={form.subjectsTaught} onChange={v => setForm({ ...form, subjectsTaught: v })} />
                <FormInput label="Grades Taught" value={form.gradesTaught} onChange={v => setForm({ ...form, gradesTaught: v })} />
              </>
            )}
            <FormInput label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
            <FormInput label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
            <FormInput label="Address" value={form.address} onChange={v => setForm({ ...form, address: v })} />
            <FormSelect label="Province" value={form.province} onChange={v => setForm({ ...form, province: v })} options={provinces} />
          </div>
          <div style={styles.formActions}>
            <button style={styles.cancelBtn} onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
            <button style={styles.saveBtn} onClick={handleSubmit}>{editing ? 'Update' : 'Save'}</button>
          </div>
        </div>
      )}

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Job Title</th>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.length === 0 ? (
              <tr><td colSpan={7} style={styles.empty}>No staff found. Add your first staff member above.</td></tr>
            ) : (
              staff.map((s) => (
                <tr key={s.id} style={styles.tr}>
                  <td style={styles.td}>{s.firstName} {s.lastName}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: s.staffType === 'Educator' ? '#EEF2FF' : '#F0FDF4', color: s.staffType === 'Educator' ? '#4F46E5' : '#16A34A' }}>
                      {s.staffType}
                    </span>
                  </td>
                  <td style={styles.td}>{s.jobTitle}</td>
                  <td style={styles.td}>{s.department}</td>
                  <td style={styles.td}>{s.employmentStatus}</td>
                  <td style={styles.td}>{s.phone}</td>
                  <td style={styles.td}>
                    <button style={styles.editBtn} onClick={() => handleEdit(s)}>Edit</button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(s.id)}>Remove</button>
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
  badge: { padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 },
  editBtn: { background: '#EEF2FF', color: '#4F46E5', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', marginRight: 8 },
  deleteBtn: { background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer' },
  loading: { padding: '2rem', color: '#6B7280' },
};