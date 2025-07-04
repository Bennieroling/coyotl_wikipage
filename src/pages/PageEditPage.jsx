import { supabase } from "../services/supabaseClient";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common as lowlight } from 'lowlight';

export const uploadFile = async (file, path) => {
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from('uploads')
    .getPublicUrl(path);

  return publicUrlData.publicUrl;
};

const PageEditPage = () => {
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      Image,
      Link,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-4 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Store or submit `html`
    },
  });

  const onDrop = async (acceptedFiles) => {
    const newUrls = [];
    for (const file of acceptedFiles) {
      const path = `${Date.now()}-${file.name}`;
      try {
        const url = await uploadFile(file, path);
        try {
          const res = await fetch("/api/pages/link-upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ url })
          });
          if (!res.ok) {
            throw new Error("Failed to link uploaded file");
          }
        } catch (linkError) {
          console.error("Linking error:", linkError.message);
        }
        newUrls.push(url);
      } catch (error) {
        console.error("Upload error:", error.message);
      }
    }
    setUploadedUrls((prev) => [...prev, ...newUrls]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": []
    },
    maxSize: 5 * 1024 * 1024 // 5 MB
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Edit Page</h1>
      <div {...getRootProps()} className="border-2 border-dashed p-4 rounded cursor-pointer bg-gray-50 hover:bg-gray-100">
        <input {...getInputProps()} />
        <p>Drag 'n' drop an image here, or click to select one (max 5MB)</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm">Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm">Italic</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm">Underline</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm">H2</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm">• List</button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm">&lt;/&gt;</button>
      </div>
      <ul className="mt-4">
        {uploadedUrls.map((url, index) => (
          <li key={index}>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {url}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-6 border rounded p-4 min-h-[200px] bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default PageEditPage;