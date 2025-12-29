
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bird } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function BackHeader({ title, subtitle, backTo, backLabel, titleColor = "text-primary", subtitleColor = "text-secondary" }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between mb-6 py-4"
    >
      <div className="flex items-center gap-4">
        <Link to={backTo}>
          <Button 
            variant="ghost" 
            size="sm"
            className="p-2 hover:bg-accent-light/10 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-accent" />
          </Button>
        </Link>
        <div>
          <h1 className={`text-2xl font-light ${titleColor}`}>{title}</h1>
          {subtitle && (
            <p className={`text-sm mt-1 ${subtitleColor}`}>{subtitle}</p>
          )}
        </div>
      </div>
      
      <Bird className="w-6 h-6 text-accent/50" />
    </motion.div>
  );
}
