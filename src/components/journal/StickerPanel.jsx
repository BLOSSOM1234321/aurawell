import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sticker, X } from "lucide-react";

const stickerCategories = {
  "Emotions & Faces": [
    "😊", "😢", "😍", "🥰", "😎", "🤗", "😴", "🥳", 
    "😌", "🙄", "😤", "🤔", "😬", "🥺", "😋", "🤪",
    "😇", "🤭", "😘", "😁", "😅", "🥲", "😑", "🫣"
  ],
  "Hearts & Love": [
    "💙", "💚", "💛", "🧡", "💜", "🤍", "🖤", "❤️",
    "💕", "💖", "💗", "💘", "💝", "💞", "💟", "♥️",
    "💋", "😻", "🥰", "😍", "💌", "💐", "🌹", "💒"
  ],
  "Nature & Plants": [
    "🌸", "🌺", "🌻", "🌷", "🌹", "🍃", "🌿", "🌱",
    "🌳", "🌲", "🌵", "🍄", "🌾", "🌴", "🎋", "🎍",
    "🌊", "🏔️", "🌈", "☀️", "🌙", "⭐", "✨", "🌟"
  ],
  "Fun & Celebration": [
    "✨", "🎉", "🎊", "🎈", "🎁", "🌟", "💫", "⚡",
    "🔥", "💎", "👑", "🎭", "🎨", "🎪", "🎯", "🎲",
    "🎵", "🎶", "🎤", "🎸", "🥳", "🎂", "🍰", "🧁"
  ],
  "Food & Treats": [
    "🍓", "🍎", "🍊", "🍋", "🍌", "🍇", "🫐", "🥝",
    "🍑", "🥭", "🍍", "🥥", "🍰", "🧁", "🍪", "☕",
    "🍭", "🍬", "🍫", "🥨", "🍩", "🥞", "🧇", "🍯"
  ],
  "Animals & Cute": [
    "🐱", "🐶", "🐰", "🐻", "🐼", "🐨", "🦊", "🐸",
    "🐙", "🦋", "🐝", "🐛", "🦆", "🐧", "🦉", "🐢",
    "🦄", "🐷", "🐵", "🐺", "🦁", "🐯", "🐨", "🐹"
  ]
};

export default function StickerPanel({ onSelectSticker }) {
  const [activeCategory, setActiveCategory] = useState("Emotions & Faces");

  return (
    <Card className="h-full bg-white border-l shadow-xl rounded-l-3xl">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Sticker className="w-5 h-5 text-purple-500" />
          Add Stickers
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden flex flex-col h-full">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1 p-4 border-b bg-gray-50">
          {Object.keys(stickerCategories).map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className={`text-xs rounded-xl ${
                activeCategory === category 
                  ? 'bg-purple-500 text-white' 
                  : 'hover:bg-purple-50'
              }`}
            >
              {category.split(' ')[0]}
            </Button>
          ))}
        </div>

        {/* Stickers Grid */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-4 gap-3">
            {stickerCategories[activeCategory].map((sticker, index) => (
              <button
                key={index}
                onClick={() => onSelectSticker(sticker)}
                className="aspect-square text-3xl p-3 rounded-2xl hover:bg-purple-50 transition-all duration-200 hover:scale-110 transform border-2 border-transparent hover:border-purple-200 flex items-center justify-center"
              >
                {sticker}
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 border-t bg-purple-50">
          <p className="text-xs text-purple-600 text-center">
            Tap a sticker to add it to your page. Drag to move, tap to select and resize!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}