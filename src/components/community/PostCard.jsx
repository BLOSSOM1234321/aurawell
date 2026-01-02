import React, { useState, useEffect } from 'react';
import { PostComment, ContentViolationReport } from '@/api/entities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Heart, MessageCircle, Archive, Star, Edit, Trash2, Send, X, MoreVertical, Flag
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { analyzeTextForRisk, BehavioralSignalTracker, logCrisisEvent } from '@/utils/crisisDetection';
import SafetyModal from '@/components/safety/SafetyModal';
import MediumRiskBanner from '@/components/safety/MediumRiskBanner';
import LowRiskExerciseSuggestion from '@/components/safety/LowRiskExerciseSuggestion';

export default function PostCard({ post, user, onLike, onFavorite, onArchive, onDelete, onEdit }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const isOwnPost = post.user_id === user?.id;

  // Crisis detection state
  const [tracker, setTracker] = useState(null);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showMediumBanner, setShowMediumBanner] = useState(false);
  const [showLowSuggestion, setShowLowSuggestion] = useState(false);

  // Content flagging state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportingCommentId, setReportingCommentId] = useState(null);
  const [commentReportReason, setCommentReportReason] = useState('');

  useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, [showComments]);

  // Initialize crisis detection tracker
  useEffect(() => {
    if (user) {
      setTracker(new BehavioralSignalTracker(user.id));
    }
  }, [user]);

  const loadComments = async () => {
    try {
      const commentsData = await PostComment.findMany({
        where: { postId: post.id }
      });
      setComments(commentsData);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    // CRISIS DETECTION
    const riskAnalysis = analyzeTextForRisk(newComment);

    if (tracker) {
      tracker.addMessage(newComment, riskAnalysis.level);
      const behavioralRisk = tracker.getBehavioralRisk();

      if (behavioralRisk.recommendation === 'ESCALATE' && riskAnalysis.level !== 'HIGH') {
        riskAnalysis.level = 'MEDIUM';
      }
    }

    if (riskAnalysis.level !== 'NONE') {
      logCrisisEvent({
        userId: user.id,
        context: 'support_room_comment',
        postId: post.id,
        riskLevel: riskAnalysis.level,
        text: newComment.substring(0, 100),
        matches: riskAnalysis.matches
      });
    }

    // HIGH RISK - Block comment
    if (riskAnalysis.level === 'HIGH') {
      setShowSafetyModal(true);
      return;
    }

    // MEDIUM/LOW - Show appropriate intervention but allow comment
    if (riskAnalysis.level === 'MEDIUM') {
      setShowMediumBanner(true);
    }

    if (riskAnalysis.level === 'LOW') {
      setShowLowSuggestion(true);
    }

    if (newComment.trim().length > 500) {
      toast.error('Comment is too long (max 500 characters)');
      return;
    }

    try {
      await PostComment.create({
        postId: post.id,
        content: newComment.trim()
      });
      setNewComment('');
      loadComments();
      toast.success('Comment added');
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      await PostComment.toggleLike(commentId);
      loadComments();
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      toast.error('Post cannot be empty');
      return;
    }

    if (editContent.trim().length > 2000) {
      toast.error('Post is too long (max 2000 characters)');
      return;
    }

    await onEdit(post.id, editContent.trim());
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(post.content);
    setIsEditing(false);
  };

  const handleReportPost = async () => {
    try {
      await ContentViolationReport.create({
        reporterId: user.id,
        contentType: 'room_post',
        contentId: post.id,
        roomId: post.roomId,
        reason: reportReason,
        status: 'pending'
      });

      toast.success('Post reported. A moderator will review it.');
      setShowReportModal(false);
      setReportReason('');
    } catch (error) {
      console.error('Failed to report post:', error);
      toast.error('Failed to report post');
    }
  };

  const handleReportComment = async (commentId, reason) => {
    try {
      await ContentViolationReport.create({
        reporterId: user.id,
        contentType: 'post_comment',
        contentId: commentId,
        postId: post.id,
        roomId: post.roomId,
        reason: reason,
        status: 'pending'
      });

      toast.success('Comment reported.');
      setReportingCommentId(null);
      setCommentReportReason('');
    } catch (error) {
      console.error('Failed to report comment:', error);
      toast.error('Failed to report comment');
    }
  };

  return (
    <>
      {/* Safety Interventions */}
      {showSafetyModal && (
        <SafetyModal
          onClose={() => {
            setShowSafetyModal(false);
            setNewComment(''); // Clear the high-risk comment
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

      {/* Report Post Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 p-6">
            <h3 className="font-semibold mb-4">Report Post</h3>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full border rounded p-2 mb-4"
            >
              <option value="">Select reason...</option>
              <option value="harassment">Harassment</option>
              <option value="spam">Spam</option>
              <option value="self-harm">Self-harm concern</option>
              <option value="hate-speech">Hate speech</option>
              <option value="misinformation">Misinformation</option>
              <option value="other">Other</option>
            </select>
            <div className="flex gap-2">
              <Button
                onClick={handleReportPost}
                disabled={!reportReason}
                className="flex-1"
              >
                Submit Report
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Report Comment Modal */}
      {reportingCommentId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 p-6">
            <h3 className="font-semibold mb-4">Report Comment</h3>
            <select
              value={commentReportReason}
              onChange={(e) => setCommentReportReason(e.target.value)}
              className="w-full border rounded p-2 mb-4"
            >
              <option value="">Select reason...</option>
              <option value="harassment">Harassment</option>
              <option value="spam">Spam</option>
              <option value="self-harm">Self-harm concern</option>
              <option value="hate-speech">Hate speech</option>
              <option value="misinformation">Misinformation</option>
              <option value="other">Other</option>
            </select>
            <div className="flex gap-2">
              <Button
                onClick={() => handleReportComment(reportingCommentId, commentReportReason)}
                disabled={!commentReportReason}
                className="flex-1"
              >
                Submit Report
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setReportingCommentId(null);
                  setCommentReportReason('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
              {post.username?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-medium text-gray-900">{post.username || 'Anonymous'}</p>
              <p className="text-xs text-gray-500">
                {format(new Date(post.created_at), "MMM d 'at' h:mm a")}
                {post.updated_at !== post.created_at && ' (edited)'}
              </p>
            </div>
          </div>

          {!isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isOwnPost ? (
                  <>
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onArchive(post.id)}>
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(post.id)} className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => setShowReportModal(true)}>
                    <Flag className="w-4 h-4 mr-2" />
                    Report Post
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Post Content */}
        {isEditing ? (
          <div className="space-y-3 mb-3">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="resize-none"
              rows={4}
              maxLength={2000}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{editContent.length}/2000</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveEdit}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-900 mb-4 whitespace-pre-wrap">{post.content}</p>
        )}

        {/* Actions Row */}
        <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-1 ${
              post.is_liked ? 'text-red-500' : 'text-gray-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-current' : ''}`} />
            <span>{post.likes_count || 0}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 text-gray-600"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments_count || 0}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFavorite(post.id)}
            className={`flex items-center gap-1 ml-auto ${
              post.is_favorited ? 'text-yellow-500' : 'text-gray-600'
            }`}
          >
            <Star className={`w-4 h-4 ${post.is_favorited ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            {/* Comment Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                maxLength={500}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="w-3 h-3" />
              </Button>
            </div>

            {/* Comments List */}
            {comments.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {comments.map((comment) => {
                  const isOwnComment = comment.user_id === user?.id;

                  return (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {comment.username || 'Anonymous'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {format(new Date(comment.created_at), "MMM d 'at' h:mm a")}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                          {!isOwnComment && (
                            <button
                              onClick={() => setReportingCommentId(comment.id)}
                              className="text-gray-400 hover:text-red-500 text-xs mt-1 flex items-center gap-1"
                            >
                              <Flag className="w-3 h-3" />
                              Report
                            </button>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCommentLike(comment.id)}
                          className={`flex items-center gap-1 ${
                            comment.is_liked ? 'text-red-500' : 'text-gray-500'
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${comment.is_liked ? 'fill-current' : ''}`} />
                          <span className="text-xs">{comment.likes_count || 0}</span>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
    </>
  );
}
