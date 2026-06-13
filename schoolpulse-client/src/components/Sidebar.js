import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/learners', label: 'Learners', icon: '🎓' },
  { to: '/staff', label: 'Staff', icon: '👨‍🏫' },
  { to: '/attendance', label: 'Attendance', icon: '📋' },
  { to: '/results', label: 'Results', icon: '📝' },
  { to: '/infrastructure', label: 'Infrastructure', icon: '🏫' },
  { to: '/textbooks', label: 'Textbooks', icon: '📚' },
];

export default function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <div style={styles.brand}>
        <p style={styles.brandName}>SchoolPulse</p>
        <p style={styles.brandTagline}>Building better school systems</p>
      </div>
      <nav>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            style={({ isActive }) => ({
              ...styles.link,
              background: isActive ? '#EEF2FF' : 'transparent',
              color: isActive ? '#4F46E5' : '#374151',
              fontWeight: isActive ? 600 : 400,
            })}
          >
            <span style={styles.icon}>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

const styles = {
  sidebar: {
    width: 240,
    minHeight: '100vh',
    background: '#fff',
    borderRight: '1px solid #E5E7EB',
    padding: '1.5rem 1rem',
    position: 'fixed',
    top: 0,
    left: 0,
  },
  brand: {
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #E5E7EB',
  },
  brandName: {
    fontSize: 20,
    fontWeight: 700,
    color: '#4F46E5',
    margin: 0,
  },
  brandTagline: {
    fontSize: 11,
    color: '#9CA3AF',
    margin: '4px 0 0',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 8,
    textDecoration: 'none',
    fontSize: 14,
    marginBottom: 4,
    transition: 'all 0.15s',
  },
  icon: {
    fontSize: 16,
  },
};