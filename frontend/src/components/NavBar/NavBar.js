import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';


function NavBar() {
    const [y, setY] = useState(window.scrollY);
    const token = localStorage.getItem('token');
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNavBarDown, setIsNavBarDown] = useState(false);

    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };
    const handleNavigation = useCallback(
        e => {
          const window = e.currentTarget;
          if (y > window.scrollY) {
            console.log("scrolling up");
          } else if (y < window.scrollY) {
            console.log("scrolling down");
          }
          setY(window.scrollY);
        //   console.log(window.scrollY)


        }, [y]
      );
      const handleSignOut = () => {
        // Send sign out request to backend
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/signout`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            // Handle successful sign out
            console.log('Sign out successful');
            // Clear user and token from local storage
            localStorage.removeItem('token');
            setUser(null);
        })
        .catch(error => {
            // Handle sign out error
            console.error('Error signing out:', error);
        });
    };

    useEffect(() => {
        if (token) {
            // Fetch user information using the token
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/get_user_info`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "69420"
                }
            })
            .then(response => {
                setUser(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching user information:', error);
            });
        }
        // Check if the current URL is the home ("/") URL
        const isHome = window.location.pathname === '/';
        const isCaptionGen = window.location.pathname === '/CaptionGen';
        const isSignUp = window.location.pathname === '/signup';
        const isLogin = window.location.pathname === '/login';
        const isEditImage = window.location.pathname === '/EditImage';
        const isImageGen = window.location.pathname === '/ImageGen';
        const isAbout = window.location.pathname === '/About';
        const isExplore = window.location.pathname === '/Explore';

        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

  
   
        setY(window.scrollY);
        window.addEventListener("scroll", handleNavigation);
        
        
      
    
        // If it is the home page, add the 'fixed-navbar' class
        if (isHome || isSignUp || isLogin) {
          document.getElementById('navbar').classList.add('fixed');
          document.getElementById('navbar-home').classList.add('md:text-blue-700');
          document.getElementById('navbar').classList.remove('border-b', 'border-gray-200', 'dark:border-gray-600');
        } else {
          // If it's not the home page, remove the 'fixed-navbar' class
          document.getElementById('navbar').classList.remove('fixed');
          document.getElementById('navbar-home').classList.remove('md:text-blue-700');
          document.getElementById('navbar').classList.add('border-b', 'border-gray-200', 'dark:border-gray-600');
        }
        if ((isHome || isSignUp || isLogin) && (y<windowHeight)){
            document.getElementById('navbar').classList.add('bg-transperant');
            document.getElementById('navbar').classList.remove('bg-primary');
            console.log("showing transp")
        }else {
            document.getElementById('navbar').classList.remove('bg-transperant');
            document.getElementById('navbar').classList.add('bg-primary');
            console.log("showing prim")

        }
        if (isCaptionGen){//md:text-blue-700
            document.getElementById('navbar-caption').classList.add('md:text-blue-700');
        }else{
            document.getElementById('navbar-caption').classList.remove('md:text-blue-700');
        }
            
        if (isEditImage){//md:text-blue-700
            document.getElementById('navbar-editImage').classList.add('md:text-blue-700');
        }else{
            document.getElementById('navbar-editImage').classList.remove('md:text-blue-700');  
        }
        if (isImageGen){//md:text-blue-700
            document.getElementById('navbar-imageGen').classList.add('md:text-blue-700');
        }else{
            document.getElementById('navbar-imageGen').classList.remove('md:text-blue-700');  
        }
        if (isExplore){//md:text-blue-700
            document.getElementById('navbar-Explore').classList.add('md:text-blue-700');
        }else{
            document.getElementById('navbar-Explore').classList.remove('md:text-blue-700');  
        }
        if (isAbout){//md:text-blue-700
            document.getElementById('navbar-About').classList.add('md:text-blue-700');
            // document.getElementById('navbar').classList.add('hidden');


        }else{
            document.getElementById('navbar-About').classList.remove('md:text-blue-700');  
            // document.getElementById('navbar').classList.remove('hidden');

        }
            // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener("scroll", handleNavigation);
        };

      }, [handleNavigation, token]); // Empty dependency array to run the effect only once on mount
  
    return (
        <div >
            <nav id="navbar" className="drak:bg-primary w-full z-20 top-0 start-0">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            {/* logo click goes to home */}
            <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                {/* <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo"/> */}
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.041 11.862A5 5 0 0 1 11 15.831V19M1 1v3.169a5 5 0 0 0 1.891 3.916M11 1v3.169a5 5 0 0 1-2.428 4.288l-5.144 3.086A5 5 0 0 0 1 15.831V19M1 3h10M1.399 6h9.252M2 14h8.652M1 17h10"/>
            </svg>
                <span className="self-center text-2xl font-semibold whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r to-rose-600 from-lime-400">ImageGen</span>
            </a>
            <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                {(!token || !user) && (
                            <>
                                <a href="/login">
                                    {/* <button type="button" className="px-4 py-2 rounded-l-lg text-white m-0 bg-transperant hover:bg-transperant border-solid border-2 border-transperant transition">
                                        Login
                                        
                                    </button> */}

                                        <button class="bg-transparent hover:underline text-white font-semibold hover:text-white py-2 px-4 hover:border-transparent rounded">
                                        Log In ⬈ 
                                        </button>
                                </a>
                                <a href="/signup">
                                    {/* <button type="button" className="px-4 py-2 rounded-r-lg bg-gray-300 hover:bg-gray-300 border-solid border-2 border-transperant transition">
                                        SignUp
                                    </button> */}
                                    <button class="bg-transparent hover:bg-white text-white font-semibold hover:text-black py-2 px-4 border border-white hover:border-transparent rounded">
                                        Try ImageGen ⬈
                                    
                                        </button>
                                </a>
                            </>
                )}
{user && token && (
                <div>
                    {/* Button to toggle dropdown */}
                    <button
                        id="dropdownAvatarNameButton"
                        className="flex items-center text-sm pe-1 font-medium text-gray-900 rounded-full hover:text-blue-600 dark:hover:text-blue-500 md:me-0 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-white"
                        type="button"
                        onClick={toggleDropdown}
                    >
                        <span className="sr-only">Open user menu</span>
                        <img className="w-8 h-8 me-2 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-3.jpg" alt="user photo" />
                        {user.username}
                        <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                        </svg>
                    </button>

                    {/* Dropdown menu */}
                    {isDropdownOpen && (
                        <div className="z-10 absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                            <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                <div className="font-medium">{user.username}</div>
                                <div className="truncate">{user.email}</div>
                            </div>
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                <li>
                                    <a href="/Archive" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Archive</a>
                                </li>
                                <li>
                                    <a href="/Setting" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                                </li>
                            </ul>
                            <div className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                <a href="#" onClick={handleSignOut} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign Out</a>
                            </div>
                        </div>
                    )}
                </div>
            )}




           


            </div>
            

            <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
                <li>
                    <a href="/" id="navbar-home" className="block py-2 px-3 text-white rounded md:bg-transparent md:p-0" aria-current="page">Home</a>
                </li>
                <li>
                    <a href="/Explore" id="navbar-Explore" className="block py-2 px-3 text-white rounded md:bg-transparent md:p-0">Explore</a>
                </li>
                <li>
                    <a href="/CaptionGen" id="navbar-caption" className="block py-2 px-3 text-white rounded md:bg-transparent md:p-0">CaptionGen</a>
                </li>
                <li>
                    <a href="/EditImage" id="navbar-editImage" className="block py-2 px-3 text-white rounded md:bg-transparent md:p-0">Edit Image</a>
                </li>
                <li>
                    <a href="/ImageGen" id="navbar-imageGen" className="block py-2 px-3 text-white rounded md:bg-transparent md:p-0">ImageGen</a>
                </li>
                <li>
                    <a href="/About" id="navbar-About" className="block py-2 px-3 text-white rounded md:bg-transparent md:p-0">About</a>
                </li>
                </ul>
            </div>
            </div>
            
            
            </nav>

      </div>
    );
  }


  export default NavBar;
