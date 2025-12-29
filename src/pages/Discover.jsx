import React, { useState, useEffect } from "react";
import { CommunityPost } from "@/api/entities";
import { GratitudePost } from "@/api/entities";
import { UserGroup } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Heart, MessageCircle, Users, TrendingUp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import BackHeader from "../components/navigation/BackHeader";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function Discover() {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [popularGroups, setPopularGroups] = useState([]);
  const [inspiringGratitude, setInspiringGratitude] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDiscoverContent();
  }, []);

  const loadDiscoverContent = async () => {
    setIsLoading(true);
    try {
      // Get trending posts (high engagement)
      const posts = await CommunityPost.list("-likes", 20);
      const trending = posts.filter(p => !p.is_pinned && p.likes > 5);
      setTrendingPosts(trending.slice(0, 10));

      // Get popular user groups
      const groups = await UserGroup.list("-member_count", 10);
      setPopularGroups(groups);

      // Get inspiring gratitude posts
      const gratitude = await GratitudePost.list("-likes", 15);
      setInspiringGratitude(gratitude.filter(g => g.likes > 3).slice(0, 10));
    } catch (error) {
      console.error("Error loading discover content:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <BackHeader
          title="Discover"
          subtitle="Explore trending conversations and inspiring content"
          backTo={createPageUrl("Community")}
          backLabel="Community"
        />

        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trending">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="groups">
              <Users className="w-4 h-4 mr-2" />
              Groups
            </TabsTrigger>
            <TabsTrigger value="gratitude">
              <Sparkles className="w-4 h-4 mr-2" />
              Gratitude
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Trending Discussions
            </h3>
            {trendingPosts.length > 0 ? (
              <div className="space-y-3">
                {trendingPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{post.title || "Discussion"}</h4>
                              <p className="text-sm text-gray-600 line-clamp-2 mt-1">{post.content}</p>
                            </div>
                            <Badge className="ml-2 bg-orange-100 text-orange-700">
                              <Flame className="w-3 h-3 mr-1" />
                              Hot
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {post.likes || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              Engaging
                            </span>
                            <span>{format(new Date(post.created_date), 'MMM d')}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No trending posts yet</p>
            )}
          </TabsContent>

          <TabsContent value="groups" className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5" style={{ color: '#5C4B99' }} />
              Popular Groups
            </h3>
            {popularGroups.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {popularGroups.map((group, index) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={createPageUrl(`UserGroupView?groupId=${group.id}`)}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: group.color || '#5C4B9920' }}>
                                {group.icon || '👥'}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-800">{group.title}</h4>
                                <p className="text-xs text-gray-500">{group.member_count || 0} members</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
                            <Badge className="capitalize">{group.category}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No groups yet</p>
            )}
          </TabsContent>

          <TabsContent value="gratitude" className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Inspiring Gratitude
            </h3>
            {inspiringGratitude.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {inspiringGratitude.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                      <CardContent className="p-4">
                        <p className="text-gray-700 italic line-clamp-3">"{post.content}"</p>
                        <div className="flex items-center gap-2 mt-3">
                          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                          <span className="text-sm text-gray-600">{post.likes || 0} hearts</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No gratitude posts yet</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}