import React from 'react';

const AboutPage = () => {
  return (
    <>
      <div className="bg-blue-400 relative overflow-hidden h-screen flex items-center justify-center">
      
      <img
        src="https://images.unsplash.com/photo-1498496294664-d9372eb521f3?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        className="absolute h-full w-full object-cover"
        alt="404 Background"
      />
        {/* <div className="text-center text-white"> */}
        <div className="container text-center relative items-center">

          <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight leading-none mb-4 dark:text-black">
            About
          </h1>
          <form className="max-w-md mx-auto p-6 bg-black rounded-md shadow-md">
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-lime-400">
              Welcome to our creative space! Explore a platform where you can
              upload photos for editing or input text to generate personalized
              images. Our advanced models, fueled by your prompts, bring your
              visions to life. Experience the power of artistic transformation
              with just a simple prompt—it's all you need to make a captivating
              edit on our site.
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
