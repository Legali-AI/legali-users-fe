import { searchLawyers } from "@/services/lawyer.service";
import type { CaseType, SearchParams } from "@/types";
import LawyerSearchInterface from "./LawyerSearchInterface";

const DEFAULT_SEARCH_PARAMS: SearchParams = {
  query: "",
  location: "",
  page: 1,
  limit: 12,
  sortBy: "rating",
  sortOrder: "desc",
};

interface ClientLawyerWrapperProps {
  caseTypeOptions: Array<{ label: string; value: CaseType; count?: number }>;
}

export default async function ClientLawyerWrapper({ caseTypeOptions }: ClientLawyerWrapperProps) {
  const initialResults = await searchLawyers(DEFAULT_SEARCH_PARAMS);
  const initialUpdatedAt = Date.now();

  return (
    <div className="animate-in duration-500 fade-in">
      <LawyerSearchInterface
        caseTypeOptions={caseTypeOptions}
        initialParams={DEFAULT_SEARCH_PARAMS}
        initialResults={initialResults}
        initialUpdatedAt={initialUpdatedAt}
      />
    </div>
  );
}
