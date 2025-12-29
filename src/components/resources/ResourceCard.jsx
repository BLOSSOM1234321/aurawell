import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ExternalLink } from "lucide-react";

export default function ResourceCard({ 
  title, 
  description, 
  type, 
  readTime, 
  icon: Icon, 
  color,
  url 
}) {
  return (
    <div className="p-4 border border-gray-200 rounded-2xl hover:shadow-md transition-all duration-200 bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${color} bg-opacity-10`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <Badge variant="outline" className="text-xs">
              {type}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          {readTime}
        </div>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full rounded-2xl hover:bg-gray-50"
        onClick={() => url && window.open(url, '_blank')}
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Access Resource
      </Button>
    </div>
  );
}