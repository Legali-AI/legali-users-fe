import type { Metadata } from "next";
import { GlobalLayout } from "@/components/layout/global-layout";
import ClientLitigationWrapper from "./components/ClientLitigationWrapper";

export const metadata: Metadata = {
  title: "Litigation Crowdfunding | Legali",
  description:
    "Invest in legal cases and get returns. Browse active litigation cases seeking funding from individual investors.",
  keywords: ["litigation funding", "legal investment", "case funding", "lawsuit investment", "legal crowdfunding"],
  openGraph: {
    title: "Litigation Crowdfunding | Legali",
    description:
      "Invest in legal cases and get returns. Browse active litigation cases seeking funding from individual investors.",
  },
};

export default function LitigationCrowdfundingPage() {
  return (
    <GlobalLayout variant="no-padding" className="bg-gradient-sky-blue min-h-screen">
      {/* SSR-rendered page shell with SEO content */}
      <ClientLitigationWrapper />
    </GlobalLayout>
  );
}
