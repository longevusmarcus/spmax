
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Watch, Moon, Apple, Heart, Zap, Droplet, Droplets, CloudMoon, Bed, Sparkles, Pizza, Salad, Coffee, Smile, Meh, Frown, AlertCircle, Check, Circle, Waves } from "lucide-react";
import { UploadFile } from "@/api/integrations";

export default function DailyLogForm({ initialData, onSubmit }) {
  const [formData, setFormData] = useState(initialData || {
    masturbation_count: null,
    diet_quality: "",
    sleep_hours: "",
    sleep_quality: "",
    stress_level: "",
    exercise_minutes: "",
    electrolytes: null,
    food_photos: [],
    notes: ""
  });

  const [uploading, setUploading] = useState(false);

  // The handlePhotoUpload function is no longer needed in the UI,
  // but keeping it here for now in case the "food_photos" field
  // is still part of the initialData structure or future plans.
  // It won't be triggered as the UI elements are removed.
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData({
        ...formData,
        food_photos: [...(formData.food_photos || []), file_url]
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Check if all required fields are filled
  const isFormComplete = () => {
    return (
      formData.masturbation_count !== null &&
      formData.sleep_quality !== "" &&
      formData.sleep_hours !== "" &&
      formData.diet_quality !== "" &&
      formData.stress_level !== "" &&
      formData.exercise_minutes !== "" &&
      formData.electrolytes !== null
    );
  };

  const CircularButton = ({ selected, onClick, icon: Icon, label }) => (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
          selected
            ? 'bg-gray-900'
            : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        <Icon className={`w-5 h-5 md:w-6 md:h-6 ${selected ? 'text-white' : 'text-gray-600'}`} strokeWidth={2} />
        {selected && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 border-2 border-white rounded-full flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
          </div>
        )}
      </button>
      <span className={`text-[10px] md:text-xs text-center font-medium max-w-[70px] leading-tight ${
        selected ? 'text-gray-900' : 'text-gray-600'
      }`}>
        {label}
      </span>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Scrollable content wrapper */}
      <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-6 scrollbar-hide">
        {/* Masturbation Frequency Section */}
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Masturbation</h3>
          <p className="text-sm text-gray-600 mb-4">How many times did you masturbate today?</p>
          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <CircularButton
              selected={formData.masturbation_count === 0}
              onClick={() => setFormData({ ...formData, masturbation_count: 0 })}
              icon={Circle}
              label="0"
            />
            <CircularButton
              selected={formData.masturbation_count === 1}
              onClick={() => setFormData({ ...formData, masturbation_count: 1 })}
              icon={Droplet}
              label="1"
            />
            <CircularButton
              selected={formData.masturbation_count === 2}
              onClick={() => setFormData({ ...formData, masturbation_count: 2 })}
              icon={Droplets}
              label="2"
            />
            <CircularButton
              selected={formData.masturbation_count === 3}
              onClick={() => setFormData({ ...formData, masturbation_count: 3 })}
              icon={Waves}
              label="3+"
            />
          </div>
        </div>

        {/* Sleep Quality Section */}
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Sleep Quality</h3>
          <p className="text-sm text-gray-600 mb-4">How well did you sleep?</p>
          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <CircularButton
              selected={formData.sleep_quality === 'excellent'}
              onClick={() => setFormData({ ...formData, sleep_quality: 'excellent' })}
              icon={Sparkles}
              label="Excellent"
            />
            <CircularButton
              selected={formData.sleep_quality === 'good'}
              onClick={() => setFormData({ ...formData, sleep_quality: 'good' })}
              icon={Moon}
              label="Good"
            />
            <CircularButton
              selected={formData.sleep_quality === 'fair'}
              onClick={() => setFormData({ ...formData, sleep_quality: 'fair' })}
              icon={CloudMoon}
              label="Fair"
            />
            <CircularButton
              selected={formData.sleep_quality === 'poor'}
              onClick={() => setFormData({ ...formData, sleep_quality: 'poor' })}
              icon={Bed}
              label="Poor"
            />
          </div>

          {/* Sleep Hours */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Hours slept</label>
            <input
              type="number"
              step="0.5"
              value={formData.sleep_hours}
              onChange={(e) => setFormData({ ...formData, sleep_hours: e.target.value })}
              placeholder="7.5"
              className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-gray-900 border-none focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
        </div>

        {/* Diet Quality Section */}
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Diet Quality</h3>
          <p className="text-sm text-gray-600 mb-4">How was your nutrition today?</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <CircularButton
              selected={formData.diet_quality === 'excellent'}
              onClick={() => setFormData({ ...formData, diet_quality: 'excellent' })}
              icon={Salad}
              label="Excellent"
            />
            <CircularButton
              selected={formData.diet_quality === 'good'}
              onClick={() => setFormData({ ...formData, diet_quality: 'good' })}
              icon={Apple}
              label="Good"
            />
            <CircularButton
              selected={formData.diet_quality === 'average'}
              onClick={() => setFormData({ ...formData, diet_quality: 'average' })}
              icon={Coffee}
              label="Average"
            />
            <CircularButton
              selected={formData.diet_quality === 'poor'}
              onClick={() => setFormData({ ...formData, diet_quality: 'poor' })}
              icon={Pizza}
              label="Poor"
            />
          </div>
        </div>

        {/* Stress Level Section */}
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Stress Level</h3>
          <p className="text-sm text-gray-600 mb-4">How stressed were you today?</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <CircularButton
              selected={formData.stress_level === 'low'}
              onClick={() => setFormData({ ...formData, stress_level: 'low' })}
              icon={Smile}
              label="Low"
            />
            <CircularButton
              selected={formData.stress_level === 'moderate'}
              onClick={() => setFormData({ ...formData, stress_level: 'moderate' })}
              icon={Meh}
              label="Moderate"
            />
            <CircularButton
              selected={formData.stress_level === 'high'}
              onClick={() => setFormData({ ...formData, stress_level: 'high' })}
              icon={Frown}
              label="High"
            />
            <CircularButton
              selected={formData.stress_level === 'extreme'}
              onClick={() => setFormData({ ...formData, stress_level: 'extreme' })}
              icon={AlertCircle}
              label="Extreme"
            />
          </div>
        </div>

        {/* Exercise Section */}
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Exercise</h3>
          <p className="text-sm text-gray-600 mb-4">Minutes of physical activity</p>
          <input
            type="number"
            value={formData.exercise_minutes}
            onChange={(e) => setFormData({ ...formData, exercise_minutes: e.target.value })}
            placeholder="30"
            className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-gray-900 border-none focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Electrolytes Section */}
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Electrolytes</h3>
          <p className="text-sm text-gray-600 mb-4">Did you take electrolytes?</p>
          <div className="flex gap-3 justify-start">
            <CircularButton
              selected={formData.electrolytes === false}
              onClick={() => setFormData({ ...formData, electrolytes: false })}
              icon={Circle}
              label="No"
            />
            <CircularButton
              selected={formData.electrolytes === true}
              onClick={() => setFormData({ ...formData, electrolytes: true })}
              icon={Zap}
              label="Yes"
            />
          </div>
        </div>

        {/* AI Tracker Section - Coming Soon */}
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-1">AI Tracker</h3>
          <p className="text-sm text-gray-600 mb-4">Advanced tracking features coming soon</p>
          
          {/* Food Photos - Disabled */}
          <div className="mb-4 relative">
            <div className="absolute top-2 right-2 z-10">
              <span className="px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded-full">
                Soon
              </span>
            </div>
            <label className="text-sm font-medium text-gray-400 mb-2 block">Upload Food Photos</label>
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 opacity-50 cursor-not-allowed">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Camera className="w-5 h-5" />
                <span className="text-sm">Take or upload photo</span>
              </div>
            </div>
          </div>

          {/* Connect Device - Disabled */}
          <div className="relative">
            <div className="absolute top-2 right-2 z-10">
              <span className="px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded-full">
                Soon
              </span>
            </div>
            <label className="text-sm font-medium text-gray-400 mb-2 block">Connect Device</label>
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 opacity-50 cursor-not-allowed">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Watch className="w-5 h-5" />
                <span className="text-sm">Connect wearable device</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Notes</h3>
          <p className="text-sm text-gray-600 mb-4">Log a symptom or make a note</p>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add any additional notes..."
            className="w-full h-24 bg-gray-50 rounded-2xl px-4 py-3 text-gray-900 border-none focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
          />
        </div>
      </div>

      {/* Submit Button - Always visible */}
      <Button
        type="submit"
        className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-semibold text-base mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={uploading || !isFormComplete()}
      >
        {uploading ? "Uploading..." : "Save Check-in"}
      </Button>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </form>
  );
}
