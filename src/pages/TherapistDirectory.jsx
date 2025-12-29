import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, User, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import BackHeader from "../components/navigation/BackHeader";
import { createPageUrl } from "@/utils";
import { mockTherapists } from "../data/mockTherapists";

export default function TherapistDirectory() {
  const [therapists, setTherapists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApproach, setSelectedApproach] = useState(null);
  const [selectedExpertise, setSelectedExpertise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTherapists();
  }, []);

  const loadTherapists = async () => {
    setIsLoading(true);
    // Simulate async loading with mock data
    setTimeout(() => {
      setTherapists(mockTherapists);
      setIsLoading(false);
    }, 300);
  };

  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch =
      therapist.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.specialization?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesApproach = !selectedApproach ||
      therapist.therapeutic_approaches?.includes(selectedApproach);

    const matchesExpertise = !selectedExpertise ||
      therapist.areas_of_expertise?.includes(selectedExpertise);

    return matchesSearch && matchesApproach && matchesExpertise;
  });

  const allApproaches = [...new Set(therapists.flatMap(t => t.therapeutic_approaches || []))];
  const allExpertise = [...new Set(therapists.flatMap(t => t.areas_of_expertise || []))];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <BackHeader
          title="Find a Therapist"
          subtitle="Connect with verified mental health professionals"
          backTo={createPageUrl("Community")}
          backLabel="Community"
        />

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name, specialization, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Filter by Therapeutic Approach</p>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    onClick={() => setSelectedApproach(null)}
                    className={`cursor-pointer ${!selectedApproach ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    All
                  </Badge>
                  {allApproaches.slice(0, 10).map(approach => (
                    <Badge
                      key={approach}
                      onClick={() => setSelectedApproach(approach)}
                      className={`cursor-pointer ${selectedApproach === approach ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {approach}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Filter by Area of Expertise</p>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    onClick={() => setSelectedExpertise(null)}
                    className={`cursor-pointer ${!selectedExpertise ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    All
                  </Badge>
                  {allExpertise.slice(0, 10).map(expertise => (
                    <Badge
                      key={expertise}
                      onClick={() => setSelectedExpertise(expertise)}
                      className={`cursor-pointer ${selectedExpertise === expertise ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {expertise}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading therapists...</p>
          </div>
        ) : filteredTherapists.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredTherapists.map((therapist, index) => (
              <motion.div
                key={therapist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                          {therapist.name?.[0] || 'T'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-800 text-lg">{therapist.name}</h3>
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                          </div>
                          <p className="text-sm text-gray-600">{therapist.specialization}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {therapist.years_of_experience} years of experience
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm line-clamp-3">{therapist.bio}</p>

                      <div className="space-y-2">
                        {therapist.therapeutic_approaches && therapist.therapeutic_approaches.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-600 mb-1">Approaches:</p>
                            <div className="flex flex-wrap gap-1">
                              {therapist.therapeutic_approaches.slice(0, 3).map((approach, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-purple-50">
                                  {approach}
                                </Badge>
                              ))}
                              {therapist.therapeutic_approaches.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{therapist.therapeutic_approaches.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {therapist.areas_of_expertise && therapist.areas_of_expertise.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-600 mb-1">Specializes in:</p>
                            <div className="flex flex-wrap gap-1">
                              {therapist.areas_of_expertise.slice(0, 3).map((expertise, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-blue-50">
                                  {expertise}
                                </Badge>
                              ))}
                              {therapist.areas_of_expertise.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{therapist.areas_of_expertise.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1" style={{ backgroundColor: '#5C4B99' }}>
                          View Profile
                        </Button>
                        {therapist.website && (
                          <Button variant="outline" onClick={() => window.open(therapist.website, '_blank')}>
                            Website
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 mb-2">No therapists found</p>
            <p className="text-sm text-gray-500">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}