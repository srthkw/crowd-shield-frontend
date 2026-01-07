import React from 'react';

const Loader = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col gap-4 w-[120vw] h-[120vh] z-10 bg-black/50 flex items-center justify-center">
      <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
        <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full" />
      </div>
    </div>
  );
}

export default Loader;