import React, { useState, useEffect } from 'react';

const HtmlDocsBrowser = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const response = await fetch('/api/html-docs');
      const data = await response.json();
      setDocs(data.files);
    } catch (error) {
      console.error('Error fetching HTML docs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading documents...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">HTML Documents</h1>
      
      {docs.length === 0 ? (
        <p>No HTML documents found. Add .html files to the html-docs folder.</p>
      ) : (
        <div className="grid gap-4">
          {docs.map((doc) => (
            <div key={doc.name} className="border rounded-lg p-4 hover:shadow-md">
              <h3 className="text-xl font-semibold mb-2">{doc.title}</h3>
              <div className="flex gap-2">
                <a 
                  href={doc.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  View Document
                </a>
                <span className="text-gray-500 text-sm self-center">
                  {doc.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HtmlDocsBrowser;
