'use client';
import React, { useState } from 'react';
import { Edit, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DashboardNav from '@/components/dashboard-nav';
import { Sidebar } from '@/components/dashboard/sidebar';

export default function AdminProfile() {
  const initialState = {
    name: 'John Doe',
    email: 'john@example.com',
    profilePic: '/placeholder.jpg',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const [formData, setFormData] = useState(initialState);
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePic: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(initialState);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500 flex">
      {/* Sidebar - Fixed position */}
      <div className="w-64 h-full bg-white shadow-md fixed top-0 left-0">
        <DashboardNav />
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <Card className="max-w-2xl mx-auto p-8">
          <h1 className="text-2xl font-bold text-center mb-8">Profile Settings</h1>
          
          {/* Profile Picture */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Image
                src={formData.profilePic}
                alt="Profile"
                width={120}
                height={120}
                className="rounded-full object-cover border-4 border-gray-200"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
                  <Edit className="h-4 w-4" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">User Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">User Email</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {/* Password Fields - Only shown when editing */}
            {isEditing && (
              <>
                {/* Current Password */}
                <div className="relative">
                  <label className="block text-sm font-medium mb-2">Current Password</label>
                  <div className="relative">
                    <Input
                      name="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={formData.currentPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                

                
                
              </>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
