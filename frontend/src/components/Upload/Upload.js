import { useEffect, useState } from 'react';

function Upload() {
    const [count, setCount] = useState(0);
    const [selectedFiles, setSelectedFile] = useState([]);
  
    function handleClick() {
      setCount(count + 1);
    }
    const handleDragOver = (event) => {
      event.preventDefault();
    };
  
    const handleDrop = (event) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      setSelectedFile(Array.from(files));
    };
    const handleFileChange = (event) => {
        const files = event.target.files;
     
        setSelectedFile(Array.from(files));
    };
    const handleRemoveFile =(index)=> {
      // console.log("remove: " + index);
      // console.log(selectedFiles);
      // setSelectedFile(selectedFiles.splice(selectedFiles.indexOf(index)));
      // console.log(selectedFiles);
      console.log(selectedFiles);
      setSelectedFile((prevFiles) => {
        const updatedFiles = [...prevFiles];
        updatedFiles.splice(index, 1);
        return updatedFiles;
      });
      //console.log(selectedFiles);
      
  
    };
    const handleUpload = () => {
        // You can implement your file upload logic here
        if (selectedFiles.length > 0) {
          // Example: send the file to a server
          const formData = new FormData();
          // Append each file to the FormData
          selectedFiles.forEach((file, index) => {
            formData.append(`file`, file);
          });
    
    
          // Add your API call or upload logic here
          // For example using fetch or Axios
          fetch('http://127.0.0.1:5000/upload', {
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
        <div className="scrollable-container">
            <div className="container py-10 px-10 mx-0 min-w-full flex flex-col items-center">
            <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"><span className="text-transparent bg-clip-text bg-gradient-to-r to-rose-600 from-lime-400">ImageGen</span></h1>
            </div>
        {/* <button onClick={handleClick}>
            Clicked {count} times
        </button> */}
        <br/>
        <br/>
        {/* <input type="file" onChange={handleFileChange} /> */}
          

        <div className="container py-10 px-10 mx-0 min-w-full flex flex-col items-center" onDrop={handleDrop} onDragOver={handleDragOver}>
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            ></path>
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG, or GIF (MAX. 800x400px)</p>
        </div>
        <input
          id="dropzone-file"
          multiple
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    
      {/* Display the list of selected files */}
      {selectedFiles.length > 0 && (selectedFiles.length > 0 && (
        <div>
          <h2 className="max-w-lg text-3xl font-semibold leading-normal text-gray-900 dark:text-white">Selected Files:</h2>
          <ul className="">
            {selectedFiles.map((file, index) => (
              <li key={index}>
                <span className="tracking-tighter text-gray-500 md:text-lg dark:text-gray-400">
                {file.name}</span> - <button type="button" className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={() => handleRemoveFile(index)}>
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
    <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z"/>
  </svg></button>
              </li>
            ))}
          </ul>
        </div>
      )) }


      <br/>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded items-center" onClick={handleUpload}>
        Upload 
        </button>
</div>

      </div>
    );
  }

  export default Upload;
