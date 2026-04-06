import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import './AddTransactionModal.css';

const CATEGORIES = ['Food', 'Housing', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Transport', 'Income'];

const empty = { name: '', amount: '', category: 'Food', type: 'expense', date: new Date().toISOString().split('T')[0] };

export default function AddTransactionModal({ onClose }) {
  const { addTransaction } = useAppContext();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount';
    if (!form.date) e.date = 'Date is required';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    addTransaction({
      name: form.name.trim(),
      amount: form.type === 'expense' ? -Math.abs(Number(form.amount)) : Math.abs(Number(form.amount)),
      category: form.category,
      type: form.type,
      date: form.date,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="modal-header">
          <h2 className="modal-title">Add Transaction</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-fields">
          <div className="modal-field">
            <label className="modal-label">Name</label>
            <input
              className={`modal-input ${errors.name ? 'error' : ''}`}
              placeholder="e.g. Grocery Store"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
            {errors.name && <span className="modal-error">{errors.name}</span>}
          </div>

          <div className="modal-field">
            <label className="modal-label">Amount (₹)</label>
            <input
              className={`modal-input ${errors.amount ? 'error' : ''}`}
              placeholder="0.00"
              type="number"
              min="0"
              value={form.amount}
              onChange={(e) => set('amount', e.target.value)}
            />
            {errors.amount && <span className="modal-error">{errors.amount}</span>}
          </div>

          <div className="modal-field">
            <label className="modal-label">Category</label>
            <select className="modal-select" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="modal-field">
            <label className="modal-label">Type</label>
            <div className="modal-type-toggle">
              <button
                className={`modal-type-btn ${form.type === 'income' ? 'active income' : ''}`}
                onClick={() => set('type', 'income')}
              >
                Income
              </button>
              <button
                className={`modal-type-btn ${form.type === 'expense' ? 'active expense' : ''}`}
                onClick={() => set('type', 'expense')}
              >
                Expense
              </button>
            </div>
          </div>

          <div className="modal-field">
            <label className="modal-label">Date</label>
            <input
              className={`modal-input ${errors.date ? 'error' : ''}`}
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
            />
            {errors.date && <span className="modal-error">{errors.date}</span>}
          </div>
        </div>

        <div className="modal-actions">
          <button className="modal-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="modal-save-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
