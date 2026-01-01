import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Archive, ArchiveRestore, Loader2, Inbox } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import BackHeader from '@/components/navigation/BackHeader';
import api from '@/api/client';

export default function ArchivedPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unarchiving, setUnarchiving] = useState(null);

  useEffect(() => {
    loadArchivedPosts();
  }, []);

  const loadArchivedPosts = async () => {
    setLoading(true);
    try {
      const response = await api.getArchivedPosts();
      setPosts(response.data || []);
    } catch (error) {
      console.error('Failed to load archived posts:', error);
      toast.error('Failed to load archived posts');
    } finally {
      setLoading(false);
    }
  };

  const handleUnarchive = async (postId) => {
    setUnarchiving(postId);
    try {
      await api.archiveRoomPost(postId);
      toast.success('Post restored to your room feed');
      loadArchivedPosts(); // Reload to remove from archived list
    } catch (error) {
      console.error('Failed to unarchive post:', error);
      toast.error('Failed to restore post');
    } finally {
      setUnarchiving(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <BackHeader
          title="Archived Posts"
          subtitle="View and restore your archived posts"
          backTo="/profile"
          backLabel="Profile"
        />

        <div className="mt-8 space-y-4">
          {posts.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Archived Posts
                </h3>
                <p className="text-gray-600">
                  Posts you archive will appear here. You can restore them anytime.
                </p>
                <Button
                  onClick={() => navigate('/community')}
                  className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  Go to Community
                </Button>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card
                key={post.id}
                className="bg-white/90 backdrop-blur-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  {/* Post Metadata */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Archive className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {post.group_name} • {post.stage.charAt(0).toUpperCase() + post.stage.slice(1)} • Room #{post.room_number}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Posted on {format(new Date(post.created_at), "MMM d, yyyy 'at' h:mm a")}
                        {post.archived_at && ` • Archived on ${format(new Date(post.archived_at), "MMM d, yyyy")}`}
                      </p>
                    </div>

                    <Button
                      onClick={() => handleUnarchive(post.id)}
                      disabled={unarchiving === post.id}
                      variant="outline"
                      size="sm"
                      className="text-purple-600 border-purple-300 hover:bg-purple-50"
                    >
                      {unarchiving === post.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Restoring...
                        </>
                      ) : (
                        <>
                          <ArchiveRestore className="w-4 h-4 mr-2" />
                          Restore
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Post Content */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
                  </div>

                  {/* Post Stats */}
                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                    <span>{post.likes_count || 0} likes</span>
                    <span>{post.comments_count || 0} comments</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {posts.length > 0 && (
          <Card className="mt-6 bg-gradient-to-r from-purple-100 to-indigo-100 border-0">
            <CardContent className="p-4">
              <p className="text-sm text-gray-700 text-center">
                <strong>Tip:</strong> Restored posts will reappear in their original room's feed.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
