import { useState } from "react";
import axios from "axios";
import styles from "./EditImagePage.module.css";
import { FacebookShareButton, FacebookIcon } from "react-share";
import { TwitterShareButton, TwitterIcon } from "react-share";
const shareUrl = "https://www.youtube.com/";
// const ImgComponent = (props) => {
//   return <div>{props.dog}</div>;
// };
function EditImagePage() {
  const [prompt, setPrompt] = useState("");
  const [selectedFiles, setSelectedFile] = useState([]);
  const [pageState, setpageState] = useState("main");
  const [images, setImages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);

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

  // const handleFileChanges = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setImageSrc(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

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

  // original function
  // const handleRemoveFile = (index) => {
  //   console.log(selectedFiles);
  //   setSelectedFile((prevFiles) => {
  //     const updatedFiles = [...prevFiles];
  //     updatedFiles.splice(index, 1);
  //     return updatedFiles;
  //   });
  //   setImageSrc(null);
  // };

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

          // const generatedImageUrl = URL.createObjectURL(selectedFiles[0]);
          // setGeneratedImageUrl(generatedImageUrl); // Set the generated image URL

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
  //     }, 10000); // Wait for 10 seconds
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
                  {/* <div className=""> */}
                  {/* <div class="child mx-0 "> */}
                  {/* show the uploaded image */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-1 relative w-full">
                      {/* <h2 className="text-3xl font-semibold leading-normal text-white"></h2> */}
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
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Display the list of selected files */}

              <br />
              <br />

              <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white w-full">
                Enter Prompt:
              </label>
              <input
                htmlFor="Caption"
                type="text"
                id="default-input"
                placeholder="Example: Change the color of the background to red"
                className="w-1/3 min-w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => setPrompt(e.target.value)}
                //change the size of prompt box
              />

              <br />

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
            {/* <div className="image-display text-center"> */}
            <div className="grid gap-x-80 items-center grid-flow-col min-w-48">
              {/* showing the uploaded image */}
              {/* <div className="grid justify-items-center w-full">
                {images.map((imageUrl, index) => (
                  <img
                    className="h-auto rounded-lg w-full"
                    key={index}
                    alt={`Image ${index + 1}`}
                    src={imageUrl}
                    style={{
                      border: "5px solid black",
                      borderRadius: "8px",
                      backgroundColor: "transparent",
                    }}
                  />
                ))}
              </div> */}
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
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
                    onClick={toggleModal}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-full"
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
