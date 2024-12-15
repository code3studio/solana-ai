import React from "react";

const GeneratePage = () => {
  return (
    <div className="w-full max-w-md mx-auto mt-8 p-6 relative z-20">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter your prompt"
          className="w-full p-3 border rounded-lg bg-white/80 backdrop-blur-sm"
        />
        <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
          Generate Image
        </button>
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Cost: 0.01 SOL per generation
        </div>
      </div>
    </div>
  );
};

export default GeneratePage;
