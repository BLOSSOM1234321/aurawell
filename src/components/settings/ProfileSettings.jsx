import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User, Mail, Calendar, Edit3, Save, X } from "lucide-react";
import { toast } from "sonner";

export default function ProfileSettings({ user, onUserUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    age: user?.age || "",
  });

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditData({
        name: user?.name || "",
        email: user?.email || "",
        bio: user?.bio || "",
        age: user?.age || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    try {
      // Update user in localStorage
      const updatedUser = {
        ...user,
        name: editData.name,
        email: editData.email,
        bio: editData.bio,
        age: editData.age,
      };

      localStorage.setItem('aurawell_current_user', JSON.stringify(updatedUser));

      // Update the users list as well
      const users = JSON.parse(localStorage.getItem('aurawell_users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('aurawell_users', JSON.stringify(users));
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      if (onUserUpdate) {
        onUserUpdate();
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    }
  };

  const handleChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-secondary">No user data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-primary">Profile Information</h3>
        {!isEditing ? (
          <Button
            onClick={handleEditToggle}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleEditToggle}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              size="sm"
              className="flex items-center gap-2 text-white"
              style={{ backgroundColor: '#5C4B99' }}
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        )}
      </div>

      {/* Profile Fields */}
      <div className="space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            Full Name
          </Label>
          {isEditing ? (
            <Input
              id="name"
              value={editData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter your name"
            />
          ) : (
            <p className="text-primary px-3 py-2 bg-secondary/10 rounded-lg">
              {user.name || "Not set"}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address
          </Label>
          {isEditing ? (
            <Input
              id="email"
              type="email"
              value={editData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter your email"
            />
          ) : (
            <p className="text-primary px-3 py-2 bg-secondary/10 rounded-lg">
              {user.email || "Not set"}
            </p>
          )}
        </div>

        {/* Age */}
        <div>
          <Label htmlFor="age" className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Age
          </Label>
          {isEditing ? (
            <Input
              id="age"
              type="number"
              value={editData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              placeholder="Enter your age"
              min="18"
              max="120"
            />
          ) : (
            <p className="text-primary px-3 py-2 bg-secondary/10 rounded-lg">
              {user.age || "Not set"}
            </p>
          )}
        </div>

        {/* Bio */}
        <div>
          <Label htmlFor="bio" className="text-sm font-medium text-primary mb-2">
            Bio
          </Label>
          {isEditing ? (
            <Textarea
              id="bio"
              value={editData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Tell us a bit about yourself..."
              rows={4}
            />
          ) : (
            <p className="text-primary px-3 py-2 bg-secondary/10 rounded-lg min-h-[100px]">
              {user.bio || "No bio added yet"}
            </p>
          )}
        </div>

        {/* Account Info (Read-only) */}
        <div className="pt-4 border-t border-light">
          <h4 className="text-sm font-medium text-primary mb-3">Account Information</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary">Account ID:</span>
              <span className="text-sm text-primary font-mono">{user.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary">Member Since:</span>
              <span className="text-sm text-primary">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}