import React, { useEffect, useState } from 'react';
import { infrastructureService } from '../services/api';

export default function Infrastructure() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    facilityName: '', facilityType: '', block: '',
    roomNumber: '', capacity: '', condition: '',
    ownershipStatus: '', constructionType: '',
    hasElectricity: false, hasWater: false,
    hasInternet: false, isAccessible: false,
    needsMaintenance: false, maintenanceNotes: '',
  });

  useEffect(() => { fetchFacilities(); }, []);

  const fetchFacilities = async () => {
    try {
      const res = await infrastructureService.getAll();
      setFacilities(res.data);
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
        capacity: parseInt(form.capacity),
      };
      if (editing) {
        await infrastructureService.update(editing.id, { ...payload, id: editing.id });
      } else {
        await infrastructureService.create(payload);
      }
      setShowForm(false);
      setEditing(null);
      resetForm();
      fetchFacilities();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (facility) => {
    setEditing(facility);
    setForm({
      facilityName: facility.facilityName, facilityType: facility.facilityType,
      block: facility.block, roomNumber: facility.roomNumber,
      capacity: facility.capacity, condition: facility.condition,
      ownershipStatus: facility.ownershipStatus,
      constructionType: facility.constructionType,
      hasElectricity: facility.hasElectricity, hasWater: facility.hasWater,
      hasInternet: facility.hasInternet, isAccessible: facility.isAccessible,
      needsMaintenance: facility.needsMaintenance,
      maintenanceNotes: facility.maintenanceNotes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this facility?')) {
      await infrastructureService.delete(id);
      fetchFacilities();
    }
  };

  const resetForm = () => setForm({
    facilityName: '', facilityType: '', block: '',
    roomNumber: '', capacity: '', condition: '',
    ownershipStatus: '', constructionType: '',
    hasElectricity: false, hasWater: false,
    hasInternet: false, isAccessible: false,
    needsMaintenance: false, maintenanceNotes: '',
  });

  const conditionColor = (condition) => {
    const map = {
      Good: { background: '#F0FDF4', color: '#16A34A' },
      Fair: { background: '#FFFBEB', color: '#D97706' },
      Poor: { background: '#FEF2F2', color: '#EF4444' },
      Condemned: { background: '#1F2937', color: '#F9FAFB' },
    };
    return map[condition] || { background: '#F3F4F6', color: '#6B7280' };
  };

  if (loading) return <div style={styles.loading}>Loading infrastructure...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Infrastructure</h1>
          <p style={styles.sub}>{facilities.length} facilities recorded</p>
        </div>
        <button style={styles.addBtn} onClick={() => { resetForm(); setEditing(null); setShowForm(true); }}>
          + Add Facility
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>{editing ? 'Edit Facility' : 'Add Facility'}</h2>
          <div style={styles.formGrid}>
            <FormInput label="Facility Name" value={form.facilityName} onChange={v => setForm({ ...form, facilityName: v })} />
            <FormSelect label="Facility Type" value={form.facilityType} onChange={v => setForm({ ...form, facilityType: v })}
              options={['Classroom', 'Library', 'Laboratory', 'Hall', 'Toilet', 'Office', 'Staffroom', 'Kitchen', 'Storeroom']} />
            <FormInput label="Block" value={form.block} onChange={v => setForm({ ...form, block: v })} />
            <FormInput label="Room Number" value={form.roomNumber} onChange={v => setForm({ ...form, roomNumber: v })} />
            <FormInput label="Capacity" type="number" value={form.capacity} onChange={v => setForm({ ...form, capacity: v })} />
            <FormSelect label="Condition" value={form.condition} onChange={v => setForm({ ...form, condition: v })}
              options={['Good', 'Fair', 'Poor', 'Condemned']} />
            <FormSelect label="Ownership Status" value={form.ownershipStatus} onChange={v => setForm({ ...form, ownershipStatus: v })}
              options={['Owned', 'Rented', 'Mobile']} />
            <FormSelect label="Construction Type" value={form.constructionType} onChange={v => setForm({ ...form, constructionType: v })}
              options={['Brick', 'Prefab', 'Mud', 'Container', 'Wood']} />
            <FormInput label="Maintenance Notes" value={form.maintenanceNotes} onChange={v => setForm({ ...form, maintenanceNotes: v })} />
          </div>
          <div style={styles.checkGrid}>
            {[
              { key: 'hasElectricity', label: 'Has Electricity' },
              { key: 'hasWater', label: 'Has Water' },
              { key: 'hasInternet', label: 'Has Internet' },
              { key: 'isAccessible', label: 'Wheelchair Accessible' },
              { key: 'needsMaintenance', label: 'Needs Maintenance' },
            ].map(({ key, label }) => (
              <label key={key} style={styles.checkLabel}>
                <input type="checkbox" checked={form[key]} onChange={e => setForm({ ...form, [key]: e.target.checked })} />
                {label}
              </label>
            ))}
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
              <th style={styles.th}>Facility</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Block</th>
              <th style={styles.th}>Capacity</th>
              <th style={styles.th}>Condition</th>
              <th style={styles.th}>Utilities</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {facilities.length === 0 ? (
              <tr><td colSpan={7} style={styles.empty}>No facilities recorded yet.</td></tr>
            ) : (
              facilities.map((f) => (
                <tr key={f.id} style={styles.tr}>
                  <td style={styles.td}>{f.facilityName}</td>
                  <td style={styles.td}>{f.facilityType}</td>
                  <td style={styles.td}>{f.block} {f.roomNumber}</td>
                  <td style={styles.td}>{f.capacity}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...conditionColor(f.condition) }}>{f.condition}</span>
                  </td>
                  <td style={styles.td}>
                    <span title="Electricity">{f.hasElectricity ? '⚡' : '—'}</span>{' '}
                    <span title="Water">{f.hasWater ? '💧' : '—'}</span>{' '}
                    <span title="Internet">{f.hasInternet ? '🌐' : '—'}</span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.editBtn} onClick={() => handleEdit(f)}>Edit</button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(f.id)}>Delete</button>
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
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: '1rem' },
  checkGrid: { display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: '1.5rem' },
  checkLabel: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#374151', cursor: 'pointer' },
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