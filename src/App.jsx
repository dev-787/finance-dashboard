import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import AddTransactionModal from './components/ui/AddTransactionModal';
import './App.css';

function AppLayout() {
  const [activePage, setActivePage] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-root">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="app-main">
        <Navbar
          activePage={activePage}
          onAddTransaction={() => setShowModal(true)}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="app-content">
      {activePage === 'dashboard'    && <Dashboard setActivePage={setActivePage} />}
          {activePage === 'transactions' && <Transactions />}
          {activePage === 'insights'     && <Insights />}
        </div>
      </div>
      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
