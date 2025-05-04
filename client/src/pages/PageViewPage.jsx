// src/pages/PageViewPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { pageService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const PageViewPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isEditor } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await pageService.getPage(slug);
        setPage(response.data);
      } catch (err) {
        setError('Page not found');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      try {
        await pageService.deletePage(slug);
        navigate('/pages');
      } catch (err) {
        setError('Failed to delete the page');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-700">{error}</div>;
  }

  return (
    <div className="container p-4 mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{page.title}</h1>
          {isEditor && (
            <div className="flex space-x-2">
              <Link
                to={`/pages/${slug}/edit`}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          <span>Last updated: {new Date(page.updatedAt).toLocaleString()}</span>
          {page.category && (
            <span className="ml-4">Category: {page.category}</span>
          )}
        </div>
      </div>

      <div className="p-6 mt-4 bg-white rounded shadow-sm">
        {/* This is where we'll render the page content */}
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
};

export default PageViewPage;