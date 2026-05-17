import { useState } from 'react';

// Layout
import GStyle  from './components/common/GStyle';
import Sidebar from './components/layout/Sidebar';
import TopBar  from './components/layout/TopBar';

// Pages
import AuthPage           from './pages/AuthPage';
import Dashboard          from './pages/Dashboard';
import VehicleDiagnostics from './pages/VehicleDiagnostics';
import TripPlanning       from './pages/TripPlanning';
import Services           from './pages/Services';
import EmergencySOS       from './pages/EmergencySOS';
import Notifications      from './pages/Notifications';
import Profile            from './pages/Profile';

const App = () => {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');

  // Show auth page if not logged in
  if (!user) {
    return (
      <>
        <GStyle />
        <AuthPage onLogin={(u) => setUser(u)} />
      </>
    );
  }

  const handleLogout = () => {
    setUser(null);
    setPage('dashboard');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0F4FF' }}>
      <GStyle />

      {/* Sidebar navigation */}
      <Sidebar
        page={page}
        setPage={setPage}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main content area */}
      <div style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>

        {/* Sticky top bar */}
        <TopBar page={page} user={user} setPage={setPage} />

        {/* Page routing via state */}
        {page === 'dashboard'     && <Dashboard          user={user} setPage={setPage} />}
        {page === 'diagnostics'   && <VehicleDiagnostics />}
        {page === 'trip'          && <TripPlanning       />}
        {page === 'services'      && <Services           />}
        {page === 'sos'           && <EmergencySOS       />}
        {page === 'notifications' && <Notifications      />}
        {page === 'profile'       && <Profile            user={user} />}
      </div>
    </div>
  );
};

export default App;
