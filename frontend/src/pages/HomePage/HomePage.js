// src/pages/AboutPage.js
import React from 'react';

const HomePage = () => {
  return (
    <div>
    
    <section className="bg-white dark:bg-gray-900 mt-16">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
            <div className="mr-auto place-self-center lg:col-span-7">
                <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
                    Edit Image w/ AI</h1>
                <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                "Edit Image w/ AI" feature harnesses the power of Pix2Pix and other cutting-edge ML models from Hugging Face. These models excel in image-to-image translation tasks, enabling your users to effortlessly enhance and modify their images through a seamless and intuitive interface on your website.</p>
                <p className='ax-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400'>
                    - ChatGPT</p>
                
                
                <a href="/EditImage" className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                    <button className="inline-flex items-center justify-center px-7 py-5 mr-3 text-base font-large text-center text-white bg-blue-500 hover:bg-blue-700 font-bold rounded-full">
                        Get started
                        <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button>
                </a>
                

            </div>
            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                <img src="https://images.firstpost.com/wp-content/uploads/2022/10/A-new-lease-of-life_-AI-based-tool-colourises-black-and-white-photos-automatically.jpg" alt="mockup"/>
            </div>                
        </div>
    </section>
    
    <section className="bg-white dark:bg-gray-900">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
            <div className="mr-auto place-self-center lg:col-span-7">
                <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
                    Image Generator using Generative AI</h1>
                <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                "Image Generator using Generative AI" feature leverages Stable Diffusion and Generative AI to empower users to create high-quality, diverse, and visually appealing images. The controlled diffusion process ensures stability, while the generative capabilities provide users with a dynamic and creative tool for image generation.
                </p>
                <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                - ChatGPT
                </p>
                <a href="/ImgGen" className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                <button className="inline-flex items-center justify-center px-7 py-5 mr-3 text-base font-large text-center text-white bg-blue-500 hover:bg-blue-700 font-bold rounded-full">
                        Get started
                        <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button>
                </a>

            </div>
            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                <img src="https://www.unite.ai/wp-content/uploads/2023/05/Screenshot-2023-05-02-at-4.23.22-PM.jpg" alt="mockup"/>
            </div>                
        </div>
    </section>

        <section className="bg-white dark:bg-gray-900">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
            <div className="mr-auto place-self-center lg:col-span-7">
                <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
                    Caption Generator</h1>
                <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                "Caption Generator" feature leverages the power of the BLIP model to provide users with automatically generated, contextually rich captions for their images. This multimodal approach ensures accurate and meaningful descriptions, enhancing the value and engagement of the visual content on your website.                    
                </p>
                <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                - ChatGPT
                </p>
                
                <a href="/CaptionGen" className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                <button className="inline-flex items-center justify-center px-7 py-5 mr-3 text-base font-large text-center text-white bg-blue-500 hover:bg-blue-700 font-bold rounded-full">
                        Get started
                        <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button>
                </a>

            </div>
            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                <img src="https://apps4lifehost.com/Instagram/og-image.jpg" alt="mockup"/>
            </div>                
        </div>
    </section>
    </div>
  );
};

export default HomePage;

