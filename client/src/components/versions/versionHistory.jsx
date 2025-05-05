import React, { useEffect, useState } from 'react';
import apiClient from '../../services/apiClient';
import { format } from 'date-fns';

const VersionHistory = ({ pageId, onVersionSelect }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getVersionsByPageId(pageId);
        setVersions(response.data);
      } catch (err) {
        setError('Failed to load version history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (pageId) {
      fetchVersions();
    }
  }, [pageId]);

  if (loading) return <div className="text-center">Loading versions...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (versions.length === 0) return <div className="text-center">No previous versions found</div>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-3">Version History</h3>
      <div className="overflow-y-auto max-h-96">
        {versions.map((version) => (
          <div
            key={version.id}
            className="mb-2 p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
            onClick={() => onVersionSelect(version)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {version.creator ? version.creator.username : 'Unknown'}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(version.createdAt), 'PPp')}
                </p>
              </div>
              <div>
                {version.comment && (
                  <p className="text-sm italic">"{version.comment}"</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VersionHistory;