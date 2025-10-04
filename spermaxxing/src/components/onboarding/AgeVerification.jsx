import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowRight, Camera, UserCircle } from "lucide-react";
import { UploadFile } from "@/api/integrations";

export default function AgeVerification({ onNext }) {
  const [formData, setFormData] = useState({
    age: "",
    height_feet: "",
    height_inches: "",
    weight: "",
    profile_photo: ""
  });
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData({ ...formData, profile_photo: file_url });
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ageNum = parseInt(formData.age);
    const heightFeet = parseInt(formData.height_feet);
    const heightInches = parseInt(formData.height_inches);
    const weight = parseInt(formData.weight);
    
    if (!formData.age || ageNum < 18) {
      setError("You must be 18 or older to use this app");
      return;
    }
    
    if (ageNum > 100) {
      setError("Please enter a valid age");
      return;
    }

    if (!formData.height_feet || heightFeet < 3 || heightFeet > 8) {
      setError("Please enter a valid height");
      return;
    }

    if (!formData.height_inches || heightInches < 0 || heightInches > 11) {
      setError("Inches must be between 0 and 11");
      return;
    }

    if (!formData.weight || weight < 50 || weight > 500) {
      setError("Please enter a valid weight");
      return;
    }

    onNext({ 
      age: ageNum,
      height_feet: heightFeet,
      height_inches: heightInches,
      weight: weight,
      profile_photo: formData.profile_photo
    });
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-black mb-1">Basic Info</h2>
      <p className="text-sm md:text-base text-gray-600 mb-4">Let's start with some basic information</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-2">
          <button
            type="button"
            onClick={() => document.getElementById('profile-upload').click()}
            disabled={uploading}
            className="relative group"
          >
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200 hover:border-gray-900 transition-all">
              {formData.profile_photo ? (
                <img src={formData.profile_photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center border-2 border-white">
              {uploading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
              ) : (
                <Camera className="w-3 h-3 text-white" />
              )}
            </div>
          </button>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
            disabled={uploading}
          />
          <p className="text-xs text-gray-500 mt-1">Upload photo (optional)</p>
        </div>

        <div>
          <Label className="text-black text-sm font-medium mb-1.5 block">
            What is your age?
          </Label>
          <Input
            type="number"
            value={formData.age}
            onChange={(e) => {
              setFormData({ ...formData, age: e.target.value });
              setError("");
            }}
            placeholder="Enter your age"
            className="h-11 md:h-12 text-base border-gray-300 focus:border-black focus:ring-black rounded-xl"
          />
        </div>

        <div>
          <Label className="text-black text-sm font-medium mb-1.5 block">
            Height
          </Label>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="number"
                value={formData.height_feet}
                onChange={(e) => {
                  setFormData({ ...formData, height_feet: e.target.value });
                  setError("");
                }}
                placeholder="Feet"
                min="3"
                max="8"
                className="h-11 md:h-12 text-base border-gray-300 focus:border-black focus:ring-black rounded-xl"
              />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                value={formData.height_inches}
                onChange={(e) => {
                  setFormData({ ...formData, height_inches: e.target.value });
                  setError("");
                }}
                placeholder="Inches"
                min="0"
                max="11"
                className="h-11 md:h-12 text-base border-gray-300 focus:border-black focus:ring-black rounded-xl"
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-black text-sm font-medium mb-1.5 block">
            Weight (lbs)
          </Label>
          <Input
            type="number"
            value={formData.weight}
            onChange={(e) => {
              setFormData({ ...formData, weight: e.target.value });
              setError("");
            }}
            placeholder="Enter your weight"
            className="h-11 md:h-12 text-base border-gray-300 focus:border-black focus:ring-black rounded-xl"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-xs md:text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-11 md:h-12 text-base font-semibold bg-black hover:bg-gray-800 text-white rounded-xl"
          disabled={uploading}
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </form>
    </div>
  );
}