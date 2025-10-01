"use client";

import { useState } from "react";
import type { LitigationCase } from "@/types/litigation";
import CaseDetail from "./CaseDetail";
import EnhancedCasesList from "./EnhancedCasesList";
import InvestmentFlow from "./InvestmentFlow";

type CurrentView = "cases" | "case-detail" | "investment-flow";

export default function LitigationCrowdfundingInterface() {
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
    <div className="animate-in duration-500 fade-in">
      {currentView === "cases" && <EnhancedCasesList onCaseSelect={handleCaseSelect} />}

      {currentView === "case-detail" && selectedCase && (
        <CaseDetail case={selectedCase} onBack={handleBack} onInvestmentStart={handleInvestmentStart} />
      )}

      {currentView === "investment-flow" && selectedCase && (
        <InvestmentFlow case={selectedCase} onBack={handleBack} onComplete={handleInvestmentComplete} />
      )}
    </div>
  );
}
