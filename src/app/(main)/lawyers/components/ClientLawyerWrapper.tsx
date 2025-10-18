"use client";

import dynamic from "next/dynamic";

// Dynamic imports for client-side components
const LawyerSearchInterface = dynamic(() => import("./LawyerSearchInterface"), {
  ssr: false, // This component needs client-side state management
  loading: () => (
    <div className="animate-pulse">
      <div className="mb-8 h-24 rounded bg-gray-200"></div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
        <div className="h-96 rounded bg-gray-200 lg:col-span-2"></div>
        <div className="space-y-4 lg:col-span-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded bg-gray-200"></div>
          ))}
        </div>
      </div>
    </div>
  ),
});

interface ClientLawyerWrapperProps {}

export default function ClientLawyerWrapper({}: ClientLawyerWrapperProps) {
  return (
    <div className="animate-in duration-500 fade-in">
      <LawyerSearchInterface />
    </div>
  );
}
