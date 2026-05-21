// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useLoanData } from '../context/LoanContext';
import { Wallet, TrendingUp, Users, ArrowRight, Activity } from 'lucide-react';
import { PAYMENT_STATUS } from '../constants/enums';
import logo from '../assets/MoneyCheck$Logo.png';

export default function Home() {
  const { entries, people, groups } = useLoanData();

  // --- Calculate Dashboard Metrics ---
  
  // 1. Total Outstanding (Money owed to me)
  const totalOutstanding = entries.reduce((sum, entry) => sum + entry.amountRemaining, 0);
  
  // 2. Total Collected (Money paid back)
  const totalCollected = entries.reduce((sum, entry) => {
    return sum + (entry.amountBorrowed - entry.amountRemaining);
  }, 0);

  // 3. Active Loans count
  const activeLoans = entries.filter(e => e.amountRemaining > 0).length;

  // 4. Get the 5 most recent entries
  const recentEntries = [...entries].reverse().slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-6 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-linear-to-t from-emerald-800 to-teal-950 rounded-2xl p-8 text-black shadow-lg flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-3 mb-2">
          <img
            src={logo}
            alt='MoneyCheck$ logo'
            />
          <p className="text-emerald-100 w-auto flex items-center">Checking your transactions made comfy and easy.  </p>
        </div>
        <div className="mt-6 md:mt-0 space-x-4">
          <Link to="/create" className="bg-white text-olive-950 font-bold px-6 py-3 rounded-lg shadow hover:bg-blue-50 transition inline-flex items-center">
            + New Entry
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Outstanding</p>
            <p className="text-2xl font-bold text-gray-800">
              ₱ {totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <Wallet size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Collected</p>
            <p className="text-2xl font-bold text-gray-800">
              ₱ {totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Active Entities</p>
            <p className="text-2xl font-bold text-gray-800">
              {activeLoans} Loans &bull; {people.length} People
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section - Recent Activity & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Entries */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Activity size={20} className="text-green-600"/> 
              Recent Entries
            </h2>
            <Link to="/records" className="text-sm text-green-800 hover:underline flex items-center">
              View All <ArrowRight size={16} className="ml-1"/>
            </Link>
          </div>
          
          {recentEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg border border-dashed">
              No entries found. Time to create your first one!
            </div>
          ) : (
            <div className="space-y-4">
              {recentEntries.map(entry => (
                <Link key={entry.id} to={`/entry/${entry.id}`} className="block hover:bg-gray-50 p-3 rounded-lg transition border border-transparent hover:border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{entry.entryName}</p>
                      <p className="text-sm text-gray-500">{entry.borrowerId} &bull; {entry.transactionType}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${entry.amountRemaining > 0 ? 'text-gray-800' : 'text-green-600'}`}>
                        ₱ {entry.amountBorrowed.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        entry.status === PAYMENT_STATUS.PAID ? 'bg-green-100 text-green-700' :
                        entry.status === PAYMENT_STATUS.PARTIALLY_PAID ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {entry.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links Menu */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/create" className="flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 hover:text-emerald-700 rounded-lg transition group">
              <span className="font-medium">Create New Loan</span>
              <ArrowRight size={18} className="text-gray-700 group-hover:text-emerald-600" />
            </Link>
            <Link to="/people" className="flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 hover:text-emerald-700 rounded-lg transition group">
              <span className="font-medium">Manage People & Groups</span>
              <ArrowRight size={18} className="text-gray-700 group-hover:text-emerald-600" />
            </Link>
            <Link to="/records" className="flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 hover:text-emerald-700 rounded-lg transition group">
              <span className="font-medium">View Payment History</span>
              <ArrowRight size={18} className="text-gray-700 group-hover:text-emerald-600" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}