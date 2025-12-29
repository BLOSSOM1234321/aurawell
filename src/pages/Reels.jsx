import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Bookmark, Share2, Play, Pause, Volume2, VolumeX, UserPlus, Check, EyeOff, AlertTriangle, Phone, MessageSquare as MessageSquareIcon, Eye, X, MoreVertical, Flag, Ban, VolumeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { createPageUrl } from "@/utils";
import ReelUploadButton from "../components/reels/ReelUploadButton";
import ReelCommentsModal from "../components/reels/ReelCommentsModal";

export default function Reels() {
  const navigate = useNavigate();
  const [reels, setReels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [likedReels, setLikedReels] = useState(new Set());
  const [savedReels, setSavedReels] = useState(new Set());
  const [followedTherapists, setFollowedTherapists] = useState(new Set());
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [watchStartTime, setWatchStartTime] = useState({});
  const [hiddenReels, setHiddenReels] = useState(new Set());
  const [pollVotes, setPollVotes] = useState({}); // Store user's poll votes
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareReel, setShareReel] = useState(null);
  const [doubleTapTimeout, setDoubleTapTimeout] = useState(null);
  const [lastTap, setLastTap] = useState(0);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [reportMenuReel, setReportMenuReel] = useState(null);
  const [blockedTherapists, setBlockedTherapists] = useState(new Set());
  const [mutedTherapists, setMutedTherapists] = useState(new Set());
  const videoRefs = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Get current user from localStorage
      const currentUserData = localStorage.getItem('aurawell_current_user');
      const currentUser = currentUserData ? JSON.parse(currentUserData) : null;
      setUser(currentUser);

      // Load therapist reels from localStorage
      const therapistReels = JSON.parse(localStorage.getItem('therapist_reels') || '[]');

      // Sort by most recent first
      const sortedReels = therapistReels.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setReels(sortedReels);

      // Load user interactions from localStorage (simplified)
      if (currentUser) {
        const userLikes = JSON.parse(localStorage.getItem(`reel_likes_${currentUser.id}`) || '[]');
        setLikedReels(new Set(userLikes));

        const userSaves = JSON.parse(localStorage.getItem(`reel_saves_${currentUser.id}`) || '[]');
        setSavedReels(new Set(userSaves));

        const userFollows = JSON.parse(localStorage.getItem(`therapist_follows_${currentUser.id}`) || '[]');
        setFollowedTherapists(new Set(userFollows));
      }
    } catch (error) {
      console.error("Error loading reels:", error);
    }
    setIsLoading(false);
  };

  const calculateRecommendations = (allReels, interactions, currentUser) => {
    // Filter out "see less" reels
    const seeLessCategories = new Set();
    const seeLessTherapists = new Set();
    interactions.forEach(i => {
      if (i.see_less) {
        if (i.category) seeLessCategories.add(i.category);
        if (i.therapist_email) seeLessTherapists.add(i.therapist_email);
      }
    });

    let filteredReels = allReels.filter(reel => 
      !seeLessCategories.has(reel.category) && 
      !seeLessTherapists.has(reel.therapist_email)
    );

    // Score each reel based on user engagement
    const reelsWithScores = filteredReels.map(reel => {
      let score = 0;
      
      // Check user's quiz results for category preferences
      if (currentUser.quiz_results?.top_concerns?.includes(reel.category)) {
        score += 50;
      }

      // Analyze interactions
      const reelInteractions = interactions.filter(i => i.reel_id === reel.id);
      const categoryInteractions = interactions.filter(i => i.category === reel.category);
      const therapistInteractions = interactions.filter(i => i.therapist_email === reel.therapist_email);

      // Watched fully = high engagement
      categoryInteractions.forEach(i => {
        if (i.watched_fully) score += 20;
        if (i.interaction_type === 'like') score += 15;
        if (i.interaction_type === 'comment') score += 25;
        if (i.interaction_type === 'save') score += 30;
      });

      // Followed therapist bonus
      therapistInteractions.forEach(i => {
        if (i.watched_fully) score += 10;
        if (i.interaction_type === 'like') score += 10;
      });

      // Penalty for skipped content
      categoryInteractions.forEach(i => {
        if (i.interaction_type === 'skip') score -= 5;
      });

      // Recency bonus (newer reels get slight boost)
      const daysOld = (Date.now() - new Date(reel.created_date)) / (1000 * 60 * 60 * 24);
      if (daysOld < 7) score += 10;

      return { ...reel, recommendationScore: score };
    });

    // Sort by score, then by created date
    return reelsWithScores.sort((a, b) => {
      if (b.recommendationScore !== a.recommendationScore) {
        return b.recommendationScore - a.recommendationScore;
      }
      return new Date(b.created_date) - new Date(a.created_date);
    });
  };

  const trackWatchProgress = async (reelId, index) => {
    // Analytics tracking - currently using localStorage only
    // In production, this would send to your analytics service
    const video = videoRefs.current[index];
    if (!video || !user) return;

    const watchPercentage = (video.currentTime / video.duration) * 100;
    const watchedFully = watchPercentage >= 90;

    // Update view count in localStorage
    try {
      const allReels = JSON.parse(localStorage.getItem('therapist_reels') || '[]');
      const reelIndex = allReels.findIndex(r => r.id === reelId);
      if (reelIndex !== -1 && watchedFully) {
        allReels[reelIndex].views = (allReels[reelIndex].views || 0) + 1;
        localStorage.setItem('therapist_reels', JSON.stringify(allReels));
      }
    } catch (error) {
      console.error("Error tracking watch progress:", error);
    }
  };

  const handleScroll = (e) => {
    const container = e.target;
    const index = Math.round(container.scrollTop / container.clientHeight);
    if (index !== currentIndex && index < reels.length) {
      // Track previous video watch progress
      if (currentIndex >= 0 && reels[currentIndex]) {
        trackWatchProgress(reels[currentIndex].id, currentIndex);
      }

      setCurrentIndex(index);
      setWatchStartTime({ ...watchStartTime, [reels[index].id]: Date.now() });
      
      // Pause previous video, play current
      videoRefs.current.forEach((ref, i) => {
        if (ref) {
          if (i === index) {
            ref.play();
          } else {
            ref.pause();
          }
        }
      });
    }
  };

  const handleLike = async (reel) => {
    try {
      if (!user) return;

      const userLikesKey = `reel_likes_${user.id}`;
      const userLikes = JSON.parse(localStorage.getItem(userLikesKey) || '[]');

      if (likedReels.has(reel.id)) {
        // Unlike
        const updatedLikes = userLikes.filter(id => id !== reel.id);
        localStorage.setItem(userLikesKey, JSON.stringify(updatedLikes));
        setLikedReels(prev => {
          const newSet = new Set(prev);
          newSet.delete(reel.id);
          return newSet;
        });

        // Update reel likes count
        const allReels = JSON.parse(localStorage.getItem('therapist_reels') || '[]');
        const reelIndex = allReels.findIndex(r => r.id === reel.id);
        if (reelIndex !== -1) {
          allReels[reelIndex].likes = Math.max(0, (allReels[reelIndex].likes || 0) - 1);
          localStorage.setItem('therapist_reels', JSON.stringify(allReels));
        }
      } else {
        // Like
        userLikes.push(reel.id);
        localStorage.setItem(userLikesKey, JSON.stringify(userLikes));
        setLikedReels(prev => new Set([...prev, reel.id]));

        // Update reel likes count
        const allReels = JSON.parse(localStorage.getItem('therapist_reels') || '[]');
        const reelIndex = allReels.findIndex(r => r.id === reel.id);
        if (reelIndex !== -1) {
          allReels[reelIndex].likes = (allReels[reelIndex].likes || 0) + 1;
          localStorage.setItem('therapist_reels', JSON.stringify(allReels));
        }
      }
      loadData();
    } catch (error) {
      console.error("Error liking reel:", error);
    }
  };

  const handleSave = async (reel) => {
    try {
      if (!user) return;

      const userSavesKey = `reel_saves_${user.id}`;
      const userSaves = JSON.parse(localStorage.getItem(userSavesKey) || '[]');

      if (savedReels.has(reel.id)) {
        // Unsave
        const updatedSaves = userSaves.filter(id => id !== reel.id);
        localStorage.setItem(userSavesKey, JSON.stringify(updatedSaves));
        setSavedReels(prev => {
          const newSet = new Set(prev);
          newSet.delete(reel.id);
          return newSet;
        });
        toast.success("Removed from saved");
      } else {
        // Save
        userSaves.push(reel.id);
        localStorage.setItem(userSavesKey, JSON.stringify(userSaves));
        setSavedReels(prev => new Set([...prev, reel.id]));
        toast.success("Saved to your collection");
      }
    } catch (error) {
      console.error("Error saving reel:", error);
    }
  };

  const handleFollow = async (therapistId) => {
    try {
      if (!user) return;

      const userFollowsKey = `therapist_follows_${user.id}`;
      const userFollows = JSON.parse(localStorage.getItem(userFollowsKey) || '[]');

      if (followedTherapists.has(therapistId)) {
        // Unfollow
        const updatedFollows = userFollows.filter(id => id !== therapistId);
        localStorage.setItem(userFollowsKey, JSON.stringify(updatedFollows));
        setFollowedTherapists(prev => {
          const newSet = new Set(prev);
          newSet.delete(therapistId);
          return newSet;
        });
        toast.success("Unfollowed");
      } else {
        // Follow
        userFollows.push(therapistId);
        localStorage.setItem(userFollowsKey, JSON.stringify(userFollows));
        setFollowedTherapists(prev => new Set([...prev, therapistId]));
        toast.success("Following therapist");
      }
    } catch (error) {
      console.error("Error following:", error);
    }
  };

  const handleDoubleTap = (e, reel) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // milliseconds

    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected
      e.stopPropagation();
      if (!likedReels.has(reel.id)) {
        handleLike(reel);
        // Show heart animation
        toast.success("❤️", { duration: 1000 });
      }
      setLastTap(0);
    } else {
      // Single tap - toggle play/pause
      setLastTap(now);
      setTimeout(() => {
        if (lastTap !== 0) {
          togglePlayPause();
        }
      }, DOUBLE_TAP_DELAY);
    }
  };

  const togglePlayPause = () => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      if (isPlaying) {
        currentVideo.pause();
      } else {
        currentVideo.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      currentVideo.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeeLess = async (reel) => {
    try {
      // Store hidden reels in localStorage
      if (!user) return;

      const hiddenReelsKey = `hidden_reels_${user.id}`;
      const hiddenReelsList = JSON.parse(localStorage.getItem(hiddenReelsKey) || '[]');

      if (!hiddenReelsList.includes(reel.id)) {
        hiddenReelsList.push(reel.id);
        localStorage.setItem(hiddenReelsKey, JSON.stringify(hiddenReelsList));
      }

      setHiddenReels(prev => new Set([...prev, reel.id]));
      toast.success("We'll show you less content like this");

      // Refresh feed
      loadData();
    } catch (error) {
      console.error("Error marking see less:", error);
    }
  };

  const handlePollVote = async (reel, optionId) => {
    try {
      if (!user) {
        toast.error("Please log in to vote");
        return;
      }

      // Check if user already voted on this poll
      const pollVotesKey = `poll_votes_${user.id}`;
      const userPollVotes = JSON.parse(localStorage.getItem(pollVotesKey) || '{}');

      if (userPollVotes[reel.id]) {
        toast.error("You've already voted on this poll");
        return;
      }

      // Update poll votes in the reel
      const allReels = JSON.parse(localStorage.getItem('therapist_reels') || '[]');
      const reelIndex = allReels.findIndex(r => r.id === reel.id);

      if (reelIndex !== -1 && allReels[reelIndex].poll) {
        const poll = allReels[reelIndex].poll;
        const optionIndex = poll.options.findIndex(opt => opt.id === optionId);

        if (optionIndex !== -1) {
          poll.options[optionIndex].votes += 1;
          poll.totalVotes += 1;

          // Save updated reel
          localStorage.setItem('therapist_reels', JSON.stringify(allReels));

          // Record user's vote
          userPollVotes[reel.id] = optionId;
          localStorage.setItem(pollVotesKey, JSON.stringify(userPollVotes));

          // Update state
          setPollVotes(prev => ({ ...prev, [reel.id]: optionId }));

          toast.success("Vote recorded!");
          loadData();
        }
      }
    } catch (error) {
      console.error("Error voting on poll:", error);
      toast.error("Failed to record vote");
    }
  };

  const handleShare = async (reel) => {
    const shareUrl = `${window.location.origin}/Reels?reel=${reel.id}`;
    const shareText = `Check out this mindful content from ${reel.therapist_name}: ${reel.caption?.substring(0, 100)}...`;

    // Try Web Share API first (mobile-friendly)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AuraWell - ${reel.therapist_name}`,
          text: shareText,
          url: shareUrl
        });
        toast.success("Shared successfully!");
      } catch (error) {
        // User cancelled or share failed
        if (error.name !== 'AbortError') {
          console.error("Error sharing:", error);
        }
      }
    } else {
      // Fallback to copy link
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        console.error("Error copying link:", error);
        toast.error("Failed to copy link");
      }
    }
  };

  const handleBlockTherapist = (therapistId) => {
    if (!user) return;

    const blockedKey = `blocked_therapists_${user.id}`;
    const blocked = JSON.parse(localStorage.getItem(blockedKey) || '[]');

    if (!blocked.includes(therapistId)) {
      blocked.push(therapistId);
      localStorage.setItem(blockedKey, JSON.stringify(blocked));
      setBlockedTherapists(new Set(blocked));

      toast.success("Therapist blocked. You won't see their content.");
      setShowReportMenu(false);
      loadData(); // Refresh to filter out blocked content
    }
  };

  const handleMuteTherapist = (therapistId) => {
    if (!user) return;

    const mutedKey = `muted_therapists_${user.id}`;
    const muted = JSON.parse(localStorage.getItem(mutedKey) || '[]');

    if (!muted.includes(therapistId)) {
      muted.push(therapistId);
      localStorage.setItem(mutedKey, JSON.stringify(muted));
      setMutedTherapists(new Set(muted));

      toast.success("Therapist muted. Their content will be shown less often.");
      setShowReportMenu(false);
    }
  };

  const handleReportReel = (reel) => {
    if (!user) return;

    // Store report in localStorage
    const reportsKey = 'reported_reels';
    const reports = JSON.parse(localStorage.getItem(reportsKey) || '[]');

    const report = {
      id: `report-${Date.now()}`,
      reel_id: reel.id,
      therapist_id: reel.therapist_id,
      therapist_name: reel.therapist_name,
      reporter_id: user.id,
      reporter_name: user.name,
      reported_at: new Date().toISOString(),
      reel_title: reel.title
    };

    reports.push(report);
    localStorage.setItem(reportsKey, JSON.stringify(reports));

    toast.success("Content reported. Our team will review this.");
    setShowReportMenu(false);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading reels...</div>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Reels Yet</h2>
        <p className="text-gray-600 mb-8">Be the first to explore mindful content</p>
        {user?.user_type === 'therapist' && user?.verification_status === 'verified' && (
          <ReelUploadButton onUploadComplete={loadData} />
        )}
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Vertical Scroll Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            className="h-screen w-full snap-start relative flex items-center justify-center"
          >
            {/* Video */}
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={reel.video_url}
              className="h-full w-full object-cover"
              loop
              playsInline
              autoPlay={index === 0}
              muted={isMuted}
              onClick={(e) => handleDoubleTap(e, reel)}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 pointer-events-none">
              <div className="flex items-end justify-between pointer-events-auto">
                {/* Left: Caption and Info */}
                <div className="flex-1 space-y-3 max-w-md">
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() => navigate(`/TherapistProfile/${reel.therapist_id}`)}
                      className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                        {reel.therapist_name?.[0] || 'T'}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{reel.therapist_name}</p>
                        <p className="text-gray-300 text-sm">Therapist • Verified ✓</p>
                      </div>
                    </div>
                    {user?.email !== reel.therapist_email && (
                      <Button
                        size="sm"
                        variant={followedTherapists.has(reel.therapist_email) ? "secondary" : "default"}
                        onClick={() => handleFollow(reel.therapist_email)}
                        className="rounded-full text-xs"
                        style={!followedTherapists.has(reel.therapist_email) ? { backgroundColor: '#5C4B99' } : {}}
                      >
                        {followedTherapists.has(reel.therapist_email) ? (
                          <><Check className="w-3 h-3 mr-1" /> Following</>
                        ) : (
                          <><UserPlus className="w-3 h-3 mr-1" /> Follow</>
                        )}
                      </Button>
                    )}
                  </div>
                  <p className="text-white text-sm line-clamp-3">{reel.caption}</p>
                  <div className="flex flex-wrap gap-2">
                    {reel.hashtags?.map((tag, i) => (
                      <span key={i} className="text-blue-300 text-sm">#{tag}</span>
                    ))}
                  </div>

                  {/* Content Warnings */}
                  {(reel.contentSensitivity && reel.contentSensitivity !== 'none') || (reel.triggerWarnings && reel.triggerWarnings.length > 0) ? (
                    <div className="bg-orange-900/80 backdrop-blur-sm rounded-lg p-3 border border-orange-500">
                      {reel.contentSensitivity && reel.contentSensitivity !== 'none' && (
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-orange-300" />
                          <span className="text-orange-100 text-xs font-medium">
                            {reel.contentSensitivity === 'mild' && 'Mild Content'}
                            {reel.contentSensitivity === 'moderate' && 'Moderate Sensitivity'}
                            {reel.contentSensitivity === 'high' && 'High Sensitivity'}
                          </span>
                        </div>
                      )}
                      {reel.triggerWarnings && reel.triggerWarnings.length > 0 && (
                        <div>
                          <p className="text-orange-200 text-xs font-medium mb-1">Trigger Warnings:</p>
                          <div className="flex flex-wrap gap-1">
                            {reel.triggerWarnings.map((warning, i) => (
                              <span key={i} className="bg-orange-800 text-orange-100 text-xs px-2 py-0.5 rounded">
                                {warning.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}

                  {/* Poll */}
                  {reel.poll && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-3">
                      <p className="text-white font-medium text-sm">{reel.poll.question}</p>
                      <div className="space-y-2">
                        {reel.poll.options.map((option) => {
                          const userVoted = pollVotes[reel.id];
                          const totalVotes = reel.poll.totalVotes || 0;
                          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                          const isSelected = userVoted === option.id;

                          return (
                            <button
                              key={option.id}
                              onClick={() => handlePollVote(reel, option.id)}
                              disabled={!!userVoted}
                              className={`w-full text-left p-3 rounded-lg transition-all ${
                                userVoted
                                  ? 'cursor-default'
                                  : 'cursor-pointer hover:bg-white/20'
                              } ${
                                isSelected ? 'bg-purple-500/50 border-2 border-purple-300' : 'bg-white/5'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-white text-sm font-medium">{option.text}</span>
                                {userVoted && (
                                  <span className="text-white text-sm">{percentage}%</span>
                                )}
                              </div>
                              {userVoted && (
                                <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className="h-full bg-purple-400 transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {pollVotes[reel.id] && (
                        <p className="text-white/70 text-xs text-center">
                          {reel.poll.totalVotes} {reel.poll.totalVotes === 1 ? 'vote' : 'votes'}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col items-center gap-6 ml-4">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLike(reel)}
                    className="flex flex-col items-center gap-1"
                  >
                    <Heart
                      className={`w-8 h-8 ${likedReels.has(reel.id) ? 'fill-red-500 text-red-500' : 'text-white'}`}
                    />
                    <span className="text-white text-xs">{reel.likes_count || 0}</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowComments(true)}
                    className="flex flex-col items-center gap-1"
                  >
                    <MessageCircle className="w-8 h-8 text-white" />
                    <span className="text-white text-xs">{reel.comments_count || 0}</span>
                  </motion.button>

                  <div className="flex flex-col items-center gap-1">
                    <Eye className="w-8 h-8 text-white" />
                    <span className="text-white text-xs">{reel.views || 0}</span>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSave(reel)}
                    className="flex flex-col items-center gap-1"
                  >
                    <Bookmark
                      className={`w-8 h-8 ${savedReels.has(reel.id) ? 'fill-white text-white' : 'text-white'}`}
                    />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleShare(reel)}
                    className="flex flex-col items-center gap-1"
                  >
                    <Share2 className="w-8 h-8 text-white" />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSeeLess(reel)}
                    className="flex flex-col items-center gap-1"
                  >
                    <EyeOff className="w-8 h-8 text-white" />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMute}
                    className="flex flex-col items-center gap-1"
                  >
                    {isMuted ? (
                      <VolumeX className="w-8 h-8 text-white" />
                    ) : (
                      <Volume2 className="w-8 h-8 text-white" />
                    )}
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setReportMenuReel(reel);
                      setShowReportMenu(true);
                    }}
                    className="flex flex-col items-center gap-1"
                  >
                    <MoreVertical className="w-8 h-8 text-white" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Button (for verified therapists) */}
      {user?.user_type === 'therapist' && user?.verification_status === 'verified' && (
        <div className="absolute top-4 right-4 z-10">
          <ReelUploadButton onUploadComplete={loadData} />
        </div>
      )}

      {/* CRISIS SUPPORT BUTTON - Always Visible */}
      <motion.button
        onClick={() => setShowCrisisModal(true)}
        className="absolute top-4 left-4 z-10 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm font-medium">I Need Support</span>
      </motion.button>

      {/* Crisis Support Modal */}
      <AnimatePresence>
        {showCrisisModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCrisisModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Crisis Support</h2>
                </div>
                <button
                  onClick={() => setShowCrisisModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-700">
                If you're in crisis or need immediate support, please reach out. You're not alone.
              </p>

              <div className="space-y-3">
                {/* 988 Suicide & Crisis Lifeline */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-900">988 Suicide & Crisis Lifeline</h3>
                      <p className="text-sm text-red-700 mt-1">24/7 free and confidential support</p>
                      <a
                        href="tel:988"
                        className="inline-block mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Call 988
                      </a>
                    </div>
                  </div>
                </div>

                {/* Crisis Text Line */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <MessageSquareIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900">Crisis Text Line</h3>
                      <p className="text-sm text-blue-700 mt-1">Text HELLO to 741741</p>
                      <a
                        href="sms:741741&body=HELLO"
                        className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Text Now
                      </a>
                    </div>
                  </div>
                </div>

                {/* Additional Resources */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">More Resources</h3>
                  <ul className="space-y-2 text-sm text-purple-800">
                    <li>• National Domestic Violence Hotline: 1-800-799-7233</li>
                    <li>• SAMHSA National Helpline: 1-800-662-4357</li>
                    <li>• Veterans Crisis Line: 1-800-273-8255 (Press 1)</li>
                    <li>• Trevor Project (LGBTQ+): 1-866-488-7386</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 text-center">
                  This app provides educational content only and is not a substitute for professional mental health care or emergency services.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments Modal */}
      <AnimatePresence>
        {showComments && (
          <ReelCommentsModal
            reel={reels[currentIndex]}
            onClose={() => setShowComments(false)}
            onCommentAdded={loadData}
          />
        )}
      </AnimatePresence>

      {/* Report/Block/Mute Menu Modal */}
      <AnimatePresence>
        {showReportMenu && reportMenuReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-end md:items-center justify-center z-50 p-4"
            onClick={() => setShowReportMenu(false)}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold text-lg">Content Options</h3>
                <button
                  onClick={() => setShowReportMenu(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Options */}
              <div className="divide-y">
                {/* Report */}
                <button
                  onClick={() => handleReportReel(reportMenuReel)}
                  className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 bg-red-100 rounded-full">
                    <Flag className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">Report Content</p>
                    <p className="text-sm text-gray-600">Flag inappropriate or harmful content</p>
                  </div>
                </button>

                {/* Mute Therapist */}
                <button
                  onClick={() => handleMuteTherapist(reportMenuReel.therapist_id)}
                  className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <VolumeOff className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">Mute {reportMenuReel.therapist_name}</p>
                    <p className="text-sm text-gray-600">See less content from this therapist</p>
                  </div>
                </button>

                {/* Block Therapist */}
                <button
                  onClick={() => handleBlockTherapist(reportMenuReel.therapist_id)}
                  className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 bg-gray-200 rounded-full">
                    <Ban className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">Block {reportMenuReel.therapist_name}</p>
                    <p className="text-sm text-gray-600">Stop seeing all content from this therapist</p>
                  </div>
                </button>
              </div>

              {/* Cancel Button */}
              <div className="p-4 border-t bg-gray-50">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowReportMenu(false)}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}