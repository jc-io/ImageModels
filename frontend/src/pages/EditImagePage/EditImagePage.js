import { useState } from "react";
import axios from "axios";
import { FacebookShareButton, FacebookIcon } from "react-share";
import { TwitterShareButton, TwitterIcon } from "react-share";
import { toast } from 'react-toastify';
const shareUrl = "https://www.youtube.com/";



function EditImagePage() {
  const [prompt, setPrompt] = useState("");
  const [selectedFiles, setSelectedFile] = useState([]);
  const [pageState, setpageState] = useState("main");
  const [images, setImages] = useState([]);

  const [selectedModel, setSelectedModel] = useState(
    "runwayml/stable-diffusion-v1-5"
  ); // Default model selection
  const token = localStorage.getItem("token");
  const MAX_CHAR_LIMIT_LOWD = 100;
  const MAX_CHAR_LIMIT_HIGHD = 50;
  const MAX_SELECTED_CHAR_LIMIT =
    selectedModel === "runwayml/stable-diffusion-v1-5"
      ? MAX_CHAR_LIMIT_LOWD
      : MAX_CHAR_LIMIT_HIGHD;

  // Image settings state
  const [imageSettingsVisible, setImageSettingsVisible] = useState(false);
  const [guidance, setGuidance] = useState(7.5);
  const [strength, setStrength] = useState(0.8);
  const [inferenceSteps, setInferenceSteps] = useState(50);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Define dropdownOpen state variable

  const [featuredImage, setFeaturedImage] = useState("");
  //pop
  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
  };
  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }
  //pop

  const [imageSrc, setImageSrc] = useState(null);

  // download function
  const handleDownload = () => {
    if (images.length > 0) {
      const imageUrl = images[images.length - 1];
      const downloadLink = document.createElement("a");
      downloadLink.href = imageUrl;
      downloadLink.download = "generated_image.jpg"; // the filename for download

      downloadLink.click();
    }
  };
  const archiveImage = async () => {
    console.log("Image Archived!");
    const formData = new FormData();

    formData.append('image', images[0]);//whatever was selected
    formData.append('prompt', prompt);
    formData.append('model', selectedModel); // Include the selected model

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
  const chooseLowDetail = () => {
    setSelectedModel("runwayml/stable-diffusion-v1-5");
    document.getElementById("prompt-input").value = "";
    setPrompt((prevPrompt) => "");
  };
  const chooseHighDetail = () => {
    toast.warning("This is the XL-Generator, will take longer to load!", { autoClose: 5000});
    setSelectedModel("stabilityai/stable-diffusion-xl-base-1.0");
    document.getElementById("prompt-input").value = "";
    setPrompt((prevPrompt) => "");
  };
  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (selectedFiles.length > 0) {
      setSelectedFile(imageFiles);
    } else {
      setSelectedFile((prevFiles) => [...prevFiles, ...imageFiles]);
    }

    const droppedImage = imageFiles[0]; // Assuming only one image is dropped
    if (droppedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(droppedImage);
    }
  };

  const toggleImageSettings = () => {
    setImageSettingsVisible(!imageSettingsVisible);
    setDropdownOpen(!dropdownOpen); // Toggle dropdownOpen state
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const handleFileChange = (event) => {
    const files = event.target.files;
    setSelectedFile(Array.from(files));
    //
    //
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const goBack = () => {
    handleRemoveFile(0);
    setPrompt("")
    setpageState("main");
  };

  const handleRemoveFile = (index) => {
    setSelectedFile((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
    setImageSrc(null);

    // Clear the selectedFiles array completely
    setSelectedFile([]);
  };

  const handleUpload = () => {
    // You can implement your file upload logic here
    if (selectedFiles.length <= 0) {
      toast.warning("Upload a File!", { autoClose: 5000});
    }
    if (prompt.length <= 0) {
      toast.warning("Enter a Prompt!", { autoClose: 5000});
    }
    if (selectedFiles.length > 0 && prompt.length > 0) {
      // Example: send the file to a server
      const formData = new FormData();
      // Append each file to the FormData

      selectedFiles.forEach((file, index) => {
        formData.append(`file`, file);
      });

      formData.append("prompt", prompt);
      formData.append("model", selectedModel);
      formData.append("guidance", guidance);
      formData.append("inferenceSteps", inferenceSteps);
      formData.append("strength", strength);

      setpageState("loading");
      toast.info("Loading Image Upload! Please wait for it to finish!", { autoClose: false})
      // Add your API call or upload logic here
      // For example using fetch or Axios
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/editImage`, formData)
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          setpageState("result");
          // Check if data.images is an array before calling map
          const imageUrls = Array.isArray(data.images)
            ? data.images.map((image) => image.image_data)
            : [];
          setImages(imageUrls);
          setPrompt(data.prompt);
          toast.dismiss()
          toast.success("Success: Image(s) Generated!", { autoClose: 5000});
          return data ? Promise.resolve(data) : Promise.resolve({});
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.dismiss()
          toast.error('Image Failed to Generate. Make sure its an image file!', { autoClose: 5000});
          setPrompt("")
          setpageState("main"); // Reset page state
        });
    }
  };

  return (
    <div className="bg-second min-h-screen from-gray-100 to-gray-300">
      <div className="scrollable-container">
        <div className="container py-10 px-10 mx-0 min-w-full flex flex-col items-center">
          <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-rose-600 from-lime-400">
              Edit Image
            </span>
          </h1>
        </div>

        {pageState === "main" && (
          <div>
            <div
              className="container py-10 px-10 mx-0 min-w-full flex flex-col items-center parent"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {imageSrc ? (
                // The layout of the page when an image is uploaded
                <div>
                  {/* show the uploaded image */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-1 relative w-full">
                      <div
                        className="w-full"
                        style={{
                          border: "5px solid black",
                          borderRadius: "8px",
                          backgroundColor: "transparent",
                        }}
                      >
                        <img
                          src={URL.createObjectURL(selectedFiles[0])}
                          alt="Uploaded"
                          className="max-w-md w-full"
                        />
                      </div>

                      <i
                        className="fa fa-times close-modal absolute top-2 right-2 cursor-pointer "
                        onClick={() => handleRemoveFile(0)}
                        style={{ color: "red" }}
                      ></i>
                      {/* handleRemoveFile(0) --> this assume that there is only one file */}
                    </div>
                  )}

                  <div className="child w-full" style={{ marginLeft: "auto" }}>
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
                  </div>
                </div>
              ) : (
                // The layout of the page before uploading an image
                <div class="image-display text-center">
                  <div className="parent">
                    <label
                      htmlFor="dropzone-file"
                      className="flex child flex-col items-center justify-center w-96 h-72   border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex  flex-grow flex-col items-center justify-center pt-5 pb-6">
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
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG, or GIF (MAX. 800x400px)
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
                  </div>
                </div>
              )}

              {/* Display the list of selected files */}

              <br />
              <br />

              <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white w-full">
                <center>
                  Enter Prompt:
                </center>
              </label>
              <center>
              <input
                htmlFor="Caption"
                type="text"
                id="prompt-input"
                maxLength={MAX_SELECTED_CHAR_LIMIT}
                placeholder="Example: Change the color of the background to red"
                className="w-1/3 min-w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => setPrompt(e.target.value)}
                //change the size of prompt box
              />
              </center>
              <div className="text-right mt-2 text-sm text-gray-600">
                {`${prompt.length}/${MAX_SELECTED_CHAR_LIMIT} Characters Remaining`}
              </div>

              <br />
              <div className="relative inline-block text-left">
                <button
                  onClick={toggleImageSettings}
                  type="button"
                  className="inline-flex justify-between w-[27.4rem] rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-200 text-base font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                >
                  <span>Advanced Image Settings</span>
                  {/* Icon for dropdown */}
                  <svg
                    className={`-mr-1 ml-2 h-5 w-5 ${
                      dropdownOpen ? "transform rotate-180" : ""
                    }`}
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
                      <label
                        htmlFor="guidance"
                        className="block text-sm font-medium text-gray-700"
                      >
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
                        <span>More Strict to Prompt</span>
                        <span>Less Strict to Prompt</span>
                      </div>

                      {/* Strength slider */}
                      <label
                        htmlFor="strength"
                        className="block mt-3 text-sm font-medium text-gray-700"
                      >
                        Strength: {strength}
                      </label>
                      <div className="flex justify-between items-center mt-1">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={strength}
                          onChange={(e) => setStrength(e.target.value)}
                          className="block w-full mt-1"
                        />
                        <span className="text-xs text-gray-500"></span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Less creative</span>
                        <span>More creative</span>
                      </div>

                      {/* Inference Steps slider */}
                      <label
                        htmlFor="inferenceSteps"
                        className="block mt-3 text-sm font-medium text-gray-700"
                      >
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

              <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">
                Choose Model:
              </label>
              <div className="flex space-x-4">
                <button
                  className={`text-white font-bold py-2 px-4 rounded ${
                    selectedModel === "runwayml/stable-diffusion-v1-5"
                      ? "bg-buttonHover"
                      : "bg-blue-700"
                  }`}
                  onClick={() => chooseLowDetail()}
                >
                  RunwayML (Low Detail)
                </button>
                <button
                  className={`text-white font-bold py-2 px-4 rounded ${
                    selectedModel === "stabilityai/stable-diffusion-xl-base-1.0"
                      ? "bg-buttonHover"
                      : "bg-blue-700"
                  }`}
                  onClick={() => chooseHighDetail()}
                >
                  StabilityAI (High Detail)
                </button>
              </div>

              <div className="flex justify-center mt-8 gap-60">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded items-center "
                  onClick={handleUpload}
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        )}

        {pageState === "loading" && (
          <div className="w-3/5 m-auto max-w-[1220px]">
            <div className="grid gap-x-80 items-center grid-flow-col min-w-48">
              <div class="grid justify-items-center w-full">
                {/* show the uploaded image */}
                {selectedFiles.length > 0 && (
                  <div
                    style={{
                      border: "5px solid black",
                      borderRadius: "8px",
                      backgroundColor: "transparent",
                    }}
                  >
                    <img
                      src={URL.createObjectURL(selectedFiles[0])}
                      alt="Uploaded"
                      className="max-w-md"
                    />
                  </div>
                )}
              </div>

              <div class="grid justify-items-center w-full">
                <div class="spinner">
                  <div class="spinner1"></div>
                </div>
                <br></br>
                <br></br>
                <h3 className="justify-self text-white font-bold">
                  Generating
                </h3>
              </div>
            </div>
          </div>
        )}

        {pageState === "result" && (
          <div className="w-3/5 m-auto max-w-[1220px]">
            <div className="grid gap-x-80 items-center grid-flow-col min-w-48">
              {imageSrc && (
                <div className="grid justify-items-center w-full">
                  <img
                    className="h-auto rounded-lg w-full"
                    src={imageSrc}
                    alt="Uploaded"
                    style={{
                      border: "5px solid black",
                      borderRadius: "8px",
                      backgroundColor: "transparent",
                    }}
                  />
                </div>
              )}

              {/* show the generated image */}
              <div className="grid justify-items-center w-full">
                {images.map((imageUrl, index) => (
                  <div>
                    <img
                      className="h-auto  rounded-lg w-full"
                      key={index}
                      alt={`Image ${index + 1}`}
                      src={imageUrl}
                      style={{
                        border: "5px solid black",
                        borderRadius: "8px",
                        backgroundColor: "transparent",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* showing the prompt the user used */}
            <h3 className="text-white mt-20 font-bold inline-block text-center w-full mb-8">
              Prompt used: {prompt}
            </h3>
            {/* Buttons */}
            <div className="flex gap-1 w-full mt-8 justify-between">
              <button
                className=" bg-blue-500 hover:bg-blue-400 text-white flex gap-2 font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                onClick={() => goBack()}
              >
                <svg
                  className="w-5 h-5 rtl:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                  />
                </svg>
                <span> Back</span>
              </button>

              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={archiveImage}
              >
                Archive
              </button>

              <div>
                {modal && (
                  <div className="modal">
                    <div onClick={toggleModal} className="overlay"></div>
                    <div className="modal-content">
                      <div className="share-buttons">
                        <FacebookShareButton url={shareUrl}>
                          <FacebookIcon size={50} round />
                        </FacebookShareButton>
                        <TwitterShareButton
                          url={shareUrl} // Replace with actual image URL
                          title="Check out this image I generated"
                          hashtags={["imagegeneration", "react"]}
                        >
                          <TwitterIcon size={50} round />
                        </TwitterShareButton>

                        {/* downbload button */}
                        <button
                          onClick={handleDownload}
                          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                        >
                          <svg
                            class="fill-current w-4 h-4 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                          </svg>
                        </button>
                      </div>

                      <i
                        class="fa fa-times close-modal text-red-500"
                        onClick={toggleModal}
                      ></i>
                    </div>
                  </div>
                )}

                <>
                  <button
                    onClick={handleDownload}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-full"
                  >
                    Download
                  </button>
                </>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditImagePage;
