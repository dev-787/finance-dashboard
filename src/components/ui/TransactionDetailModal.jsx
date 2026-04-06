import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import CategoryIcon from './CategoryIcon';
import './TransactionDetailModal.css';

const CATEGORIES = ['Food', 'Housing', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Transport', 'Income'];

export default function TransactionDetailModal({ transaction, onClose }) {
  const { updateTransaction, deleteTransaction, role } = useAppContext();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: transaction.name,
    amount: Math.abs(transaction.amount),
    category: transaction.category,
    type: transaction.type,
    date: transaction.date,
  });
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    updateTransaction(transaction.id, {
      name: form.name.trim(),
      amount: form.type === 'expense' ? -Math.abs(Number(form.amount)) : Math.abs(Number(form.amount)),
      category: form.category,
      type: form.type,
      date: form.date,
    });
    setEditing(false);
    onClose();
  };

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    onClose();
  };

  return (
    <div className="tdm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="tdm-card">
        <div className="tdm-header">
          <div className="tdm-header-left">
            <CategoryIcon category={transaction.category} />
            <div>
              <h2 className="tdm-title">{editing ? 'Edit Transaction' : transaction.name}</h2>
              {!editing && <span className="tdm-subtitle">{transaction.category} · {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
            </div>
          </div>
          <button className="tdm-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!editing ? (
          <>
            <div className="tdm-detail-grid">
              <div className="tdm-detail-item">
                <span className="tdm-detail-label">Amount</span>
                <span className={`tdm-detail-value amount ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}₹{Math.abs(transaction.amount).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="tdm-detail-item">
                <span className="tdm-detail-label">Type</span>
                <span className={`tx-badge ${transaction.type}`}>
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </span>
              </div>
              <div className="tdm-detail-item">
                <span className="tdm-detail-label">Category</span>
                <span className="tdm-detail-value">{transaction.category}</span>
              </div>
              <div className="tdm-detail-item">
                <span className="tdm-detail-label">Date</span>
                <span className="tdm-detail-value">{new Date(transaction.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            {role === 'Admin' && (
              <div className="tdm-actions">
                <button className="tdm-delete-btn" onClick={handleDelete}>Delete</button>
                <button className="tdm-edit-btn" onClick={() => setEditing(true)}>Edit</button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="tdm-fields">
              <div className="tdm-field">
                <label className="tdm-label">Name</label>
                <input className={`tdm-input ${errors.name ? 'error' : ''}`} value={form.name} onChange={(e) => set('name', e.target.value)} />
                {errors.name && <span className="tdm-error">{errors.name}</span>}
              </div>

              <div className="tdm-field">
            <label className="tdm-label">Amount (₹)</label>
                <input className={`tdm-input ${errors.amount ? 'error' : ''}`} type="number" min="0" value={form.amount} onChange={(e) => set('amount', e.target.value)} />
                {errors.amount && <span className="tdm-error">{errors.amount}</span>}
              </div>

              <div className="tdm-field">
                <label className="tdm-label">Category</label>
                <select className="tdm-select" value={form.category} onChange={(e) => set('category', e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="tdm-field">
                <label className="tdm-label">Type</label>
                <div className="tdm-type-toggle">
                  <button className={`tdm-type-btn ${form.type === 'income' ? 'active income' : ''}`} onClick={() => set('type', 'income')}>Income</button>
                  <button className={`tdm-type-btn ${form.type === 'expense' ? 'active expense' : ''}`} onClick={() => set('type', 'expense')}>Expense</button>
                </div>
              </div>

              <div className="tdm-field">
                <label className="tdm-label">Date</label>
                <input className="tdm-input" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
              </div>
            </div>

            <div className="tdm-actions">
              <button className="tdm-cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
              <button className="tdm-save-btn" onClick={handleSave}>Save Changes</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
