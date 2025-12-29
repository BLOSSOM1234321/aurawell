import React, { useState } from 'react';
import { CommunityGroup } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  HeartPulse, Brain, Shield, Zap, Activity, Heart, Apple, RotateCcw,
  Users, Briefcase, RefreshCw, Church, User, UserCheck, Mountain, Sparkles, PlusCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const icons = {
  HeartPulse, Brain, Shield, Zap, Activity, Heart, Apple, RotateCcw, Users,
  Briefcase, RefreshCw, Church, User, UserCheck, Mountain, Sparkles
};

const iconNames = Object.keys(icons);

export default function NewGroupForm({ onGroupCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    icon: 'Sparkles',
    color: 'from-gray-400 to-gray-500',
    textColor: 'text-gray-800',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSlugGeneration = (title) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, title, slug }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await CommunityGroup.create(formData);
      onGroupCreated();
      setIsOpen(false);
      setFormData({
        title: '', slug: '', description: '', icon: 'Sparkles',
        color: 'from-gray-400 to-gray-500', textColor: 'text-gray-800',
      });
    } catch (error) {
      console.error("Error creating group:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Community Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <Input id="title" value={formData.title} onChange={(e) => handleSlugGeneration(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="slug" className="text-sm font-medium">URL Slug</label>
            <Input id="slug" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} required />
          </div>
          <div>
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
          </div>
          <div>
            <label htmlFor="icon" className="text-sm font-medium">Icon</label>
            <Select value={formData.icon} onValueChange={(value) => setFormData({...formData, icon: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                {iconNames.map(name => {
                  const IconComponent = icons[name];
                  return (
                    <SelectItem key={name} value={name}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span>{name}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="color" className="text-sm font-medium">Gradient Color Classes</label>
            <Input id="color" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} placeholder="e.g., from-blue-400 to-cyan-500" required />
          </div>
          <div>
            <label htmlFor="textColor" className="text-sm font-medium">Text Color Class</label>
            <Input id="textColor" value={formData.textColor} onChange={(e) => setFormData({...formData, textColor: e.target.value})} placeholder="e.g., text-blue-800" required />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Creating...' : 'Create Group'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}