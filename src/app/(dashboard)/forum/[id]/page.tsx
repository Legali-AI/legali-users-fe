import { QueryProvider } from "../../../../lib/query-client";
import ForumDetailClient from "./forum-detail-client";

export default async function ForumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <QueryProvider>
      <ForumDetailClient issueId={id} />
    </QueryProvider>
  );
}
