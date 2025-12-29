
import React, { useState, useEffect, useCallback } from "react";
import { JournalEntry } from "@/api/entities";
import { Dream } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Plus, Search, Heart, Star, Edit, Trash2, Moon, Users } from "lucide-react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import FullscreenJournalEditor from "../components/journal/FullscreenJournalEditor";
import RolePlaySelector from "../components/journal/RolePlaySelector";
import DreamForm from '../components/dreams/DreamForm';
import DreamList from '../components/dreams/DreamList';
import DreamDetail from '../components/dreams/DreamDetail';
import NightSkyBackground from '../components/dreams/NightSkyBackground';
import BackHeader from '../components/navigation/BackHeader'; // Added import
import { createPageUrl } from "@/utils";
import { useLocation, useNavigate } from 'react-router-dom'; // Changed useHistory to useNavigate for React Router v6

export default function Journal() {
  const location = useLocation();
  const navigate = useNavigate(); // Changed useHistory to useNavigate

  const getTabFromUrl = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || 'personal';
  }, [location.search]);

  // State for Personal Journal
  const [entries, setEntries] = useState([]);
  const [isWriting, setIsWriting] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State for Dream Journal
  const [dreams, setDreams] = useState([]);
  const [isLoadingDreams, setIsLoadingDreams] = useState(true);
  const [isDreamFormOpen, setIsDreamFormOpen] = useState(false);
  const [selectedDream, setSelectedDream] = useState(null);
  const [activeTab, setActiveTab] = useState(getTabFromUrl());

  // State for Role-Play Mode
  const [isRolePlayMode, setIsRolePlayMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') !== activeTab) {
      params.set('tab', activeTab);
      navigate({ search: params.toString() }, { replace: true }); // Use navigate for URL changes
    }
  }, [activeTab, navigate, location.search]);

  useEffect(() => {
    setActiveTab(getTabFromUrl());
  }, [location.search, getTabFromUrl]);

  // Personal Journal Functions
  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    const journalEntries = await JournalEntry.list("-created_date", 50);
    setEntries(journalEntries);
    setIsLoading(false);
  }, []); 

  // Dream Journal Functions
  const loadDreams = useCallback(async () => {
    setIsLoadingDreams(true);
    try {
      const dreamEntries = await Dream.list('-dream_date');
      setDreams(dreamEntries);
    } catch (error) {
      console.error("Failed to load dreams:", error);
    }
    setIsLoadingDreams(false);
  }, []);

  useEffect(() => {
    loadEntries();
    loadDreams();
  }, [loadEntries, loadDreams]); 

  const handleSave = async (entryData) => {
    setIsLoading(true);
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      
      // Add role-play tags if in role-play mode
      const finalEntryData = {
        ...entryData,
        date: today,
        tags: selectedRole 
          ? [...(entryData.tags || []), 'Role-Play', selectedRole.name]
          : entryData.tags
      };
      
      if (selectedEntry && selectedEntry.id) {
        await JournalEntry.update(selectedEntry.id, finalEntryData);
      } else {
        await JournalEntry.create(finalEntryData);
        // Garden activity removed (Mind Garden deleted)
      }
      
      await loadEntries();
      setIsWriting(false);
      setSelectedEntry(null);
      setIsRolePlayMode(false);
      setSelectedRole(null);
    } catch (error) {
      console.error("Error saving journal entry:", error);
    }
    setIsLoading(false);
  };

  const handleEdit = (entry) => {
    setSelectedEntry(entry);
    
    // Check if this is a role-play entry
    const isRolePlayEntry = entry.tags?.includes('Role-Play');
    if (isRolePlayEntry) {
      setIsRolePlayMode(true);
      // Try to find the original role name from tags, excluding the 'Role-Play' tag itself
      const roleTag = entry.tags?.find(tag => tag !== 'Role-Play');
      // We'll need to match this back to a role object, for now just set a basic one
      setSelectedRole({ name: roleTag, starter: "" }); // Assuming RolePlaySelector/FullscreenJournalEditor can work with this minimal data for editing
    } else {
      setIsRolePlayMode(false);
      setSelectedRole(null);
    }
    
    setIsWriting(true);
  };

  const handleDelete = async (entry) => {
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      try {
        await JournalEntry.delete(entry.id);
        await loadEntries();
      } catch (error) {
        console.error("Error deleting journal entry:", error);
      }
    }
  };

  const handleNewEntry = () => {
    setSelectedEntry(null);
    setIsRolePlayMode(false);
    setSelectedRole(null);
    setIsWriting(true);
  };

  const handleRolePlayStart = () => {
    setSelectedEntry(null); // Ensure no previous entry is selected
    setIsRolePlayMode(true);
    setSelectedRole(null); // Make sure no role is pre-selected, so the selector opens
    setIsWriting(false); // Make sure editor is not open, so selector opens first
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setIsWriting(true); // Open the editor once a role is selected
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFavorites = !filterFavorites || entry.is_favorite;
    
    return matchesSearch && matchesFavorites;
  });

  const handleDreamFormClose = (didSave) => {
    setIsDreamFormOpen(false);
    if (didSave) {
      loadDreams();
    }
  };

  const handleDreamSelect = (dream) => {
    setSelectedDream(dream);
  };

  // Separate entries into regular and role-play
  const regularEntries = filteredEntries.filter(entry => !entry.tags?.includes('Role-Play'));
  const rolePlayEntries = filteredEntries.filter(entry => entry.tags?.includes('Role-Play'));

  return (
    <>
      {/* Full Screen Night Sky Background for Dream Tab */}
      {activeTab === "dream" && <NightSkyBackground fullScreen={true} />}
      
      <div className={`min-h-screen p-4 md:p-8 ${activeTab === 'dream' ? 'bg-transparent' : ''}`}>
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Back Header */}
          <BackHeader 
            title="Journal" 
            subtitle="Your space for reflection and growth"
            backTo={createPageUrl("Dashboard")}
            backLabel="Home"
            titleColor={activeTab === 'dream' ? 'text-white' : 'text-gray-800'}
            subtitleColor={activeTab === 'dream' ? 'text-blue-200' : 'text-gray-600'}
          />

          {/* Header Section (Original, preserved for conditional styling) */}
          <div className="text-center space-y-2">
            <h1 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${activeTab === "dream" ? "from-blue-200 to-purple-200" : "from-yellow-300 via-orange-400 to-red-400"} bg-clip-text text-transparent`}>
              My Journal
            </h1>
            <p className={`text-base md:text-lg ${activeTab === "dream" ? "text-blue-200 drop-shadow" : "text-gray-600"}`}>
              Your creative space for thoughts, dreams, and daily reflections ✨
            </p>
          </div>

          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className={`grid grid-cols-2 w-full max-w-md ${activeTab === "dream" ? "bg-white/10 backdrop-blur-sm border border-white/20" : ""}`}>
                <TabsTrigger 
                  value="personal" 
                  className={`flex items-center justify-center gap-2 text-sm ${activeTab === "dream" ? "data-[state=active]:bg-white/20 data-[state=active]:text-white text-blue-200" : ""}`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Personal</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="dream" 
                  className={`flex items-center justify-center gap-2 text-sm ${activeTab === "dream" ? "data-[state=active]:bg-white/20 data-[state=active]:text-white text-blue-200" : ""}`}
                >
                  <Moon className="w-4 h-4" />
                  <span className="hidden sm:inline">Dreams</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="personal" className="space-y-6 relative">
              {/* Role-Play Selector Overlay */}
              <AnimatePresence>
                {isRolePlayMode && !selectedRole && !isWriting && (
                  <RolePlaySelector
                    onRoleSelect={handleRoleSelect}
                    onClose={() => {
                      setIsRolePlayMode(false);
                      setSelectedRole(null);
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Search and Controls */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <CardHeader>
                  <div className="space-y-4">
                    <CardTitle className="flex items-center gap-3 text-lg md:text-xl">
                      <div className="p-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl shadow-lg">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      Journal Entries
                      <Badge className="bg-orange-100 text-orange-700 text-xs">
                        {entries.length}
                      </Badge>
                    </CardTitle>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search your journal..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/70 text-sm"
                        />
                      </div>
                      
                      <Button
                        variant={filterFavorites ? "default" : "outline"}
                        onClick={() => setFilterFavorites(!filterFavorites)}
                        className="rounded-xl text-sm"
                        size="sm"
                      >
                        <Heart className={`w-4 h-4 mr-1 ${filterFavorites ? 'fill-current' : ''}`} />
                        Favorites
                      </Button>
                      
                      <Button 
                        onClick={handleRolePlayStart}
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-semibold text-sm"
                        size="sm"
                      >
                        <Users className="w-4 h-4 mr-1" />
                        Role-Play
                      </Button>
                      
                      <Button 
                        onClick={handleNewEntry}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold text-sm"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        New Entry
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Role-Play Entries Section */}
              {rolePlayEntries.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    Role-Play Scenarios
                    <Badge className="bg-indigo-100 text-indigo-700 text-xs">
                      {rolePlayEntries.length}
                    </Badge>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rolePlayEntries.map((entry) => (
                      <Card 
                        key={entry.id}
                        className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group cursor-pointer"
                        onClick={() => handleEdit(entry)}
                      >
                        <div className="relative">
                          <div className="h-32 bg-gradient-to-br from-orange-100 to-red-100 p-3 flex items-center justify-center">
                            <div className="text-center">
                              <Users className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                              <p className="text-xs text-indigo-600 font-medium">
                                Role-Play Entry
                              </p>
                            </div>
                          </div>
                          
                          {entry.is_favorite && (
                            <div className="absolute top-2 right-2">
                              <Heart className="w-4 h-4 text-red-500 fill-current drop-shadow-sm" />
                            </div>
                          )}
                        </div>
                        
                        <div className="p-3">
                          <div className="space-y-2">
                            <div>
                              <h3 className="font-bold text-gray-800 line-clamp-1 text-sm">
                                {entry.title || `Entry from ${format(new Date(entry.date), 'MMM d')}`}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {format(new Date(entry.created_date), 'MMM d • h:mm a')}
                              </p>
                            </div>
                            
                            <p className="text-gray-700 text-xs line-clamp-2">
                              {entry.content || "No content yet..."}
                            </p>
                            
                            {entry.tags && entry.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {entry.tags.filter(tag => tag !== 'Role-Play').slice(0, 2).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {entry.tags.filter(tag => tag !== 'Role-Play').length > 2 && (
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    +{entry.tags.filter(tag => tag !== 'Role-Play').length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex justify-between items-center mt-3 pt-2 border-t border-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(entry);
                              }}
                              className="text-orange-600 hover:bg-orange-50 rounded-lg text-xs h-8"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(entry);
                              }}
                              className="text-red-500 hover:bg-red-50 rounded-lg text-xs h-8"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Journal Entries */}
              {isLoading ? (
                <div className="text-center text-gray-500 py-8">Loading entries...</div>
              ) : regularEntries.length > 0 ? (
                <div className="space-y-4">
                  {filteredEntries.length > 0 && rolePlayEntries.length > 0 && ( // Only show personal entries title if there are entries or if role-play entries exist above.
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-orange-600" />
                      Personal Entries
                      <Badge className="bg-orange-100 text-orange-700 text-xs">
                        {regularEntries.length}
                      </Badge>
                    </h3>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {regularEntries.map((entry) => (
                      <Card 
                        key={entry.id}
                        className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group cursor-pointer"
                        onClick={() => handleEdit(entry)}
                      >
                        <div className="relative">
                          <div 
                            className="h-32 bg-gradient-to-br from-yellow-100 to-orange-100 p-3 flex items-center justify-center"
                            style={entry.thumbnail ? {
                              backgroundImage: `url(${entry.thumbnail})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            } : {}}
                          >
                            {!entry.thumbnail && (
                              <div className="text-center">
                                <BookOpen className="w-6 h-6 text-orange-300 mx-auto mb-1" />
                                <p className="text-xs text-orange-600 font-medium">
                                  {entry.pages?.length || 1} {entry.pages?.length === 1 ? 'page' : 'pages'}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {entry.is_favorite && (
                            <div className="absolute top-2 right-2">
                              <Heart className="w-4 h-4 text-red-500 fill-current drop-shadow-sm" />
                            </div>
                          )}
                        </div>
                        
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <div>
                              <h3 className="font-bold text-gray-800 line-clamp-1 text-sm">
                                {entry.title || `Entry from ${format(new Date(entry.date), 'MMM d')}`}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {format(new Date(entry.created_date), 'MMM d • h:mm a')}
                              </p>
                            </div>
                            
                            {entry.prompt && (
                              <p className="text-xs text-orange-600 italic line-clamp-1">
                                "{entry.prompt}"
                              </p>
                            )}
                            
                            <p className="text-gray-700 text-xs line-clamp-2">
                              {entry.content || "No content yet..."}
                            </p>
                            
                            {entry.tags && entry.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {entry.tags.slice(0, 2).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {entry.tags.length > 2 && (
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    +{entry.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(entry);
                              }}
                              className="text-orange-600 hover:bg-orange-50 rounded-lg text-xs h-8"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(entry);
                              }}
                              className="text-red-500 hover:bg-red-50 rounded-lg text-xs h-8"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                  <CardContent className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      {searchQuery || filterFavorites ? 'No matching entries found' : 'Your journal is empty'}
                    </h3>
                    <p className="text-gray-500 mb-4 text-sm">
                      {searchQuery || filterFavorites 
                        ? 'Try adjusting your search or filters'  
                        : 'Start your journaling journey by creating your first entry'
                      }
                    </p>
                    {!searchQuery && !filterFavorites && (
                      <div className="flex justify-center gap-3">
                        <Button 
                          onClick={handleNewEntry}
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl px-6 py-2 font-semibold shadow-lg"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create First Entry
                        </Button>
                        <Button 
                          onClick={handleRolePlayStart}
                          variant="outline"
                          className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 rounded-xl px-6 py-2 font-semibold"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Try Role-Play
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="bg-gradient-to-br from-yellow-100 to-orange-100 border-0 shadow-lg rounded-xl">
                  <CardContent className="p-3 text-center">
                    <p className="text-xl font-bold text-orange-700">{entries.length}</p>
                    <p className="text-xs text-orange-600">Total Entries</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-indigo-100 to-indigo-200 border-0 shadow-lg rounded-xl">
                  <CardContent className="p-3 text-center">
                    <p className="text-xl font-bold text-indigo-700">{rolePlayEntries.length}</p>
                    <p className="text-xs text-indigo-600">Role-Play</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-pink-100 to-pink-200 border-0 shadow-lg rounded-xl">
                  <CardContent className="p-3 text-center">
                    <p className="text-xl font-bold text-pink-700">
                      {entries.filter(e => e.is_favorite).length}
                    </p>
                    <p className="text-xs text-pink-600">Favorites</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-teal-100 to-teal-200 border-0 shadow-lg rounded-xl">
                  <CardContent className="p-3 text-center">
                    <p className="text-xl font-bold text-teal-700">
                      {entries.reduce((sum, e) => sum + (e.pages?.length || 1), 0)}
                    </p>
                    <p className="text-xs text-teal-600">Total Pages</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="dream" className="space-y-6">
              <div className="relative z-10">
                <div className="text-center space-y-3 mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                    Dream Entries
                  </h2>
                  <p className="text-blue-200 drop-shadow text-sm md:text-base">
                    Explore the landscapes of your subconscious mind.
                  </p>
                  <Button
                    onClick={() => setIsDreamFormOpen(true)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl px-4 md:px-6 py-2 md:py-3 shadow-lg hover:shadow-xl transition-all text-sm md:text-base"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Log a New Dream
                  </Button>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="w-full"
                >
                  <DreamList
                    dreams={dreams}
                    isLoading={isLoadingDreams}
                    onSelectDream={handleDreamSelect}
                  />
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Fullscreen Journal Editor */}
          <AnimatePresence>
            {isWriting && (
              <FullscreenJournalEditor
                entry={selectedEntry}
                rolePlayData={selectedRole}
                onSave={handleSave}
                onClose={() => {
                  setIsWriting(false);
                  setSelectedEntry(null);
                  setIsRolePlayMode(false); // Reset role-play state when editor closes
                  setSelectedRole(null);   // Reset selected role when editor closes
                }}
                isLoading={isLoading}
              />
            )}
          </AnimatePresence>

          {/* Dream Modals */}
          <AnimatePresence>
            {isDreamFormOpen && (
              <DreamForm
                onClose={handleDreamFormClose}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedDream && (
              <DreamDetail
                dream={selectedDream}
                onClose={() => setSelectedDream(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
