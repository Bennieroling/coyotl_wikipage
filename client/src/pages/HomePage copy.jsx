// client/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../services/apiClient';

const HomePage = () => {
  const { user } = useAuth();
  const [recentPages, setRecentPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentPages = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/api/pages?limit=5&sort=updatedAt');
        setRecentPages(response.data.pages || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recent pages:', err);
        setError('Error loading recent pages');
        setLoading(false);
      }
    };

    fetchRecentPages();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="text-center py-8 bg-white rounded-lg shadow-sm mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Custom Wiki
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          A flexible wiki platform with complete HTML customization capabilities, built with React, 
          Node.js, and PostgreSQL. Create and share knowledge with powerful editing tools.
        </p>
        
        {user ? (
          <div className="flex justify-center space-x-4">
            <Link
              to="/pages"
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Browse Pages
            </Link>
            <Link
              to="/pages/new"
              className="px-6 py-3 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
            >
              Create Page
            </Link>
          </div>
        ) : (
          <div className="flex justify-center space-x-4">
            <Link
              to="/login"
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
            >
              Register
            </Link>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Recently Updated Pages
        </h2>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading recent pages...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : recentPages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No pages have been created yet.</p>
            {user && (
              <Link
                to="/pages/new"
                className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Create the First Page
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentPages.map((page) => (
              <div key={page._id} className="py-4 flex justify-between items-center">
                <div>
                  <Link 
                    to={`/pages/${page.slug}`}
                    className="text-lg font-medium text-blue-600 hover:underline"
                  >
                    {page.title}
                  </Link>
                  {page.category && (
                    <span className="ml-3 text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {page.category}
                    </span>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Last updated on {new Date(page.updatedAt).toLocaleDateString()} by{' '}
                    {page.updatedBy?.username || 'Unknown'}
                  </p>
                </div>
                <Link
                  to={`/pages/${page.slug}`}
                  className="px-3 py-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-50"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Key Features
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Rich text editing with TipTap</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Complete HTML customization</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>File uploads and management</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>User authentication and permissions</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Responsive design for all devices</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Getting Started
          </h2>
          <ol className="space-y-3 text-gray-600 list-decimal list-inside">
            <li>
              <span className="font-medium">Create an account</span>
              <p className="text-sm ml-6 mt-1">
                Register to start creating and editing wiki content.
              </p>
            </li>
            <li>
              <span className="font-medium">Browse existing pages</span>
              <p className="text-sm ml-6 mt-1">
                Explore the wiki to see what's already available.
              </p>
            </li>
            <li>
              <span className="font-medium">Create your first page</span>
              <p className="text-sm ml-6 mt-1">
                Use the rich text editor to create content.
              </p>
            </li>
            <li>
              <span className="font-medium">Upload files</span>
              <p className="text-sm ml-6 mt-1">
                Add images and documents to enhance your content.
              </p>
            </li>
            <li>
              <span className="font-medium">Share knowledge</span>
              <p className="text-sm ml-6 mt-1">
                Collaborate with others to build a comprehensive wiki.
              </p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default HomePage;