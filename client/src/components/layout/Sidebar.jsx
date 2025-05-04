import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4">
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/" className="block px-3 py-2 rounded-md hover:bg-gray-100">
              Home
            </Link>
          </li>
          <li>
            <Link to="/pages" className="block px-3 py-2 rounded-md hover:bg-gray-100">
              All Pages
            </Link>
          </li>
          <li>
            <Link to="/categories" className="block px-3 py-2 rounded-md hover:bg-gray-100">
              Categories
            </Link>
          </li>
          <li>
            <Link to="/create" className="block px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
              Create New Page
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
