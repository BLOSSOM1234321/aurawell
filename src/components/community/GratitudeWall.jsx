import React, { useState, useEffect } from "react";
import { GratitudePost } from "@/api/entities";
import { GratitudeLike } from "@/api/entities";
import { GratitudeComment } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Heart, Send, X, Sparkles, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { toast } from "sonner";

export default function GratitudeWall({ onClose }) {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [newPost, setNewPost] = useState("");
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const gratitudePosts = await GratitudePost.list("-created_date", 50);
      setPosts(gratitudePosts);

      // Load user's likes
      const userLikes = await GratitudeLike.filter({ user_email: currentUser.email });
      setLikedPosts(new Set(userLikes.map(like => like.post_id)));
    } catch (error) {
      console.error("Error loading gratitude data:", error);
    }
    setIsLoading(false);
  };

  const handleSubmitPost = async () => {
    if (!newPost.trim()) {
      toast.error("Please write something you're grateful for");
      return;
    }

    setIsSubmitting(true);
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      await GratitudePost.create({
        content: newPost.trim(),
        date: today,
        is_anonymous: true,
        likes: 0
      });

      toast.success("Your gratitude has been shared! 💖");
      setNewPost("");
      loadData();
    } catch (error) {
      console.error("Error posting gratitude:", error);
      toast.error("Failed to share your gratitude. Please try again.");
    }
    setIsSubmitting(false);
  };

  const handleLike = async (post) => {
    try {
      if (likedPosts.has(post.id)) {
        // Unlike
        const userLikes = await GratitudeLike.filter({ 
          post_id: post.id, 
          user_email: user.email 
        });
        if (userLikes.length > 0) {
          await GratitudeLike.delete(userLikes[0].id);
        }
        await GratitudePost.update(post.id, { 
          likes: Math.max(0, post.likes - 1) 
        });
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(post.id);
          return newSet;
        });
      } else {
        // Like
        await GratitudeLike.create({
          post_id: post.id,
          user_email: user.email
        });
        await GratitudePost.update(post.id, { 
          likes: post.likes + 1 
        });
        setLikedPosts(prev => new Set([...prev, post.id]));
      }
      loadData();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const loadComments = async (postId) => {
    try {
      const postComments = await GratitudeComment.filter({ post_id: postId });
      setComments(prev => ({ ...prev, [postId]: postComments }));
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const toggleComments = async (postId) => {
    if (expandedComments.has(postId)) {
      setExpandedComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    } else {
      setExpandedComments(prev => new Set([...prev, postId]));
      if (!comments[postId]) {
        await loadComments(postId);
      }
    }
  };

  const handleAddComment = async (postId) => {
    const commentText = newComment[postId]?.trim();
    if (!commentText) return;

    try {
      await GratitudeComment.create({
        post_id: postId,
        comment_text: commentText,
        user_name: "Anonymous",
        is_anonymous: true
      });

      toast.success("Comment added!");
      setNewComment(prev => ({ ...prev, [postId]: "" }));
      await loadComments(postId);
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
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
        className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card border-b border-light p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: '#5C4B99' }}>
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-primary">Gratitude Wall</h2>
                <p className="text-sm text-secondary">Share what you're grateful for</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} className="p-2">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Create new post */}
          <Card className="bg-secondary/20 border-light">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4" style={{ color: '#5C4B99' }} />
                  <span className="text-sm font-medium text-primary">What are you grateful for today?</span>
                </div>
                <Textarea
                  placeholder="I'm grateful for..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="resize-none bg-white border-light focus:border-accent"
                  rows={3}
                  maxLength={280}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-secondary">
                    {newPost.length}/280 • Posted anonymously
                  </span>
                  <Button
                    onClick={handleSubmitPost}
                    disabled={isSubmitting || !newPost.trim()}
                    className="text-white hover:opacity-90"
                    style={{ backgroundColor: '#5C4B99' }}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Share
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts list */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-secondary/20 rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-secondary/40 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-secondary/40 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white border-light hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <p className="text-primary mb-3 leading-relaxed">"{post.content}"</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-secondary">
                          {format(new Date(post.created_date), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleComments(post.id)}
                            className="flex items-center gap-1 text-secondary hover:text-blue-500"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>{comments[post.id]?.length || 0}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(post)}
                            className={`flex items-center gap-1 transition-colors ${
                              likedPosts.has(post.id)
                                ? "text-red-500 hover:text-red-600"
                                : "text-secondary hover:text-red-500"
                            }`}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                likedPosts.has(post.id) ? "fill-current" : ""
                              }`}
                            />
                            <span>{post.likes || 0}</span>
                          </Button>
                        </div>
                      </div>

                      {/* Comments Section */}
                      {expandedComments.has(post.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-light space-y-3"
                        >
                          {comments[post.id]?.length > 0 && (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {comments[post.id].map((comment) => (
                                <div key={comment.id} className="bg-gray-50 rounded-lg p-2">
                                  <p className="text-sm text-gray-700">{comment.comment_text}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {format(new Date(comment.created_date), "MMM d 'at' h:mm a")}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a comment..."
                              value={newComment[post.id] || ""}
                              onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                              onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                              className="flex-1 text-sm"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleAddComment(post.id)}
                              disabled={!newComment[post.id]?.trim()}
                              style={{ backgroundColor: '#5C4B99' }}
                              className="text-white"
                            >
                              <Send className="w-3 h-3" />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="bg-secondary/20 border-light">
                <CardContent className="p-8 text-center">
                  <Heart className="w-12 h-12 mx-auto mb-3" style={{ color: '#5C4B9980' }} />
                  <h3 className="font-medium text-primary mb-2">No gratitude posts yet</h3>
                  <p className="text-sm text-secondary">
                    Be the first to share what you're grateful for!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}