// client/src/components/layout/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import SearchBar from '../search/SearchBar';


const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow">
           <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Festina Lente Wiki
          </Link>
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 items-center">
            <Link to="/" className="px-3 py-2 text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link to="/pages" className="px-3 py-2 text-gray-700 hover:text-blue-600">
              Pages
            </Link>
            {user && (
              <>
                <Link to="/pages/new" className="px-3 py-2 text-gray-700 hover:text-blue-600">
                  New Page
                </Link>
                <Link to="/files" className="px-3 py-2 text-gray-700 hover:text-blue-600">
                  Files
                </Link>
                <Link to="/html-docs" className="px-3 py-2 text-gray-700 hover:text-blue-600">
  HTML Docs
</Link>
              </>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4 ml-4">
                <span className="text-gray-700">
                  Hello, {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  to="/login"
                  className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={toggleMobileMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/pages"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pages
            </Link>
            {user && (
              <>
                <Link
                  to="/pages/new"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  New Page
                </Link>
                <Link
                  to="/files"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Files
                </Link>
                <Link
  to="/html-docs"
  className="block px-3 py-2 text-gray-700 hover:text-blue-600"
  onClick={() => setMobileMenuOpen(false)}
>
  HTML Docs
</Link>
              </>
            )}
            
            {user ? (
              <div className="pt-4 border-t border-gray-200 mt-4">
                <span className="block px-3 py-2 text-gray-700">
                  Hello, {user.username}
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 mt-4">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;