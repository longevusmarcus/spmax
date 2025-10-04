
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User, UserProfile } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { UserCircle, LogOut, Award, TrendingUp, Flame, Calendar, Camera, Target, Zap, Trophy, ArrowLeft } from "lucide-react";
import { UploadFile } from "@/api/integrations";
import SubscriptionSection from "../components/profile/SubscriptionSection";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const currentUser = await User.me();
    setUser(currentUser);

    const profiles = await UserProfile.filter({ created_by: currentUser.email });
    setProfile(profiles[0]);
    setLoading(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      await UserProfile.update(profile.id, {
        profile_photo: file_url
      });
      await loadData();
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setUploading(false);
  };

  const handleLogout = async () => {
    await User.logout();
    navigate(createPageUrl("Welcome"));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent" />
      </div>
    );
  }

  const badges = [
    { id: "first_log", name: "First Log", earned: true, icon: Target },
    { id: "week_streak", name: "7 Day Streak", earned: profile.longest_streak >= 7, icon: Flame },
    { id: "month_streak", name: "30 Day Streak", earned: profile.longest_streak >= 30, icon: Award },
    { id: "level_5", name: "Level 5", earned: profile.sperm_level >= 5, icon: Zap },
    { id: "level_10", name: "Level 10", earned: profile.sperm_level >= 10, icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-8">
      <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-200">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gray-900 flex items-center justify-center mb-4 shadow-lg overflow-hidden">
                {profile.profile_photo ? (
                  <img 
                    src={profile.profile_photo} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-10 h-10 md:w-12 md:h-12 text-white" />
                )}
              </div>
              
              {/* Upload button overlay */}
              <button
                onClick={() => document.getElementById('profile-photo-upload').click()}
                disabled={uploading}
                className="absolute bottom-3 right-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-900 hover:bg-gray-800 flex items-center justify-center shadow-lg transition-all duration-200 border-2 border-white"
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Camera className="w-4 h-4 md:w-5 md:h-5 text-white" />
                )}
              </button>
              
              <input
                id="profile-photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={uploading}
              />
            </div>
            
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{user.full_name}</h1>
            <p className="text-sm md:text-base text-gray-600">{user.email}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-xs md:text-sm font-medium">
                Age {profile.age}
              </span>
              <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-xs md:text-sm font-medium">
                Level {profile.sperm_level}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <div className="bg-white rounded-3xl p-4 md:p-6 text-center shadow-sm border border-gray-200">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
            </div>
            <div className="flex items-baseline justify-center gap-0.5 md:gap-1 mb-1">
              <span className="text-sm md:text-lg font-bold text-gray-900">$</span>
              <span className="text-xl md:text-3xl font-bold text-gray-900">{(profile.sperm_value || 50).toLocaleString()}</span>
            </div>
            <div className="text-[10px] md:text-xs text-gray-600 font-medium">Sperm Value</div>
          </div>

          <div className="bg-white rounded-3xl p-4 md:p-6 text-center shadow-sm border border-gray-200">
            <div className="flex items-center justify-center mb-2">
              <Flame className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
            </div>
            <div className="text-xl md:text-3xl font-bold text-gray-900 mb-1">{profile.current_streak}</div>
            <div className="text-[10px] md:text-xs text-gray-600 font-medium">Streak</div>
          </div>

          <div className="bg-white rounded-3xl p-4 md:p-6 text-center shadow-sm border border-gray-200">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
            </div>
            <div className="text-xl md:text-3xl font-bold text-gray-900 mb-1">{profile.longest_streak}</div>
            <div className="text-[10px] md:text-xs text-gray-600 font-medium">Best</div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Achievements</h2>
            <span className="text-xs text-gray-500">{badges.filter(b => b.earned).length}/{badges.length}</span>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {badges.map(badge => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className="flex flex-col items-center gap-2 flex-shrink-0"
                >
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                    badge.earned 
                      ? 'bg-gray-900' 
                      : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-6 h-6 md:w-7 md:h-7 ${
                      badge.earned ? 'text-white' : 'text-gray-400'
                    }`} strokeWidth={2} />
                  </div>
                  <div className={`text-[10px] md:text-xs text-center font-medium max-w-[60px] leading-tight ${
                    badge.earned ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {badge.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subscription Section */}
        <SubscriptionSection />

        {/* Logout */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full h-12 md:h-14 border-2 border-gray-300 text-gray-900 hover:bg-red-50 hover:border-red-500 hover:text-red-600 rounded-2xl font-semibold text-sm md:text-base"
        >
          <LogOut className="w-4 h-4 md:w-5 md:h-5 mr-2" />
          Logout
        </Button>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
