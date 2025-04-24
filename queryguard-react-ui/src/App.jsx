import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InfoPage from './pages/InfoPage';
import LoginPage from './pages/LoginPage';
import UserPortal from './pages/UserPortal';
import QueryGuardDashboard from './pages/QueryGuardDashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InfoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/portal" element={<UserPortal />} />
        <Route path="/dashboard" element={<QueryGuardDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
