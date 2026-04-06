import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAppContext } from '../context/AppContext';
import './Insights.css';

const BAR_COLORS = ['#ff4500', '#ff5c1a', '#ff7433', '#cc3700', '#e84000'];

export default function Insights() {
  const { transactions } = useAppContext();

  const insights = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const thisMonthExp = expenses
      .filter((t) => { const d = new Date(t.date); return d.getMonth() === thisMonth && d.getFullYear() === thisYear; })
      .reduce((s, t) => s + Math.abs(t.amount), 0);

    const lastMonthExp = expenses
      .filter((t) => { const d = new Date(t.date); return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear; })
      .reduce((s, t) => s + Math.abs(t.amount), 0);

    const pctDelta = lastMonthExp === 0 ? 100 : (((thisMonthExp - lastMonthExp) / lastMonthExp) * 100).toFixed(1);
    const deltaUp = pctDelta >= 0;

    const daysInMonth = new Date(thisYear, thisMonth + 1, 0).getDate();
    const avgDaily = (thisMonthExp / daysInMonth).toFixed(2);

    const catTotals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

    const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
    const catChartData = Object.entries(catTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const biggest = expenses.reduce((max, t) => Math.abs(t.amount) > Math.abs(max.amount) ? t : max, expenses[0]);

    return { thisMonthExp, pctDelta, deltaUp, avgDaily, topCat, catChartData, biggest };
  }, [transactions]);

  if (!insights.topCat) return null;

  return (
    <div className="insights-page">
      <div className="insights-grid">
        <div className="insight-card">
          <span className="insight-label">Highest Spending Category</span>
          <div className="insight-value">{insights.topCat[0]}</div>
          <span className="insight-sub">${insights.topCat[1].toLocaleString()} total spent</span>
        </div>

        <div className="insight-card">
          <span className="insight-label">This Month vs Last Month</span>
          <div className="insight-value">${insights.thisMonthExp.toLocaleString()}</div>
          <span className={`insight-badge ${insights.deltaUp ? 'down' : 'up'}`}>
            {insights.deltaUp ? '↑' : '↓'} {Math.abs(insights.pctDelta)}%
          </span>
          <span className="insight-sub">vs last month expenses</span>
        </div>

        <div className="insight-card">
          <span className="insight-label">Average Daily Spend</span>
          <div className="insight-value">${insights.avgDaily}</div>
          <span className="insight-sub">per day this month</span>
        </div>

        <div className="insight-card">
          <span className="insight-label">Biggest Single Expense</span>
          <div className="insight-value">${Math.abs(insights.biggest?.amount).toLocaleString()}</div>
          <span className="insight-sub">{insights.biggest?.name}</span>
        </div>
      </div>

      <div className="insights-chart-card">
        <h2 className="insights-chart-title">Spending by Category</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={insights.catChartData} layout="vertical" barCategoryGap="25%">
            <CartesianGrid horizontal={false} stroke="#1e1e1e" />
            <XAxis type="number" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} width={90} />
            <Tooltip
              formatter={(v) => [`$${v.toLocaleString()}`, 'Spent']}
              contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 12 }}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {insights.catChartData.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
