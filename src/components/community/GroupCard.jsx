import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GroupCard({ group, isAdmin, onArchive }) {
  const { title, slug, description, icon: Icon, color, textColor } = group;

  return (
    <div className="group relative">
      <Link
        to={createPageUrl(`Group?name=${slug}`)}
        className="block h-full"
      >
        <div className="h-full p-6 bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
          <div className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-bl ${color} rounded-full opacity-10 group-hover:opacity-20 transition-all duration-300`} />
          
          <div className="relative h-full flex flex-col">
            <div className={`mb-4 w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
              <Icon size={28} />
            </div>
            <h3 className={`text-xl font-bold ${textColor} mb-2`}>{title}</h3>
            <p className="text-gray-600 text-sm flex-grow">{description}</p>
            <div className="mt-4 flex items-center justify-end text-sm font-semibold text-gray-500 group-hover:text-blue-600 transition-colors">
              Join Group
              <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
      {isAdmin && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full h-8 w-8"
          onClick={onArchive}
          title="Archive Group"
        >
          <Archive className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}