import React, { useState } from "react";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ContentFeedCard({ article }) {
  const [expanded, setExpanded] = useState(false);

  const categoryColors = {
    nutrition: "bg-green-100 text-green-800",
    lifestyle: "bg-blue-100 text-blue-800",
    supplements: "bg-purple-100 text-purple-800",
    science: "bg-indigo-100 text-indigo-800",
    tips: "bg-yellow-100 text-yellow-800",
    success_stories: "bg-pink-100 text-pink-800"
  };

  const categoryEmojis = {
    nutrition: "🥗",
    lifestyle: "🏃",
    supplements: "💊",
    science: "🔬",
    tips: "💡",
    success_stories: "🌟"
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
      {/* Image */}
      {article.image_url && (
        <div className="relative h-48 md:h-64 w-full overflow-hidden">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${categoryColors[article.category] || 'bg-gray-100 text-gray-800'}`}>
              {categoryEmojis[article.category]} {article.category}
            </span>
          </div>
          {article.read_time && (
            <div className="absolute bottom-4 right-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full">
                <Clock className="w-3 h-3 text-white" />
                <span className="text-xs font-medium text-white">{article.read_time} min</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-5 md:p-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{article.title}</h3>
        
        {/* Preview or Full Content */}
        <div className={`prose prose-sm md:prose-base prose-gray max-w-none ${!expanded ? 'line-clamp-3' : ''}`}>
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="text-sm md:text-base text-gray-700 mb-3">{children}</p>,
              h1: ({ children }) => <h1 className="text-xl md:text-2xl font-bold text-gray-900 mt-4 mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg md:text-xl font-bold text-gray-900 mt-4 mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base md:text-lg font-semibold text-gray-900 mt-3 mb-2">{children}</h3>,
              ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="text-sm md:text-base text-gray-700">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
              em: ({ children }) => <em className="italic text-gray-800">{children}</em>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-3">
                  {children}
                </blockquote>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-gray-700 transition-colors"
        >
          {expanded ? (
            <>
              <span>Show less</span>
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Read more</span>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}