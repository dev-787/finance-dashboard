import { useAppContext } from '../../context/AppContext';
import './Navbar.css';

const pageTitles = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  insights: 'Insights',
};

const dateRanges = ['This Month', '3 Months', 'This Year'];

export default function Navbar({ activePage, onAddTransaction }) {
  const { role, dateRange, setDateRange } = useAppContext();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">{pageTitles[activePage]}</h1>
      </div>

      <div className="navbar-right">
        <div className="navbar-pill-group">
          {dateRanges.map((d) => (
            <button
              key={d}
              className={`navbar-pill ${dateRange === d ? 'active' : ''}`}
              onClick={() => setDateRange(d)}
            >
              {d}
            </button>
          ))}
        </div>

        <button className="navbar-icon-btn" title="Toggle dark mode">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>

        {role === 'Admin' && (
          <button className="navbar-add-btn" onClick={onAddTransaction}>
            + Add Transaction
          </button>
        )}
      </div>
    </header>
  );
}
