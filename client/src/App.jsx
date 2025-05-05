// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import PageListPage from './pages/PageListPage';
import PageViewPage from './pages/PageViewPage';
import PageEditPage from './pages/PageEditPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FileManagerPage from './pages/FileManagerPage';
import NotFoundPage from './pages/NotFoundPage';
import SearchResultsPage from './pages/SearchResultsPage';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pages" element={<PageListPage />} />
            <Route path="/pages/new" element={<PageEditPage />} />
            <Route path="/pages/:slug" element={<PageViewPage />} />
            <Route path="/pages/:slug/edit" element={<PageEditPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/files" element={<FileManagerPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/search" element={<SearchResultsPage />} />

          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;