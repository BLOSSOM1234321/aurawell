import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Upload, Video } from "lucide-react";
import { toast } from "sonner";
import { Reel } from "@/api/entities";
import { User } from "@/api/entities";
import { base44 } from "@/api/base44Client";

const categories = [
  { value: "anxiety", label: "Anxiety" },
  { value: "healing", label: "Healing" },
  { value: "mindfulness", label: "Mindfulness" },
  { value: "motivation", label: "Motivation" },
  { value: "depression", label: "Depression" },
  { value: "self_care", label: "Self Care" },
  { value: "relationships", label: "Relationships" },
  { value: "stress", label: "Stress" }
];

export default function ReelUploadModal({ onClose, onComplete }) {
  const [videoFile, setVideoFile] = useState(null);
  const [formData, setFormData] = useState({
    caption: "",
    category: "",
    hashtags: ""
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast.error("Video size must be less than 100MB");
      return;
    }

    if (!file.type.startsWith('video/')) {
      toast.error("Please upload a video file");
      return;
    }

    setVideoFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      toast.error("Please select a video");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    setIsUploading(true);
    try {
      const user = await User.me();

      // Upload video
      toast.info("Uploading video...");
      const { file_url } = await base44.integrations.Core.UploadFile({ file: videoFile });

      // Parse hashtags
      const hashtags = formData.hashtags
        .split('#')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Create reel
      await Reel.create({
        video_url: file_url,
        caption: formData.caption,
        category: formData.category,
        hashtags,
        therapist_email: user.email,
        therapist_name: user.preferred_name || user.full_name,
        is_approved: false // Requires admin approval
      });

      toast.success("Reel submitted for review!");
      onComplete();
    } catch (error) {
      console.error("Error uploading reel:", error);
      toast.error("Failed to upload reel. Please try again.");
    }
    setIsUploading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
      >
        <div className="sticky top-0 bg-white border-b p-6 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Upload Reel</h2>
          <Button variant="ghost" onClick={onClose} size="icon">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <Label>Video *</Label>
            <div className="mt-2">
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 transition-colors">
                {videoFile ? (
                  <div className="text-center">
                    <Video className="w-12 h-12 mx-auto mb-2 text-purple-500" />
                    <p className="text-sm text-gray-700 font-medium">{videoFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload video</p>
                    <p className="text-xs text-gray-500 mt-1">Max 100MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="caption">Caption *</Label>
            <Textarea
              id="caption"
              value={formData.caption}
              onChange={(e) => setFormData({...formData, caption: e.target.value})}
              placeholder="Share your message..."
              required
              rows={4}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({...formData, category: value})}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="hashtags">Hashtags (Optional)</Label>
            <Input
              id="hashtags"
              value={formData.hashtags}
              onChange={(e) => setFormData({...formData, hashtags: e.target.value})}
              placeholder="#mindfulness #healing"
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">Separate with spaces or #</p>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading}
              className="flex-1 rounded-xl text-white"
              style={{ backgroundColor: '#5C4B99' }}
            >
              {isUploading ? "Uploading..." : "Submit for Review"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}