// src/pages/NotFoundPage.js
import { React, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ImageGenPage = () => {
  const [prompt, setPrompt] = useState('');
  const [pageState, setPageState] = useState('main')
  const [images, setImages] = useState([]);
  const token = localStorage.getItem('token');
  const [postCount, setPostCount] = useState(0);

  const achiveImage = async () => {
    console.log("Image Archived!");
    const formData = new FormData();
    formData.append('image', images[0]);//whatever was selected
    formData.append('prompt', prompt);
    //add information about the model and setting and etc used to generate the image
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/Archive`, formData, {
      headers: {
          Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
        // Handle successful sign out
        console.log('Archived Image!', response.data);
        toast('Archived Image!');
    })
    .catch(error => {
        // Handle sign out error
        toast.error('Error Archiving Image. Please Login.');
        console.error('Error signing out:', error);
    });

  };

  const handleGen = async () => {
    if (prompt.length > 0 && postCount < 6) {//check model chosen
      setPageState('loading');

      try {
        for (let i = 0; i < 6; i++) {
          const formData = new FormData();
          formData.append('prompt', prompt);

          const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/generate`, formData);
          const data = response.data;

          setImages(prevImages => [...prevImages, ...data.images.map(image => image.image_data)]);
          setPageState('result');
          setPostCount(prevCount => prevCount + 1);
        }

      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
  <>
<div className="bg-second min-h-screen from-gray-100 to-gray-300">
    <div className="scrollable-container">
      

        {pageState==="main" && (  
            
            <div className="container py-10 px-10 mx-0 min-w-full flex flex-col items-center">
              <h1 className="text-center	  text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                        <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r to-rose-600 from-lime-400">ImageGen</span>
                      </h1>
                      <br/><br/>

            
                    <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">
                    Enter Image Description:</label>
                    <br/>
                <input htmlFor="Caption" type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setPrompt(e.target.value)}/>
                <br/>

                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded items-center" onClick={handleGen}>
                Generate Image
                </button>
          
                
            </div>
      )};
      {pageState==="loading" && (
            <div className="container py-10 px-10 mx-0 min-w-full flex flex-col items-center">
              <h1 className="text-center	  text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                        <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r to-rose-600 from-lime-400">ImageGen</span>
                      </h1>
                      <br/><br/>

        <div className="text-center">
            <div role="status">
                  <svg aria-hidden="true" class="inline w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-pink-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
                <h3 className="text-white font-bold">Loading...</h3>
                <p className="text-white font-bold">This may take a few seconds, please don't close this page.</p>

            </div>
        </div>
        </div>
        
      )}
      {pageState==="result" && (
        <div>


      <div className="image-display text-center">
          
          <h3 className="text-white font-bold">Generated Image[s]:</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((imageUrl, index) => (
                <div>
                  <img className="h-auto max-w-full rounded-lg" key={index} alt={`Gen ${index + 1}`} src={imageUrl} />
                </div>
              ))
              }
          </div>  
          <h3 className="text-white font-bold">Prompt: {prompt}</h3>

          <button className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={() => achiveImage()}>
        <span> Archive</span>
        </button>
            <br></br>
            <button className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={() => setPageState('main')}>


                <svg className="w-5 h-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                </svg>
                <span> Back</span>
            </button>
      </div>
      </div>
      )}

      </div>
</div>
  </>

  );
};

export default ImageGenPage;



