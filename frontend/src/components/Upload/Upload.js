import { useEffect, useState } from 'react';

function Upload() {
    const [count, setCount] = useState(0);
    const [selectedFile, setSelectedFile] = useState(0);
    const [files, setFile] = useState(0);
  
    function handleClick() {
      setCount(count + 1);
    }
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(files);
        setSelectedFile(file);
    };
    const handleUpload = () => {
        // You can implement your file upload logic here
        if (selectedFile) {
          // Example: send the file to a server
          const formData = new FormData();
          formData.append('image', selectedFile);
    
    
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
        <div>
            <div className="container py-10 px-10 mx-0 min-w-full flex flex-col items-center">
                <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">ImageGen</h1>
            </div>
        {/* <button onClick={handleClick}>
            Clicked {count} times
        </button> */}
        <br/>
        <br/>
        {/* <input type="file" onChange={handleFileChange} /> */}
          

        <div className="container py-10 px-10 mx-0 min-w-full flex flex-col items-center">
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
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    



      <br/>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded items-center" onClick={handleUpload}>
        Upload
        </button>
</div>

      </div>
    );
  }

  export default Upload;
