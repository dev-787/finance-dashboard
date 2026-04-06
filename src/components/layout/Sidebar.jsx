import { useAppContext } from '../../context/AppContext';
import './Sidebar.css';

const navItems = [
  {
    label: 'Dashboard',
    path: 'dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    label: 'Insights',
    path: 'insights',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
];

export default function Sidebar({ activePage, setActivePage, open, onClose }) {
  const { role, setRole } = useAppContext();

  const handleNav = (path) => {
    setActivePage(path);
    onClose();
  };

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          <span className="sidebar-logo-text">Clario</span>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-nav-label">Menu</span>
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`sidebar-nav-item ${activePage === item.path ? 'active' : ''}`}
              onClick={() => handleNav(item.path)}
              title={item.label}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span className="sidebar-nav-text">{item.label}</span>
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
            <div className="sidebar-avatar">DT</div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">Dev Tailor</p>
              <span className="sidebar-user-sub">Personal Account</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
