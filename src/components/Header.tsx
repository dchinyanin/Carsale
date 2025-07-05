import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <span className="text-white text-xl">🚗</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CarLoan</h1>
              <p className="text-sm text-gray-600">Помощник выбора авто</p>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              🏠 <span className="ml-1">Главная</span>
            </Link>
            
            <Link
              to="/add-car"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/add-car'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              + <span className="ml-1">Добавить авто</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;