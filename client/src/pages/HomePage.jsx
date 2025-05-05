// client/src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/apiClient';
import { useAuth } from '../hooks/useAuth'; // Import auth hook

const HomePage = () => {
  const [recentPages, setRecentPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Get current user from auth context

  useEffect(() => {
    const fetchRecentPages = async () => {
      try {
        const response = await api.getPages();
        
        // Check if response data exists and is an array
        if (response.data && Array.isArray(response.data)) {
          // Sort pages by updatedAt date (most recent first)
          const sortedPages = response.data.sort((a, b) => {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          });
          
          // Take only the 5 most recent pages
          setRecentPages(sortedPages.slice(0, 5));
        } else {
          // Handle case where response exists but data is not as expected
          setRecentPages([]);
        }
      } catch (err) {
        console.error('Error fetching recent pages:', err);
        // Don't set an error for empty pages - that's a valid state
        setRecentPages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPages();
  }, []);

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to Festina Lente Wiki</h1>
      
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Get Started</h2>
        <p className="mb-4">
          Welcome to your custom wiki! Here you can create, view, and edit wiki pages.
        </p>
        
        {user ? (
          <Link
            to="/pages/new"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create New Page
          </Link>
        ) : (
          <div>
            <p className="mb-2 text-yellow-600">
              Please log in to create or edit pages.
            </p>
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Log In
            </Link>
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Pages</h2>
        
        {recentPages.length > 0 ? (
          <ul className="divide-y">
            {recentPages.map((page) => (
              <li key={page.id} className="py-3">
                <Link
                  to={`/pages/${page.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {page.title}
                </Link>
                <p className="text-sm text-gray-500">
                  Last updated: {new Date(page.updatedAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No pages found. {user ? 'Create your first page!' : 'Please log in to create pages.'}</p>
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