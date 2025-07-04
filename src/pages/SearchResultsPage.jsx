import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import SearchBar from '../components/search/SearchBar';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);

        if (!query.trim()) {
          setResults([]);
          return;
        }

        const { data, error } = await supabase
          .from('pages')
          .select('id, title, slug, content, updated_at, categories(name)')
          .textSearch('content', query, {
            type: 'websearch',
          })
          .order('updated_at', { ascending: false });

        if (error) throw error;

        const resultsWithSnippet = data.map(page => ({
          ...page,
          snippet: page.content?.slice(0, 180) + '...',
        }));

        setResults(resultsWithSnippet);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to perform search');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [query]);
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>
      
      <div className="mb-6">
        <SearchBar />
      </div>
      
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-2">
          {query ? `Results for "${query}"` : 'Enter a search term'}
        </h2>
        
        {loading ? (
          <div className="text-center py-8">
            <p>Searching...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 py-4">{error}</div>
        ) : results.length === 0 ? (
          <div className="py-4">
            <p>No results found{query ? ` for "${query}"` : ''}.</p>
          </div>
        ) : (
          <div className="divide-y">
            {results.map((result) => (
              <div key={result.id} className="py-4">
                <Link
                  to={`/pages/${result.slug}`}
                  className="text-lg font-medium text-blue-600 hover:text-blue-800"
                >
                  {result.title}
                </Link>
                <p className="text-sm text-gray-500 mb-2">
                  {result.categories?.name} · Updated {new Date(result.updated_at).toLocaleDateString()}
                </p>
                <p className="text-gray-700">{result.snippet}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;