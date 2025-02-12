'use client'

import React, { useState } from 'react';
import { Edit, Save, Trash } from 'lucide-react'; 
import Image from 'next/image';
import DashboardNav from '@/components/dashboard-nav'; // Assuming your DashboardNav component is correctly placed

export default function Profile() {
  const [profilePic, setProfilePic] = useState('/path/to/default/profile.jpg'); // Default profile image
  const [userName, setUserName] = useState('John Doe'); // Default username
  const [isEditing, setIsEditing] = useState(false); // To toggle edit mode
  const [quizCount, setQuizCount] = useState(10); // Replace with dynamic quiz count

  // Handle profile picture change
  const handleProfilePicChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result); // Set the new profile picture
      };
      reader.readAsDataURL(file);
    }
  };

  // Save changes
  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully');
  };

  // Delete profile
  const handleDelete = () => {
    alert('Profile deleted');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-500 flex">
      {/* Fixed Dashboard Navbar */}
      <div className="fixed w-1/5 h-full bg-white shadow-md z-10">
        <DashboardNav />
      </div>

      {/* Profile Section */}
      <div className="flex flex-1 ml-[20%] justify-center items-start mt-20 ml-1/5">
        <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg">
          {/* Profile Pic */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <Image 
                src={profilePic} 
                alt="Profile Picture" 
                width={120} 
                height={120} 
                className="rounded-full object-cover border-4 border-blue-500"
              />
              {isEditing && (
                <label htmlFor="profile-pic" className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer">
                  <Edit className="h-4 w-4" />
                  <input
                    id="profile-pic"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* User Name */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-blue-800">
              {isEditing ? (
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-2 px-4 py-2 border border-gray-300 rounded-lg w-full text-center"
                  placeholder="Enter your name"
                />
              ) : (
                userName
              )}
            </h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 mt-2"
              >
                <Edit className="inline-block mr-1" /> Edit Name
              </button>
            )}
          </div>

          {/* Analytics Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Quiz Analytics</h2>
            <div className="w-full h-8 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full">
              <div 
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${(quizCount / 20) * 100}%` }} // Adjust this based on total quizzes attended
              ></div>
            </div>
            <p className="text-center mt-2 text-sm text-gray-600">{quizCount} Quizzes Attended</p>
          </div>

          {/* Save & Delete Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Save className="mr-2" /> Save
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 flex items-center"
            >
              <Trash className="mr-2" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
