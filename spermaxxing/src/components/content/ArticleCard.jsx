import React from "react";
import { Clock } from "lucide-react";

export default function ArticleCard({ article }) {
  // Default images by category
  const defaultImages = {
    supplements: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    nutrition: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
    lifestyle: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    science: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80",
    tips: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
    success_stories: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80"
  };

  const imageUrl = article.image_url || defaultImages[article.category] || defaultImages.supplements;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
      <img
        src={imageUrl}
        alt={article.title}
        className="w-full h-32 md:h-48 object-cover"
      />
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-2 mb-2 md:mb-3">
          <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium bg-black text-white capitalize">
            {article.category}
          </span>
          {article.read_time && (
            <div className="flex items-center gap-1 text-gray-600 text-[10px] md:text-xs">
              <Clock className="w-3 h-3" />
              <span>{article.read_time} min</span>
            </div>
          )}
        </div>
        <h3 className="text-base md:text-xl font-bold text-black mb-1 md:mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-gray-600 text-xs md:text-sm line-clamp-2">
          {article.content.substring(0, 100)}...
        </p>
      </div>
    </div>
  );
}