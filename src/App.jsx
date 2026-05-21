// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LoanProvider } from './context/LoanContext';

// import pages anf components
import Home from './pages/Home'; 
import PeopleGroups from './pages/PeopleGroups';
import CreateEntry from './components/entries/CreateEntry';
import AllRecords from './pages/AllRecords';
import EntryDetails from './pages/EntryDetails';

export default function App() {
  return (
    <LoanProvider>
      <Router>
        <div className="min-h-screen bg-teal-800">
          {/* Navigation Bar */}
          <nav className="bg-emerald-950 text-white shadow-md">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
              <Link to="/" className="font-bold text-xl tracking-wide">MoneyChecks</Link>
              <div className="space-x-6 text-sm md:text-base font-medium">
                <Link to="/" className="hover:text-blue-200 transition">Dashboard</Link>
                <Link to="/records" className="hover:text-blue-200 transition">All Records</Link>
                <Link to="/create" className="hover:text-blue-200 transition">New Entry</Link>
                <Link to="/people" className="hover:text-blue-200 transition">People & Groups</Link>
              </div>
            </div>
          </nav>

          {/* Page Content */}
          <main className="pb-12">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/records" element={<AllRecords />} />
              <Route path="/create" element={<CreateEntry />} />
              <Route path="/people" element={<PeopleGroups />} />
              <Route path="/entry/:id" element={<EntryDetails />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LoanProvider>
  );
}