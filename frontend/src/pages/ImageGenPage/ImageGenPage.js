// src/pages/NotFoundPage.js
import React from 'react';

const ImageGenPage = () => {

  return (
  <>
<div className="bg-indigo-900 min-h-screen from-gray-100 to-gray-300">
<h1 className="flex justify-center mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"><span className="text-transparent bg-clip-text bg-gradient-to-r to-rose-600 from-lime-400">ImageGen</span></h1>
    <div>
    <label htmlFor="imageDescriptionInput" className="flex justify-center mt-4 block mb-2 text-sm font-medium text-gray-900">
              Enter Image Description:
            </label>
      <div className="flex justify-center mt-4">
            <input 
              type="text" 
              id="imageDescriptionInput"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2" 
            />
      </div>
            <div className= "flex justify-center mt-4">
              <button 
                //onClick={Click} 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                Generate Image
              </button>
            </div>
    </div>
</div>
  </>
  );
};

export default ImageGenPage;
