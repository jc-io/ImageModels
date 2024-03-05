import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExplorePage = () => {
  const [images, setImages] = useState(null); // Initialize images as null
  const [selectedImage, setSelectedImage] = useState(null);
  const [mapTriggered, setMapTriggered] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/getImages`,
          { crossorigin: true, headers: {
            "ngrok-skip-browser-warning": "69420"
          } },
        ).then(response => {
          console.log(response.data);
          const imagesGrabbed = Array.isArray(response.data.images) ? response.data.images : null;
          setImages(imagesGrabbed);

        });
        
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    

    if (images === null) {
      fetchImages();
    }
  }, [images]); // Run the effect whenever images changes

  // Function to handle image click
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Function to render each image card
  const renderImageCard = (image) => (
    <a key={image._id} href="#" className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80" onClick={(e) => { e.preventDefault(); handleImageClick(image); }}>
      <img src={image.src} loading="lazy" alt={image.description} className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>
      <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">{image.username}</span>
    </a>
  );

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
            width: '35vw', // 80% of the viewport width
            height: '80vh', // 80% of the viewport height
            padding: 0,
            backgroundColor: '#fff',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            color: 'black',
            overflow: 'hidden',
          }}
          onClick={e => e.stopPropagation()} // Prevent click from closing modal
        >
          <img src={image.src} alt={image.username} style={{
            minHeight: '75%', // Scale up the image to be in the range
            maxHeight: '75%', // Limit the image height to ensure text space
            objectFit: 'contain', // Maintain aspect ratio without cropping
            marginBottom: '10px', // Space between the image and the text
          }} />
          <div style={{ textAlign: 'center', overflowY: 'auto', maxHeight: '30%' }}>
            <h2>User: {image.username}</h2>
            <p>Model: {image.model}</p>
            <p>Prompt: {image.prompt}</p>
            <p>Description: {image.description}</p>
          </div>
        </div>
      </div>
    ) : null
  );

  return (
    <div className="bg-primary dark:bg-primary min-h-screen py-6 sm:py-8 lg:py-12"> {/* Changed h-screen to min-h-screen */}
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="mb-4 flex items-center justify-between gap-8 sm:mb-8 md:mb-12">
          <div className="flex items-center gap-12">
            <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl dark:text-white">Gallery</h2>
            <p className="hidden max-w-screen-sm text-gray-500 dark:text-gray-300 md:block">
              Explore what others are creating with our models here! 
            </p>
          </div>
        </div>
  
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 xl:gap-8">
          {images?.map(image => renderImageCard(image, setSelectedImage))}
        </div>
      </div>
      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};  

export default ExplorePage;