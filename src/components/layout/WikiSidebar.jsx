// client/src/components/layout/WikiSidebar.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Link, useLocation } from 'react-router-dom';

const WikiSidebar = () => {
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState({});
  const location = useLocation();

  useEffect(() => {
    const fetchSidebarData = async () => {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, pages(id, title, slug)')
        .order('name', { ascending: true });

      if (categoriesError) {
        console.error('Error loading categories:', categoriesError);
        return;
      }

      setCategories(categoriesData);
    };

    fetchSidebarData();
  }, []);

  const toggleExpand = (categoryId) => {
    setExpanded((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <div className="w-64 bg-gray-100 h-full p-4 overflow-y-auto border-r">
      <h2 className="text-lg font-bold mb-4">Navigation</h2>
      {categories.map((cat) => (
        <div key={cat.id} className="mb-3">
          <button
            className="w-full text-left font-semibold"
            onClick={() => toggleExpand(cat.id)}
          >
            {cat.name}
          </button>
          {expanded[cat.id] && (
            <ul className="ml-4 mt-2 space-y-1">
              {cat.pages?.map((page) => (
                <li key={page.id}>
                  <Link
                    to={`/pages/${page.slug}`}
                    className={`block px-2 py-1 rounded hover:bg-blue-200 ${
                      location.pathname === `/pages/${page.slug}` ? 'bg-blue-300' : ''
                    }`}
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default WikiSidebar;
