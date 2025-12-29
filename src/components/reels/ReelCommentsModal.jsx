import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, AlertTriangle, Phone, MessageSquare as MessageSquareIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

// Crisis keywords detection
const CRISIS_KEYWORDS = [
  'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die', 'better off dead',
  'self harm', 'self-harm', 'cutting', 'hurt myself', 'harm myself',
  'overdose', 'pills', 'jump off', 'hang myself',
  'no reason to live', 'can\'t go on', 'end it all'
];

const detectCrisisKeywords = (text) => {
  const lowerText = text.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => lowerText.includes(keyword));
};

export default function ReelCommentsModal({ reel, onClose, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCrisisWarning, setShowCrisisWarning] = useState(false);
  const [pendingComment, setPendingComment] = useState(null);

  useEffect(() => {
    loadComments();
    loadUser();
  }, []);

  const loadUser = () => {
    try {
      const currentUserData = localStorage.getItem('aurawell_current_user');
      if (currentUserData) {
        const currentUser = JSON.parse(currentUserData);
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const loadComments = () => {
    try {
      const commentsKey = `reel_comments_${reel.id}`;
      const commentsData = JSON.parse(localStorage.getItem(commentsKey) || '[]');
      setComments(commentsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    // Check for crisis keywords
    if (detectCrisisKeywords(newComment)) {
      setPendingComment(newComment);
      setShowCrisisWarning(true);
      setIsSubmitting(false);
      return;
    }

    await postComment(newComment);
  };

  const postComment = async (commentText) => {
    setIsSubmitting(true);
    try {
      // Create new comment
      const comment = {
        id: `comment-${Date.now()}`,
        reel_id: reel.id,
        user_id: user.id,
        user_email: user.email,
        user_name: user.name || user.preferred_name || user.full_name,
        comment: commentText.trim(),
        createdAt: new Date().toISOString()
      };

      // Save comment to localStorage
      const commentsKey = `reel_comments_${reel.id}`;
      const existingComments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
      existingComments.push(comment);
      localStorage.setItem(commentsKey, JSON.stringify(existingComments));

      // Update reel comments count
      const allReels = JSON.parse(localStorage.getItem('therapist_reels') || '[]');
      const reelIndex = allReels.findIndex(r => r.id === reel.id);
      if (reelIndex !== -1) {
        allReels[reelIndex].comments_count = (allReels[reelIndex].comments_count || 0) + 1;
        localStorage.setItem('therapist_reels', JSON.stringify(allReels));
      }

      setNewComment("");
      setPendingComment(null);
      loadComments();
      onCommentAdded();
      toast.success("Comment posted!");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    }
    setIsSubmitting(false);
  };

  const handleCrisisConfirm = () => {
    setShowCrisisWarning(false);
    if (pendingComment) {
      postComment(pendingComment);
    }
  };

  const handleCrisisCancel = () => {
    setShowCrisisWarning(false);
    setPendingComment(null);
    setNewComment("");
    toast.info("Comment not posted. Please reach out if you need support.");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-lg max-h-[80vh] flex flex-col"
        >
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-lg">Comments</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {comment.user_name?.[0] || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-2xl p-3">
                      <p className="font-medium text-sm">{comment.user_name}</p>
                      <p className="text-gray-700 text-sm mt-1">{comment.comment}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-3">
                      {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No comments yet</p>
                <p className="text-sm">Be the first to comment</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 rounded-full"
              />
              <Button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="rounded-full"
                style={{ backgroundColor: '#5C4B99' }}
              >
                <Send className="w-4 h-4 text-white" />
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>

      {/* Crisis Warning Modal */}
      <AnimatePresence>
        {showCrisisWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">We're Here for You</h2>
              </div>

              <p className="text-gray-700">
                Your comment mentions content that concerns us. If you're struggling, please reach out to a crisis resource. You're not alone, and help is available 24/7.
              </p>

              <div className="space-y-3">
                {/* 988 Suicide & Crisis Lifeline */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-900 text-sm">988 Suicide & Crisis Lifeline</h3>
                      <a
                        href="tel:988"
                        className="inline-block mt-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                      >
                        Call 988
                      </a>
                    </div>
                  </div>
                </div>

                {/* Crisis Text Line */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <MessageSquareIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 text-sm">Crisis Text Line</h3>
                      <a
                        href="sms:741741&body=HELLO"
                        className="inline-block mt-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                      >
                        Text HELLO to 741741
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCrisisCancel}
                >
                  Cancel Comment
                </Button>
                <Button
                  className="flex-1"
                  style={{ backgroundColor: '#5C4B99' }}
                  onClick={handleCrisisConfirm}
                >
                  Post Anyway
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                If this is an emergency, please call 911 or go to your nearest emergency room.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}