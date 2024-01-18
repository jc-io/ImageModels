// src/pages/NotFoundPage.js
import React from 'react';
import Upload from './../../components/Upload/Upload';

const UploadPage = () => {
  const styles = {
    container: {
      height: '100%'
    },
    first: {
      
    }
  }
  return (//From https://freefrontend.com/tailwind-404-page-templates/
  <>
      <div className="bg-indigo-900 relative overflow-hidden h-screen">
      {/* <img
        src="https://external-preview.redd.it/4MddL-315mp40uH18BgGL2-5b6NIPHcDMBSWuN11ynM.jpg?width=960&crop=smart&auto=webp&s=b98d54a43b3dac555df398588a2c791e0f3076d9"
        className="absolute h-full w-full object-cover"
        alt="404 Background"
      /> */}
                <Upload />

    </div>
  </>
  );
};

export default UploadPage;

