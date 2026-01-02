import React, { useState, useEffect } from 'react';
import { RoomPost } from '@/api/entities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import PostCard from './PostCard';
import { analyzeTextForRisk, BehavioralSignalTracker, logCrisisEvent } from '@/utils/crisisDetection';
import SafetyModal from '@/components/safety/SafetyModal';
import MediumRiskBanner from '@/components/safety/MediumRiskBanner';
import LowRiskExerciseSuggestion from '@/components/safety/LowRiskExerciseSuggestion';

export default function RoomPostsFeed({ roomId, user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Crisis detection state
  const [tracker, setTracker] = useState(null);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showMediumBanner, setShowMediumBanner] = useState(false);
  const [showLowSuggestion, setShowLowSuggestion] = useState(false);

  useEffect(() => {
    loadPosts();
  }, [roomId]);

  // Initialize crisis detection tracker
  useEffect(() => {
    if (user) {
      setTracker(new BehavioralSignalTracker(user.id));
    }
  }, [user]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const postsData = await RoomPost.findMany({
        where: { roomId }
      });
      setPosts(postsData);
    } catch (error) {
      console.error('Failed to load posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      toast.error('Please write something');
      return;
    }

    // CRISIS DETECTION
    const riskAnalysis = analyzeTextForRisk(newPostContent);

    if (tracker) {
      tracker.addMessage(newPostContent, riskAnalysis.level);
      const behavioralRisk = tracker.getBehavioralRisk();

      if (behavioralRisk.recommendation === 'ESCALATE' && riskAnalysis.level !== 'HIGH') {
        riskAnalysis.level = 'MEDIUM';
      }
    }

    // Log crisis event
    if (riskAnalysis.level !== 'NONE') {
      logCrisisEvent({
        userId: user.id,
        context: 'support_room_post',
        roomId: roomId,
        riskLevel: riskAnalysis.level,
        text: newPostContent.substring(0, 100),
        matches: riskAnalysis.matches
      });
    }

    // HIGH RISK - Block post, show safety modal
    if (riskAnalysis.level === 'HIGH') {
      setShowSafetyModal(true);
      return;
    }

    // MEDIUM RISK - Allow post but show banner
    if (riskAnalysis.level === 'MEDIUM') {
      setShowMediumBanner(true);
    }

    // LOW RISK - Allow post, show suggestion
    if (riskAnalysis.level === 'LOW') {
      setShowLowSuggestion(true);
    }

    if (newPostContent.trim().length > 2000) {
      toast.error('Post is too long (max 2000 characters)');
      return;
    }

    setSubmitting(true);
    try {
      await RoomPost.create({
        roomId,
        content: newPostContent.trim()
      });

      toast.success('Post created!');
      setNewPostContent('');
      loadPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await RoomPost.toggleLike(postId);
      loadPosts();
    } catch (error) {
      console.error('Failed to like post:', error);
      toast.error('Failed to like post');
    }
  };

  const handleFavorite = async (postId) => {
    try {
      await RoomPost.toggleFavorite(postId);
      loadPosts();
    } catch (error) {
      console.error('Failed to favorite post:', error);
      toast.error('Failed to favorite post');
    }
  };

  const handleArchive = async (postId) => {
    try {
      await RoomPost.archive(postId);
      toast.success('Post archived');
      loadPosts();
    } catch (error) {
      console.error('Failed to archive post:', error);
      toast.error('Failed to archive post');
    }
  };

  const handleDelete = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await RoomPost.delete(postId);
      toast.success('Post deleted');
      loadPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleEdit = async (postId, newContent) => {
    try {
      await RoomPost.update(postId, { content: newContent });
      toast.success('Post updated');
      loadPosts();
    } catch (error) {
      console.error('Failed to update post:', error);
      toast.error('Failed to update post');
    }
  };

  return (
    <>
      {/* Safety Interventions */}
      {showSafetyModal && (
        <SafetyModal
          onClose={() => {
            setShowSafetyModal(false);
            setNewPostContent(''); // Clear the high-risk post
          }}
          userRegion="US"
          context="support_room"
          mandatory={true}
        />
      )}

      {showMediumBanner && (
        <MediumRiskBanner
          onDismiss={() => setShowMediumBanner(false)}
        />
      )}

      {showLowSuggestion && (
        <LowRiskExerciseSuggestion
          onDismiss={() => setShowLowSuggestion(false)}
        />
      )}

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Create New Post */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardContent className="p-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Share with your room</h3>
            <Textarea
              placeholder="What's on your mind? Share your thoughts, experiences, or ask for support..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="resize-none bg-white"
              rows={4}
              maxLength={2000}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {newPostContent.length}/2000 characters
              </span>
              <Button
                onClick={handleCreatePost}
                disabled={submitting || !newPostContent.trim()}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Post
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      ) : posts.length === 0 ? (
        <Card className="bg-gray-50">
          <CardContent className="p-12 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <h3 className="font-medium text-gray-900 mb-1">No posts yet</h3>
            <p className="text-sm text-gray-500">Be the first to share something!</p>
          </CardContent>
        </Card>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            user={user}
            onLike={handleLike}
            onFavorite={handleFavorite}
            onArchive={handleArchive}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))
      )}
    </div>
    </>
  );
}
