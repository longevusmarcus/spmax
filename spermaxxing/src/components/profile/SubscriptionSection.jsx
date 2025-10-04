import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

export default function SubscriptionSection() {
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const [freeTrialEnabled, setFreeTrialEnabled] = useState(false);

  const handleContinue = () => {
    // TODO: Implement payment flow
    alert("Payment integration coming soon!");
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-gray-900" />
          <span className="text-sm font-semibold text-gray-900">Upgrade to Premium</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Choose your plan</h2>
        <p className="text-gray-600 text-sm">Unlock full tracking, analytics, insights, marketplace & more</p>
      </div>

      {/* Free Trial Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-6">
        <span className="text-sm font-medium text-gray-900">Not sure yet? Enable free trial.</span>
        <button
          onClick={() => setFreeTrialEnabled(!freeTrialEnabled)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            freeTrialEnabled ? 'bg-gray-900' : 'bg-gray-300'
          }`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              freeTrialEnabled ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Plan Options */}
      <div className="space-y-3 mb-6">
        {/* Yearly Plan */}
        <button
          onClick={() => setSelectedPlan("yearly")}
          className={`w-full relative border-2 rounded-2xl p-5 transition-all ${
            selectedPlan === "yearly"
              ? 'border-gray-900 bg-gray-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="absolute -top-3 right-4">
            <span className="px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-full">
              SAVE 58%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="flex items-baseline gap-2">
                <span className="text-xl md:text-2xl font-bold text-gray-900">1 year</span>
                <span className="text-lg font-bold text-gray-900">$49.99</span>
                <span className="text-sm text-gray-600">(only $4.17/month)</span>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              selectedPlan === "yearly"
                ? 'border-gray-900 bg-gray-900'
                : 'border-gray-300'
            }`}>
              {selectedPlan === "yearly" && <Check className="w-4 h-4 text-white" />}
            </div>
          </div>
        </button>

        {/* Monthly Plan */}
        <button
          onClick={() => setSelectedPlan("monthly")}
          className={`w-full border-2 rounded-2xl p-5 transition-all ${
            selectedPlan === "monthly"
              ? 'border-gray-900 bg-gray-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="flex items-baseline gap-2">
                <span className="text-xl md:text-2xl font-bold text-gray-900">1 month</span>
                <span className="text-lg font-bold text-gray-900">$9.99</span>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              selectedPlan === "monthly"
                ? 'border-gray-900 bg-gray-900'
                : 'border-gray-300'
            }`}>
              {selectedPlan === "monthly" && <Check className="w-4 h-4 text-white" />}
            </div>
          </div>
        </button>
      </div>

      {/* Features List */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm">Premium includes:</h4>
        <ul className="space-y-2">
          {[
            "Unlimited daily tracking",
            "Advanced analytics & trends",
            "Personalized insights & tips",
            "Access to sperm marketplace",
            "Priority support",
            "Export your data"
          ].map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-semibold text-base"
      >
        Continue
      </Button>

      <p className="text-center text-xs text-gray-500 mt-4">
        Cancel anytime. No commitments.
      </p>
    </div>
  );
}