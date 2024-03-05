import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pageState, setpageState] = useState('main')
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  function routeChange() {
    window.location.href = '/explore';
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform signup logic here
    console.log('Signup form submitted');
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);

    const requestData = {
        username: username,
        password: password,
        email: email
    };

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, requestData)
        .then(response => {
            return response.data;
        })
        .then(data => {
            console.log(data);
            // Check if login is successful and get token
            if (data.token) {
                // Storing token in localStorage
                console.log('Token:', data.token);
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', username);
                routeChange();
            }
            return data ? Promise.resolve(data) : Promise.resolve({});
        })
        .catch(error => {
            console.error('Error:', error);
            if (error.response && error.response.status === 401) {
                // Username already exists, ask user to choose another
                toast.error('Login Not Authorized');
              } else {
                // Other error occurred, handle it accordingly
                toast.error('An error occurred. Please try again later.');
            }
            return Promise.reject(error);
        });
};


  return (
    <div className="relative">
        <video className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline>
        <source src="https://imagegenachieve.s3.amazonaws.com/tokyo-walk.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
        <section className="relative bg-transparent">
        {/* <video className="w-full h-full" autoPlay loop muted playsInline playbackRate={0.5}>
            <source src="https://imagegenachieve.s3.amazonaws.com/output.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video> */}
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
             <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
             <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 20">
                 <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.041 11.862A5 5 0 0 1 11 15.831V19M1 1v3.169a5 5 0 0 0 1.891 3.916M11 1v3.169a5 5 0 0 1-2.428 4.288l-5.144 3.086A5 5 0 0 0 1 15.831V19M1 3h10M1.399 6h9.252M2 14h8.652M1 17h10"/>
             </svg>
             <span className="self-center text-2xl font-semibold whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r to-rose-600 from-lime-400">ImageGen</span>    
             </a>
            <div className="opacity-85 w-full bg-black dark:bg-black rounded-lg dark:border-gray-700 shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign in to your account
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit} action="#">
                        <div>
                            <label for="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">username</label>
                            <input value={username} onChange={handleUsernameChange} type="username" name="username" id="username" placeholder="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                        </div>
                        <div>
                            <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input value={password} onChange={handlePasswordChange} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>
                                </div>
                                <div className="ml-3 text-sm">
                                    <label for="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                </div>
                            </div>
                            <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                        </div>
                        <button type="submit" className="w-full text-white bg-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don’t have an account yet? <a href="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
        </section>
        </div>
  );
};

export default LoginPage;
