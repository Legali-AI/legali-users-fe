"use client";

import { Bot, Scale, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PurposeOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  bgColor: string;
  iconColor: string;
}

const purposeOptions: PurposeOption[] = [
  {
    id: "ai-assistant",
    title: "Use Legali AI",
    description:
      "Get AI-powered legal assistance for your daily legal needs and questions",
    icon: Bot,
    route: "/",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "legal-consultation",
    title: "Legal Consultation & Marketplace",
    description:
      "Connect with lawyers for initial consultation and explore our attorney marketplace",
    icon: Scale,
    route: "/lawyers",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    id: "litigation-funding",
    title: "Litigation Crowdfunding",
    description:
      "Explore and invest in legal cases through our crowdfunding platform",
    icon: TrendingUp,
    route: "/litigation-crowdfunding",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

export function PurposeSelectionForm() {
  const [selectedPurpose, setSelectedPurpose] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    if (!selectedPurpose) return;

    setIsLoading(true);

    // Find the selected option
    const selectedOption = purposeOptions.find(
      (option) => option.id === selectedPurpose
    );

    if (selectedOption) {
      // Add a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.push(selectedOption.route);
    }

    setIsLoading(false);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 sm:space-y-10">
      {/* Header */}
      <div className="space-y-4 text-center sm:space-y-6">
        <div className="mb-6 flex justify-center">
          <Image
            src="/logo.png"
            width={120}
            height={70}
            alt="Legali Logo"
            priority
            sizes="120px"
            className="drop-shadow-sm"
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Please select your purpose
        </h1>
        <p className="mx-auto max-w-2xl px-4 text-base leading-relaxed text-gray-600 sm:text-lg">
          Choose what you'd like to do on the Legali platform to get started
          with the right tools and resources for your legal needs.
        </p>
      </div>

      {/* Purpose Options */}
      <div className="grid gap-4 sm:gap-6">
        {purposeOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setSelectedPurpose(option.id)}
            className={cn(
              "relative rounded-2xl border-2 p-6 text-left transition-all duration-300 sm:p-8",
              "transform-gpu hover:scale-[1.02] hover:shadow-lg",
              "focus:ring-2 focus:ring-sky-blue-500 focus:ring-offset-2 focus:outline-none",
              selectedPurpose === option.id
                ? "bg-sky-blue-50 scale-[1.02] border-sky-blue-500 shadow-lg ring-2 ring-sky-blue-200"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
            )}
          >
            <div className="flex items-start gap-4 sm:gap-6">
              {/* Icon */}
              <div
                className={cn(
                  "flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl sm:h-20 sm:w-20",
                  selectedPurpose === option.id
                    ? "bg-sky-blue-100"
                    : option.bgColor
                )}
              >
                <option.icon
                  className={cn(
                    "h-8 w-8 sm:h-10 sm:w-10",
                    selectedPurpose === option.id
                      ? "text-sky-blue-600"
                      : option.iconColor
                  )}
                />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:mb-3 sm:text-xl">
                  {option.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                  {option.description}
                </p>
              </div>

              {/* Selection Indicator */}
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border-2",
                  selectedPurpose === option.id
                    ? "border-sky-blue-500 bg-sky-blue-500"
                    : "border-gray-300"
                )}
              >
                {selectedPurpose === option.id && (
                  <div className="h-3 w-3 rounded-full bg-white" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-4 pt-4">
        <Button
          onClick={handleContinue}
          disabled={!selectedPurpose || isLoading}
          className="rounded-xl bg-sky-blue-600 px-12 py-3 text-lg font-medium hover:bg-sky-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          size="lg"
        >
          {isLoading ? "Loading..." : "Continue"}
        </Button>

        <button
          type="button"
          onClick={() => router.push("/profile")}
          className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
        >
          Skip for now
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center space-x-2 pt-4">
        <div className="h-2 w-2 rounded-full bg-sky-blue-500"></div>
        <div className="h-2 w-2 rounded-full bg-gray-300"></div>
        <div className="h-2 w-2 rounded-full bg-gray-300"></div>
      </div>
    </div>
  );
}
