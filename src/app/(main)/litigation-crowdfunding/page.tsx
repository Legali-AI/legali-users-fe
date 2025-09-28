"use client";

import { useState } from "react";
import CaseDetail from "@/app/(main)/litigation-crowdfunding/components/CaseDetail";
import EnhancedCasesList from "@/app/(main)/litigation-crowdfunding/components/EnhancedCasesList";
import InvestmentFlow from "@/app/(main)/litigation-crowdfunding/components/InvestmentFlow";
import { GlobalLayout } from "@/components/layout/global-layout";
import type { LitigationCase } from "@/types/litigation";

type CurrentView = "cases" | "case-detail" | "investment-flow";

export default function LitigationCrowdfundingPage() {
  const [currentView, setCurrentView] = useState<CurrentView>("cases");
  const [selectedCase, setSelectedCase] = useState<LitigationCase | null>(null);

  const handleCaseSelect = (litigationCase: LitigationCase) => {
    setSelectedCase(litigationCase);
    setCurrentView("case-detail");
  };

  const handleInvestmentStart = (litigationCase: LitigationCase) => {
    setSelectedCase(litigationCase);
    setCurrentView("investment-flow");
  };

  const handleBack = () => {
    if (currentView === "investment-flow") {
      setCurrentView("case-detail");
    } else {
      setCurrentView("cases");
      setSelectedCase(null);
    }
  };

  const handleInvestmentComplete = () => {
    setCurrentView("cases");
    setSelectedCase(null);
  };

  return (
    <GlobalLayout variant="no-padding" className="bg-gradient-sky-blue min-h-screen">
      {currentView === "cases" && <EnhancedCasesList onCaseSelect={handleCaseSelect} />}

      {currentView === "case-detail" && selectedCase && (
        <CaseDetail case={selectedCase} onBack={handleBack} onInvestmentStart={handleInvestmentStart} />
      )}

      {currentView === "investment-flow" && selectedCase && (
        <InvestmentFlow case={selectedCase} onBack={handleBack} onComplete={handleInvestmentComplete} />
      )}
    </GlobalLayout>
  );
}
