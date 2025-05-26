import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Inbox from './pages/Inbox';
import ExportList from './pages/ExportList';
import RestoreList from './pages/RestoreList';
import FancyTable from './pages/FancyTable'; // Tambahkan

const App = () => {
  return (
    <Router>
      <nav className="bg-gray-200 p-3 mb-4 flex flex-wrap gap-4">
        <Link className="text-blue-700 hover:underline" to="/">Dashboard</Link>
        <Link className="text-blue-700 hover:underline" to="/inbox">Inbox</Link>
        <Link className="text-blue-700 hover:underline" to="/export">Export</Link>
        <Link className="text-blue-700 hover:underline" to="/restore">Restore</Link>
      </nav>

      <div className="p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inbox" element={<FancyTable />} /> // Ganti dari Inbox
          <Route path="/export" element={<ExportList />} />
          <Route path="/restore" element={<RestoreList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
