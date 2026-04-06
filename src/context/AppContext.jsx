import { createContext, useContext, useState, useEffect } from 'react';
import { allTransactions } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [role, setRole] = useState('Admin');
  const [transactions, setTransactions] = useState(allTransactions);
  const [dateRange, setDateRange] = useState('This Month');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => t === 'dark' ? 'light' : 'dark');

  const addTransaction = (tx) => {
    setTransactions((prev) => [{ id: Date.now(), ...tx }, ...prev]);
  };

  const updateTransaction = (id, updated) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AppContext.Provider value={{ role, setRole, transactions, addTransaction, updateTransaction, deleteTransaction, dateRange, setDateRange, theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
