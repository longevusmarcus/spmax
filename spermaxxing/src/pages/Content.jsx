
import React, { useState, useEffect } from "react";
import { Article, TestResult, UserProfile } from "@/api/entities";
import { User } from "@/api/entities";
import { BookOpen, Bookmark, Clock, Sparkles, TrendingUp, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Fix: Added 'from' keyword
import { createPageUrl } from "@/utils";
import ArticleCard from "../components/content/ArticleCard";

export default function Content() {
  const [articles, setArticles] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("foryou");
  const [loading, setLoading] = useState(true);
  const [showPersonalizedBanner, setShowPersonalizedBanner] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const currentUser = await User.me();
    const allArticles = await Article.list("-created_date");
    setArticles(allArticles);

    const results = await TestResult.filter({ created_by: currentUser.email }, "-test_date");
    setTestResults(results);

    const profiles = await UserProfile.filter({ created_by: currentUser.email });
    setProfile(profiles[0]);

    setLoading(false);
  };

  // Personalize content based on test results
  const getForYouContent = () => {
    if (!profile || testResults.length === 0) {
      // Show general tips and lifestyle content for new users
      return articles.filter(a =>
        a.category === "tips" ||
        a.category === "lifestyle" ||
        a.featured
      ).slice(0, 6);
    }

    const latestTest = testResults[0];
    let priorityCategories = [];
    let recommendations = [];

    // Personalize based on test results
    if (latestTest.concentration && latestTest.concentration < 16) {
      priorityCategories.push("nutrition", "supplements");
      recommendations.push("Focus on nutrition to boost sperm concentration");
    }
    if (latestTest.motility && latestTest.motility < 42) {
      priorityCategories.push("lifestyle", "tips");
      recommendations.push("Improve lifestyle habits for better motility");
    }
    if (latestTest.progressive_motility && latestTest.progressive_motility < 30) {
      priorityCategories.push("science", "supplements");
      recommendations.push("Learn about progressive motility optimization");
    }

    // Add general categories
    priorityCategories.push("tips", "success_stories");

    // Filter and sort by priority
    const personalized = articles.filter(a =>
      priorityCategories.includes(a.category) || a.featured
    );

    return {
      content: personalized,
      recommendations: recommendations
    };
  };

  const getContentByTab = () => {
    switch(activeTab) {
      case "foryou":
        const forYouData = getForYouContent();
        return forYouData.content || forYouData;
      case "discover":
        return articles;
      case "saved":
        return articles.filter(a => a.featured);
      case "recent":
        return articles.slice(0, 6);
      default:
        return articles;
    }
  };

  const displayContent = getContentByTab();
  const forYouData = activeTab === "foryou" ? getForYouContent() : null;

  // Group articles by category for sections
  const nutritionArticles = displayContent.filter(a => a.category === "nutrition");
  const lifestyleArticles = displayContent.filter(a => a.category === "lifestyle");
  const supplementArticles = displayContent.filter(a => a.category === "supplements");
  const tipsArticles = displayContent.filter(a => a.category === "tips");
  const scienceArticles = displayContent.filter(a => a.category === "science");
  const successArticles = displayContent.filter(a => a.category === "success_stories");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent" />
      </div>
    );
  }

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
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Insights</h1>
            <p className="text-sm md:text-base text-gray-600">Optimize your reproductive health</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("foryou")}
            className={`pb-3 px-1 font-semibold text-sm transition-all duration-200 border-b-2 whitespace-nowrap ${
              activeTab === "foryou"
                ? "border-black text-black"
                : "border-transparent text-gray-500"
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-1" />
            For You
          </button>
          <button
            onClick={() => setActiveTab("discover")}
            className={`pb-3 px-1 font-semibold text-sm transition-all duration-200 border-b-2 whitespace-nowrap ${
              activeTab === "discover"
                ? "border-black text-black"
                : "border-transparent text-gray-500"
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`pb-3 px-1 font-semibold text-sm transition-all duration-200 border-b-2 whitespace-nowrap ${
              activeTab === "saved"
                ? "border-black text-black"
                : "border-transparent text-gray-500"
            }`}
          >
            <Bookmark className="w-4 h-4 inline mr-1" />
            Saved
          </button>
          <button
            onClick={() => setActiveTab("recent")}
            className={`pb-3 px-1 font-semibold text-sm transition-all duration-200 border-b-2 whitespace-nowrap ${
              activeTab === "recent"
                ? "border-black text-black"
                : "border-transparent text-gray-500"
            }`}
          >
            <Clock className="w-4 h-4 inline mr-1" />
            Recent
          </button>
        </div>

        {/* For You Personalization Banner */}
        {activeTab === "foryou" && testResults.length > 0 && forYouData?.recommendations?.length > 0 && showPersonalizedBanner && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 relative">
            <button
              onClick={() => setShowPersonalizedBanner(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <span className="text-gray-600 font-semibold text-sm">×</span>
            </button>
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-gray-900" />
              <h3 className="font-bold text-gray-900">Personalized for You</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Content curated based on your latest test results
            </p>
            <div className="space-y-2">
              {forYouData.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  {rec}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Nutrition Section */}
          {nutritionArticles.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-black mb-4">Nutrition & Diet</h2>
              <div className="grid grid-cols-2 gap-3">
                {nutritionArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}

          {/* Lifestyle Section */}
          {lifestyleArticles.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-black mb-4">Lifestyle & Habits</h2>
              <div className="grid grid-cols-2 gap-3">
                {lifestyleArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}

          {/* Quick Tips Section */}
          {tipsArticles.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-black mb-4">Quick Tips</h2>
              <div className="grid grid-cols-2 gap-3">
                {tipsArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}

          {/* Supplements Section */}
          {supplementArticles.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-black mb-4">Supplements</h2>
              <div className="grid grid-cols-2 gap-3">
                {supplementArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}

          {/* Science Section */}
          {scienceArticles.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-black mb-4">Science & Research</h2>
              <div className="grid grid-cols-2 gap-3">
                {scienceArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}

          {/* Success Stories Section */}
          {successArticles.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-black mb-4">Success Stories</h2>
              <div className="grid grid-cols-2 gap-3">
                {successArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}

          {displayContent.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No content yet</h3>
              <p className="text-gray-600 text-sm">Check back soon for optimization tips!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
