import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axiosInstance from '../utils/axios';
import { API_PATHS } from '../utils/apiPath';
import { Trash2, Download } from 'lucide-react';

function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.GET_EXPENSES);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(API_PATHS.ADD_EXPENSE, formData);
      setFormData({
        title: '',
        amount: '',
        category: '',
        date: '',
        description: '',
      });
      fetchExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axiosInstance.delete(API_PATHS.DELETE_EXPENSE(id));
        fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.DOWNLOAD_EXPENSE, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expenses.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading expenses:', error);
    }
  };

  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Expense Management</h1>
        <button
          onClick={handleDownload}
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <Download className="mr-2" size={20} />
          Download Excel
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-red-400 to-red-600 p-6 rounded-lg shadow-lg text-white mb-8">
        <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
        <p className="text-4xl font-bold">${totalExpense.toFixed(2)}</p>
      </div>

      {/* Add Expense Form */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Add Expense</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Housing">Housing</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              rows="3"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>

      {/* Expense List */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Expense List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : expenses.length === 0 ? (
          <p className="text-gray-600">No expense records found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expenses.map((expense) => (
              <div
                key={expense._id}
                className="relative p-4 bg-gray-50 rounded-lg hover:shadow-md transition group"
              >
                <button
                  onClick={() => handleDelete(expense._id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 size={16} />
                </button>
                <h3 className="font-bold text-lg mb-2">{expense.title}</h3>
                <p className="text-2xl font-bold text-red-600 mb-2">${expense.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Category:</span> {expense.category}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Date:</span>{' '}
                  {new Date(expense.date).toLocaleDateString()}
                </p>
                {expense.description && (
                  <p className="text-sm text-gray-600 mt-2">{expense.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Expense;