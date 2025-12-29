import React, { useState, useEffect } from "react";
import { UserGroup } from "@/api/entities";
import { GroupMembership } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, UserMinus } from "lucide-react";
import { toast } from "sonner";
import BackHeader from "../components/navigation/BackHeader";
import { createPageUrl } from "@/utils";

export default function UserGroupView() {
  const [group, setGroup] = useState(null);
  const [user, setUser] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGroupData();
  }, []);

  const loadGroupData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const params = new URLSearchParams(window.location.search);
      const groupId = params.get('groupId');

      const groupData = await UserGroup.filter({ id: groupId });
      if (groupData.length > 0) {
        setGroup(groupData[0]);
        
        const memberships = await GroupMembership.filter({ group_id: groupId });
        setMemberCount(memberships.length);
        setIsMember(memberships.some(m => m.user_email === currentUser.email));
      }
    } catch (error) {
      console.error("Error loading group:", error);
    }
    setIsLoading(false);
  };

  const handleJoinLeave = async () => {
    try {
      if (isMember) {
        const memberships = await GroupMembership.filter({ 
          group_id: group.id, 
          user_email: user.email 
        });
        if (memberships.length > 0) {
          await GroupMembership.delete(memberships[0].id);
        }
        await UserGroup.update(group.id, { 
          member_count: Math.max(0, (group.member_count || 0) - 1)
        });
        toast.success("Left the group");
        setIsMember(false);
        setMemberCount(prev => Math.max(0, prev - 1));
      } else {
        await GroupMembership.create({
          group_id: group.id,
          user_email: user.email,
          user_name: user.preferred_name || user.full_name,
          joined_date: new Date().toISOString()
        });
        await UserGroup.update(group.id, { 
          member_count: (group.member_count || 0) + 1
        });
        toast.success("Joined the group!");
        setIsMember(true);
        setMemberCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update membership");
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!group) {
    return <div className="min-h-screen flex items-center justify-center">Group not found</div>;
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <BackHeader
          title={group.title}
          subtitle={`${memberCount} members`}
          backTo={createPageUrl("Community")}
          backLabel="Community"
        />

        <Card>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: group.color }}>
                    {group.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{group.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="capitalize">{group.category}</Badge>
                      {group.is_private && <Badge variant="outline">Private</Badge>}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleJoinLeave}
                  variant={isMember ? "outline" : "default"}
                  style={!isMember ? { backgroundColor: '#5C4B99', color: 'white' } : {}}
                >
                  {isMember ? (
                    <><UserMinus className="w-4 h-4 mr-2" /> Leave Group</>
                  ) : (
                    <><UserPlus className="w-4 h-4 mr-2" /> Join Group</>
                  )}
                </Button>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">About this group</h3>
                <p className="text-gray-600">{group.description}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {isMember && (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-600">
                Group discussions coming soon! Stay tuned for updates.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}