// client/src/components/layout/Layout.jsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import WikiSidebar from './WikiSidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex flex-grow">
        <WikiSidebar />
        <div className="flex-grow p-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;