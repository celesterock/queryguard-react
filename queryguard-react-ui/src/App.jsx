import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InfoPage from './pages/InfoPage';
import LoginPage from './pages/LoginPage';
import UserPortal from './pages/UserPortal';
import RegisterPage from './pages/RegisterPage';
import QueryGuardDashboard from './pages/QueryGuardDashboard';
import MostCommonInject from './pages/MostCommonInject';
import MostRecentInject from './pages/MostRecentInject';
import MostRecentIP from './pages/MostRecentIP';
import CompromisedAccounts from './pages/CompromisedAccounts';
import CompromisedData from './pages/CompromisedData';
import SuspiciousAccounts from './pages/SuspiciousAccounts';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InfoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/portal" element={<UserPortal />} />
        <Route path="/dashboard" element={<QueryGuardDashboard />} />
	<Route path="/register" element={<RegisterPage />} />
	<Route path="/ip-details" element={<MostRecentIP />} />
	<Route path="/recent-injections" element={<MostRecentInject />} />
	<Route path="/common-injections" element={<MostCommonInject />} />
	<Route path="/suspicious-accounts" element={<SuspiciousAccounts />} />
	<Route path="/compromised-accounts" element={<CompromisedAccounts />} />
	<Route path="/data-sources" element={<CompromisedData />} />
      </Routes>
    </Router>
  );
}

export default App;
