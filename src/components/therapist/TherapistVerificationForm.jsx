import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, CheckCircle, Bird, X } from "lucide-react";
import { toast } from "sonner";
import { TherapistProfile } from "@/api/entities";
import { User } from "@/api/entities";
import { base44 } from "@/api/base44Client";

const therapeuticApproachesList = [
  "Cognitive Behavioral Therapy (CBT)",
  "Dialectical Behavior Therapy (DBT)",
  "Eye Movement Desensitization and Reprocessing (EMDR)",
  "Psychodynamic Therapy",
  "Humanistic Therapy",
  "Acceptance and Commitment Therapy (ACT)",
  "Mindfulness-Based Therapy",
  "Solution-Focused Brief Therapy",
  "Family Systems Therapy",
  "Narrative Therapy",
  "Somatic Therapy",
  "Art Therapy",
  "Play Therapy"
];

const expertiseAreasList = [
  "Anxiety Disorders",
  "Depression",
  "Trauma & PTSD",
  "Relationship Issues",
  "Couples Counseling",
  "Family Therapy",
  "Child Psychology",
  "Adolescent Therapy",
  "Grief & Loss",
  "Stress Management",
  "Self-Esteem Issues",
  "Eating Disorders",
  "Addiction & Substance Abuse",
  "OCD",
  "Bipolar Disorder",
  "Personality Disorders",
  "Life Transitions",
  "Anger Management",
  "Sleep Disorders",
  "Chronic Pain"
];

export default function TherapistVerificationForm({ onComplete }) {
  const [formData, setFormData] = useState({
    full_name: "",
    specialization: "",
    years_of_experience: "",
    bio: "",
    website: "",
    therapeutic_approaches: [],
    areas_of_expertise: []
  });
  const [certificationFile, setCertificationFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setCertificationFile(file);
  };

  const toggleApproach = (approach) => {
    setFormData(prev => ({
      ...prev,
      therapeutic_approaches: prev.therapeutic_approaches.includes(approach)
        ? prev.therapeutic_approaches.filter(a => a !== approach)
        : [...prev.therapeutic_approaches, approach]
    }));
  };

  const toggleExpertise = (expertise) => {
    setFormData(prev => ({
      ...prev,
      areas_of_expertise: prev.areas_of_expertise.includes(expertise)
        ? prev.areas_of_expertise.filter(e => e !== expertise)
        : [...prev.areas_of_expertise, expertise]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!certificationFile) {
      toast.error("Please upload your certification");
      return;
    }

    if (formData.therapeutic_approaches.length === 0) {
      toast.error("Please select at least one therapeutic approach");
      return;
    }

    if (formData.areas_of_expertise.length === 0) {
      toast.error("Please select at least one area of expertise");
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload certification file
      const { file_url } = await base44.integrations.Core.UploadFile({ file: certificationFile });

      // Create therapist profile
      await TherapistProfile.create({
        ...formData,
        years_of_experience: parseInt(formData.years_of_experience),
        certification_url: file_url,
        verification_status: "pending",
        submitted_date: new Date().toISOString()
      });

      // Update user type and status
      await User.updateMyUserData({
        user_type: "therapist",
        verification_status: "pending"
      });

      toast.success("Verification submitted! We'll review your application soon.");
      onComplete();
    } catch (error) {
      console.error("Error submitting verification:", error);
      toast.error("Failed to submit verification. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-8 space-y-3">
          <Bird className="w-12 h-12 mx-auto" style={{ color: '#5C4B99' }} />
          <h1 className="text-3xl font-bold text-gray-800">Therapist Verification</h1>
          <p className="text-gray-600">Help us verify your credentials to join as a trusted therapist</p>
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="full_name">Full Professional Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="specialization">Specialization Area *</Label>
                <Input
                  id="specialization"
                  placeholder="e.g., Anxiety, Depression, Trauma, Mindfulness"
                  value={formData.specialization}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="years_of_experience">Years of Experience *</Label>
                <Input
                  id="years_of_experience"
                  type="number"
                  min="0"
                  value={formData.years_of_experience}
                  onChange={(e) => setFormData({...formData, years_of_experience: e.target.value})}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="bio">Professional Bio *</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about your background, approach, and what you can offer to our community..."
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  required
                  rows={5}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="website">Website or Social Link (Optional)</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://..."
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Therapeutic Approaches * (Select all that apply)</Label>
                <div className="mt-2 border border-gray-200 rounded-xl p-4 max-h-48 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {therapeuticApproachesList.map((approach) => (
                      <Badge
                        key={approach}
                        onClick={() => toggleApproach(approach)}
                        className={`cursor-pointer transition-colors ${
                          formData.therapeutic_approaches.includes(approach)
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {approach}
                      </Badge>
                    ))}
                  </div>
                </div>
                {formData.therapeutic_approaches.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.therapeutic_approaches.length} selected
                  </p>
                )}
              </div>

              <div>
                <Label>Areas of Expertise * (Select all that apply)</Label>
                <div className="mt-2 border border-gray-200 rounded-xl p-4 max-h-48 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {expertiseAreasList.map((expertise) => (
                      <Badge
                        key={expertise}
                        onClick={() => toggleExpertise(expertise)}
                        className={`cursor-pointer transition-colors ${
                          formData.areas_of_expertise.includes(expertise)
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {expertise}
                      </Badge>
                    ))}
                  </div>
                </div>
                {formData.areas_of_expertise.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.areas_of_expertise.length} selected
                  </p>
                )}
              </div>

              <div>
                <Label>Upload Certification * (Image or PDF, max 10MB)</Label>
                <div className="mt-2">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 transition-colors">
                    {certificationFile ? (
                      <div className="text-center">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                        <p className="text-sm text-gray-700">{certificationFile.name}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">Click to upload certification</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl text-white"
                style={{ backgroundColor: '#5C4B99' }}
              >
                {isSubmitting ? "Submitting..." : "Submit for Verification"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-4">
          Once submitted, our team will review your application within 24-48 hours
        </p>
      </motion.div>
    </div>
  );
}