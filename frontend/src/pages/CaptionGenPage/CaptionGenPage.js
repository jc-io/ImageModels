import { useState } from 'react';
import axios from 'axios';


function CaptionGenPage() {
    const [selectedFiles, setSelectedFile] = useState([]);
    //State var to store caption
    const [caption, setCaption] = useState('')
    const [textareaRows, setTextareaRows] = useState(1);
    
    const [result, setResult] = useState('')
    const [pageState, setpageState] = useState('main')
    const [selectedTone, setSelectedTone] = useState('');

    {/*Drop Down state Managment*/}
    const [showDropdown, setShowDropdown] = useState(false);

    // This function is called when a tone is selected from the dropdown
    const handleSelectTone = (tone) => {
        setSelectedTone(tone);
        setShowDropdown(false); // Close the dropdown
        handleMakeIt(); // Trigger the action associated with the tone selection
    };
    
  
    // Handler function to update the selected tone when the user makes a selection
    const handleToneChange = (event) => {
      setSelectedTone(event.target.value);
    };
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

      console.log(selectedFiles);
      setSelectedFile((prevFiles) => {
        const updatedFiles = [...prevFiles];
        updatedFiles.splice(index, 1);
        return updatedFiles;
      });

      setCaption('');
      
  
    };

    const handleUpload = () => {
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file, index) => {
          formData.append(`file`, file);
        });
        console.log("uploading");
        setpageState('blip_phase');
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/imageTotext`, formData)
          .then(response => response.data)
          .then(data => {
            setCaption(data.caption);
          })
          .catch(error => console.error('Error:', error));
      }
    };
  
    const handleMakeIt = () => {
      if (caption && selectedTone) {
        const formDataTwo = new FormData();
        formDataTwo.append(`captionGenerated`, caption);
        formDataTwo.append(`tone`, selectedTone);
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/generateLLM`, formDataTwo)
          .then(response => response.data)
          .then(data => {
            setpageState('result');
            setResult(data.result);
          })
          .catch(error => console.error('Error:', error));
      } else {
        console.error('Caption or tone is not available');
      }
    };

    return (

      <div className="m-0 bg-second dark:bg-second" style={{ minHeight: '100vh' }}>

        <div className="container py-3 px-10 mx-0 min-w-full flex flex-col items-center">
            <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r to-rose-600 from-lime-400">CaptionGen</span></h1>
        </div>

        {/*Main state*/}
  
        {pageState==="main" && (  
          <div className="bg-indigo-900 min-h-screen from-gray-100 to-gray-300">
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
      )}

      {/*BLIP STATE*/}
      {pageState==="blip_phase" && (
        <div>
      
        <div className="text-center">

          {/*Preview Image*/}
          {selectedFiles.length > 0 && (
          <div className="text-center mt-0 pt-0">
            <h2 className="text-3xl font-semibold leading-normal text-white">Uploaded Image:</h2>
            <div className="flex justify-center items-center mt-5">
              {selectedFiles.map((file, index) => (
                <div key={index} style={{ border: '5px solid black', borderRadius: '8px', backgroundColor: 'transparent'}}>
                  <img src={URL.createObjectURL(file)} alt="Uploaded" className="max-w-md" />
                </div>
              ))}
            </div>
          </div>
        )}


          {/*Display Caption*/}
          <div className="caption-display">
            <h2 className="text-white font-bold mb-2 py-7">Generated Caption:</h2>
            <textarea
                readOnly 
                className="w-1/2 py-2 px-2 text-center text-white border rounded-lg focus:outline-none"
                rows={textareaRows} // Use the calculated number of rows
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '20px',
                    borderRadius: '8px',
                    marginTop: '5px',
                    resize: 'none' // Disable textarea resizing
                }}
            ></textarea>
        </div>

        
            <br/><br/>
            
            {/*Buttons*/}
            <div className="flex justify-center gap-4">
              <button 
              onClick={() => setpageState('main')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Back
              </button>
                
            {/*Original*/}
              {/* <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleMakeIt}
                >
                Make it
              </button> */}

                {/*Original end*/}


              
              {/* <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setIsDropdownVisible(!isDropdownVisible)}>
                Make it
              </button>
              
            {isDropdownVisible && (
              <form className="mb-4">
                  <label htmlFor="tone-dropdown" className="text-gray-700">Select a Tone:</label>
                  <select
                    id="tone-dropdown"
                    className="block w-full px-4 py-2 mt-2 bg-white border rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    value={selectedTone}
                    onChange={(event) => {
                      setSelectedTone(event.target.value);
                      setIsDropdownVisible(false); 
                      handleMakeIt();
                    }}
                  >
                    <option value="">Choose a Tone</option>
                    <option value="Funny">Funny</option>
                    <option value="Witty">Witty</option>
                    <option value="Mysterious">Mysterious</option>
                    <option value="Satire">Satire</option>
                  </select>
              </form>
            )} */}


            {/*dropdown test*/}
            <div className='relative inline-block text-left'>

            <button
                  id="dropdownDefaultButton"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}>
                  Make it 
                      <svg className="w-2.5 h-2.5 ml-2" aria-hidden="true" fill="none" viewBox="0 0 10 6">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l4 4 4-4" />
                  </svg>
                    </button>

                        {/* Dropdown menu */}
                        {showDropdown && (
                            <div className="origin-top-right absolute left-0 mt-1 rounded-md shadow-lg bg-black ring-1 ring-black ring-opacity-5" style={{ top: '100%', left: '0' }}>
                              <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                  <li>
                                  <button className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-black" onClick={() => handleSelectTone('Funny')}>Funny</button>
                                </li>
                                <li>
                                  <button className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-black" onClick={() => handleSelectTone('Witty')}>Witty</button>
                                </li>
                                <li>
                                  <button className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-black" onClick={() => handleSelectTone('Mysterious')}>Mysterious</button>
                                </li>
                                <li>
                                  <button className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-black" onClick={() => handleSelectTone('Satire')}>Satire</button>
                                </li>
                              </ul>
                            </div>
                        )}

            </div>
            {/*dropdown test end*/}


              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Share
              </button>
            </div>
        </div>
        </div>
        
      )}




      {/*Result State*/}

    {pageState==="result" && (
      <div>
    <div className="caption-display text-center">
        <h3 className="text-white font-bold">Generated Caption:</h3>
          <div className='text-white font-extrabold font-size: 20px justify-center'>{result}</div>
          <br></br>
          <button class="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={() => setpageState('main')}>
              <svg className="w-5 h-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
              </svg>
              <span> Back</span>
          </button>
    </div>
    </div>
    )}
      </div>
    );
  }

  export default CaptionGenPage;