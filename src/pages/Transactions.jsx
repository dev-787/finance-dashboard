import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import TransactionDetailModal from '../components/ui/TransactionDetailModal';
import CategoryIcon from '../components/ui/CategoryIcon';
import './Transactions.css';

const CATEGORIES = ['All', 'Food', 'Housing', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Transport', 'Income'];

export default function Transactions() {
  const { transactions, role } = useAppContext();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  const toggleSort = (field) => {
    if (sortBy === field) setSortAsc((a) => !a);
    else { setSortBy(field); setSortAsc(false); }
  };

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    if (typeFilter !== 'All') list = list.filter((t) => t.type === typeFilter.toLowerCase());
    if (categoryFilter !== 'All') list = list.filter((t) => t.category === categoryFilter);
    list.sort((a, b) => {
      const valA = sortBy === 'date' ? new Date(a.date) : Math.abs(a.amount);
      const valB = sortBy === 'date' ? new Date(b.date) : Math.abs(b.amount);
      return sortAsc ? valA - valB : valB - valA;
    });
    return list;
  }, [transactions, search, typeFilter, categoryFilter, sortBy, sortAsc]);

  return (
    <div className="tx-page">
      <div className="tx-toolbar">
        <div className="tx-search-wrap">
          <svg className="tx-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="tx-search"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="tx-filters">
          <select className="tx-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option>All</option>
            <option>Income</option>
            <option>Expense</option>
          </select>
          <select className="tx-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="tx-sort-btns">
          <button className={`tx-sort-btn ${sortBy === 'date' ? 'active' : ''}`} onClick={() => toggleSort('date')}>
            Date {sortBy === 'date' ? (sortAsc ? '↑' : '↓') : ''}
          </button>
          <button className={`tx-sort-btn ${sortBy === 'amount' ? 'active' : ''}`} onClick={() => toggleSort('amount')}>
            Amount {sortBy === 'amount' ? (sortAsc ? '↑' : '↓') : ''}
          </button>
        </div>
      </div>

      <div className="tx-table-wrap">
        <table className="tx-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Category</th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="tx-empty">
                    <span className="tx-empty-icon">🔍</span>
                    <p>No transactions match your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((tx) => (
                <tr key={tx.id} className="tx-row" onClick={() => setSelectedTx(tx)}>
                  <td>
                    <CategoryIcon category={tx.category} />
                  </td>
                  <td className="tx-row-name">{tx.name}</td>
                  <td className="tx-row-cat">{tx.category}</td>
                  <td className="tx-row-date">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td>
                    <span className={`tx-badge ${tx.type}`}>
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </span>
                  </td>
                  <td className={`tx-row-amount ${tx.type}`}>
                    {tx.type === 'income' ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedTx && (
        <TransactionDetailModal
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </div>
  );
}
