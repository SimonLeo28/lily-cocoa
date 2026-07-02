import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
    <h1 className="text-6xl font-bold text-rose mb-4">404</h1>
    <p className="text-chocolate/60 mb-8">Oops! This slice of cake doesn't exist.</p>
    <Link to="/" className="btn-primary">Back to Home</Link>
  </div>
);

export default NotFound;
