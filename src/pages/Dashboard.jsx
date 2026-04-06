import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { chartData } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import CategoryIcon from '../components/ui/CategoryIcon';
import './Dashboard.css';

const PIE_COLORS = ['#ff4500', '#ff6a30', '#cc3700', '#3a3a3a', '#555555', '#ff7340', '#992800'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        <p style={{ color: '#ff4500' }}>Income: ₹{payload[0]?.value?.toLocaleString('en-IN')}</p>
        <p style={{ color: '#aaa' }}>Expenses: ₹{payload[1]?.value?.toLocaleString('en-IN')}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard({ setActivePage }) {
  const { transactions } = useAppContext();

  const summary = useMemo(() => {
    const totalIncome  = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
    const balance = totalIncome - totalExpense;
    return { balance, totalIncome, totalExpense };
  }, [transactions]);

  const recentTransactions = useMemo(() =>
    [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5),
    [transactions]
  );

  const spendingBreakdown = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const totals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});
    const grand = Object.values(totals).reduce((s, v) => s + v, 0);
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .map(([label, amt], i) => ({
        label,
        pct: grand > 0 ? Math.round((amt / grand) * 100) : 0,
        color: PIE_COLORS[i % PIE_COLORS.length],
      }));
  }, [transactions]);

  const summaryCards = [
    { label: 'Total Balance',  value: `₹${summary.balance.toLocaleString('en-IN')}`,     badge: '↑ 8.2%', badgeType: 'up',   sub: 'vs last month' },
    { label: 'Total Income',   value: `₹${summary.totalIncome.toLocaleString('en-IN')}`,  badge: '↑ 12%',  badgeType: 'up',   sub: 'All time', valueClass: 'green' },
    { label: 'Total Expenses', value: `₹${summary.totalExpense.toLocaleString('en-IN')}`, badge: '↓ 3.4%', badgeType: 'down', sub: 'All time', valueClass: 'red' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-cards">
        {summaryCards.map((card) => (
          <div className="summary-card" key={card.label}>
            <span className="summary-card-label">{card.label}</span>
            <div className={`summary-card-value ${card.valueClass || ''}`}>{card.value}</div>
            <div className="summary-card-sub">
              <span className={`summary-badge ${card.badgeType}`}>{card.badge}</span>
              <span>{card.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-card">
        <div className="chart-card-header">
          <div>
            <h2 className="chart-title">Income vs Expenses</h2>
            <p className="chart-sub">Full year overview — 2024</p>
          </div>
          <div className="chart-controls">
            <button className="chart-ctrl-btn">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              Date
            </button>
            <button className="chart-ctrl-btn">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
              </svg>
              View
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} barCategoryGap="30%" barGap={4}>
            <CartesianGrid vertical={false} stroke="#1e1e1e" />
            <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="income"   name="Income"   fill="#ff4500" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#2e2e2e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="chart-legend">
          <span className="chart-legend-item">
            <span className="chart-legend-dot" style={{ background: '#ff4500' }} />
            Income
          </span>
          <span className="chart-legend-item">
            <span className="chart-legend-dot" style={{ background: '#2e2e2e', border: '1px solid #444' }} />
            Expenses
          </span>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="chart-card">
          <div className="chart-card-header">
            <h2 className="chart-title">Recent Transactions</h2>
            <a className="view-all-link" onClick={() => setActivePage('transactions')}>View All →</a>
          </div>
          <div className="tx-list">
            {recentTransactions.map((tx) => (
              <div className="tx-item" key={tx.id}>
                <div className="tx-left">
                  <CategoryIcon category={tx.category} />
                  <div>
                    <p className="tx-name">{tx.name}</p>
                    <span className="tx-meta">
                      {new Date(tx.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} · {tx.category}
                    </span>
                  </div>
                </div>
                <span className={`tx-amount ${tx.type}`}>
                  {tx.type === 'income' ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h2 className="chart-title">Spending Breakdown</h2>
          </div>
          <div className="pie-wrapper">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={spendingBreakdown} dataKey="pct" nameKey="label" cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3}>
                  {spendingBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, n) => [`${v}%`, n]}
                  contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="pie-legend">
            {spendingBreakdown.map((item) => (
              <div className="pie-legend-row" key={item.label}>
                <div className="pie-legend-left">
                  <span className="pie-legend-dot" style={{ background: item.color }} />
                  <span>{item.label}</span>
                </div>
                <span className="pie-legend-pct">{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
