
import React, { useState, useEffect, useCallback } from 'react';
import { CommunityPost, PostLike, User, ContentViolationReport } from '@/api/entities';
import { format, formatDistanceToNow } from 'date-fns';
import { Heart, MessageSquare, MoreVertical, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner'; // Assuming 'sonner' for toast notifications, adjust if using a different library
import { AnimatePresence, motion } from 'framer-motion';

// Simple profanity filter - in production, you'd use a more comprehensive solution
const profanityWords = [
  'fuck', 'shit', 'damn', 'bitch', 'asshole', 'bastard', 'crap', 'piss',
  // Add more words as needed - this is a basic implementation
];

const containsProfanity = (text) => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return profanityWords.some(word => lowerText.includes(word));
};

const filterProfanity = (text) => {
  if (!text) return '';
  let filteredText = text;
  profanityWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filteredText = filteredText.replace(regex, '*'.repeat(word.length));
  });
  return filteredText;
};

export default function PostThread({ post, user, onUpdate }) {
  const [replies, setReplies] = useState([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(true);
  const [newReplyContent, setNewReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);
  const [isLikeLoading, setIsLikeLoading] = useState(true);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const checkIfLiked = useCallback(async () => {
    if (!user) {
      setIsLikeLoading(false);
      return;
    }
    setIsLikeLoading(true);
    const likeRecord = await PostLike.filter({ post_id: post.id, user_email: user.email });
    if (likeRecord.length > 0) {
      setIsLiked(true);
      setLikeId(likeRecord[0].id);
    } else {
      setIsLiked(false);
      setLikeId(null);
    }
    setIsLikeLoading(false);
  }, [user, post.id]); // Dependencies for useCallback

  useEffect(() => {
    loadReplies();
    checkIfLiked();
  }, [post.id, checkIfLiked]); // Added checkIfLiked to useEffect dependencies

  const loadReplies = async () => {
    setIsLoadingReplies(true);
    // Assuming replies are posts with a `parent_post_id` field.
    // This requires a schema change to `CommunityPost`. Let's assume it exists.
    // const postReplies = await CommunityPost.filter({ parent_post_id: post.id }, 'created_date');
    // setReplies(postReplies);
    setIsLoadingReplies(false); // For now, no replies
  };
  
  const handleLikeToggle = async () => {
    if (!user || isLikeLoading) return;
    
    setIsLikeLoading(true);
    try {
      if (isLiked) {
        await PostLike.delete(likeId);
        const newLikeCount = likeCount - 1;
        await CommunityPost.update(post.id, { likes: newLikeCount });
        setLikeCount(newLikeCount);
        setIsLiked(false);
        setLikeId(null);
      } else {
        const newLike = await PostLike.create({ post_id: post.id, user_email: user.email });
        const newLikeCount = likeCount + 1;
        await CommunityPost.update(post.id, { likes: newLikeCount });
        setLikeCount(newLikeCount);
        setIsLiked(true);
        setLikeId(newLike.id);
      }
      if (onUpdate) onUpdate(); // Notify parent component of update
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like. Please try again.");
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason) {
      toast.error("Please select a reason for reporting");
      return;
    }

    try {
      await ContentViolationReport.create({
        reported_post_id: post.id,
        reported_user_email: post.created_by || post.user_email,
        reporter_email: user.email,
        violation_type: reportReason,
        description: `Post content: "${post.content}"`
      });
      
      toast.success("Report submitted. Thank you for helping keep our community safe.");
      setShowReportModal(false);
      setReportReason('');
      if (onUpdate) onUpdate(); // Notify parent component of update
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report. Please try again.");
    }
  };

  // Check for content moderation
  const isContentModerated = containsProfanity(post.content);
  const displayContent = isContentModerated ? filterProfanity(post.content) : post.content;

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
              {post.user_avatar_char || post.user_full_name?.[0] || 'A'}
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                {post.user_full_name || 'Anonymous User'}
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(post.created_date), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
          
          {/* Report Button */}
          {user && user.email && (post.created_by || post.user_email) && user.email !== (post.created_by || post.user_email) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowReportModal(true)}>
                  <Flag className="w-4 h-4 mr-2" />
                  Report Content
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {post.title && (
          <h3 className="text-lg font-bold text-gray-800 mb-3">{post.title}</h3>
        )}
        
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {displayContent}
            {isContentModerated && (
              <span className="text-xs text-orange-600 block mt-2">
                ⚠️ Content filtered for language
              </span>
            )}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-6">
            <Button variant="ghost" size="sm" onClick={handleLikeToggle} disabled={isLikeLoading || !user} className="flex items-center gap-2 text-gray-600 hover:text-red-500">
              {isLikeLoading ? (
                <Skeleton className="w-5 h-5 rounded-full" />
              ) : (
                <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
              )}
              <span>{likeCount}</span>
            </Button>
            <div className="flex items-center gap-2 text-gray-600">
              <MessageSquare className="w-5 h-5" />
              <span>{replies.length}</span>
            </div>
        </div>

        {/* Report Modal */}
        <AnimatePresence>
          {showReportModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowReportModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Content</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Help us maintain a safe community. What's wrong with this post?
                </p>
                
                <div className="space-y-3 mb-6">
                  {[
                    { value: 'offensive_language', label: 'Offensive Language' },
                    { value: 'harassment', label: 'Harassment or Bullying' },
                    { value: 'inappropriate_content', label: 'Inappropriate Content' },
                    { value: 'spam', label: 'Spam' },
                    { value: 'other', label: 'Other' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="reportReason"
                        value={option.value}
                        checked={reportReason === option.value}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="mr-3 accent-red-600"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowReportModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleReport}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    disabled={!reportReason}
                  >
                    Submit Report
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
