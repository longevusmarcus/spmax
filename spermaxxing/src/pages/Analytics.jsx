
import React, { useState, useEffect } from "react";
import { User, UserProfile, DailyLog, TestResult } from "@/api/entities";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Calendar, Activity, Zap, Droplet, Moon, UserCircle } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import TestResultDisplay from "../components/tracking/TestResultDisplay";

export default function Analytics() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await User.me();
      const profiles = await UserProfile.filter({ created_by: currentUser.email });
      setProfile(profiles[0]);

      const daysToFetch = selectedPeriod === "7d" ? 7 : 30;
      const allLogs = await DailyLog.filter({ created_by: currentUser.email }, "-date", daysToFetch);
      setLogs(allLogs);

      const allTestResults = await TestResult.filter({ created_by: currentUser.email }, "-test_date");
      setTestResults(allTestResults);
      
      setLoading(false);
    };

    loadData();
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent" />
      </div>
    );
  }

  const sleepData = logs.map(log => ({
    date: format(new Date(log.date), "MMM d"),
    hours: log.sleep_hours || 0
  })).reverse();

  const stressData = logs.map(log => ({
    date: format(new Date(log.date), "MMM d"),
    level: { low: 1, moderate: 2, high: 3, extreme: 4 }[log.stress_level] || 0
  })).reverse();

  const avgSleep = logs.reduce((acc, log) => acc + (log.sleep_hours || 0), 0) / logs.length || 0;
  const avgWater = logs.reduce((acc, log) => acc + (log.water_intake || 0), 0) / logs.length || 0;
  const avgExercise = logs.reduce((acc, log) => acc + (log.exercise_minutes || 0), 0) / logs.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-8">
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        {/* Header - Sticky */}
        <div className="sticky top-0 z-10 bg-gray-50 pb-2 md:mb-6">
          {/* Mobile: Minimal header with icons */}
          <div className="flex items-center justify-between md:hidden mb-2">
            <button 
              onClick={() => navigate(createPageUrl("Profile"))}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <UserCircle className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-base">🔔</span>
            </button>
          </div>

          {/* Desktop: Full header */}
          <div className="hidden md:block">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Analytics</h1>
            <p className="text-sm md:text-base text-gray-600">Your sperm value insights over time</p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedPeriod("7d")}
            className={`px-3 md:px-4 py-2 rounded-xl font-medium text-xs md:text-sm transition-all duration-200 ${
              selectedPeriod === "7d"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setSelectedPeriod("30d")}
            className={`px-3 md:px-4 py-2 rounded-xl font-medium text-xs md:text-sm transition-all duration-200 ${
              selectedPeriod === "30d"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
            }`}
          >
            30 Days
          </button>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {/* Current Value */}
          <div className="bg-gray-900 rounded-3xl p-4 md:p-6 text-white">
            <div className="flex items-center gap-2 text-white/70 mb-2">
              <Activity className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-xs font-medium uppercase tracking-wide">Sperm Value</span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-xl font-bold">$</span>
              <span className="text-4xl md:text-4xl font-bold">{(profile.sperm_value || 50).toLocaleString()}</span>
            </div>
            <div className="text-white/70 text-xs md:text-sm">Current Worth</div>
          </div>

          {/* Days Logged */}
          <div className="bg-white rounded-3xl p-4 md:p-6 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-xs font-medium uppercase tracking-wide">Days Logged</span>
            </div>
            <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">{logs.length}</div>
            <div className="text-gray-600 text-xs md:text-sm">Total</div>
          </div>

          {/* Avg Sleep */}
          <div className="bg-white rounded-3xl p-4 md:p-6 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Moon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-xs font-medium uppercase tracking-wide">Avg Sleep</span>
            </div>
            <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">{avgSleep.toFixed(1)}</div>
            <div className="text-gray-600 text-xs md:text-sm">hours/night</div>
          </div>

          {/* Avg Water */}
          <div className="bg-white rounded-3xl p-4 md:p-6 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Droplet className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-xs font-medium uppercase tracking-wide">Avg Water</span>
            </div>
            <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">{Math.round(avgWater)}</div>
            <div className="text-gray-600 text-xs md:text-sm">glasses/day</div>
          </div>
        </div>

        {/* Test Results Section */}
        {testResults.length > 0 && (
          <div className="bg-white rounded-3xl p-5 md:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                Test Results History ({testResults.length})
              </h2>
            </div>
            
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <TestResultDisplay 
                  key={result.id} 
                  result={result} 
                  previousResult={testResults[index + 1]} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Sleep Trends */}
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Sleep Trends</h2>
              <p className="text-gray-600 text-xs md:text-sm">Last {selectedPeriod === "7d" ? "7" : "30"} days</p>
            </div>
          </div>
          {sleepData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={sleepData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#000000" 
                  strokeWidth={2} 
                  dot={{ fill: "#000000", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <p className="text-gray-600">No data yet. Start logging daily!</p>
            </div>
          )}
        </div>

        {/* Stress Levels */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Stress Levels</h2>
              <p className="text-gray-600 text-sm">Last {selectedPeriod === "7d" ? "7" : "30"} days</p>
            </div>
          </div>
          {stressData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar 
                  dataKey="level" 
                  fill="#000000" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <p className="text-gray-600">No data yet. Start logging daily!</p>
            </div>
          )}
        </div>

        {/* Activity Summary */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Activity Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Avg Exercise</div>
                  <div className="text-sm text-gray-600">{Math.round(avgExercise)} min/day</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Current Streak</div>
                  <div className="text-sm text-gray-600">{profile.current_streak} days</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Best Streak</div>
                  <div className="text-sm text-gray-600">{profile.longest_streak} days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
