import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import PostThread from './PostThread';
import NewPostForm from './NewPostForm';
import { Lightbulb, Pin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function StageSection({ stage, groupSlug, welcomeMessage, posts, isLoading, onPostCreated }) {
  const pinnedPosts = posts.filter(p => p.is_pinned);
  const prompts = posts.filter(p => p.is_prompt);
  const discussionPosts = posts.filter(p => !p.is_pinned && !p.is_prompt);

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <p className="text-gray-700 italic">{welcomeMessage}</p>
        </CardContent>
      </Card>
      
      {isLoading ? (
          <Skeleton className="h-48 w-full rounded-2xl" />
      ) : (
        <>
            {prompts.length > 0 && (
                <div className="space-y-4">
                {prompts.map(post => <PostThread key={post.id} post={post} isPrompt />)}
                </div>
            )}

            {pinnedPosts.length > 0 && (
                <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-700"><Pin size={18}/> Pinned Resources</h3>
                {pinnedPosts.map(post => <PostThread key={post.id} post={post} isPinned />)}
                </div>
            )}
        </>
      )}

      <NewPostForm
        stage={stage}
        groupSlug={groupSlug}
        onPostCreated={onPostCreated}
      />

      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-gray-700">Discussions</h3>
        {isLoading ? (
            <div className="space-y-4">
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
        ) : discussionPosts.length > 0 ? (
          discussionPosts.map(post => <PostThread key={post.id} post={post} />)
        ) : (
          <Card className="bg-white/50 border-dashed border-2">
            <CardContent className="p-8 text-center text-gray-600">
              <p>No discussions here yet. Be the first to start a conversation!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}