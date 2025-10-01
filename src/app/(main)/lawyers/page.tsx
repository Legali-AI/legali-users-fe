import type { Metadata } from "next";
import { GlobalLayout } from "@/components/layout/global-layout";
import { caseTypes, languages } from "@/data/mock-data";
import ClientLawyerWrapper from "./components/ClientLawyerWrapper";

export const metadata: Metadata = {
  title: "Find Lawyers & Legal Professionals | Legali",
  description:
    "Connect with qualified lawyers and legal professionals in your area. Search by practice area, location, and expertise.",
  keywords: ["lawyers", "legal professionals", "attorney search", "legal help", "law firm"],
  openGraph: {
    title: "Find Lawyers & Legal Professionals | Legali",
    description:
      "Connect with qualified lawyers and legal professionals in your area. Search by practice area, location, and expertise.",
  },
};

export default function LawyersPage() {
  // Convert case types to filter options (SSR-friendly data preparation)
  const caseTypeOptions = caseTypes.map(caseType => ({
    label: caseType.label,
    value: caseType.value,
    count: Math.floor(Math.random() * 50) + 10, // Mock count
  }));

  // Language options (SSR-friendly data preparation)
  const languageOptions = languages.map(lang => ({
    label: lang,
    value: lang,
    count: Math.floor(Math.random() * 30) + 5, // Mock count
  }));

  return (
    <GlobalLayout variant="no-padding" className="mobile-safe-bottom bg-gradient-sky-blue min-h-screen">
      {/* SSR-rendered page shell with SEO content */}
      <ClientLawyerWrapper caseTypeOptions={caseTypeOptions} languageOptions={languageOptions} />
    </GlobalLayout>
  );
}
