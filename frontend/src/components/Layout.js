import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Home, DollarSign, TrendingUp, LogOut } from 'lucide-react';

function Layout({ children }) {
  const { user, logout } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Income', path: '/income', icon: TrendingUp },
    { name: 'Expenses', path: '/expense', icon: DollarSign },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-blue-600">Expense Tracker</h1>
        </div>
        <nav className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center p-3 mb-2 rounded-lg transition ${
                  location.pathname === item.path
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="mr-3" size={20} />
                {item.name}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 mt-4 text-red-600 rounded-lg hover:bg-red-50 transition"
          >
            <LogOut className="mr-3" size={20} />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}

export default Layout;