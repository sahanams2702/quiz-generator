"use client";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DashboardNav from "@/components/dashboard-nav";
import {updateUser} from "./action";
import { Sidebar } from "@/components/dashboard/sidebar";
async function userData() {
  try {
    const id = await axios.get("/api/auth/user").then((res) => res.data.userId);
    const user = await axios.get(`/api/users/${id}`);
    return user.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export default function AdminProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const user = await userData();
      if (user) {
        setFormData({
          name: user.name || "",
          email: user.email || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setError("Failed to load user data.");
      }
    }
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      await updateUser(formData);
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-auto bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500 flex">
      {/* Sidebar */}
      <div className="w-64 h-full bg-white shadow-md fixed top-0 left-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <Card className="max-w-2xl mx-auto p-8">
          <h1 className="text-2xl font-bold text-center mb-8">Profile Settings</h1>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">User Name</label>
              <Input name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">User Email</label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} disabled={!isEditing} />
            </div>

            {/* Password Fields - Only shown when editing */}
            {isEditing && (
              <>
                {/* New Password */}
                <div className="relative">
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <div className="relative">
                    <Input
                      name="newPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                  <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} />
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="bg-blue-500 hover:bg-blue-600">
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">
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
