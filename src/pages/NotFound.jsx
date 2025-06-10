// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl font-bold mb-4 text-red-600">404</h1>
      <p className="text-xl mb-4">Oops! The page you&rsquo;re looking for doesn&rsquo;t exist.</p>
      <Link to="/" className="text-blue-500 underline">
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
