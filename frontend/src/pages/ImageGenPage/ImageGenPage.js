// src/pages/NotFoundPage.js
import { React, useState } from 'react';

function ImageGenPage() {
  const [prompt, setPrompt] = useState('');
  const handleGen = () => {
      // You can implement your file upload logic here
      if (prompt.length > 0) {
          // Example: send the file to a server
        const formData = new FormData();
          // Append each file to the FormData

        formData.append('prompt',prompt);
    
    
        // Add your API call or upload logic here
        // For example using fetch or Axios
        fetch('http://127.0.0.1:5000/generate', {
          method: 'POST',
          body: formData
        }).then((res)=>{
            return res.text();
      })
      .then((data)=>{
          console.log(data);
          return new Promise((resolve, reject)=>{
              resolve(data ? JSON.parse(data) : {})
          })
      })


      }
    };
  return (
  <>
<div className="bg-indigo-900 min-h-screen from-gray-100 to-gray-300">
    <div className="scrollable-container">
    <h1 className="text-center	  text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r to-rose-600 from-lime-400">ImageGen</span>
            </h1>
      <div className="container py-10 px-10 mx-0 min-w-full flex flex-col items-center">



      
              <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">
              Enter Image Description:</label>
              <br/>
          <input htmlFor="Caption" type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setPrompt(e.target.value)}/>
          <br/>

          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded items-center" onClick={handleGen}>
          Generate Image
          </button>
     
          
      </div>
      </div>
</div>
  </>
  );
};

export default ImageGenPage;


// import { useState } from 'react';

// function ImageGenPage() {
//     const [selectedFiles, setSelectedFile] = useState([]);
//     const [caption, setCaption] = useState('');
  

//     const handleDragOver = (event) => {
//       event.preventDefault();
//     };
  
//     const handleDrop = (event) => {
//       event.preventDefault();
//       const files = event.dataTransfer.files;
//       setSelectedFile(Array.from(files));
//     };
//     const handleFileChange = (event) => {
//         const files = event.target.files;
     
//         setSelectedFile(Array.from(files));
//     };
//     const handleRemoveFile =(index)=> {
//       // console.log("remove: " + index);
//       // console.log(selectedFiles);
//       // setSelectedFile(selectedFiles.splice(selectedFiles.indexOf(index)));
//       // console.log(selectedFiles);
//       console.log(selectedFiles);
//       setSelectedFile((prevFiles) => {
//         const updatedFiles = [...prevFiles];
//         updatedFiles.splice(index, 1);
//         return updatedFiles;
//       });
//       //console.log(selectedFiles);
      
  
//     };
//     const handleUpload = () => {
//         // You can implement your file upload logic here
//         if (selectedFiles.length > 0) {
//           // Example: send the file to a server
//           const formData = new FormData();
//           // Append each file to the FormData
//           selectedFiles.forEach((file, index) => {
//             formData.append(`file`, file);
//           });
//           formData.append('caption',caption);
    
    
//           // Add your API call or upload logic here
//           // For example using fetch or Axios
//           fetch('http://127.0.0.1:5000/upload', {
//             method: 'POST',
//             body: formData
//           }).then((res)=>{
//             return res.text();
//         })
//         .then((data)=>{
//             console.log(data);
//             return new Promise((resolve, reject)=>{
//                 resolve(data ? JSON.parse(data) : {})
//             })
//         })


//         }
//       };
  
//     return (
//       <div className="bg-indigo-900 min-h-screen from-gray-100 to-gray-300">

//         <div className="scrollable-container">
//             <div className="container py-10 px-10 mx-0 min-w-full flex flex-col items-center">
//             <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"><span className="text-transparent bg-clip-text bg-gradient-to-r to-rose-600 from-lime-400">Edit Image</span></h1>
//             </div>

//         <br/>
//         <br/>
//         {/* <input type="file" onChange={handleFileChange} /> */}
    


//         <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//         GenCaption:</label>
//         <input htmlFor="Caption" type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setCaption(e.target.value)}/>
    

//         <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded items-center" onClick={handleUpload}>
//         Generate Image 
//         </button>
// </div>

//       </div>
//       </div>
//     );
//   }

//   export default ImageGenPage;



