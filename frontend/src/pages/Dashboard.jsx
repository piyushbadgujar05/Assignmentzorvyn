import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi, recordsApi } from '../api';

const Dashboard = ({ onLogout }) => {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0 });
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({ amount: '', type: 'expense', category: '', date: '' });
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const { data: summaryData } = await dashboardApi.getSummary();
      setSummary(summaryData);
      const { records: recordsData } = await recordsApi.getRecords();
      setRecords(recordsData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await recordsApi.createRecord(newRecord);
      fetchData(); // Refresh
      setNewRecord({ amount: '', type: 'expense', category: '', date: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await recordsApi.deleteRecord(id);
      fetchData(); // Refresh
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (onLogout) onLogout(); // Notify App.jsx
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button onClick={handleLogout} className="text-red-500 font-semibold">Logout</button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded shadow-sm">
            <h3 className="text-gray-500 uppercase text-xs font-bold mb-1">Total Income</h3>
            <p className="text-2xl font-bold text-green-500">${summary.totalIncome}</p>
          </div>
          <div className="bg-white p-6 rounded shadow-sm">
            <h3 className="text-gray-500 uppercase text-xs font-bold mb-1">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-500">${summary.totalExpense}</p>
          </div>
          <div className="bg-white p-6 rounded shadow-sm">
            <h3 className="text-gray-500 uppercase text-xs font-bold mb-1">Net Balance</h3>
            <p className="text-2xl font-bold text-blue-500">${summary.netBalance}</p>
          </div>
        </div>

        {/* Record Form */}
        <div className="bg-white p-6 rounded shadow-sm mb-12">
          <h2 className="text-xl font-bold mb-4">Add New Record</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="number"
              placeholder="Amount"
              className="p-2 border rounded"
              value={newRecord.amount}
              onChange={(e) => setNewRecord({ ...newRecord, amount: e.target.value })}
              required
            />
            <select
              className="p-2 border rounded"
              value={newRecord.type}
              onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input
              type="text"
              placeholder="Category"
              className="p-2 border rounded"
              value={newRecord.category}
              onChange={(e) => setNewRecord({ ...newRecord, category: e.target.value })}
              required
            />
            <input
              type="date"
              className="p-2 border rounded"
              value={newRecord.date}
              onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
              required
            />
            <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Add</button>
          </form>
        </div>

        {/* Record List */}
        <div className="bg-white rounded shadow-sm overflow-hidden">
          <h2 className="text-xl font-bold p-6 border-b">Recent Records</h2>
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-gray-500 text-sm font-semibold">Date</th>
                <th className="p-4 text-gray-500 text-sm font-semibold">Category</th>
                <th className="p-4 text-gray-500 text-sm font-semibold">Type</th>
                <th className="p-4 text-gray-500 text-sm font-semibold">Amount</th>
                <th className="p-4 text-gray-500 text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record._id} className="border-t">
                  <td className="p-4">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="p-4 capitalize">{record.category}</td>
                  <td className="p-4 capitalize">
                    <span className={record.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                      {record.type}
                    </span>
                  </td>
                  <td className="p-4 font-bold">${record.amount}</td>
                  <td className="p-4">
                    <button onClick={() => handleDelete(record._id)} className="text-red-500 text-sm font-semibold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
