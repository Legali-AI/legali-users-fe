"use client";

import dynamic from "next/dynamic";

// Dynamic imports for client-side components with state management
const LitigationCrowdfundingInterface = dynamic(() => import("./LitigationCrowdfundingInterface"), {
  ssr: false, // Complex state management requires client-side
  loading: () => (
    <div className="animate-pulse p-8">
      <div className="mb-8 h-16 rounded bg-gray-200"></div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 rounded-lg bg-gray-200"></div>
        ))}
      </div>
    </div>
  ),
});

export default function ClientLitigationWrapper() {
  return (
    <div className="animate-in duration-500 fade-in">
      <LitigationCrowdfundingInterface />
    </div>
  );
}
