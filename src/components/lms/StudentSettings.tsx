
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLMS } from '../../contexts/LMSContext';
import { User, Camera, Lock, Save } from 'lucide-react';

const StudentSettings = () => {
  const { currentUser } = useLMS();
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      // In a real app, this would make an API call to update the profile
      console.log('Updating profile:', profileData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // In a real app, this would make an API call to reset the password
      console.log('Resetting password');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Password reset successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Password reset failed:', error);
      alert('Failed to reset password. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleProfilePictureUpdate = () => {
    // In a real app, this would open a file picker and upload the image
    console.log('Opening profile picture upload');
    alert('Profile picture upload feature coming soon!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Account Settings
        </h1>
        <p className="text-gray-600 mt-2">Manage your account preferences and security</p>
      </div>

      {/* Profile Picture */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Profile Picture</CardTitle>
          <CardDescription>Update your profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <Button
              onClick={handleProfilePictureUpdate}
              variant="outline"
              className="border-green-200 text-green-600 hover:bg-green-50"
            >
              <Camera className="w-4 h-4 mr-2" />
              Update Picture
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personal Details */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Personal Details</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>
            <Button 
              type="submit"
              disabled={isUpdating}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isUpdating ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Reset */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Password & Security</CardTitle>
          <CardDescription>Change your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>
            <Button 
              type="submit"
              disabled={isUpdating}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              <Lock className="w-4 h-4 mr-2" />
              {isUpdating ? 'Updating...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentSettings;
