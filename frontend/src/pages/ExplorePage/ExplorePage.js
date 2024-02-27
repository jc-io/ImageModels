import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Placeholder data to simulate fetched images
const placeholderImages = [
  { id: 1, src: 'https://via.placeholder.com/600x400', title: 'Image 1', description: 'A beautiful landscape' },
  { id: 2, src: 'https://via.placeholder.com/600x400', title: 'Image 2', description: 'A serene beach' },
  { id: 3, src: 'https://via.placeholder.com/600x400', title: 'Image 3', description: 'A bustling cityscape' },
  // Add more placeholders as needed
];

const ExplorePage = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/getImages');
        setImages(response.data.images); // Assuming the API returns an array of images
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, []);
  // Function to render each image card
  const renderImageCard = (image) => (
    <div key={image.id} style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '5px', overflow: 'hidden' }}>
      <img src={image.src} alt={image.title} style={{ width: '100%', height: 'auto' }} />
      <div style={{ padding: '15px' }}>
        <h2>{image.title}</h2>
        <p>{image.description}</p>
      </div>
    </div>
  );

  return (
    <div className="explore-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', padding: '1rem' }}>
      {images.map(renderImageCard)}
    </div>
  );
};

export default ExplorePage;
