// src/pages/PageEditPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pageService } from '../services/api';
import WikiEditor from '../components/editor/WikiEditor';


const PageEditPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    isPublished: false
  });

  // Fetch page data if editing an existing page
  useEffect(() => {
    if (slug && slug !== 'new') {
      const fetchPage = async () => {
        try {
          const response = await pageService.getPage(slug);
          const { title, content, category, tags, isPublished } = response.data;
          setFormData({
            title,
            content,
            category: category || '',
            tags: tags?.join(', ') || '',
            isPublished: isPublished || false
          });
        } catch (err) {
          setError('Failed to fetch page data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchPage();
    } else {
      setLoading(false);
    }
  }, [slug]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleContentChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare the data
      const pageData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };
      
      // Create or update the page
      if (slug && slug !== 'new') {
        await pageService.updatePage(slug, pageData);
      } else {
        await pageService.createPage(pageData);
      }
      
      // Redirect to the page list
      navigate('/pages');
    } catch (err) {
      setError('Failed to save the page');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">
        {slug && slug !== 'new' ? 'Edit Page' : 'Create New Page'}
      </h1>
      
      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2 font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="block mb-2 font-medium">
            Content
          </label>
          <WikiEditor 
            content={formData.content} 
            onChange={handleContentChange} 
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="category" className="block mb-2 font-medium">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="tags" className="block mb-2 font-medium">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="tag1, tag2, tag3"
          />
        </div>
        
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="isPublished"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
            className="w-4 h-4 mr-2"
          />
          <label htmlFor="isPublished">
            Publish page
          </label>
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PageEditPage;