import React from 'react';

const HomePage = () => {
  return (
    <div>
    <section className="relative w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://miro.medium.com/v2/resize:fit:1080/format:webp/1*jcccm053U2EO63bwb55czw.gif')" }}>
      <video className="absolute inset-0 object-cover w-full h-full" autoPlay loop muted playsInline playbackRate={0.5}>
        <source src="https://imagegenachieve.s3.amazonaws.com/output.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="flex items-center justify-center h-screen">
        <div className="inset-0 justify-center items-center text-white z-10">
          <h1 className="text-4xl font-bold dark:text-white">Welcome to ImageGen</h1>

            {/* Alternatively, you can replace "Get Started" with "Login" */}
            <a href="/ImageGen" className="flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-transparent">
            <button className="px-6 py-3 bg-transperant text-white hover:text-black border-solid border-2 border-sky-500 rounded-lg font-semibold hover:bg-white">
                        Get started
                    </button>
                </a>

        </div>
      </div>
    </section>

    <section className="text-white dark:bg-fifth">
        
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
            <div className="mr-auto place-self-center lg:col-span-7">
                <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
                    Edit Image w/ AI</h1>
                <p className="max-w-2xl mb-6 font-light lg:mb-8 md:text-lg lg:text-xl">
                "Edit Image w/ AI" feature harnesses the power of Stable Diffusion and other cutting-edge ML models from Hugging Face. These models excel in image-to-image translation tasks, enabling you to effortlessly enhance and modify their images through a seamless and intuitive interface on our website.</p>
               
                
                
                <a href="/EditImage" className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                    <button className="inline-flex items-center justify-center px-7 py-5 mr-3 text-base font-large text-center text-white bg-button hover:bg-buttonHover font-bold rounded-full">
                        Get started
                        <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </a>
                

            </div>
            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                <img src="https://images.firstpost.com/wp-content/uploads/2022/10/A-new-lease-of-life_-AI-based-tool-colourises-black-and-white-photos-automatically.jpg" alt="mockup"/>
            </div>                
        </div>
    </section>
    
    <section className="dark:bg-third text-white">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
            <div className="mr-auto place-self-center lg:col-span-7">
                <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
                    Image Generator using Generative AI</h1>
                <p className="max-w-2xl mb-6 font-light lg:mb-8 md:text-lg lg:text-xl">
                "Image Generator using Generative AI" feature leverages Stable Diffusion and Generative AI to empower users to create high-quality, diverse, and visually appealing images. The controlled diffusion process ensures stability, while the generative capabilities provide you with a dynamic and creative tool for image generation.
                </p>
              
                <a href="/ImageGen" className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                <button className="inline-flex items-center justify-center px-7 py-5 mr-3 text-base font-large text-center text-white bg-button hover:bg-buttonHover font-bold rounded-full">
                        Get started
                        <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </a>

            </div>
            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                <img src="https://miro.medium.com/v2/resize:fit:1080/1*jcccm053U2EO63bwb55czw.gif" alt="mockup"/>
            </div>                
        </div>
    </section>
    {/* <section class="bg-white dark:bg-gray-900">

  <img className="h-auto w-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBasi7qj8gQ3x9msZSSaefaFBbP57yA5xIIg&usqp=CAU" alt="image description"/>

</section> */}

        <section className="bg-white dark:bg-second text-white">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
            <div className="mr-auto place-self-center lg:col-span-7">
                <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
                    Caption Generator</h1>
                <p className="max-w-2xl mb-6 font-light lg:mb-8 md:text-lg lg:text-xl">
                "Caption Generator" feature leverages the power of the BLIP model to provide you with automatically generated, contextually rich captions for images. The next step to enhancing the caption using using a Large Language Model (LLM) is also available. This feature is perfect for generating captions for images, and it can be used in a variety of applications, including social media, content creation, and more.                    
                </p>
                <p className="max-w-2xl mb-6 font-light lg:mb-8 md:text-lg lg:text-xl">
                    Get started and generate captions for your images now! No need to comtemplate on what to write. Just upload your image and let our AI do the work for you. You CHOOSE the tone. You CHOOSE the style. You CHOOSE the length. Our AI will do the rest.
                </p>
             
                
                <a href="/CaptionGen" className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                <button className="inline-flex items-center justify-center px-7 py-5 mr-3 text-base font-large text-center text-white bg-button hover:bg-buttonHover font-bold rounded-full">
                        Get started
                        <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </a>

            </div>
            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBasi7qj8gQ3x9msZSSaefaFBbP57yA5xIIg&usqp=CAU" alt="mockup"/>
            </div>                
        </div>
    </section>
    </div>
  );
};

export default HomePage;



