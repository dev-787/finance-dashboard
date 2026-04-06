import { useAppContext } from '../../context/AppContext';
import './Sidebar.css';

const navItems = [
  {
    label: 'Dashboard',
    path: 'dashboard',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Transactions',
    path: 'transactions',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    label: 'Insights',
    path: 'insights',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
];

export default function Sidebar({ activePage, setActivePage }) {
  const { role, setRole } = useAppContext();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-text">Clario</span>
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-nav-label">Menu</span>
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`sidebar-nav-item ${activePage === item.path ? 'active' : ''}`}
            onClick={() => setActivePage(item.path)}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <span className="sidebar-role-label">Role</span>
        <select
          className="sidebar-role-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option>Admin</option>
          <option>Viewer</option>
        </select>

        <div className="sidebar-user">
          <div className="sidebar-avatar">AS</div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">Aryan Shah</p>
            <span className="sidebar-user-sub">Personal Account</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
