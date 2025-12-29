import React, { useState } from "react";
import { UserGroup } from "@/api/entities";
import { GroupMembership } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import BackHeader from "../components/navigation/BackHeader";
import { createPageUrl } from "@/utils";

const categories = [
  { value: "anxiety", label: "Anxiety Support", icon: "💙" },
  { value: "depression", label: "Depression Support", icon: "🌧️" },
  { value: "mindfulness", label: "Mindfulness & Meditation", icon: "🧘" },
  { value: "parenting", label: "Mindful Parenting", icon: "👨‍👩‍👧" },
  { value: "relationships", label: "Relationships", icon: "💕" },
  { value: "grief", label: "Grief & Loss", icon: "🕊️" },
  { value: "self_care", label: "Self-Care", icon: "✨" },
  { value: "other", label: "Other", icon: "🌟" }
];

export default function CreateGroup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    is_private: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = await User.me();
      const slug = generateSlug(formData.title);
      const selectedCategory = categories.find(c => c.value === formData.category);

      // Create the group
      const newGroup = await UserGroup.create({
        title: formData.title,
        slug: slug,
        description: formData.description,
        category: formData.category,
        icon: selectedCategory?.icon || "👥",
        color: "#5C4B9920",
        creator_email: user.email,
        member_count: 1,
        is_private: formData.is_private,
        is_active: true
      });

      // Add creator as first member
      await GroupMembership.create({
        group_id: newGroup.id,
        user_email: user.email,
        user_name: user.preferred_name || user.full_name,
        joined_date: new Date().toISOString()
      });

      toast.success("Group created successfully!");
      navigate(createPageUrl(`UserGroupView?groupId=${newGroup.id}`));
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <BackHeader
          title="Create a Group"
          subtitle="Build a community around shared experiences"
          backTo={createPageUrl("Community")}
          backLabel="Community"
        />

        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Group Name *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Anxiety Warriors"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="What is this group about? What kind of support will members find here?"
                  required
                  rows={5}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="private"
                  checked={formData.is_private}
                  onChange={(e) => setFormData({...formData, is_private: e.target.checked})}
                  className="w-4 h-4"
                />
                <Label htmlFor="private" className="cursor-pointer">
                  Make this group private (invite-only)
                </Label>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(createPageUrl("Community"))}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 text-white"
                  style={{ backgroundColor: '#5C4B99' }}
                >
                  <Users className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Creating..." : "Create Group"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}