import React from 'react';
import { diffLines } from 'diff';

const VersionCompare = ({ currentContent, versionContent, onRestore, versionId }) => {
  // Generate diff between the two versions
  const diff = diffLines(versionContent, currentContent);
  
  const handleRestore = async () => {
    if (window.confirm('Are you sure you want to restore this version?')) {
      onRestore(versionId);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Version Comparison</h3>
        <button
          onClick={handleRestore}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Restore This Version
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Selected Version</h4>
          <div className="border p-3 rounded bg-gray-50">
            <div dangerouslySetInnerHTML={{ __html: versionContent }} />
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">Current Version</h4>
          <div className="border p-3 rounded bg-gray-50">
            <div dangerouslySetInnerHTML={{ __html: currentContent }} />
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="font-medium mb-2">Changes</h4>
        <div className="border p-3 rounded bg-gray-50 font-mono text-sm">
          {diff.map((part, index) => (
            <div 
              key={index}
              className={`${part.added ? 'bg-green-100' : part.removed ? 'bg-red-100' : ''}`}
            >
              <span className="mr-2">{part.added ? '+' : part.removed ? '-' : ' '}</span>
              {part.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VersionCompare;