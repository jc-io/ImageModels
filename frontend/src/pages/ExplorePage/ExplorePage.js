import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExplorePage = () => {
  const [images, setImages] = useState(null); // Set initial state to null
  const [selectedImage, setSelectedImage] = useState(null);
  const [mapTriggered, setMapTriggered] = useState(false);

  useEffect(() => {
    if (images === null) { // Check if images is null
      // Fetch user information using the token
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/get_user_info`)
        .then(response => {
          setImages(response.data.images);
          console.log(response.data);
        })
        .catch(error => {
          console.error('Error fetching user information:', error);
        });
    }
  }, [images]);

  // Function to handle image click
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Function to render each image card
  const renderImageCard = (image) => (
    <a key={image.src} href="#" className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80" onClick={(e) => { e.preventDefault(); handleImageClick(image); }}>
      <img src={image.src} loading="lazy" alt={image.description} className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>
      <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">{image.username}</span>
    </a>
  );

  // Modal component for displaying the selected image
  const ImageModal = ({ image, onClose }) => (
    image ? (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
        onClick={onClose}
      >
        <div
          style={{
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            display: 'inline-block',
            minHeight: '300px',
            margin: 'auto',
            position: 'relative',
            maxWidth: '80%',
            textAlign: 'center',
            color: 'black'
          }}
          onClick={e => e.stopPropagation()} // Prevent click from closing modal
        >
          <img src={image.src} alt={image.username} style={{ maxWidth: '100%', maxHeight: '80vh' }} />
          <h2>{image.username}</h2>
          <p>{image.model}</p>
          <p>{image.prompt}</p>
          <p>{image.description}</p>
        </div>
      </div>
    ) : null
  );

  return (
    <div className="bg-primary dark:bg-primary h-screen h-full py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="mb-4 flex items-center justify-between gap-8 sm:mb-8 md:mb-12">
          <div className="flex items-center gap-12">
            <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl dark:text-white">Gallery</h2>
            <p className="hidden max-w-screen-sm text-gray-500 dark:text-gray-300 md:block">
              This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text.
            </p>
          </div>
          <a href="#" className="inline-block rounded-lg border bg-white dark:bg-gray-700 dark:border-none px-4 py-2 text-center text-sm font-semibold text-gray-500 dark:text-gray-200 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:px-8 md:py-3 md:text-base">
            More
          </a>
        </div>

        {images !== null && images.length > 0 && ( // Check if images is not null
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 xl:gap-8">
            {images.map(image => renderImageCard(image))}
          </div>
        )}

      </div>
      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export default ExplorePage;
