
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  X, Save, Plus, ChevronLeft, ChevronRight, Star,
  Palette, Sticker, Image as ImageIcon, Grid,
  FileText, Minus, RotateCcw, Heart, Undo, Redo,
  Move, RotateCw, Maximize, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns"; // New import for date formatting

import StickerPanel from "./StickerPanel";
import BackgroundSelector from "./BackgroundSelector";
import PageLayoutSelector from "./PageLayoutSelector";

const starterPrompts = [
  "Today, I feel...",
  "A moment that made me smile today was...",
  "Something I want to let go of is...",
  "I'm grateful for...",
  "A lesson I learned recently is...",
  "My biggest accomplishment today was...",
  "Something that challenged me was...",
  "I'm looking forward to...",
  "A memory that brings me joy is...",
  "If I could tell my younger self something, it would be..."
];

// Helper function to generate unique IDs
const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function FullscreenJournalEditor({
  entry,
  rolePlayData, // New prop for role-play scenarios
  onSave,
  onClose,
  isLoading
}) {
  // Refactor formData into individual states
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [moodRating, setMoodRating] = useState(5);
  const [tags, setTags] = useState([]);
  const [pages, setPages] = useState([]); // Will be initialized in useEffect
  const [isFavorite, setIsFavorite] = useState(false);

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showStickerPanel, setShowStickerPanel] = useState(false);
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [newTag, setNewTag] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const textareaRef = useRef(null);
  const historyIndexRef = useRef(historyIndex); // Ref to hold the latest historyIndex for callbacks

  // Keep historyIndexRef up-to-date
  useEffect(() => {
    historyIndexRef.current = historyIndex;
  }, [historyIndex]);

  // Memoize saveToHistory to ensure stable function identity
  const saveToHistory = useCallback(() => {
    // Capture all relevant states for history
    const newHistoryEntry = {
      title,
      prompt,
      moodRating,
      tags: [...tags], // Deep copy tags
      pages: JSON.parse(JSON.stringify(pages)), // Deep copy pages for elements etc.
      isFavorite,
      currentPageIndex // Also save current page index
    };

    setHistory(prevHistory => {
      // Use the ref for historyIndex to get the latest value
      const newHistory = prevHistory.slice(0, historyIndexRef.current + 1);
      newHistory.push(newHistoryEntry);
      return newHistory;
    });
    setHistoryIndex(prevIndex => prevIndex + 1);
  }, [title, prompt, moodRating, tags, pages, isFavorite, currentPageIndex]); // Dependencies for all states captured

  // Initial data loading and state setup (runs once on mount or when entry/rolePlayData changes)
  useEffect(() => {
    if (entry) {
      // Load existing entry data
      setTitle(entry.title || "");
      setPrompt(entry.prompt || "");
      setMoodRating(entry.mood_rating || 5);
      setTags(entry.tags || []);
      setPages(entry.pages && entry.pages.length > 0 ? entry.pages : [{
        id: generateId(),
        content: entry.content || "",
        background: { type: "solid", value: "#fef7ff" },
        layout: "blank",
        elements: []
      }]);
      setIsFavorite(entry.is_favorite || false);
      setCurrentPageIndex(0); // Always start at first page when loading an entry
    } else {
      // Initialize for a new entry
      const initialContent = rolePlayData?.starter || "";
      const randomPrompt = starterPrompts[Math.floor(Math.random() * starterPrompts.length)];

      setTitle(rolePlayData ? `${rolePlayData.name} - ${format(new Date(), 'MMM d, yyyy')}` : "");
      setPrompt(rolePlayData ? `Role-play as: ${rolePlayData.name}` : randomPrompt);
      setMoodRating(5);
      setTags([]);
      setPages([{
        id: generateId(),
        content: initialContent,
        background: { type: "solid", value: "#fef7ff" },
        layout: "blank",
        elements: []
      }]);
      setIsFavorite(false);
      setCurrentPageIndex(0);
    }
  }, [entry, rolePlayData]); // rolePlayData is a dependency as it influences initial state

  // Initialize history after states are set for the first time
  useEffect(() => {
    // Only save to history if pages array is not empty and history is empty (initial load)
    // This prevents saving an empty initial state before useEffect above runs.
    if (pages.length > 0 && history.length === 0) {
      saveToHistory();
    }
  }, [pages, history.length, saveToHistory]); // saveToHistory is a dependency because it's called here

  const undo = () => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      setTitle(previousState.title);
      setPrompt(previousState.prompt);
      setMoodRating(previousState.moodRating);
      setTags(previousState.tags);
      setPages(previousState.pages);
      setIsFavorite(previousState.isFavorite);
      setCurrentPageIndex(previousState.currentPageIndex);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setTitle(nextState.title);
      setPrompt(nextState.prompt);
      setMoodRating(nextState.moodRating);
      setTags(nextState.tags);
      setPages(nextState.pages);
      setIsFavorite(nextState.isFavorite);
      setCurrentPageIndex(nextState.currentPageIndex);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Get current page data object from the pages array
  const currentPageData = pages[currentPageIndex];

  const updateCurrentPage = (updates) => {
    if (!currentPageData) return; // Guard against undefined page data

    const newPages = [...pages];
    newPages[currentPageIndex] = { ...currentPageData, ...updates };
    setPages(newPages);
    // Debounced history save to avoid too many entries for rapid changes (e.g., typing)
    // A more robust solution might use a dedicated debounce hook.
    setTimeout(saveToHistory, 500);
  };

  const addNewPage = () => {
    const newPage = {
      id: generateId(),
      content: "",
      background: { type: "solid", value: "#fef7ff" },
      layout: "blank",
      elements: []
    };
    setPages(prevPages => [...prevPages, newPage]);
    setCurrentPageIndex(pages.length); // New page is at the end, so its index is the current length
    saveToHistory();
  };

  const addSticker = (sticker) => {
    const newElement = {
      id: generateId(),
      type: "sticker",
      content: sticker,
      position: {
        x: Math.random() * (window.innerWidth > 768 ? 300 : 200), // Random position for initial placement
        y: Math.random() * 200 + 100
      },
      size: { width: 60, height: 60 },
      rotation: 0,
      zIndex: Date.now() // Unique zIndex for each new element
    };

    updateCurrentPage({
      elements: [...currentPageData.elements, newElement]
    });
    setShowStickerPanel(false);
    toast.success("Sticker added! Drag to move, pinch or use controls to resize.");
  };

  const updateElement = (elementId, updates) => {
    const updatedElements = currentPageData.elements.map(el =>
      el.id === elementId ? { ...el, ...updates } : el
    );
    updateCurrentPage({ elements: updatedElements });
  };

  const deleteElement = (elementId) => {
    const updatedElements = currentPageData.elements.filter(el => el.id !== elementId);
    updateCurrentPage({ elements: updatedElements });
    setSelectedElement(null);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prevTags => [...prevTags, newTag.trim()]);
      setNewTag("");
      saveToHistory();
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
    saveToHistory();
  };

  // Placeholder for thumbnail generation (complex in a real scenario, mock for now)
  const generateThumbnail = async (page) => {
    // In a real application, this would involve rendering the page content
    // (text, stickers, background) to an offscreen canvas or div and capturing
    // an image. For this exercise, we'll return a simple placeholder.
    console.log("Generating thumbnail for page:", page.id);
    return Promise.resolve(""); // Returns an empty string
  };


  const handleSave = async () => {
    const entryData = {
      title: title || (rolePlayData ? `${rolePlayData.name} - ${format(new Date(), 'MMM d, yyyy')}` : `Entry - ${format(new Date(), 'MMM d, yyyy')}`),
      content: pages.map(p => p.content).join('\n\n'), // Concatenate all page content for primary 'content' field
      prompt: prompt,
      mood_rating: moodRating,
      tags: tags,
      pages: pages,
      is_favorite: isFavorite,
      thumbnail: pages.length > 0 ? await generateThumbnail(pages[0]) : "", // Thumbnail from the first page, if available
    };

    onSave(entryData);
  };

  const getBackgroundStyle = (background) => {
    switch (background.type) {
      case "gradient":
        return { background: background.value };
      case "pattern":
        return {
          backgroundColor: "#fef7ff",
          backgroundImage: background.value,
          backgroundSize: "30px 30px"
        };
      default:
        return { backgroundColor: background.value };
    }
  };

  const getLayoutOverlay = (layout) => {
    if (layout === "lined") {
      return (
        <div className="absolute inset-0 pointer-events-none opacity-30">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className="border-b border-gray-400"
              style={{ height: "28px", marginBottom: "4px" }}
            />
          ))}
        </div>
      );
    }
    if (layout === "grid") {
      return (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
            backgroundSize: "25px 25px"
          }}
        />
      );
    }
    return null;
  };

  // Ensure currentPageData is available before rendering
  if (!currentPageData) {
    return null; // Or a loading spinner
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm flex items-center justify-center p-2 md:p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onClose}
              className="p-2 hover:bg-white/70 rounded-xl"
            >
              <X className="w-5 h-5" />
            </Button>
            {!rolePlayData && ( // Only show this title input if not in role-play mode
              <Input
                placeholder="Give your entry a title..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setTimeout(saveToHistory, 500);
                }}
                className="border-0 bg-white/70 text-lg font-semibold rounded-2xl min-w-0 flex-1"
              />
            )}
            {/* If in role-play mode, the title input is moved to the main area */}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsFavorite(prev => !prev)}
              className={`p-2 rounded-xl ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 md:px-6 py-2 rounded-2xl font-semibold shadow-lg"
            >
              {isLoading ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save</>}
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 border-b overflow-x-auto">
          <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStickerPanel(!showStickerPanel)}
              className="rounded-xl whitespace-nowrap"
            >
              <Sticker className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Stickers</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBackgroundSelector(!showBackgroundSelector)}
              className="rounded-xl whitespace-nowrap"
            >
              <Palette className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Background</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLayoutSelector(!showLayoutSelector)}
              className="rounded-xl whitespace-nowrap"
            >
              <Grid className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Layout</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={historyIndex <= 0}
              className="rounded-xl"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="rounded-xl"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm text-gray-500 whitespace-nowrap">
              Page {currentPageIndex + 1} of {pages.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
              disabled={currentPageIndex === 0}
              className="p-2 rounded-xl"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPageIndex(Math.min(pages.length - 1, currentPageIndex + 1))}
              disabled={currentPageIndex === pages.length - 1}
              className="p-2 rounded-xl"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={addNewPage}
              className="p-2 rounded-xl"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Journal Area */}
        <div className="flex-1 overflow-hidden flex">
          {/* Journal Page */}
          <div className="flex-1 p-4 md:p-8 overflow-auto">
            {/* Title input for role-play entries */}
            {rolePlayData && (
              <div className="max-w-[600px] mx-auto mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${rolePlayData.color || 'from-indigo-400 to-purple-500'}`}>
                    <rolePlayData.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Role-Play Mode: {rolePlayData.name}</h3>
                    <p className="text-sm text-gray-600">{rolePlayData.description}</p>
                  </div>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setTimeout(saveToHistory, 500);
                  }}
                  placeholder={`${rolePlayData.name} - ${format(new Date(), 'MMM d, yyyy')}`}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            )}

            <div
              className="relative w-full min-h-[600px] rounded-3xl shadow-xl mx-auto border-2 border-white"
              style={{
                ...getBackgroundStyle(currentPageData.background),
                maxWidth: window.innerWidth > 768 ? "600px" : "100%"
              }}
              onClick={() => setSelectedElement(null)}
            >
              {getLayoutOverlay(currentPageData.layout)}

              {/* Prompt */}
              {prompt && (
                <div className="relative z-10 p-4 md:p-6 pb-2">
                  <p className="text-purple-600 italic text-sm md:text-base mb-4 font-medium">
                    {prompt}
                  </p>
                </div>
              )}

              {/* Content Area */}
              <div className="relative z-10 p-4 md:p-6 pt-2">
                <textarea
                  ref={textareaRef}
                  value={currentPageData.content}
                  onChange={(e) => {
                    updateCurrentPage({ content: e.target.value });
                  }}
                  placeholder="Start writing your thoughts here..."
                  className="w-full h-96 bg-transparent border-0 resize-none focus:outline-none text-gray-800 leading-relaxed placeholder-gray-400"
                  style={{ fontSize: "16px", lineHeight: "1.6" }}
                />
              </div>

              {/* Draggable Elements */}
              {currentPageData.elements.map((element) => (
                <motion.div
                  key={element.id}
                  className={`absolute cursor-move z-20 select-none ${
                    selectedElement?.id === element.id ? 'ring-2 ring-purple-400 ring-offset-2' : ''
                  }`}
                  style={{
                    left: element.position.x,
                    top: element.position.y,
                    width: element.size.width,
                    height: element.size.height,
                    transform: `rotate(${element.rotation || 0}deg)`,
                    zIndex: element.zIndex
                  }}
                  drag
                  dragMomentum={false}
                  onDrag={(event, info) => {
                    updateElement(element.id, {
                      position: {
                        x: Math.max(0, element.position.x + info.delta.x),
                        y: Math.max(0, element.position.y + info.delta.y)
                      }
                    });
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElement(element);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {element.type === "sticker" && (
                    <div className="flex items-center justify-center w-full h-full text-4xl">
                      {element.content}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Element Controls */}
              {selectedElement && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute bg-white rounded-2xl shadow-lg p-3 flex gap-2 z-30"
                  style={{
                    left: selectedElement.position.x,
                    top: selectedElement.position.y - 50,
                  }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateElement(selectedElement.id, {
                      size: {
                        width: Math.max(30, selectedElement.size.width - 10),
                        height: Math.max(30, selectedElement.size.height - 10)
                      }
                    })}
                    className="p-1"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateElement(selectedElement.id, {
                      size: {
                        width: Math.min(120, selectedElement.size.width + 10),
                        height: Math.min(120, selectedElement.size.height + 10)
                      }
                    })}
                    className="p-1"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateElement(selectedElement.id, {
                      rotation: (selectedElement.rotation || 0) + 15
                    })}
                    className="p-1"
                  >
                    <RotateCw className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteElement(selectedElement.id)}
                    className="p-1 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Side Panels */}
          <AnimatePresence>
            {showStickerPanel && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="w-80 flex-shrink-0"
              >
                <StickerPanel onSelectSticker={addSticker} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tags Section */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center gap-3 mb-3">
            <Input
              placeholder="Add a tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              className="flex-1 rounded-2xl"
            />
            <Button
              onClick={addTag}
              variant="outline"
              className="rounded-2xl"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1 rounded-2xl cursor-pointer hover:bg-red-100 bg-purple-100 text-purple-700"
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Background Selector Modal */}
        <AnimatePresence>
          {showBackgroundSelector && (
            <BackgroundSelector
              currentBackground={currentPageData.background}
              onSelectBackground={(bg) => {
                updateCurrentPage({ background: bg });
                setShowBackgroundSelector(false);
              }}
              onClose={() => setShowBackgroundSelector(false)}
            />
          )}
        </AnimatePresence>

        {/* Layout Selector Modal */}
        <AnimatePresence>
          {showLayoutSelector && (
            <PageLayoutSelector
              currentLayout={currentPageData.layout}
              onSelectLayout={(layout) => {
                updateCurrentPage({ layout });
                setShowLayoutSelector(false);
              }}
              onClose={() => setShowLayoutSelector(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
