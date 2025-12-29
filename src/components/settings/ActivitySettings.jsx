import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { CommunityPost } from '@/api/entities';
import { PostLike } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { BookUser, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { formatDistanceToNow } from 'date-fns';

export default function ActivitySettings() {
  const [user, setUser] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        await Promise.all([
          loadMyPosts(currentUser.email),
          loadLikedPosts(currentUser.email)
        ]);
      } catch (error) {
        console.error("User not authenticated or data loading failed:", error);
      }
      setIsLoading(false);
    };
    loadAllData();
  }, []);

  const loadMyPosts = async (email) => {
    const posts = await CommunityPost.filter({ created_by: email }, "-created_date");
    setMyPosts(posts);
  };

  const loadLikedPosts = async (email) => {
    const likes = await PostLike.filter({ user_email: email });
    const postIds = likes.map(like => like.post_id);
    if (postIds.length > 0) {
      // Assuming a batch fetch is possible. If not, this can be slow.
      // A more robust SDK might have a `getByIds` method.
      const posts = (await CommunityPost.list()).filter(post => postIds.includes(post.id));
      setLikedPosts(posts);
    }
  };
  
  const renderPostList = (posts) => (
    <div className="space-y-4">
      {posts.length > 0 ? (
        posts.map(post => (
          <Link to={createPageUrl(`Group?slug=${post.group_slug}`)} key={post.id}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all">
               <CardContent className="p-4">
                  <p className="font-semibold text-gray-800">{post.title || "A post"}</p>
                  <p className="text-sm text-gray-600 truncate">{post.content}</p>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>In <span className="font-medium text-blue-600">{post.group_slug}</span></span>
                    <span>{formatDistanceToNow(new Date(post.created_date), { addSuffix: true })}</span>
                  </div>
              </CardContent>
            </Card>
          </Link>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No activity found yet.</p>
        </div>
      )}
    </div>
  );

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle>Your Community Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-2xl">
            <TabsTrigger value="posts" className="rounded-xl">
              <BookUser className="mr-2 h-4 w-4" /> My Posts
            </TabsTrigger>
            <TabsTrigger value="likes" className="rounded-xl">
              <Heart className="mr-2 h-4 w-4" /> My Likes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-4">
            <CardHeader className="px-0">
              <CardTitle className="text-lg">Your Posts & Replies</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              {isLoading ? <Skeleton className="h-48 w-full" /> : renderPostList(myPosts)}
            </CardContent>
          </TabsContent>
          <TabsContent value="likes" className="mt-4">
            <CardHeader className="px-0">
              <CardTitle className="text-lg">Posts You've Liked</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              {isLoading ? <Skeleton className="h-48 w-full" /> : renderPostList(likedPosts)}
            </CardContent>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}