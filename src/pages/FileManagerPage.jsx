// client/src/pages/FileManagerPage.jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import FileBrowser from '../components/files/FileBrowser';

const FileManagerPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          You need to be logged in to access the file manager.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">File Manager</h1>
      
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Files</h2>
        <p className="text-gray-600 mb-4">
          Upload images, documents, and other files to use in your wiki pages. 
          Supported file types include images (JPG, PNG, GIF, SVG), documents (PDF, DOC, DOCX), 
          spreadsheets (XLS, XLSX), presentations (PPT, PPTX), and common web files (HTML, CSS, JS, JSON).
        </p>
        <p className="text-gray-600 mb-4">
          Maximum file size: <strong>10MB</strong>
        </p>
      </div>
      
      <FileBrowser 
        onSelectFile={(file) => {
          // Just to preview file URL - in a real integration this would insert into editor
          alert(`File URL: ${file.url}`);
        }}
        showUploader={true}
      />
    </div>
  );
};

export default FileManagerPage;