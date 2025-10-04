

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import { createPageUrl } from "@/utils";
import { Home, Calendar, BarChart3, BookOpen, User, Droplet, ChevronLeft, ChevronRight } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Load collapsed state from localStorage
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Save collapsed state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  const navItems = [
    { name: "Dashboard", path: createPageUrl("Dashboard"), icon: Home },
    { name: "Track", path: createPageUrl("Tracking"), icon: Calendar },
    { name: "Analytics", path: createPageUrl("Analytics"), icon: BarChart3 },
    { name: "Insights", path: createPageUrl("Content"), icon: BookOpen },
    { name: "Profile", path: createPageUrl("Profile"), icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Lora', serif;
        }
        
        .cursive-logo {
          font-family: 'Dancing Script', cursive;
        }
        
        body {
          overflow-x: hidden;
        }
      `}</style>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:block fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 z-50 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      }`}>
        <div className="h-full p-6 flex flex-col">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className={`rounded-xl bg-black flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                sidebarCollapsed ? 'w-8 h-8' : 'w-12 h-12'
              }`}>
                <Droplet className={`text-white transition-all duration-300 ${
                  sidebarCollapsed ? 'w-4 h-4' : 'w-6 h-6'
                }`} strokeWidth={2} fill="white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-2xl font-bold text-black cursive-logo">Spermaxxing</h1>
                  <p className="text-xs text-gray-500">Sperm Health Optimization</p>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? 'text-black'
                      : 'text-gray-400 hover:text-gray-600'
                  } ${sidebarCollapsed ? 'justify-center' : ''}`}
                  title={sidebarCollapsed ? item.name : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={active ? 2.5 : 2} />
                  {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Collapse Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`mt-auto pt-6 border-t border-gray-200 flex items-center gap-2 rounded-lg text-gray-400 hover:text-gray-600 transition-all duration-200 ${
              sidebarCollapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'
            }`}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs font-medium">Collapse</span>
              </>
            )}
          </button>

          {!sidebarCollapsed && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                HIPAA Compliant • Secure
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Main content with proper spacing */}
      <div className={`pb-20 md:pb-0 transition-all duration-300 overflow-x-hidden ${
        sidebarCollapsed ? 'md:ml-20' : 'md:ml-72'
      }`}>
        <div className="w-full max-w-4xl mx-auto px-4 pt-4 md:pt-6">
          {/* Conditional Back button for Profile page - Mobile only */}
          {location.pathname === createPageUrl("Profile") && (
            <button
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="md:hidden flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium mb-4"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
              Back
            </button>
          )}
          {children}
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        {/* Hide mobile nav on Welcome and Onboarding pages */}
        {!location.pathname.includes("Welcome") && 
         !location.pathname.includes("Onboarding") && (
          <div className="bg-white border-t border-gray-200 shadow-lg">
            <div className="flex justify-around items-center px-2 py-2">
              {navItems.filter(item => item.name !== "Profile").map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 ${
                      active 
                        ? 'text-black' 
                        : 'text-gray-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

