import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import VersionHistory from '../components/versions/versionHistory';
import VersionCompare from '../components/versions/VersionCompare';

const PageViewPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVersions, setShowVersions] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          throw error;
        }
        setPage(data);
      } catch (err) {
        setError('Failed to load page');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  const handleEdit = () => {
    navigate(`/pages/${slug}/edit`);
  };

  const handleToggleVersions = () => {
    setShowVersions(!showVersions);
    setSelectedVersion(null);
  };

  const handleVersionSelect = (version) => {
    setSelectedVersion(version);
  };

  const handleRestoreVersion = async (versionId) => {
    try {
      const { data: versionData, error: versionError } = await supabase
        .from('page_versions')
        .select('content')
        .eq('id', versionId)
        .single();

      if (versionError) {
        throw versionError;
      }

      const { error: updateError } = await supabase
        .from('pages')
        .update({ content: versionData.content })
        .eq('slug', slug);

      if (updateError) {
        throw updateError;
      }

      // Reload the page content
      const { data: updatedPage } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single();

      setPage(updatedPage);
      setSelectedVersion(null);
    } catch (err) {
      console.error('Failed to restore version', err);
      alert('Failed to restore version');
    }
  };

  if (loading) return <div className="text-center p-8">Loading page...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!page) return <div className="text-center p-8">Page not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{page.title}</h1>
        <div className="space-x-2">
          {user && (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleToggleVersions}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            {showVersions ? 'Hide History' : 'Show History'}
          </button>
        </div>
      </div>

      {showVersions && (
        <div className="mb-6">
          <VersionHistory 
            pageId={page.id} 
            onVersionSelect={handleVersionSelect} 
          />
        </div>
      )}

      {selectedVersion && (
        <div className="mb-6">
          <VersionCompare
            currentContent={page.content}
            versionContent={selectedVersion.content}
            onRestore={handleRestoreVersion}
            versionId={selectedVersion.id}
          />
        </div>
      )}

      <div className="bg-white p-6 rounded shadow">
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>
          Last updated: {new Date(page.updated_at).toLocaleString()} by {page.updated_by || 'Unknown'}
        </p>
      </div>
    </div>
  );
};

export default PageViewPage;