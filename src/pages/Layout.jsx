

import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { User } from "@/api/entities";
import { Home, Sprout, Globe, User as UserIcon, Bird, Play, Shield } from "lucide-react"; // Added Play and Shield icons
import { Toaster } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import OpeningAnimation from '../components/core/OpeningAnimation';
import { createPageUrl } from '@/utils';

const themes = {
  sunset: `
    --bg-card: 250 247 242 / 0.8; /* Off-White Cream with backdrop */
    --text-primary: 55 65 81;
    --text-secondary: 107 114 128;
    --accent: 163 89 111; /* Dark Blush Rose for text */
    --accent-peach: 248 226 231; /* Blush Rose */
    --accent-coral: 245 216 222; /* Lighter Blush Rose */
    --border-light: 229 231 235;
  `,
  light: `
    --bg-main: 250 247 242; /* Off-White Cream */
    --bg-secondary: 248 250 252;
    --text-primary: 15 23 42;
    --text-secondary: 71 85 105;
    --accent: 163 89 111; /* Dark Blush Rose */
    --accent-light: 248 226 231; /* Blush Rose */
    --border-light: 226 232 240;
    --card-bg: 250 247 242; /* Off-White Cream */
  `,
  dark: `
    --bg-main: 15 23 42;
    --bg-secondary: 30 41 59;
    --text-primary: 248 250 252;
    --text-secondary: 148 163 184;
    --accent: 248 226 231; /* Blush Rose */
    --accent-light: 245 216 222; /* Lighter Blush Rose */
    --border-light: 71 85 105;
    --card-bg: 30 41 59;
  `
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [activeTheme, setActiveTheme] = useState('sunset');
  
  const [isAnimationVisible, setIsAnimationVisible] = useState(
    () => !sessionStorage.getItem('hasAnimationPlayed')
  );

  useEffect(() => {
    if (isAnimationVisible) {
      const timer = setTimeout(() => {
        setIsAnimationVisible(false);
        sessionStorage.setItem('hasAnimationPlayed', 'true');
      }, 3500); // Faster: 3.5 seconds
      return () => clearTimeout(timer);
    }
  }, [isAnimationVisible]);

  useEffect(() => {
    const loadUser = () => {
      try {
        // Get user from localStorage
        const currentUserData = localStorage.getItem('aurawell_current_user');
        if (currentUserData) {
          const currentUser = JSON.parse(currentUserData);
          setUser(currentUser);
          setActiveTheme(currentUser?.active_theme || 'sunset');
        } else {
          setUser(null);
          setActiveTheme('sunset');
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null);
        setActiveTheme('sunset'); // Default to sunset if not logged in
      }
    };
    loadUser();
  }, []);

  // Determine current active route
  const getCurrentRoute = () => {
    const path = location.pathname.toLowerCase();

    // Exact match for the main sections first
    if (path === '/growth') return 'Growth';
    if (path === '/community') return 'Community';
    if (path === '/profile') return 'Profile';
    if (path === '/dashboard' || path === '/') return 'Dashboard';
    if (path === '/reels') return 'Reels'; // Handle Reels route
    if (path === '/moderatordashboard') return 'ModeratorDashboard'; // Handle Moderator route

    // Check for sub-pages
    const growthPages = ['/moodtracker', '/mindgarden', '/meditations', '/journal'];
    if (growthPages.some(p => path.startsWith(p))) {
      return 'Growth';
    }

    // Reels sub-pages (if any, add here)
    const reelsPages = []; // e.g., ['/reels/create', '/reels/view']
    if (reelsPages.some(p => path.startsWith(p))) {
      return 'Reels';
    }

    const communityPages = ['/unspokenconnections', '/group', '/groups', '/mindfulworldmap', '/support-group', '/support-room'];
     if (communityPages.some(p => path.startsWith(p))) {
      return 'Community';
    }

    const profilePages = ['/settings', '/gopremium'];
    if (profilePages.some(p => path.startsWith(p))) {
      return 'Profile';
    }

    return 'Dashboard'; // Default to Home
  };

  const currentRoute = getCurrentRoute();

  // Check if user is a moderator
  const isModerator = user?.email === 'blossomalabor132@gmail.com';

  // Bottom navigation items - dynamically include moderator if user is a moderator
  const navigationItems = useMemo(() => {
    const baseItems = [
      {
        title: "Home",
        icon: Bird,
        activeIcon: Bird,
        route: "Dashboard"
      },
      {
        title: "Growth",
        icon: Sprout,
        activeIcon: Sprout,
        route: "Growth"
      },
      {
        title: "Reels",
        icon: Play,
        activeIcon: Play,
        route: "Reels"
      },
      {
        title: "Community",
        icon: Globe,
        activeIcon: Globe,
        route: "Community"
      },
      {
        title: "Profile",
        icon: UserIcon,
        activeIcon: UserIcon,
        route: "Profile"
      }
    ];

    // Add moderator item if user is a moderator
    if (isModerator) {
      baseItems.splice(4, 0, {
        title: "Moderator",
        icon: Shield,
        activeIcon: Shield,
        route: "ModeratorDashboard"
      });
    }

    return baseItems;
  }, [isModerator]);

  const isSpecialBackgroundPage = useMemo(() => {
    const path = location.pathname.toLowerCase();
    const dreamJournalActive = path.startsWith('/journal') && location.search.includes('tab=dream');
    const mindGardenActive = path.startsWith('/mindgarden');
    return dreamJournalActive || mindGardenActive;
  }, [location.pathname, location.search]);

  return (
    <>
      <Toaster position="top-center" richColors />
      <AnimatePresence mode="wait">
        {isAnimationVisible ? (
          <OpeningAnimation key="animation" />
        ) : (
          <motion.div
            key="layout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <style>
              {`
                :root {
                  ${themes[activeTheme] || themes.sunset}
                }

                /* iOS Safe Area Support */
                body {
                  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
                }

                .bg-main { background-color: rgb(var(--bg-main)); }
                .bg-secondary { background-color: rgb(var(--bg-secondary)); }
                .text-primary { color: rgb(var(--text-primary)); }
                .text-secondary { color: rgb(var(--text-secondary)); }
                .border-light { border-color: rgb(var(--border-light)); }
                .bg-card { background-color: rgb(var(--bg-card)); backdrop-filter: blur(10px); }
                .text-accent { color: rgb(var(--accent)); }
                .bg-accent { background-color: rgb(var(--accent)); }
                .bg-accent-light { background-color: rgb(var(--accent-light)); }
                .btn-peach { background-color: rgb(var(--accent-peach)); color: rgb(15 23 42); }
                .btn-coral { background-color: rgb(var(--accent-coral)); color: rgb(15 23 42); }

                /* Blush Rose */
                .sage-green-background {
                  background-color: #F8E2E7;
                }

                /* Safe area padding for iOS */
                .safe-area-top {
                  padding-top: env(safe-area-inset-top);
                }

                .safe-area-bottom {
                  padding-bottom: env(safe-area-inset-bottom);
                }
              `}
            </style>
            
            {/* Main App Container */}
            <div className={`min-h-screen text-primary flex flex-col ${!isSpecialBackgroundPage ? 'sage-green-background' : 'bg-main'}`} style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>

              {/* Content Area - takes remaining space above bottom nav */}
              <main className="flex-1 overflow-auto" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))', paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}>
                 <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mx-auto px-4">
                      {children}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </main>

              {/* Bottom Navigation */}
              <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-light shadow-lg z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                <div className="flex items-center justify-around h-16 max-w-md mx-auto">
                  {navigationItems.map((item) => {
                    const isActive = currentRoute === item.route;
                    const IconComponent = isActive ? item.activeIcon : item.icon;
                    
                    return (
                      <motion.div 
                        key={item.title}
                        whileTap={{ scale: 0.95 }} // Apply animation to motion.div
                      >
                        <Link
                          to={createPageUrl(item.route)}
                          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 w-16 ${
                            isActive 
                              ? 'text-white' 
                              : 'text-secondary hover:text-accent'
                          }`}
                          style={isActive ? { color: '#5C4B99' } : {}}
                        >
                          <IconComponent className="w-6 h-6 mb-1" />
                          <span className="text-xs font-medium">{item.title}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

