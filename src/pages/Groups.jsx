import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Loader2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import BackHeader from "../components/navigation/BackHeader";
import api from "@/api/client";

const GroupCard = ({ group, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.05, duration: 0.3 }}
    >
      <Link to={createPageUrl(`Group/${group.id}`)}>
        <Card className="bg-white border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 h-full">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: `${group.color}20` }}
              >
                {group.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {group.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {group.description}
                </p>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default function Groups() {
  const [supportGroups, setSupportGroups] = useState([]);
  const [communityGroups, setCommunityGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setIsLoading(true);
    try {
      const response = await api.getSupportGroups();

      if (response.success && response.data) {
        // Separate groups by type
        const support = response.data.filter(g => g.group_type === 'support');
        const community = response.data.filter(g => g.group_type === 'community');

        setSupportGroups(support);
        setCommunityGroups(community);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#5C4B99' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <BackHeader
          title="Support Groups"
          subtitle="Find your community and connect with others on similar journeys"
          backTo={createPageUrl("Community")}
          backLabel="Community"
        />

        {/* Support Groups Section */}
        {supportGroups.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide px-4">
              Support Groups
            </h2>
            <div className="space-y-3 px-4">
              {supportGroups.map((group, index) => (
                <GroupCard key={group.id} group={group} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Community Groups Section */}
        {communityGroups.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide px-4">
              Community Groups
            </h2>
            <div className="space-y-3 px-4">
              {communityGroups.map((group, index) => (
                <GroupCard key={group.id} group={group} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {supportGroups.length === 0 && communityGroups.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-center py-12 px-4"
          >
            <p className="text-gray-600 mb-4">No groups available at the moment.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
