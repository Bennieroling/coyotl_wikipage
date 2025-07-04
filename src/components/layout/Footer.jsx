// client/src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white shadow-inner border-t border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Custom Wiki
            </Link>
            <p className="text-sm text-gray-600 mt-1">
              A flexible wiki platform with complete HTML customization.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>
            <Link to="/pages" className="text-gray-600 hover:text-blue-600">
              Pages
            </Link>
            <Link to="/files" className="text-gray-600 hover:text-blue-600">
              Files
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-6 pt-6 text-center text-sm text-gray-500">
          <p>
            &copy; {currentYear} Custom Wiki Project. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;