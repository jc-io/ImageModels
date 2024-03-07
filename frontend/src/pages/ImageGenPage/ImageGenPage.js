// src/pages/NotFoundPage.js
import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ImageGenPage = () => {
  const [prompt, setPrompt] = useState('');
  const [pageState, setPageState] = useState('main')
  const [images, setImages] = useState([]);
  const [selectedModel, setSelectedModel] = useState('runwayml/stable-diffusion-v1-5'); // Default model selection
  const token = localStorage.getItem('token');
  const [postCount, setPostCount] = useState(0);
  const MAX_CHAR_LIMIT = 200;

  // Image settings state
  const [imageSettingsVisible, setImageSettingsVisible] = useState(false);
  const [guidance, setGuidance] = useState(7.5);
  const [numImages, setSteps] = useState(1);
  const [inferenceSteps, setInferenceSteps] = useState(50);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Define dropdownOpen state variable

  const [featuredImage, setFeaturedImage] = useState('');

  // Function to handle click on an image
  const handleClickImage = (imageUrl) => {
    if (featuredImage !== imageUrl) {
      const updatedImages = [imageUrl, ...images.filter(img => img !== imageUrl)];
      setImages(updatedImages);
      setFeaturedImage(imageUrl);
    }
  };

  useEffect(() => {
    if (images.length > 0) {
      // Set the initial featured image to be the first image in the images array
      setFeaturedImage(images[0]);
    }
  }, [images]);

  const toggleImageSettings = () => {
    setImageSettingsVisible(!imageSettingsVisible);
    setDropdownOpen(!dropdownOpen); // Toggle dropdownOpen state
  };

  const archiveImage = async () => {
    console.log("Image Archived!");
    const formData = new FormData();
    console.log(featuredImage ? featuredImage : (images.length > 0 ? images[0] : ''));
    formData.append('image', featuredImage ? featuredImage : (images.length > 0 ? images[0] : ''));//whatever was selected
    formData.append('prompt', prompt);
    formData.append('model', selectedModel); // Include the selected model
    formData.append('guidance', guidance);
    formData.append('inferenceSteps', inferenceSteps);
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
        for (let i = 0; i < numImages; i++) {
          const formData = new FormData();
          formData.append('prompt', prompt);
          formData.append('model', selectedModel); // Include the selected model
          // formData.append('guidance', guidance);
          // formData.append('')

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

  const goBack = () => {
    setImages(prevImages => []);
    setPageState('main');
  };

  const share = () => {
    console.log("Share/Download Image")
  };

  return (
    <>
      <div className="bg-second min-h-screen from-gray-100 to-gray-300">
        <div className="scrollable-container">
          {pageState === "main" && (
            <div className="container py-10 px-10 mx-0 min-w-full flex flex-col items-center">
              <h1 className="text-center text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r to-rose-600 from-lime-400">ImageGen</span>
              </h1>
              <br /><br />
              <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">
                Enter Image Description:
              </label>
              <br />
              <textarea
                id="prompt-input"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-2/3 h-24" // Adjusted width to 1/2 and height to 6rem
                placeholder="Enter Image Description"
                maxLength={MAX_CHAR_LIMIT}
                onChange={(e) => setPrompt(e.target.value)}
              ></textarea>
              <div className="text-right mt-2 text-sm text-gray-600">
                {`${prompt.length}/${MAX_CHAR_LIMIT} Characters Remaining`}
              </div>
              <br />
              <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">
                Choose Model:
              </label>
              <div className="flex space-x-4">
                <button className={`text-white font-bold py-2 px-4 rounded ${selectedModel === 'runwayml/stable-diffusion-v1-5' ? 'bg-buttonHover' : 'bg-blue-700'}`} onClick={() => setSelectedModel('runwayml/stable-diffusion-v1-5')}>
                  RunwayML (Low Detail)
                </button>
                <button className={`text-white font-bold py-2 px-4 rounded ${selectedModel === 'stabilityai/stable-diffusion-xl-base-1.0' ? 'bg-buttonHover' : 'bg-blue-700'}`} onClick={() => setSelectedModel('stabilityai/stable-diffusion-xl-base-1.0')}>
                  StabilityAI (High Detail)
                </button>
              </div>
              <br />
              {/* Dropdown for Image Settings */}
              <div className="relative inline-block text-left">
                <button
                  onClick={toggleImageSettings}
                  type="button"
                  className="inline-flex justify-between w-[27.4rem] rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-200 text-base font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                >
                  <span>Advanced Image Settings</span>
                  {/* Icon for dropdown */}
                  <svg
                    className={`-mr-1 ml-2 h-5 w-5 ${dropdownOpen ? 'transform rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 13.707a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 11.586l3.293-3.293a1 1 0 111.414 1.414l-4 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {/* Dropdown content */}
                {imageSettingsVisible && (
                  <div className="origin-top-right absolute right-0 w-[27.4rem] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="p-4">
                      {/* Guidance slider */}
                      <label htmlFor="guidance" className="block text-sm font-medium text-gray-700">
                        Guidance: {guidance}
                      </label>
                      <div className="flex justify-between items-center mt-1">
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.1"
                          value={guidance}
                          onChange={(e) => setGuidance(e.target.value)}
                          className="block w-full mt-1"
                        />
                        <span className="text-xs text-gray-500"></span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>More Strict</span>
                        <span>Less Strict</span>
                      </div>

                      {/* Number of Images slider */}
                      <label htmlFor="numImages" className="block mt-3 text-sm font-medium text-gray-700">
                        Number of Images: {numImages}
                      </label>
                      <div className="flex justify-between items-center mt-1">
                        <input
                          type="range"
                          min="1"
                          max="6"
                          step="1"
                          value={numImages}
                          onChange={(e) => setSteps(e.target.value)}
                          className="block w-full mt-1"
                        />
                        <span className="text-xs text-gray-500"></span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>1</span>
                        <span>6</span>
                      </div>

                      {/* Inference Steps slider */}
                      <label htmlFor="inferenceSteps" className="block mt-3 text-sm font-medium text-gray-700">
                        Inference Steps: {inferenceSteps}
                      </label>
                      <div className="flex justify-between items-center mt-1">
                        <input
                          type="range"
                          min="50"
                          max="150"
                          step="10"
                          value={inferenceSteps}
                          onChange={(e) => setInferenceSteps(e.target.value)}
                          className="block w-full mt-1"
                        />
                        <span className="text-xs text-gray-500"></span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Lower Quality but Faster</span>
                        <span>Higher Quality but Slower</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* End of Image Settings */}
              <br />
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded items-center" onClick={handleGen}>
                Generate Image
              </button>
            </div>
          )};

          {pageState === "loading" && (
            <div className="container py-10 px-10 mx-0 min-w-full flex flex-col items-center">
              <h1 className="text-center	  text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r to-rose-600 from-lime-400">ImageGen</span>
              </h1>
              <br /><br />

              <div className="text-center">
                <div role="status">
                  <svg aria-hidden="true" class="inline w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-pink-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <h3 className="text-white font-bold">Loading...</h3>
                  <p className="text-white font-bold">This may take a few seconds, please don't close this page.</p>
                </div>
              </div>
            </div>
          )}

          {pageState === "result" && (
            <>
              <div className="image-display text-center flex flex-col items-center overflow-hidden">
                <h3 className="text-white font-bold mb-1">Generated Featured Image:</h3>
                <div className="w-full max-w-[57vh]">
                  {images.length > 0 && (
                    <img className="h-auto w-full rounded-lg mb-1" src={featuredImage} alt="Featured Image" />
                  )}
                </div>
                {numImages > 1 && (
                  <h3 className="text-white font-bold mb-1">Generated Selectable Images:</h3>
                )}
                <div className="grid grid-cols-5 gap-4 w-full max-w-[57vh] mx-auto h-full">
                  {images.slice(1, 6).map((imageUrl, index) => (
                    <div key={index} className="w-full h-full" onClick={() => handleClickImage(imageUrl)}>
                      <img className="h-full w-full rounded-lg" src={imageUrl} alt={`Image ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="prompt-display text-center pt-2">
                <h2 className="text-white font-bold mb-2">Prompt:</h2>
                <textarea
                  readOnly
                  className="w-1/2 py-2 px-2 text-center text-white border rounded-lg focus:outline-none"
                  rows={1} // Use the calculated number of rows
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '10px',
                    borderRadius: '8px',
                    marginTop: '5px',
                    resize: 'none' // Disable textarea resizing
                  }}
                ></textarea>
              </div>
              <div className="flex justify-center space-x-28 mt-4">
                <button className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 w-24 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={() => goBack()}>
                  <svg className="w-5 h-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                  </svg>
                  <span>Back</span>
                </button>
                <button className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 w-48 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={() => archiveImage()}>
                  <span>Archive Featured</span>
                </button>
                <button className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 w-24 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={() => share()}>
                  <span>Share</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ImageGenPage;