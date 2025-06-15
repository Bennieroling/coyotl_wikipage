// client/src/components/files/FileBrowser.jsx
import React, { useState, useEffect } from 'react';
import { fileAPI } from '../../services/apiClient';
import FileUploader from './FileUploader';

const FileBrowser = ({ onSelectFile, showUploader = true }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fileAPI.getFiles(`page=${pagination.page}`);
      setFiles(response.data.files);
      setPagination(response.data.pagination);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('Error loading files. Please try again.');
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newFile) => {
    setFiles(prevFiles => [newFile, ...prevFiles]);
  };

  const handleDeleteFile = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await fileAPI.deleteFile(fileId);
        setFiles(prevFiles => prevFiles.filter(file => file._id !== fileId));
      } catch (err) {
        console.error('Error deleting file:', err);
        setError('Error deleting file. Please try again.');
      }
    }
  };

  const getFileIcon = (mimetype) => {
    if (mimetype.startsWith('image/')) {
      return 'image';
    } else if (mimetype.includes('pdf')) {
      return 'pdf';
    } else if (mimetype.includes('word') || mimetype.includes('document')) {
      return 'doc';
    } else if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) {
      return 'excel';
    } else if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) {
      return 'powerpoint';
    } else {
      return 'file';
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Files</h2>
      </div>

      {showUploader && (
        <div className="p-4 border-b border-gray-200">
          <FileUploader onUploadSuccess={handleUploadSuccess} />
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700">
          {error}
        </div>
      )}

      <div className="p-4">
        {loading ? (
          <div className="text-center p-4">Loading files...</div>
        ) : files.length === 0 ? (
          <div className="text-center p-4 text-gray-500">No files uploaded yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map(file => (
              <div
                key={file._id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {file.mimetype.startsWith('image/') ? (
                  <div
                    className="h-32 bg-center bg-cover"
                    style={{ backgroundImage: `url(${file.url})` }}
                  ></div>
                ) : (
                  <div className="h-32 bg-gray-100 flex items-center justify-center">
                    <span className="text-4xl text-gray-400">
                      {getFileIcon(file.mimetype) === 'pdf' && '📄'}
                      {getFileIcon(file.mimetype) === 'doc' && '📝'}
                      {getFileIcon(file.mimetype) === 'excel' && '📊'}
                      {getFileIcon(file.mimetype) === 'powerpoint' && '📑'}
                      {getFileIcon(file.mimetype) === 'file' && '📁'}
                    </span>
                  </div>
                )}
                <div className="p-3">
                  <div className="truncate text-sm font-medium text-gray-900" title={file.originalName}>
                    {file.originalName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </div>
                  <div className="mt-2 flex justify-between">
                    <button
                      type="button"
                      onClick={() => onSelectFile && onSelectFile(file)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Select
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFile(file._id)}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`px-3 py-1 rounded-l-md border ${
                  pagination.page === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 border-t border-b ${
                    pagination.page === page
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className={`px-3 py-1 rounded-r-md border ${
                  pagination.page === pagination.pages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileBrowser;