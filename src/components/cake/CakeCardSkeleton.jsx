import React from "react";

const CakeCardSkeleton = () => (
  <div className="card p-3">
    <div className="skeleton h-48 w-full mb-3" />
    <div className="skeleton h-4 w-3/4 mb-2" />
    <div className="skeleton h-4 w-1/2 mb-2" />
    <div className="skeleton h-8 w-full mt-3" />
  </div>
);

export default CakeCardSkeleton;
