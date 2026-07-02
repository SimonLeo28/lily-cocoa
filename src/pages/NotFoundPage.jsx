import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFoundPage = () => (
  <div className="min-h-[80vh] flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <div className="text-8xl mb-6">🎂</div>
      <h1 className="font-display text-6xl font-bold text-rose mb-3">404</h1>
      <h2 className="font-display text-2xl text-chocolate mb-4">Page Not Found</h2>
      <p className="text-chocolate/60 mb-8">
        Oops! Looks like this page got eaten. Let's find you a cake instead.
      </p>
      <Link to="/" className="btn-primary">Go Home</Link>
    </motion.div>
  </div>
);

export default NotFoundPage;
