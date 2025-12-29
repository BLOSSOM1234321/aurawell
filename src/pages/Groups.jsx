
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Users,
  Loader2,
  ChevronRight,
  Heart,
  Brain,
  BookOpen,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import BackHeader from "../components/navigation/BackHeader";
import { SupportGroup } from "@/api/entities";
import { mockUserGroups } from "../data/mockGroups";

const iconMap = {
  Heart,
  Brain,
  BookOpen,
  MessageSquare,
  Users
};

const SupportGroupCard = ({ group, index, onClick }) => {
  const IconComponent = iconMap[group.icon] || Users;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
    >
      <Card
        className="bg-card border-light shadow-sm cursor-pointer hover:shadow-md transition-shadow h-full"
        onClick={() => onClick(group)}
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full bg-gradient-to-r ${group.color}`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`font-bold ${group.textColor} mb-1`}>{group.title}</h3>
              <p className="text-sm text-secondary">{group.description}</p>
            </div>
            <div className="text-accent">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const UserGroupCard = ({ group, index, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
    >
      <Card
        className="bg-card border-light shadow-sm cursor-pointer hover:shadow-md transition-shadow h-full"
        onClick={() => onClick(group)}
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: group.color || '#5C4B9920' }}>
              {group.icon || '👥'}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">{group.title}</h3>
              <p className="text-sm text-secondary line-clamp-2">{group.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="capitalize text-xs">{group.category}</Badge>
                <span className="text-xs text-gray-500">{group.member_count || 0} members</span>
              </div>
            </div>
            <div style={{ color: '#5C4B99' }}>
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function Groups() {
  const [supportGroups, setSupportGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load Support Groups from localStorage
      const groups = await SupportGroup.findMany({
        where: {
          isArchived: false
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      setSupportGroups(groups);
      setUserGroups(mockUserGroups); // Keep user groups as mock for now
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading support groups:', error);
      setSupportGroups([]);
      setUserGroups(mockUserGroups);
      setIsLoading(false);
    }
  };

  const handleSupportGroupClick = (group) => {
    window.location.href = createPageUrl(`Group?slug=${group.slug}`);
  };

  const handleUserGroupClick = (group) => {
    window.location.href = createPageUrl(`UserGroupView?groupId=${group.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-main py-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  const totalGroups = supportGroups.length + userGroups.length;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <BackHeader
          title="All Groups"
          subtitle="Find your community and connect with others on similar journeys"
          backTo={createPageUrl("Community")}
          backLabel="Community"
        />

        {/* Support Groups Section */}
        {supportGroups.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Support Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supportGroups.map((group, index) => (
                <SupportGroupCard
                  key={group.id}
                  group={group}
                  index={index}
                  onClick={handleSupportGroupClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* User-Created Groups Section */}
        {userGroups.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Community Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userGroups.map((group, index) => (
                <UserGroupCard
                  key={group.id}
                  group={group}
                  index={index}
                  onClick={handleUserGroupClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {totalGroups === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="text-center py-10"
          >
            <p className="text-secondary mb-4">No groups available at the moment.</p>
            <Link to={createPageUrl("CreateGroup")}>
              <button className="px-6 py-2 rounded-lg text-white" style={{ backgroundColor: '#5C4B99' }}>
                Create the First Group
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
