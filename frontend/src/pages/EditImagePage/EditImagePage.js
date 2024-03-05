import { useState } from "react";
import axios from "axios";
import styles from "./EditImagePage.module.css";
import { FacebookShareButton, FacebookIcon } from "react-share";
import { TwitterShareButton, TwitterIcon } from "react-share";
const shareUrl = "https://www.youtube.com/";

function EditImagePage() {
  const [prompt, setPrompt] = useState("");
  const [selectedFiles, setSelectedFile] = useState([]);
  const [pageState, setpageState] = useState("main");
  const [images, setImages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  // // buttons

  // const togglePopup = () => {
  //   setIsOpen(!isOpen);
  // };
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // // buttons

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

  //img
  const [imageSrc, setImageSrc] = useState(null);

  const handleFileChanges = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //img

  const handleDrop = (event) => {
    // event.preventDefault();
    // const files = event.dataTransfer.files;
    // setSelectedFile(Array.from(files));
    //working
    // event.preventDefault();
    // const files = event.dataTransfer.files;
    // const imageFiles = Array.from(files).filter((file) =>
    //   file.type.startsWith("image/")
    // );
    // setSelectedFile((prevFiles) => [...prevFiles, ...imageFiles]);
    //working
    event.preventDefault();
    const files = event.dataTransfer.files;
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    setSelectedFile((prevFiles) => [...prevFiles, ...imageFiles]);

    const droppedImage = imageFiles[0]; // Assuming only one image is dropped
    if (droppedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(droppedImage);
    }
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

  const handleRemoveFile = (index) => {
    console.log(selectedFiles);
    setSelectedFile((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
    setImageSrc(null);
  };

  // # This function handles uplaoding the image correctly

  const handleUpload = () => {
    // You can implement your file upload logic here
    if (selectedFiles.length > 0) {
      // Example: send the file to a server
      const formData = new FormData();
      // Append each file to the FormData
      selectedFiles.forEach((file, index) => {
        formData.append(`file`, file);
      });
      formData.append("prompt", prompt);

      setpageState("loading");

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
          setGeneratedImageUrl(imageUrls[0]);
          // console.log(data);
          return data ? Promise.resolve(data) : Promise.resolve({});
        })
        .catch((error) => {
          console.error("Error:", error);
          alert(
            "An error occurred while uploading the image. Please try again later."
          );
          setpageState("main"); // Reset page state
          return Promise.reject(error);
        });
    }
  };

  // Testing function
  // This function will return the same uploaded image after waiting for 10 seconds. *** Replace with the function above when done testing
  // const handleUpload = () => {
  //   // Check if files are selected
  //   if (selectedFiles.length > 0) {
  //     // Set loading state
  //     setpageState("loading");

  //     // Simulate delay using setTimeout
  //     setTimeout(() => {
  //       // Reset loading state
  //       setpageState("result");

  //       // Get the uploaded image URL
  //       const uploadedImageUrls = selectedFiles.map((file) =>
  //         URL.createObjectURL(file)
  //       );

  //       // Set the uploaded image URLs as result
  //       setImages(uploadedImageUrls);

  //       // Reset page state after displaying the result
  //       // setTimeout(() => {
  //       //   setpageState('main');
  //       // }, 3000); // Change 3000 to 10000 for 10-second delay
  //     }, 5000); // Wait for 10 seconds
  //   }
  // };

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

        <br />
        <br />

        {pageState === "main" && (
          <div>
            <div
              className="container py-10 px-10 mx-0 min-w-full flex flex-col items-center parent"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {imageSrc ? (
                <div className="parent">
                  <div class="child">
                    {/* show the uploaded image */}
                    {selectedFiles.length > 0 && (
                      <div className="mt-4 relative">
                        <h2 className="text-3xl font-semibold leading-normal text-white"></h2>
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

                        <i
                          className="fa fa-times close-modal absolute top-2 right-2 cursor-pointer "
                          onClick={() => handleRemoveFile(0)}
                          style={{ color: "grey" }}
                        ></i>
                        {/* handleRemoveFile(0) --> this assume that there is only one file */}
                      </div>
                    )}
                  </div>
                  <div
                    class="child "
                    style={{ visibility: "hidden", margin: "5px" }}
                  >
                    <div class="spinner">
                      <div class="spinner1"></div>
                    </div>
                    <br></br>
                    <br></br>
                    <h3 className="text-white font-bold">Generating</h3>
                    {/* <p className="text-white font-bold">This may take a few seconds, please don't close this page.</p> */}
                  </div>

                  <label className="flex child flex-col items-center justify-center w-96 h-72 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex h-full flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">
                          The generated image will appear here
                        </span>{" "}
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
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
                    />
                  </label>

                  <div
                    class="child"
                    style={{ visibility: "hidden", margin: "5px" }}
                  >
                    <div class="spinner">
                      <div class="spinner1"></div>
                    </div>
                    <br></br>
                    <br></br>
                    <h3 className="text-white font-bold">Generating</h3>
                  </div>

                  <label className="flex child flex-col items-center justify-center w-96 h-72 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex h-full flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">
                          The generated image will appear here
                        </span>{" "}
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* Display the list of selected files */}
              {selectedFiles.length > 0 && selectedFiles.length > 0 && (
                <div className="flex flex-col items-center justify-center">
                  <h2 className="max-w-lg text-2xl font-semibold leading-normal text-gray-900 dark:text-white mt-10">
                    Selected Files:
                  </h2>
                  <ul className="flex justify-center mt-4">
                    {selectedFiles.map((file, index) => (
                      <li key={index}>
                        <span className="tracking-tighter text-gray-500 md:text-lg dark:text-gray-400">
                          {file.name}
                        </span>{" "}
                        - {/* Delete button */}
                        <button
                          class="button1 mt-4 "
                          onClick={() => handleRemoveFile(index)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 69 14"
                            class="svgIcon bin-top"
                          >
                            <g clip-path="url(#clip0_35_24)">
                              <path
                                fill="black"
                                d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"
                              ></path>
                            </g>
                            <defs>
                              <clipPath id="clip0_35_24">
                                <rect
                                  fill="white"
                                  height="14"
                                  width="69"
                                ></rect>
                              </clipPath>
                            </defs>
                          </svg>

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 69 57"
                            class="svgIcon bin-bottom"
                          >
                            <g clip-path="url(#clip0_35_22)">
                              <path
                                fill="black"
                                d="M20.8232 -16.3727L19.9948 -14.787C19.8224 -14.4569 19.4808 -14.25 19.1085 -14.25H4.92857C2.20246 -14.25 0 -12.1273 0 -9.5C0 -6.8727 2.20246 -4.75 4.92857 -4.75H64.0714C66.7975 -4.75 69 -6.8727 69 -9.5C69 -12.1273 66.7975 -14.25 64.0714 -14.25H49.8915C49.5192 -14.25 49.1776 -14.4569 49.0052 -14.787L48.1768 -16.3727C47.3451 -17.9906 45.6355 -19 43.7719 -19H25.2281C23.3645 -19 21.6549 -17.9906 20.8232 -16.3727ZM64.0023 1.0648C64.0397 0.4882 63.5822 0 63.0044 0H5.99556C5.4178 0 4.96025 0.4882 4.99766 1.0648L8.19375 50.3203C8.44018 54.0758 11.6746 57 15.5712 57H53.4288C57.3254 57 60.5598 54.0758 60.8062 50.3203L64.0023 1.0648Z"
                              ></path>
                            </g>
                            <defs>
                              <clipPath id="clip0_35_22">
                                <rect
                                  fill="white"
                                  height="57"
                                  width="69"
                                ></rect>
                              </clipPath>
                            </defs>
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <br />
              <br />

              <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">
                Enter Prompt:
              </label>
              <input
                htmlFor="Caption"
                type="text"
                id="default-input"
                placeholder="Example: Change the color of the background to red"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => setPrompt(e.target.value)}
                style={{ width: "700px" }} //change the size of prompt box
              />

              <br />

              <div className="flex justify-center mt-8 gap-60">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded items-center "
                  onClick={handleUpload}
                >
                  Generate
                </button>
                {/* <div class="dropdown">
                  <button class="dropbtn">Dropdown</button>
                  <div class="dropdown-content">
                    <div class="slider-container">
                      <label>Visiblity</label>
                      <input type="range"></input>
                    </div>
                    <div class="slider-container">
                      <label>Label 2:</label>
                      <input type="range"></input>
                    </div>
                    <div class="slider-container">
                      <label>Label 3:</label>
                      <input type="range"></input>
                    </div>
                    <div class="slider-container">
                      <label>Label 4:</label>
                      <input type="range"></input>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        )}
        {/* {pageState==="loading" && (
        <div> */}
        {pageState === "loading" && (
          <div class="parent">
            <div class="child">
              {/* show the uploaded image */}
              {selectedFiles.length > 0 && (
                <div className="mr-4">
                  <h2 className="text-3xl font-semibold leading-normal text-white"></h2>
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
                </div>
              )}
            </div>

            <div class="child" style={{ margin: "5px" }}>
              <div class="spinner">
                <div class="spinner1"></div>
              </div>
              <br></br>
              <br></br>
              <h3 className="text-white font-bold">Generating</h3>
              {/* <p className="text-white font-bold">This may take a few seconds, please don't close this page.</p> */}
            </div>

            <label className="flex child flex-col items-center justify-center w-96 h-72 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex h-full flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">
                    The generated image will appear here
                  </span>{" "}
                </p>
              </div>
            </label>
          </div>
        )}

        {pageState === "result" && (
          <div class="parent">
            <div className="image-display text-center">
              {/* <h3 className="text-white font-bold">Generated Image[s]:</h3> */}

              {/* show the uploaded image */}
              <div class="child">
                {selectedFiles.length > 0 && (
                  <div className="mr-4">
                    <h2 className="text-3xl font-semibold leading-normal text-white"></h2>
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
                  </div>
                )}
              </div>

              <div
                class="child "
                style={{ visibility: "hidden", margin: "5px" }}
              >
                <div class="spinner">
                  <div class="spinner1"></div>
                </div>
                <br></br>
                <br></br>
                <h3 className="text-white font-bold">Generating</h3>
                {/* <p className="text-white font-bold">This may take a few seconds, please don't close this page.</p> */}
              </div>
              {/* show the generated image */}
              <div class="child">
                {images.map((imageUrl, index) => (
                  <div>
                    <img
                      className="h-auto max-w-full rounded-lg max-w-md"
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
            {/* showing the uploaded image */}
            {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((imageUrl, index) => (
                      <div>
                        <img className="h-auto max-w-full rounded-lg" key={index} alt={`Image ${index + 1}`} src={imageUrl} />
                      </div>
                    ))
                    }
                </div>   */}

            {/* showing the prompt the user used */}
            <h3 className="text-white mt-20 font-bold">
              Prompt used: {prompt}
            </h3>
            {/* Buttons */}
            <div className="flex justify-center mt-8 gap-60">
              <button
                className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                onClick={() => setpageState("main")}
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
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded items-center"
                onClick={handleUpload}
              >
                Archive
              </button>

              <div>
                {modal && (
                  <div className="modal">
                    <div onClick={toggleModal} className="overlay"></div>
                    <div className="modal-content">
                      <div className="share-buttons">
                        <FacebookShareButton url={generatedImageUrl}>
                          <FacebookIcon size={50} round />
                        </FacebookShareButton>
                        <TwitterShareButton
                          url={generatedImageUrl} // Replace with actual image URL
                          title="Check out this image I generated"
                          hashtags={["imagegeneration", "react"]}
                        >
                          <TwitterIcon size={50} round />
                        </TwitterShareButton>
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
                    onClick={toggleModal}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Share
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
