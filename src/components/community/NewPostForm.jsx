import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CommunityPost } from '@/api/entities';
import { User } from '@/api/entities';
import { InvokeLLM } from '@/api/integrations';
import { toast } from 'sonner';
import { Send, AlertTriangle } from 'lucide-react';

export default function NewPostForm({ groupSlug, userStage, onPostCreated, user }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);

    if (user.is_banned) {
      toast.error("Your account is banned and you cannot post.", {
        description: "Please contact support if you believe this is a mistake.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const moderationPrompt = `You are a content moderator for a mental health support app called "AuraWell". Your primary goal is to maintain a safe, supportive, and respectful environment. Analyze the following text submitted by a user. Determine if it contains any content that is offensive, sexually explicit, arrogant, or inconsiderate. Your response must be a JSON object with the structure: {"is_inappropriate": boolean, "censored_text": "string"}. If inappropriate, return the text with violating words replaced by asterisks (e.g., "****"). Otherwise, return the original text. User text: "${content}"`;
      
      const moderationResult = await InvokeLLM({
        prompt: moderationPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            is_inappropriate: { type: "boolean" },
            censored_text: { type: "string" }
          },
          required: ["is_inappropriate", "censored_text"]
        }
      });

      if (moderationResult.is_inappropriate) {
        const warnings = user.warning_count || 0;
        
        if (warnings >= 1) {
          // This is the second offense, ban the user
          await User.updateMyUserData({ is_banned: true });
          toast.error("Account Banned", {
            description: "Your account has been banned due to repeated violations of community guidelines. You can no longer post.",
            icon: <AlertTriangle className="text-red-500" />
          });
          setIsSubmitting(false);
          return; // Stop the submission
        } else {
          // This is the first offense, issue a warning
          await User.updateMyUserData({ warning_count: warnings + 1 });
          toast.warning("Content Moderated", {
            description: "Your post contained sensitive content and has been censored. Future violations will result in a ban.",
            icon: <AlertTriangle className="text-yellow-500" />
          });
          
          // Create the post with censored content
          await createPost(moderationResult.censored_text, true, content);
        }
      } else {
        // Content is clean, create post normally
        await createPost(content, false, null);
      }

    } catch (error) {
      console.error("Error during post submission:", error);
      toast.error("Failed to submit post. Please try again.");
    }

    setIsSubmitting(false);
  };

  const createPost = async (postContent, isModerated, originalContent) => {
    const userDisplayName = user.is_anonymous ? 'Anonymous' : (user.preferred_name || user.full_name);
    const userAvatar = user.is_anonymous ? 'A' : (userDisplayName.charAt(0) || 'U');

    await CommunityPost.create({
      group_slug: groupSlug,
      stage: userStage,
      content: postContent,
      user_full_name: userDisplayName,
      user_avatar_char: userAvatar,
      is_moderated: isModerated,
      original_content: originalContent,
    });
    setContent('');
    onPostCreated();
  };

  return (
    <form onSubmit={handlePostSubmit} className="mt-6">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts or ask a question..."
          className="w-full p-4 pr-24 border-gray-200 bg-white/80 backdrop-blur-sm rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>
    </form>
  );
}