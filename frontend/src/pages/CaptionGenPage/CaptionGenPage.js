import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function CaptionGenPage() {
  const [selectedFiles, setSelectedFile] = useState([]);
  //State var to store caption
  const [caption, setCaption] = useState("Generating...");
  const [textareaRows, setTextareaRows] = useState(1);

  const [result, setResult] = useState("");
  const [pageState, setpageState] = useState("main");
  const [selectedTone, setSelectedTone] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  {
    /*Drop Down state Managment*/
  }
  const [showDropdown, setShowDropdown] = useState(false);

  /**
   * Goes back to the main state and resets all the variables
   * @function goBack
   */
  const goBack = () => {
    setSelectedTone("");
    setShowDropdown(false);
    setSelectedFile("");
    setpageState("main");
    setIsGenerating(false);
    setCaption("");
  };

  /**
   * This function is called when a tone is selected from the dropdown
   * @function handleSelectTone
   */
  const handleSelectTone = (tone) => {
    setSelectedTone(tone);
    setShowDropdown(false); // Close the dropdown
    handleMakeIt(); // Trigger the action associated with the tone selection
  };

  /**
   * This function is called when a tone is selected from the dropdown
   * @function handleToneChange
   */
  const handleToneChange = (event) => {
    setSelectedTone(event.target.value);
  };

  /**
   * Prevents default setting when taking input
   * @function handleDragOver
   */
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  /**
   * Saves the files when droppped
   * @function handleDrop
   */
  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    setSelectedFile(Array.from(files));
  };

  /**
   * Saves the files when there is files update
   * @function handleFileChange
   */
  const handleFileChange = (event) => {
    const files = event.target.files;

    setSelectedFile(Array.from(files));
  };

  /**
   * Deletes the uploaded file
   * @function handleRemoveFile
   */
  const handleRemoveFile = (index) => {
    console.log(selectedFiles);
    setSelectedFile((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });

    setCaption("");
  };

  /**
   * Sends request to the backend fir blip model after fetching the needed parameters and input
   * @function handleUpload
   */
  const handleUpload = () => {
    if (selectedFiles.length <= 0) {
      toast.warning("Upload a File!", { autoClose: 5000 });
    }
    if (selectedFiles.length > 0) {
      toast.info("Attempting Image Upload! Please wait for it to finish!", {
        autoClose: false,
      });
      const formData = new FormData();
      setCaption("Generating...");
      selectedFiles.forEach((file, index) => {
        formData.append(`file`, file);
      });

      console.log("uploading");

      // Sends the request to the backends
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/imageTotext`, formData)
        .then((response) => response.data)
        .then((data) => {
          setpageState("blip_phase");
          setCaption(data.caption);
          toast.dismiss();
          toast.success("Success!", { autoClose: 5000 });
        })
        .catch((error) => {
          toast.dismiss();
          console.error("Error:", error);
          toast.error("CaptionGen Failed to Generate.");
          setCaption("Failed to Generate Caption");
          goBack();
        });
    }
  };

  /**
   * Sends request to the backend fir LLM after fetching the needed parameters and input
   * @function handleMakeIt
   */
  const handleMakeIt = () => {
    if (selectedTone == "") {
      toast.error("Choose a tone!", { autoClose: 5000 });
    } else if (!isGenerating && caption && selectedTone) {
      setIsGenerating(true); // Disable the button
      toast.info(
        `Generating a ${selectedTone} Caption! Please wait for it to finish!`,
        { autoClose: false }
      );
      setCaption("Generating...");
      // if (caption && selectedTone) {
      //   setCaption('Generating...')
      const formDataTwo = new FormData();
      formDataTwo.append(`captionGenerated`, caption);
      formDataTwo.append(`tone`, selectedTone);
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/generateLLM`, formDataTwo)
        .then((response) => response.data)
        .then((data) => {
          setpageState("result");
          setCaption(caption);
          setResult(data.result);
          toast.dismiss();
          toast.success("Success!", { autoClose: 5000 });
        })
        .catch((error) => {
          toast.dismiss();
          console.error("Error:", error);
          toast.error("CaptionGen Failed to Generate.", { autoClose: 5000 });
          goBack();
        });
    }
  };

  return (
    <div className="m-0 bg-second dark:bg-second min-h-screen">
      <div className="container py-3 px-10 mx-0 min-w-full flex flex-col items-center">
        <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-rose-600 from-lime-400">
            CaptionGen
          </span>
        </h1>
      </div>

      {pageState === "main" && (
        <div className="bg-indigo-900 min-h-screen from-gray-100 to-gray-300">
          <div
            className="container py-10 px-10 mx-0 min-w-full flex flex-col items-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
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
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                multiple
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/gif, image/jpeg, image/png"
              />
            </label>

            {/* Display the list of selected files */}
            {selectedFiles.length > 0 && selectedFiles.length > 0 && (
              <div>
                <h2 className="max-w-lg text-3xl font-semibold leading-normal text-gray-900 dark:text-white">
                  Selected Files:
                </h2>
                <ul className="">
                  {selectedFiles.map((file, index) => (
                    <li key={index}>
                      <span className="tracking-tighter text-gray-500 md:text-lg dark:text-gray-400">
                        {file.name}
                      </span>{" "}
                      -{" "}
                      <button
                        type="button"
                        className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <svg
                          className="w-6 h-6 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 18 20"
                        >
                          <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <br />
            {/* Radio active */}

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded items-center"
              onClick={handleUpload}
            >
              Upload
            </button>
          </div>
        </div>
      )}
      {pageState === "blip_phase" && (
        <div>
          <div className="text-center">
            {/*Preview Image*/}
            {selectedFiles.length > 0 && (
              <div className="text-center mt-0 pt-0">
                <h2 className="text-3xl font-semibold leading-normal text-white">
                  Uploaded Image:
                </h2>
                <div className="flex justify-center items-center mt-5">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      style={{
                        border: "5px solid black",
                        borderRadius: "8px",
                        backgroundColor: "transparent",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Uploaded"
                        className="max-w-md"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Page  */}
            {pageState === "loading" && (
              <div className="container py-10 px-10 mx-0 min-w-full flex flex-col items-center">
                <h1 className="text-center	  text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                  <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r to-rose-600 from-lime-400">
                    CaptionGem
                  </span>
                </h1>
                <br />
                <br />

                <div className="text-center">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      class="inline w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-pink-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <h3 className="text-white font-bold">Loading...</h3>
                    <p className="text-white font-bold">
                      This may take a few seconds, please don't close this page.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/*Display Caption*/}
            <div className="caption-display">
              <h2 className="text-white font-bold mb-2 py-7">
                Generated Caption:
              </h2>
              <textarea
                readOnly
                className="w-1/2 py-2 px-2 text-center text-white border rounded-lg focus:outline-none"
                rows={textareaRows}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  padding: "20px",
                  borderRadius: "8px",
                  marginTop: "5px",
                  resize: "none",
                }}
              ></textarea>
            </div>
            <br />

            {/*Buttons*/}
            <center>
              <form className="max-w-2xl mb-6 font-light lg:mb-8 md:text-lg lg:text-xl text-white">
                <label
                  htmlFor="large"
                  className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
                >
                  Select a Tone
                </label>
                <select
                  id="large"
                  className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={selectedTone} // Bind the value of the select element to state
                  onChange={handleToneChange} // Call the handler function when the value changes
                >
                  <option value="">Choose a Tone</option>
                  <option value="Funny">Funny</option>
                  <option value="Witty">Witty</option>
                  <option value="Mysterious">Mysterious</option>
                  <option value="Satire">Satire</option>
                </select>
              </form>
            </center>
            <br />
            <div className="flex justify-center gap-4">
              <button
                onClick={() => goBack()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Back
              </button>

              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleMakeIt}
                disabled={isGenerating}
              >
                Generate
              </button>
            </div>
          </div>
          <br />
          <br />
        </div>
      )}

      {pageState === "result" && (
        <div>
          {/*Preview Image*/}
          {selectedFiles.length > 0 && (
            <div className="text-center mt-0 pt-0">
              <h2 className="text-3xl font-semibold leading-normal text-white">
                Uploaded Image:
              </h2>
              <div className="flex justify-center items-center mt-5">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      border: "5px solid black",
                      borderRadius: "8px",
                      backgroundColor: "transparent",
                    }}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Uploaded"
                      className="max-w-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Showing old and new caption */}
          <div className="caption-display text-center">
            <h3 className="text-white font-bold">
              Original Generated Caption:
            </h3>
            <div className="text-white font-extrabold font-size: 20px justify-center">
              {caption}
            </div>

            {/* Display Caption */}
            <div className="caption-display">
              <h2 className="text-white font-bold mb-2 py-7">
                New Generated Caption:
              </h2>
              <textarea
                readOnly
                className="w-1/2 text-center text-white border rounded-lg focus:outline-none"
                value={result}
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  padding: "20px",
                  borderRadius: "8px",
                  marginTop: "5px",
                  resize: "none",
                  overflow: "hidden",
                  height: "auto",
                  minHeight: "50px", // Minimum height to start with
                }}
                ref={(textarea) => {
                  if (textarea) {
                    textarea.style.height = `${textarea.scrollHeight}px`;
                  }
                }}
              ></textarea>
            </div>

            <br></br>
            {/* Back Button */}
            <button
              class="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
              onClick={() => goBack()}
            >
              <svg
                className="w-5 h-5 rtl:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                />
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
