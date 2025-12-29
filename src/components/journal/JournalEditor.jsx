import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Save, X, Plus } from "lucide-react";

export default function JournalEditor({ entry, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    prompt: "",
    mood_rating: 5,
    tags: []
  });
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (entry) {
      setFormData({
        title: entry.title || "",
        content: entry.content || "",
        prompt: entry.prompt || "",
        mood_rating: entry.mood_rating || 5,
        tags: entry.tags || []
      });
    }
  }, [entry]);

  const handleSubmit = () => {
    if (!formData.content.trim()) return;
    onSave(formData);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <CardTitle className="text-center">
            {entry && entry.id ? 'Edit Entry' : 'New Journal Entry'}
          </CardTitle>
          <div className="w-10" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {formData.prompt && (
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
            <h3 className="font-medium text-amber-800 mb-2">Writing Prompt:</h3>
            <p className="text-amber-700 italic">{formData.prompt}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium">Title</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Give your entry a title..."
            className="rounded-2xl"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Your thoughts</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            placeholder="What's on your mind? Share your thoughts, feelings, experiences..."
            className="w-full p-4 border border-gray-200 rounded-2xl resize-none h-64 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500">
            {formData.content.length} characters
          </p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium">
            Mood while writing: {formData.mood_rating}/10
          </label>
          <Slider
            value={[formData.mood_rating]}
            onValueChange={(values) => setFormData({...formData, mood_rating: values[0]})}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>Very Low</span>
            <span>Neutral</span>
            <span>Very High</span>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium">Tags</label>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag..."
              className="flex-1 rounded-2xl"
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
            />
            <Button
              onClick={addTag}
              variant="outline"
              className="rounded-2xl"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1 rounded-2xl cursor-pointer hover:bg-red-100"
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 rounded-2xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !formData.content.trim()}
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-2xl"
          >
            {isLoading ? (
              'Saving...'
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Entry
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}