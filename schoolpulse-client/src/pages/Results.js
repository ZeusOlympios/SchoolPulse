import React, { useEffect, useState } from 'react';
import { resultService, learnerService } from '../services/api';

export default function Results() {
  const [results, setResults] = useState([]);
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    learnerId: '', subject: '', grade: '', term: '',
    year: new Date().getFullYear(), classworkMark: '',
    testMark: '', examMark: '', finalMark: '',
    performanceLevel: '', symbol: '', passed: false,
    recordedBy: '',
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [res, learn] = await Promise.all([
        resultService.getAll(),
        learnerService.getAll(),
      ]);
      setResults(res.data);
      setLearners(learn.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateResult = (form) => {
    const final = parseFloat(form.finalMark);
    const passed = final >= 40;
    let symbol = '';
    let performanceLevel = '';
    if (final >= 80) { symbol = 'A'; performanceLevel = '7'; }
    else if (final >= 70) { symbol = 'B'; performanceLevel = '6'; }
    else if (final >= 60) { symbol = 'C'; performanceLevel = '5'; }
    else if (final >= 50) { symbol = 'D'; performanceLevel = '4'; }
    else if (final >= 40) { symbol = 'E'; performanceLevel = '3'; }
    else if (final >= 30) { symbol = 'F'; performanceLevel = '2'; }
    else { symbol = 'G'; performanceLevel = '1'; }
    return { passed, symbol, performanceLevel };
  };

  const handleSubmit = async () => {
    try {
      const calculated = calculateResult(form);
      const payload = {
        ...form,
        learnerId: parseInt(form.learnerId),
        classworkMark: parseFloat(form.classworkMark),
        testMark: parseFloat(form.testMark),
        examMark: parseFloat(form.examMark),
        finalMark: parseFloat(form.finalMark),
        year: parseInt(form.year),
        ...calculated,
      };
      if (editing) {
        await resultService.update(editing.id, { ...payload, id: editing.id });
      } else {
        await resultService.create(payload);
      }
      setShowForm(false);
      setEditing(null);
      resetForm();
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (result) => {
    setEditing(result);
    setForm({
      learnerId: result.learnerId, subject: result.subject,
      grade: result.grade, term: result.term, year: result.year,
      classworkMark: result.classworkMark, testMark: result.testMark,
      examMark: result.examMark, finalMark: result.finalMark,
      performanceLevel: result.performanceLevel, symbol: result.symbol,
      passed: result.passed, recordedBy: result.recordedBy,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this result?')) {
      await resultService.delete(id);
      fetchAll();
    }
  };

  const resetForm = () => setForm({
    learnerId: '', subject: '', grade: '', term: '',
    year: new Date().getFullYear(), classworkMark: '',
    testMark: '', examMark: '', finalMark: '',
    performanceLevel: '', symbol: '', passed: false,
    recordedBy: '',
  });

  const grades = ['Grade R', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'];
  const subjects = ['Mathematics', 'English', 'Afrikaans', 'IsiZulu', 'Natural Sciences', 'Social Sciences', 'Life Skills', 'Technology', 'Arts & Culture'];
  const terms = ['Term 1', 'Term 2', 'Term 3', 'Term 4'];

  if (loading) return <div style={styles.loading}>Loading results...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Results</h1>
          <p style={styles.sub}>{results.length} result records</p>
        </div>
        <button style={styles.addBtn} onClick={() => { resetForm(); setEditing(null); setShowForm(true); }}>
          + Add Result
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>{editing ? 'Edit Result' : 'Add Result'}</h2>
          <div style={styles.formGrid}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>Learner</label>
              <select value={form.learnerId} onChange={e => setForm({ ...form, learnerId: e.target.value })}
                style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #E5E7EB', fontSize: 14 }}>
                <option value="">Select learner...</option>
                {learners.map(l => <option key={l.id} value={l.id}>{l.firstName} {l.lastName} — {l.grade}</option>)}
              </select>
            </div>
            <FormSelect label="Subject" value={form.subject} onChange={v => setForm({ ...form, subject: v })} options={subjects} />
            <FormSelect label="Grade" value={form.grade} onChange={v => setForm({ ...form, grade: v })} options={grades} />
            <FormSelect label="Term" value={form.term} onChange={v => setForm({ ...form, term: v })} options={terms} />
            <FormInput label="Year" type="number" value={form.year} onChange={v => setForm({ ...form, year: v })} />
            <FormInput label="Classwork Mark (%)" type="number" value={form.classworkMark} onChange={v => setForm({ ...form, classworkMark: v })} />
            <FormInput label="Test Mark (%)" type="number" value={form.testMark} onChange={v => setForm({ ...form, testMark: v })} />
            <FormInput label="Exam Mark (%)" type="number" value={form.examMark} onChange={v => setForm({ ...form, examMark: v })} />
            <FormInput label="Final Mark (%)" type="number" value={form.finalMark} onChange={v => setForm({ ...form, finalMark: v })} />
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
              <th style={styles.th}>Learner</th>
              <th style={styles.th}>Subject</th>
              <th style={styles.th}>Grade</th>
              <th style={styles.th}>Term</th>
              <th style={styles.th}>Final Mark</th>
              <th style={styles.th}>Symbol</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr><td colSpan={8} style={styles.empty}>No results yet. Add your first result above.</td></tr>
            ) : (
              results.map((r) => (
                <tr key={r.id} style={styles.tr}>
                  <td style={styles.td}>{r.learner ? `${r.learner.firstName} ${r.learner.lastName}` : '—'}</td>
                  <td style={styles.td}>{r.subject}</td>
                  <td style={styles.td}>{r.grade}</td>
                  <td style={styles.td}>{r.term}</td>
                  <td style={styles.td}><strong>{r.finalMark}%</strong></td>
                  <td style={styles.td}>{r.symbol}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: r.passed ? '#F0FDF4' : '#FEF2F2', color: r.passed ? '#16A34A' : '#EF4444' }}>
                      {r.passed ? 'Passed' : 'Failed'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.editBtn} onClick={() => handleEdit(r)}>Edit</button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(r.id)}>Delete</button>
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
  editBtn: { background: '#EEF2FF', color: '#4F46E5', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', marginRight: 8 },
  deleteBtn: { background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer' },
  loading: { padding: '2rem', color: '#6B7280' },
};