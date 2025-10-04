
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User, UserProfile, DailyLog } from "@/api/entities";
import { Activity, ArrowRight, TrendingUp, Calendar, Flame, Moon, Apple, Heart, UserCircle } from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import FloatingChatbot from "../components/dashboard/FloatingChatbot";

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [todayLog, setTodayLog] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        const profiles = await UserProfile.filter({ created_by: currentUser.email });
        
        if (profiles.length === 0) {
          navigate(createPageUrl("Welcome"));
          return;
        }

        setProfile(profiles[0]);

        const today = format(new Date(), "yyyy-MM-dd");
        const logs = await DailyLog.filter({ date: today, created_by: currentUser.email });
        setTodayLog(logs[0] || null);

        // Get last 30 days of logs for calendar
        const last330Days = await DailyLog.filter({ created_by: currentUser.email }, "-date", 30);
        setRecentLogs(last330Days);
      } catch (error) {
        navigate(createPageUrl("Welcome"));
      }
      setLoading(false);
    };

    loadData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent" />
      </div>
    );
  }

  const firstName = user?.full_name?.split(' ')[0] || 'there';

  // Generate calendar days for current month
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Create a map of logged dates
  const loggedDates = new Set(recentLogs.map(log => log.date));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 bg-gray-50 px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Profile Icon - Mobile only, left side */}
            <button 
              onClick={() => navigate(createPageUrl("Profile"))}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center md:hidden"
            >
              <UserCircle className="w-5 h-5 text-gray-600" />
            </button>

            {/* Desktop: Show month title */}
            <div className="hidden md:block">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {format(today, "MMMM")}
              </h1>
            </div>
            
            {/* Notification Icon - right side */}
            <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-base">🔔</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="px-4 space-y-3 pb-24 md:pb-6">
          {/* Calendar Streak - Horizontal Scroll */}
          <div className="relative">
            <div className="flex items-center gap-1 mb-2 px-1">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Today</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {daysInMonth.map((day, idx) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const isToday = format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
                const isLogged = loggedDates.has(dateStr);
                const isPast = day < today;
                const dayNum = format(day, "d");
                
                return (
                  <div
                    key={idx}
                    className={`flex-shrink-0 w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center font-semibold transition-all text-xs md:text-sm ${
                      isToday
                        ? 'bg-black text-white'
                        : isLogged
                        ? 'bg-gray-900 text-white'
                        : isPast
                        ? 'border-2 border-gray-200 text-gray-300'
                        : 'border-2 border-dashed border-gray-300 text-gray-400'
                    }`}
                  >
                    {dayNum}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Circle - Sperm Value */}
          <div className="flex justify-center py-2">
            <div className="relative">
              {/* Pulsing rings */}
              <div className="absolute inset-0 rounded-full bg-gray-200 opacity-20 animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 rounded-full bg-gray-200 opacity-10 animate-pulse" style={{ animationDuration: '2s' }} />
              
              {/* Main Circle - Slightly bigger on mobile */}
              <div className="relative w-52 h-52 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center shadow-lg">
                <div className="flex items-center gap-1 mb-1">
                  <Activity className="w-4 h-4 text-gray-600" />
                  <span className="text-[10px] md:text-xs text-gray-600 font-medium">Sperm Value</span>
                </div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-xl md:text-xl font-bold text-gray-900">$</span>
                  <span className="text-4xl md:text-5xl font-bold text-gray-900">{(profile.sperm_value || 50).toLocaleString()}</span>
                </div>
                
                {/* Small stats below */}
                <div className="flex gap-6 md:gap-8">
                  <div className="text-center">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center mb-1 shadow-sm">
                      <Flame className="w-4 h-4 md:w-5 md:h-5 text-gray-900" />
                    </div>
                    <div className="text-base md:text-lg font-bold text-gray-900">{profile.current_streak}</div>
                    <div className="text-[9px] text-gray-600">streak</div>
                  </div>
                  <div className="text-center">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center mb-1 shadow-sm">
                      <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-gray-900" />
                    </div>
                    <div className="text-base md:text-lg font-bold text-gray-900">{profile.sperm_level}</div>
                    <div className="text-[9px] text-gray-600">level</div>
                  </div>
                </div>
              </div>

              {/* Floating Sperm Animations */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-2 animate-float" style={{ animationDelay: '0s', animationDuration: '4s' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-gray-400 opacity-40">
                    <circle cx="8" cy="8" r="4" fill="currentColor" />
                    <path d="M12 8 Q16 4, 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
                
                <div className="absolute top-6 right-3 animate-float" style={{ animationDelay: '1s', animationDuration: '5s' }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" className="text-gray-400 opacity-30">
                    <circle cx="8" cy="8" r="4" fill="currentColor" />
                    <path d="M12 8 Q16 12, 18 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
                
                <div className="absolute bottom-8 left-4 animate-float" style={{ animationDelay: '2s', animationDuration: '6s' }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" className="text-gray-400 opacity-25">
                    <circle cx="8" cy="8" r="4" fill="currentColor" />
                    <path d="M12 8 Q14 6, 18 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
                
                <div className="absolute bottom-10 right-2 animate-float" style={{ animationDelay: '3s', animationDuration: '5.5s' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-gray-400 opacity-35">
                    <circle cx="8" cy="8" r="4" fill="currentColor" />
                    <path d="M12 8 Q16 10, 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Insights Section */}
          <div>
            <h2 className="text-sm md:text-lg font-bold text-gray-900 mb-3">My daily insights</h2>
            
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {/* Log Check-in Card - Smaller on mobile */}
              <button
                onClick={() => navigate(createPageUrl("Tracking"))}
                className="flex-shrink-0 w-28 h-36 md:w-40 md:h-52 rounded-3xl bg-white border-2 border-gray-200 hover:border-gray-900 transition-all duration-200 p-3 md:p-5 flex flex-col items-center justify-center"
              >
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 md:mb-3">
                  {todayLog ? (
                    <span className="text-xl md:text-3xl">✓</span>
                  ) : (
                    <span className="text-xl md:text-3xl">📝</span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 text-center text-[11px] md:text-sm mb-0.5">
                  {todayLog ? "Today's Log" : "Log check-in"}
                </h3>
                <p className="text-[9px] md:text-xs text-gray-600 text-center">
                  {todayLog ? "View details" : "Track today"}
                </p>
              </button>

              {/* Today's Stats Card - Smaller on mobile */}
              <div className="flex-shrink-0 w-28 h-36 md:w-40 md:h-52 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 p-3 md:p-5 flex flex-col">
                <h3 className="font-semibold text-gray-900 text-[11px] md:text-sm mb-2">Today's stats</h3>
                {todayLog ? (
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <Moon className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                      <span className="text-[11px] md:text-sm text-gray-900 font-medium">{todayLog.sleep_hours || 0}h</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Apple className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                      <span className="text-[11px] md:text-sm text-gray-900 font-medium capitalize">{todayLog.diet_quality || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                      <span className="text-[11px] md:text-sm text-gray-900 font-medium capitalize">{todayLog.stress_level || "N/A"}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="text-2xl mb-1.5">📊</div>
                    <p className="text-[9px] md:text-xs text-gray-600 text-center">No data yet</p>
                    <p className="text-[8px] md:text-xs text-gray-500 text-center mt-0.5">Log today</p>
                  </div>
                )}
              </div>

              {/* Progress Card - Smaller on mobile */}
              <button
                onClick={() => navigate(createPageUrl("Analytics"))}
                className="flex-shrink-0 w-28 h-36 md:w-40 md:h-52 rounded-3xl bg-white border-2 border-gray-200 hover:border-gray-900 transition-all duration-200 p-3 md:p-5 flex flex-col items-center justify-center"
              >
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 md:mb-3">
                  <TrendingUp className="w-5 h-5 md:w-8 md:h-8 text-gray-900" />
                </div>
                <h3 className="font-semibold text-gray-900 text-center text-[11px] md:text-sm mb-0.5">
                  View Progress
                </h3>
                <p className="text-[9px] md:text-xs text-gray-600 text-center">
                  Analytics
                </p>
              </button>

              {/* Insights Card - Smaller on mobile */}
              <button
                onClick={() => navigate(createPageUrl("Content"))}
                className="flex-shrink-0 w-28 h-36 md:w-40 md:h-52 rounded-3xl bg-white border-2 border-gray-200 hover:border-gray-900 transition-all duration-200 p-3 md:p-5 flex flex-col items-center justify-center"
              >
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 md:mb-3">
                  <span className="text-xl md:text-3xl">💡</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-center text-[11px] md:text-sm mb-0.5">
                  Learn More
                </h3>
                <p className="text-[9px] md:text-xs text-gray-600 text-center">
                  Tips
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chatbot */}
      <FloatingChatbot profile={profile} />

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(10px, -15px) rotate(5deg);
          }
          50% {
            transform: translate(-5px, -25px) rotate(-5deg);
          }
          75% {
            transform: translate(-15px, -10px) rotate(3deg);
          }
        }
        
        .animate-float {
          animation: float infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
