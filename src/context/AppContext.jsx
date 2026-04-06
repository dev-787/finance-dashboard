import { createContext, useContext, useState } from 'react';
import { allTransactions } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [role, setRole] = useState('Admin');
  const [transactions, setTransactions] = useState(allTransactions);
  const [dateRange, setDateRange] = useState('This Month');

  const addTransaction = (tx) => {
    setTransactions((prev) => [{ id: Date.now(), ...tx }, ...prev]);
  };

  return (
    <AppContext.Provider value={{ role, setRole, transactions, addTransaction, dateRange, setDateRange }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
