import React, { useEffect, useState } from 'react';
import { textbookService } from '../services/api';

export default function Textbooks() {
  const [textbooks, setTextbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '', category: '', subject: '', grade: '',
    publisher: '', isbn: '', year: new Date().getFullYear(),
    totalStock: '', issuedCount: '', damagedCount: '',
    lostCount: '', fundingSource: '', unitCost: '',
    dateReceived: '', condition: '', recordedBy: '',
  });

  useEffect(() => { fetchTextbooks(); }, []);

  const fetchTextbooks = async () => {
    try {
      const res = await textbookService.getAll();
      setTextbooks(res.data);
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
        year: parseInt(form.year),
        totalStock: parseInt(form.totalStock),
        issuedCount: parseInt(form.issuedCount) || 0,
        damagedCount: parseInt(form.damagedCount) || 0,
        lostCount: parseInt(form.lostCount) || 0,
        unitCost: parseFloat(form.unitCost) || 0,
        availableCount: parseInt(form.totalStock) - (parseInt(form.issuedCount) || 0),
      };
      if (editing) {
        await textbookService.update(editing.id, { ...payload, id: editing.id });
      } else {
        await textbookService.create(payload);
      }
      setShowForm(false);
      setEditing(null);
      resetForm();
      fetchTextbooks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title, category: item.category,
      subject: item.subject, grade: item.grade,
      publisher: item.publisher, isbn: item.isbn,
      year: item.year, totalStock: item.totalStock,
      issuedCount: item.issuedCount, damagedCount: item.damagedCount,
      lostCount: item.lostCount, fundingSource: item.fundingSource,
      unitCost: item.unitCost, dateReceived: item.dateReceived?.split('T')[0],
      condition: item.condition, recordedBy: item.recordedBy,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this item?')) {
      await textbookService.delete(id);
      fetchTextbooks();
    }
  };

  const resetForm = () => setForm({
    title: '', category: '', subject: '', grade: '',
    publisher: '', isbn: '', year: new Date().getFullYear(),
    totalStock: '', issuedCount: '', damagedCount: '',
    lostCount: '', fundingSource: '', unitCost: '',
    dateReceived: '', condition: '', recordedBy: '',
  });

  const grades = ['Grade R', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'];
  const subjects = ['Mathematics', 'English', 'Afrikaans', 'IsiZulu', 'Natural Sciences', 'Social Sciences', 'Life Skills', 'Technology', 'Arts & Culture'];

  const stockStatus = (item) => {
    if (item.availableCount <= 0) return { background: '#FEF2F2', color: '#EF4444', label: 'Out of stock' };
    if (item.availableCount <= 5) return { background: '#FFFBEB', color: '#D97706', label: 'Low stock' };
    return { background: '#F0FDF4', color: '#16A34A', label: 'In stock' };
  };

  if (loading) return <div style={styles.loading}>Loading textbooks...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Textbooks & Materials</h1>
          <p style={styles.sub}>{textbooks.length} items recorded</p>
        </div>
        <button style={styles.addBtn} onClick={() => { resetForm(); setEditing(null); setShowForm(true); }}>
          + Add Item
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>{editing ? 'Edit Item' : 'Add Item'}</h2>
          <div style={styles.formGrid}>
            <FormInput label="Title" value={form.title} onChange={v => setForm({ ...form, title: v })} />
            <FormSelect label="Category" value={form.category} onChange={v => setForm({ ...form, category: v })}
              options={['Textbook', 'Workbook', 'Stationery', 'Equipment']} />
            <FormSelect label="Subject" value={form.subject} onChange={v => setForm({ ...form, subject: v })} options={subjects} />
            <FormSelect label="Grade" value={form.grade} onChange={v => setForm({ ...form, grade: v })} options={grades} />
            <FormInput label="Publisher" value={form.publisher} onChange={v => setForm({ ...form, publisher: v })} />
            <FormInput label="ISBN" value={form.isbn} onChange={v => setForm({ ...form, isbn: v })} />
            <FormInput label="Year" type="number" value={form.year} onChange={v => setForm({ ...form, year: v })} />
            <FormInput label="Total Stock" type="number" value={form.totalStock} onChange={v => setForm({ ...form, totalStock: v })} />
            <FormInput label="Issued Count" type="number" value={form.issuedCount} onChange={v => setForm({ ...form, issuedCount: v })} />
            <FormInput label="Damaged Count" type="number" value={form.damagedCount} onChange={v => setForm({ ...form, damagedCount: v })} />
            <FormInput label="Lost Count" type="number" value={form.lostCount} onChange={v => setForm({ ...form, lostCount: v })} />
            <FormSelect label="Funding Source" value={form.fundingSource} onChange={v => setForm({ ...form, fundingSource: v })}
              options={['LTSM', 'SGB', 'Donation', 'Government']} />
            <FormInput label="Unit Cost (R)" type="number" value={form.unitCost} onChange={v => setForm({ ...form, unitCost: v })} />
            <FormInput label="Date Received" type="date" value={form.dateReceived} onChange={v => setForm({ ...form, dateReceived: v })} />
            <FormSelect label="Condition" value={form.condition} onChange={v => setForm({ ...form, condition: v })}
              options={['New', 'Good', 'Fair', 'Poor']} />
            <FormInput label="Recorded By" value={form.recordedBy} onChange={v => setForm({ ...form, recordedBy: v })} />
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
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Subject</th>
              <th style={styles.th}>Grade</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Issued</th>
              <th style={styles.th}>Available</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {textbooks.length === 0 ? (
              <tr><td colSpan={8} style={styles.empty}>No textbooks recorded yet.</td></tr>
            ) : (
              textbooks.map((t) => {
                const status = stockStatus(t);
                return (
                  <tr key={t.id} style={styles.tr}>
                    <td style={styles.td}><strong>{t.title}</strong><br /><span style={{ fontSize: 12, color: '#9CA3AF' }}>{t.category}</span></td>
                    <td style={styles.td}>{t.subject}</td>
                    <td style={styles.td}>{t.grade}</td>
                    <td style={styles.td}>{t.totalStock}</td>
                    <td style={styles.td}>{t.issuedCount}</td>
                    <td style={styles.td}>{t.availableCount}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: status.background, color: status.color }}>{status.label}</span>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.editBtn} onClick={() => handleEdit(t)}>Edit</button>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(t.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })
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
  editBtn: { background: '#EEF2FF', color: '#4F46E5', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', marginRight: 8 },
  deleteBtn: { background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer' },
  loading: { padding: '2rem', color: '#6B7280' },
};