import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../hooks/useAuth';
import WikiEditor from '../components/editor/WikiEditor';

const PageEditPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [page, setPage] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [versionComment, setVersionComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getPage(slug);
        const pageData = response.data;
        setPage(pageData);
        setTitle(pageData.title);
        setContent(pageData.content);
        setTags(pageData.tags || []);
        setCategory(pageData.category || 'Uncategorized');
        setIsPublished(pageData.isPublished);
      } catch (err) {
        setError('Failed to load page');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (slug !== 'new') {
      fetchPage();
    } else {
      setLoading(false);
    }
  }, [slug]);

  const handleSave = async () => {
    if (!title) {
      alert('Title is required');
      return;
    }

    try {
      setSaving(true);
      
      if (slug === 'new') {
        // Create new page
        const response = await apiClient.createPage({
          title,
          content,
          tags,
          category,
          isPublished
        });
        
        navigate(`/pages/${response.data.slug}`);
      } else {
        // Update existing page
        const pageData = {
          title,
          content,
          tags,
          category,
          isPublished
        };
        
        // If we have a version comment, first create a version
        if (versionComment && page) {
          await apiClient.createVersion({
            pageId: page.id,
            content: page.content,
            comment: versionComment
          });
        }
        
        await apiClient.updatePage(slug, pageData);
        navigate(`/pages/${slug}`);
      }
    } catch (err) {
      setError('Failed to save page');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (slug === 'new') {
      navigate('/');
    } else {
      navigate(`/pages/${slug}`);
    }
  };

  if (loading) return <div className="text-center p-8">Loading page...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!user) return <div className="text-center p-8">You must be logged in to edit pages</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        {slug === 'new' ? 'Create New Page' : `Edit: ${title}`}
      </h1>
      
      <div className="bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <WikiEditor content={content} onChange={setContent} />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
          <input
            type="text"
            value={tags.join(', ')}
            onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Publish this page</span>
          </label>
        </div>
        
        {slug !== 'new' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Version Comment (optional)</label>
            <input
              type="text"
              value={versionComment}
              onChange={(e) => setVersionComment(e.target.value)}
              placeholder="Describe your changes"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
        )}
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageEditPage;