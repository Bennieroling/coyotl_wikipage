// client/src/components/editor/WikiEditor.jsx
import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import EditorToolbar from './EditorToolbar';
import FileBrowser from '../files/FileBrowser';

const WikiEditor = ({ content, onChange, readOnly = false }) => {
  const [showFileBrowser, setShowFileBrowser] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    // Update editor content when content prop changes
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleSelectFile = (file) => {
    // Insert image at current cursor position
    if (file.mimetype.startsWith('image/')) {
      editor.chain().focus().setImage({ src: file.url }).run();
    } else {
      // For non-image files, insert as a link
      editor.chain().focus().setLink({ href: file.url }).insertContent(file.originalName).run();
    }
    setShowFileBrowser(false);
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="w-full border border-gray-300 rounded-md">
      {!readOnly && (
        <>
          <EditorToolbar 
            editor={editor} 
            onInsertImage={() => setShowFileBrowser(true)}
          />
          {showFileBrowser && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Select File</h3>
                <button
                  type="button"
                  onClick={() => setShowFileBrowser(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <FileBrowser 
                onSelectFile={handleSelectFile}
                showUploader={true}
              />
            </div>
          )}
        </>
      )}
      <div className="p-4">
        <EditorContent editor={editor} className="prose max-w-none" />
      </div>
    </div>
  );
};

export default WikiEditor;