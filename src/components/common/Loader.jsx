import React from "react";

const Loader = ({ fullScreen = false }) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "h-screen w-full" : "py-12 w-full"
      }`}
    >
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-blush"></div>
        <div className="absolute inset-0 rounded-full border-4 border-rose border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;
