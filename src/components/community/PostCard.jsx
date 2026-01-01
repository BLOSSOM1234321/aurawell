import React, { useState, useEffect } from 'react';
import { PostComment } from '@/api/entities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Heart, MessageCircle, Archive, Star, Edit, Trash2, Send, X, MoreVertical
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function PostCard({ post, user, onLike, onFavorite, onArchive, onDelete, onEdit }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const isOwnPost = post.user_id === user?.id;

  useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, [showComments]);

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

  return (
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

          {isOwnPost && !isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
                {comments.map((comment) => (
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
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
