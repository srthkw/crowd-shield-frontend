import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="relative">
        {/* Neon gradient circle with pulse animation */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse shadow-lg shadow-blue-500/30" />

        {/* Inner glow */}
        <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 blur-sm animate-pulse" style={{ animationDuration: '2s' }} />
      </div>
    </div>
  );
}

export default Loader;