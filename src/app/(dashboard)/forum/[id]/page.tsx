import { H3 } from "../../../../components/elements/typography";
import { getIssueById, MOCK_ISSUES } from "../../../../data/issue.data";
import ForumDetailClient from "./forum-detail-client";

// Generate static params for all available issue IDs
export async function generateStaticParams() {
  return MOCK_ISSUES.map(issue => ({
    id: issue.id,
  }));
}

export default async function ForumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const issue = getIssueById(id);

  if (!issue) {
    return (
      <main className="flex w-full flex-1 flex-col gap-5 overflow-hidden">
        <div className="flex w-full max-w-[1042px] items-center justify-center rounded-[20px] border border-white-400 bg-gradient-to-b from-white to-sky-blue-100 p-10">
          <H3 weight="semibold" level="h5" className="text-deep-navy">
            Issue not found
          </H3>
        </div>
      </main>
    );
  }

  return <ForumDetailClient issue={issue} />;
}
