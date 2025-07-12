import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Simple minimal App to test routing
const MinimalApp = () => {
  console.log('MinimalApp rendering...');
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Minimal App Test</h1>
      <p className="text-xl mb-4">Testing Tailwind CSS...</p>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <div className="bg-white text-black p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-2">Home Page</h2>
              <p>This is the home page with Tailwind styles</p>
            </div>
          } />
          <Route path="*" element={<div className="bg-red-500 p-4 rounded">Page not found</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default MinimalApp;
