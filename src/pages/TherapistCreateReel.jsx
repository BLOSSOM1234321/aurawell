import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Video,
  Upload,
  Play,
  Pause,
  X,
  Check,
  AlertCircle,
  Film,
  Clock,
  Tag,
  FileText,
  Shield,
  BarChart3,
  Plus,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import BackHeader from '../components/navigation/BackHeader';
import { createPageUrl } from '@/utils';

const MAX_DURATION = 180; // 3 minutes in seconds

const REEL_CATEGORIES = [
  'Mental Health Tips',
  'Therapy Insights',
  'Coping Strategies',
  'Self-Care',
  'Mindfulness',
  'Anxiety Relief',
  'Depression Support',
  'Trauma Recovery',
  'Relationship Advice',
  'Professional Development'
];

export default function TherapistCreateReel() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Reel metadata
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Mental Health Tips');
  const [tags, setTags] = useState('');

  // Poll options
  const [includePoll, setIncludePoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  // Safety & Content Warnings
  const [triggerWarnings, setTriggerWarnings] = useState([]);
  const [contentSensitivity, setContentSensitivity] = useState('none');

  React.useEffect(() => {
    const currentUserData = localStorage.getItem('aurawell_current_user');
    if (currentUserData) {
      const currentUser = JSON.parse(currentUserData);
      setUser(currentUser);

      if (currentUser.user_type !== 'therapist') {
        toast.error('Access denied - Therapist accounts only');
        navigate(createPageUrl('Dashboard'));
      }
    } else {
      navigate(createPageUrl('Auth'));
    }
  }, [navigate]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file');
      return;
    }

    // Check file size (max 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB in bytes
    if (file.size > maxSize) {
      toast.error('Video file is too large. Maximum size is 500MB.');
      return;
    }

    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoURL(url);

    // Create video element to check duration
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = Math.floor(video.duration);
      setVideoDuration(duration);

      if (duration > MAX_DURATION) {
        toast.error(`Video is too long. Maximum duration is 3 minutes (${MAX_DURATION}s). Your video is ${duration}s.`);
        setVideoFile(null);
        setVideoURL(null);
        setVideoDuration(0);
      } else {
        toast.success(`Video loaded successfully (${duration}s)`);
      }
    };
    video.src = url;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRemoveVideo = () => {
    if (videoURL) {
      URL.revokeObjectURL(videoURL);
    }
    setVideoFile(null);
    setVideoURL(null);
    setVideoDuration(0);
    setIsPlaying(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePublish = async () => {
    // Validation
    if (!videoFile) {
      toast.error('Please select a video file');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a title for your reel');
      return;
    }

    if (videoDuration > MAX_DURATION) {
      toast.error('Video exceeds 3-minute maximum duration');
      return;
    }

    // Poll validation
    if (includePoll) {
      if (!pollQuestion.trim()) {
        toast.error('Please enter a poll question');
        return;
      }

      const validOptions = pollOptions.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        toast.error('Poll must have at least 2 options');
        return;
      }
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // CLOUDINARY CONFIGURATION
      const CLOUDINARY_CLOUD_NAME = 'dajzga77w';
      const CLOUDINARY_UPLOAD_PRESET = 'aurawell_reels';

      // Check if credentials are configured
      if (CLOUDINARY_CLOUD_NAME === 'YOUR_CLOUD_NAME_HERE' || CLOUDINARY_UPLOAD_PRESET === 'YOUR_UPLOAD_PRESET_HERE') {
        toast.error('Cloudinary not configured. Please add your credentials to TherapistCreateReel.jsx');
        setIsUploading(false);
        return;
      }

      // Prepare form data for Cloudinary upload
      const formData = new FormData();
      formData.append('file', videoFile);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'therapist-reels'); // Organize videos in a folder
      formData.append('resource_type', 'video');

      // Optional: Add metadata
      formData.append('context', `title=${title.trim()}|therapist=${user.name}`);

      toast.info('Uploading video to cloud storage...', {
        description: 'This may take a few moments depending on video size.'
      });

      // Upload to Cloudinary with progress tracking
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      // Create promise for XHR request
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`);
        xhr.send(formData);
      });

      // Wait for upload to complete
      const cloudinaryResponse = await uploadPromise;

      // Extract video data from Cloudinary response
      const permanentVideoURL = cloudinaryResponse.secure_url; // Permanent HTTPS URL
      const thumbnailURL = cloudinaryResponse.eager?.[0]?.secure_url || cloudinaryResponse.secure_url.replace(/\.[^/.]+$/, '.jpg');
      const cloudinaryDuration = Math.round(cloudinaryResponse.duration || videoDuration);
      const publicId = cloudinaryResponse.public_id;

      toast.success('Video uploaded successfully!', {
        description: 'Saving reel data...'
      });

      // Prepare poll data if included
      let pollData = null;
      if (includePoll) {
        const validOptions = pollOptions.filter(opt => opt.trim());
        pollData = {
          question: pollQuestion.trim(),
          options: validOptions.map((opt, index) => ({
            id: index,
            text: opt.trim(),
            votes: 0
          })),
          totalVotes: 0
        };
      }

      // Create reel data with permanent Cloudinary URL
      const reelData = {
        id: `reel-${Date.now()}`,
        therapist_id: user.id,
        therapist_name: user.name,
        therapist_email: user.email,
        title: title.trim(),
        caption: `${title.trim()} - ${description.trim()}`,
        description: description.trim(),
        category,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        hashtags: tags.split(',').map(t => t.trim()).filter(t => t),
        duration: cloudinaryDuration,
        video_url: permanentVideoURL, // ✅ Permanent Cloudinary URL
        thumbnail: thumbnailURL, // Auto-generated thumbnail
        videoFileName: videoFile.name,
        videoSize: videoFile.size,
        cloudinary_public_id: publicId, // For deletion later if needed
        poll: pollData, // ✅ Poll data
        triggerWarnings, // ✅ Safety - Trigger warnings
        contentSensitivity, // ✅ Safety - Content sensitivity level
        createdAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        likes_count: 0,
        comments: 0,
        comments_count: 0,
        status: 'published'
      };

      // Save to localStorage
      const existingReels = JSON.parse(localStorage.getItem('therapist_reels') || '[]');
      existingReels.push(reelData);
      localStorage.setItem('therapist_reels', JSON.stringify(existingReels));

      // Update therapist's reel count
      const users = JSON.parse(localStorage.getItem('aurawell_users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex].totalReels = (users[userIndex].totalReels || 0) + 1;
        localStorage.setItem('aurawell_users', JSON.stringify(users));

        // Update current user
        const updatedUser = users[userIndex];
        localStorage.setItem('aurawell_current_user', JSON.stringify(updatedUser));
      }

      toast.success('Reel published successfully!', {
        description: 'Your reel is now live and visible to your followers.'
      });

      // Clean up blob URL
      if (videoURL) {
        URL.revokeObjectURL(videoURL);
      }

      // Navigate to Dashboard
      setTimeout(() => {
        navigate(createPageUrl('Dashboard'));
      }, 1000);

    } catch (error) {
      console.error('Error uploading reel:', error);
      toast.error('Failed to upload reel', {
        description: error.message || 'Please check your internet connection and try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!user || user.user_type !== 'therapist') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">Therapist Access Only</h2>
          <p className="text-gray-600">This feature is only available to verified therapists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader
        title="Create Reel"
        subtitle="Share your expertise with 3-minute videos"
        backTo={createPageUrl("Dashboard")}
        backLabel="Dashboard"
      />

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Video Upload Section */}
          <div className="space-y-6">
            <Card className="border-light shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-purple-600" />
                  Upload Video
                </CardTitle>
                <p className="text-sm text-gray-500">Maximum duration: 3 minutes</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {!videoURL ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-purple-400 transition-colors"
                  >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-2">Click to upload video</p>
                    <p className="text-xs text-gray-500">MP4, MOV, AVI (max 500MB)</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Video Preview */}
                    <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden max-w-xs mx-auto">
                      <video
                        ref={videoRef}
                        src={videoURL}
                        className="w-full h-full object-cover"
                        onEnded={() => setIsPlaying(false)}
                      />

                      {/* Play/Pause Overlay */}
                      <div
                        onClick={handlePlayPause}
                        className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer"
                      >
                        {!isPlaying && (
                          <Play className="w-16 h-16 text-white" />
                        )}
                      </div>

                      {/* Duration Badge */}
                      <div className="absolute bottom-4 right-4 bg-black/70 px-2 py-1 rounded text-white text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(videoDuration)}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={handleRemoveVideo}
                        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Video Info */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium text-gray-800">{formatDuration(videoDuration)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium text-gray-800">
                          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        {videoDuration <= MAX_DURATION ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <Check className="w-4 h-4" />
                            Valid
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            Too long
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Upload Different Video */}
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Different Video
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <Film className="w-4 h-4" />
                  Video Guidelines
                </h4>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Keep videos under 3 minutes for best engagement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Provide actionable mental health tips</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Maintain professional boundaries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Include appropriate disclaimers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Reel Details Section */}
          <div className="space-y-6">
            <Card className="border-light shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Reel Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="5 Signs You Need Therapy"
                    maxLength={100}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="In this video, I discuss 5 common signs that indicate it might be time to seek professional therapy..."
                    maxLength={500}
                    className="mt-1 min-h-[100px]"
                  />
                  <p className="text-xs text-gray-500 mt-1">{description.length}/500 characters</p>
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-200 rounded-lg bg-white"
                  >
                    {REEL_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="anxiety, therapy, mental health"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {tags ? tags.split(',').filter(t => t.trim()).length : 0} tags
                  </p>
                </div>

                {/* Poll Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                      Add Poll (Optional)
                    </Label>
                    <button
                      type="button"
                      onClick={() => setIncludePoll(!includePoll)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        includePoll ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          includePoll ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {includePoll && (
                    <div className="space-y-3 bg-purple-50 p-4 rounded-lg border border-purple-200">
                      {/* Poll Question */}
                      <div>
                        <Label htmlFor="pollQuestion" className="text-sm">Poll Question</Label>
                        <Input
                          id="pollQuestion"
                          value={pollQuestion}
                          onChange={(e) => setPollQuestion(e.target.value)}
                          placeholder="What's your biggest mental health challenge?"
                          maxLength={150}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">{pollQuestion.length}/150</p>
                      </div>

                      {/* Poll Options */}
                      <div>
                        <Label className="text-sm mb-2 block">Poll Options (2-4 options)</Label>
                        <div className="space-y-2">
                          {pollOptions.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...pollOptions];
                                  newOptions[index] = e.target.value;
                                  setPollOptions(newOptions);
                                }}
                                placeholder={`Option ${index + 1}`}
                                maxLength={60}
                                className="flex-1"
                              />
                              {pollOptions.length > 2 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    const newOptions = pollOptions.filter((_, i) => i !== index);
                                    setPollOptions(newOptions);
                                  }}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Add Option Button */}
                        {pollOptions.length < 4 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setPollOptions([...pollOptions, ''])}
                            className="w-full mt-2"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Option
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Trigger Warnings & Content Sensitivity */}
                <div className="border-t pt-4">
                  <Label className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-orange-600" />
                    Content Safety (Important)
                  </Label>

                  {/* Content Sensitivity Level */}
                  <div className="mb-4">
                    <Label htmlFor="contentSensitivity" className="text-sm mb-2 block">Content Sensitivity Level</Label>
                    <select
                      id="contentSensitivity"
                      value={contentSensitivity}
                      onChange={(e) => setContentSensitivity(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg bg-white"
                    >
                      <option value="none">None - General Audience</option>
                      <option value="mild">Mild - Some Mental Health Topics</option>
                      <option value="moderate">Moderate - Sensitive Content</option>
                      <option value="high">High - Potentially Triggering</option>
                    </select>
                  </div>

                  {/* Trigger Warnings */}
                  <div>
                    <Label className="text-sm mb-2 block">Select Applicable Trigger Warnings</Label>
                    <div className="space-y-2 bg-orange-50 p-4 rounded-lg border border-orange-200 max-h-48 overflow-y-auto">
                      {[
                        { id: 'self_harm', label: 'Self-Harm' },
                        { id: 'suicide', label: 'Suicide/Suicidal Ideation' },
                        { id: 'sexual_assault', label: 'Sexual Assault/Abuse' },
                        { id: 'domestic_violence', label: 'Domestic Violence' },
                        { id: 'child_abuse', label: 'Child Abuse' },
                        { id: 'substance_abuse', label: 'Substance Abuse' },
                        { id: 'eating_disorders', label: 'Eating Disorders' },
                        { id: 'ptsd_trauma', label: 'PTSD/Trauma' },
                        { id: 'grief_loss', label: 'Grief/Loss' },
                        { id: 'relationship_violence', label: 'Relationship Violence' }
                      ].map(warning => (
                        <label
                          key={warning.id}
                          className="flex items-center gap-2 cursor-pointer hover:bg-orange-100 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={triggerWarnings.includes(warning.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTriggerWarnings([...triggerWarnings, warning.id]);
                              } else {
                                setTriggerWarnings(triggerWarnings.filter(w => w !== warning.id));
                              }
                            }}
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700">{warning.label}</span>
                        </label>
                      ))}
                    </div>
                    {triggerWarnings.length > 0 && (
                      <p className="text-xs text-orange-700 mt-2">
                        {triggerWarnings.length} trigger warning{triggerWarnings.length !== 1 ? 's' : ''} selected
                      </p>
                    )}
                  </div>
                </div>

                {/* Professional Disclaimer */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900">Professional Disclaimer</p>
                      <p className="text-xs text-yellow-800 mt-1">
                        This reel will include your professional disclaimer from your settings.
                        Make sure your disclaimer is up to date before publishing.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Publish Button */}
            <Card className="border-light shadow-sm">
              <CardContent className="p-6">
                {isUploading ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Publishing reel...</span>
                      <span className="font-medium text-purple-600">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className="h-full bg-purple-600"
                      />
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={handlePublish}
                    disabled={!videoFile || !title.trim() || videoDuration > MAX_DURATION}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
                  >
                    <Video className="w-5 h-5 mr-2" />
                    Publish Reel
                  </Button>
                )}

                {!videoFile && (
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Upload a video and add a title to publish
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}