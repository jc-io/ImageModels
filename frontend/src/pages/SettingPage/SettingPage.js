import React, { useState } from 'react';

const SettingPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [socialMedia, setSocialMedia] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleProfileImageChange = (e) => {
    // Handle profile image change logic here
  };

  const handleSocialMediaChange = (e) => {
    // Handle social media link change logic here
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Profile Image:</label>
          <input
            type="file"
            onChange={handleProfileImageChange}
            className="border border-gray-300 px-4 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1">Username:</label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            className="border border-gray-300 px-4 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="border border-gray-300 px-4 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className="border border-gray-300 px-4 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1">Social Media:</label>
          <input
            type="text"
            value={socialMedia}
            onChange={handleSocialMediaChange}
            className="border border-gray-300 px-4 py-2 w-full rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default SettingPage;
