"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { DeleteConfirmationDialog } from "../../../components/elements/delete-confirmation-dialog";
import { H5, P } from "../../../components/elements/typography";
import { Button } from "../../../components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { useAuth } from "../../../hooks/use-auth";
import {
  useForumIssueMutation,
  useForumIssuesQuery,
  useMyForumIssuesQuery,
} from "../../../hooks/use-forum";
import { transformForumIssueToCardProps } from "./forum-utils";
import { IssueCard } from "./issue-card";

const ITEMS_PER_PAGE = 10;
function ForumContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab =
    (searchParams.get("tab") as "your-issues" | "explore-issues") ||
    "your-issues";

  // Pagination state
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    params.set("page", "1");
    router.push(`/forum?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/forum?${params.toString()}`);
  };

  // Fetch data based on active tab
  const {
    data: exploreIssuesData,
    isLoading: isLoadingExplore,
    error: exploreError,
  } = useForumIssuesQuery({
    limit: ITEMS_PER_PAGE,
    current_page: currentPage,
  });
  const {
    data: myIssuesData,
    isLoading: isLoadingMy,
    error: myError,
  } = useMyForumIssuesQuery({
    limit: ITEMS_PER_PAGE,
    current_page: currentPage,
  });
  const { deleteWithToast } = useForumIssueMutation();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState<string | null>(null);
  const { user } = useAuth();
  const handleDeleteIssue = (issueId: string) => {
    setIssueToDelete(issueId);
    setShowDeleteDialog(true);
  };

  const handleEditIssue = (issueId: string) => {
    router.push(`/forum/${issueId}/edit`);
  };

  const confirmDeleteIssue = async () => {
    if (issueToDelete) {
      await deleteWithToast(issueToDelete);
    }
    setShowDeleteDialog(false);
    setIssueToDelete(null);
  };

  const yourIssues =
    myIssuesData?.data?.map(issue =>
      transformForumIssueToCardProps(issue, true)
    ) || [];
  const exploreIssues =
    exploreIssuesData?.data?.map(issue =>
      transformForumIssueToCardProps(issue, issue.user?.id === user?.id)
    ) || [];
  const contentMaps = [
    {
      value: "your-issues",
      label: "Your Issue",
      content: yourIssues,
      isLoading: isLoadingMy,
      error: myError,
      pagination: myIssuesData?.meta,
    },
    {
      value: "explore-issues",
      label: "Explore Issue",
      content: exploreIssues,
      isLoading: isLoadingExplore,
      error: exploreError,
      pagination: exploreIssuesData?.meta,
    },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="flex flex-col gap-3 sm:gap-4">
            <TabsList className="h-[43px] w-full bg-slate-gray-100 p-1.5 sm:w-auto sm:min-w-[300px]">
              <TabsTrigger value="your-issues">
                <H5
                  level="body"
                  weight="semibold"
                  className={
                    activeTab === "your-issues"
                      ? "text-sky-blue-600"
                      : "text-slate-gray-300"
                  }
                >
                  Your Issue
                </H5>
              </TabsTrigger>
              <TabsTrigger value="explore-issues">
                <H5
                  level="body"
                  weight="semibold"
                  className={
                    activeTab === "explore-issues"
                      ? "text-sky-blue-600"
                      : "text-slate-gray-300"
                  }
                >
                  Explore Issue
                </H5>
              </TabsTrigger>
            </TabsList>
            {/* Create Issue Button */}
            <Link href="/forum/create">
              <Button className="flex w-full items-center justify-center rounded-md sm:w-fit">
                <Plus size={12} />
                Create Issue
              </Button>
            </Link>
          </div>
        </Tabs>
      </div>

      {/* Scrollable Content Area */}
      <div className="mt-4 flex-1 overflow-y-auto">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          {contentMaps.length > 0 &&
            contentMaps.map(map => (
              <TabsContent
                key={map.value}
                value={map.value}
                className="mt-0 flex flex-col gap-3 p-0 lg:gap-4"
              >
                {map.isLoading ? (
                  <div className="flex h-32 items-center justify-center rounded-[10px] border border-white-400 bg-white">
                    <P level="body" className="text-slate-gray-400">
                      Loading issues...
                    </P>
                  </div>
                ) : map.error ? (
                  <div className="flex h-32 items-center justify-center rounded-[10px] border border-white-400 bg-white">
                    <P level="body" className="text-red-500">
                      Failed to load issues. Please try again.
                    </P>
                  </div>
                ) : map.content.length > 0 ? (
                  map.content.map(issue => (
                    <IssueCard
                      key={issue.id}
                      {...issue}
                      {...(issue.isMine && {
                        onDelete: () => handleDeleteIssue(issue.id),
                        onEdit: () => handleEditIssue(issue.id),
                      })}
                      onSeeAttachments={() => {
                        router.push(`/forum/${issue.id}`);
                      }}
                    />
                  ))
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-[10px] border border-white-400 bg-white">
                    <P level="body" className="text-slate-gray-400">
                      No issues found. Create your first issue to get started!
                    </P>
                  </div>
                )}
              </TabsContent>
            ))}
        </Tabs>
      </div>

      {/* Pagination */}
      {(() => {
        const currentMap = contentMaps.find(map => map.value === activeTab);
        const pagination = currentMap?.pagination;

        const isValidPagination =
          pagination &&
          typeof pagination === "object" &&
          "total_page" in pagination &&
          typeof pagination.total_page === "number";

        if (!isValidPagination) {
          return null;
        }

        const totalPages = (pagination as { total_page: number }).total_page;
        const hasNextPage = currentPage < totalPages;
        const hasPrevPage = currentPage > 1;

        if (totalPages <= 1) return null;

        return (
          <div className="mt-4 flex-shrink-0">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      hasPrevPage && handlePageChange(currentPage - 1)
                    }
                    className={
                      !hasPrevPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => {
                  const pageNum = i + 1;
                  const onClick = () => handlePageChange(pageNum);
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={onClick}
                        isActive={pageNum === currentPage}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      hasNextPage && handlePageChange(currentPage + 1)
                    }
                    className={
                      !hasNextPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        );
      })()}

      {/* Delete Issue Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDeleteIssue}
        title="This action can't be undone. Delete anyway?"
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </div>
  );
}

export default function ForumPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForumContent />
    </Suspense>
  );
}
