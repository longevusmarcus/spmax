import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User, UserProfile } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import AgeVerification from "../components/onboarding/AgeVerification";
import LifestyleQuiz from "../components/onboarding/LifestyleQuiz";
import FertilityGoal from "../components/onboarding/FertilityGoal";
import CalculatorResults from "../components/onboarding/CalculatorResults";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    age: null,
    height_feet: null,
    height_inches: null,
    weight: null,
    profile_photo: null,
    lifestyle_data: {},
    fertility_goal: null
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await User.me();
      } catch (error) {
        navigate(createPageUrl("Welcome"));
      }
    };

    checkAuth();
  }, [navigate]);

  const handleNext = (data) => {
    setUserData({ ...userData, ...data });
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleComplete = async (calculatedScore) => {
    const currentUser = await User.me();
    await UserProfile.create({
      age: userData.age,
      height_feet: userData.height_feet,
      height_inches: userData.height_inches,
      weight: userData.weight,
      profile_photo: userData.profile_photo,
      lifestyle_data: userData.lifestyle_data,
      fertility_goal: userData.fertility_goal,
      sperm_value: calculatedScore,
      onboarding_completed: true,
      sperm_level: 1,
      current_streak: 0,
      longest_streak: 0,
      badges: [],
      created_by: currentUser.email
    });

    navigate(createPageUrl("Dashboard"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-2xl w-full">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full mx-1 transition-all duration-500 ${
                  i <= step ? 'bg-black' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-gray-600 text-xs md:text-sm text-center">Step {step} of 4</p>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-200">
          {step === 1 && <AgeVerification onNext={handleNext} />}
          {step === 2 && <FertilityGoal onNext={handleNext} onBack={handleBack} />}
          {step === 3 && <LifestyleQuiz onNext={handleNext} onBack={handleBack} />}
          {step === 4 && (
            <CalculatorResults
              userData={userData}
              onComplete={handleComplete}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
}