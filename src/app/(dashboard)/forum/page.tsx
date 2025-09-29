"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { DeleteConfirmationDialog } from "../../../components/elements/delete-confirmation-dialog";
import { H5, P } from "../../../components/elements/typography";
import { Button } from "../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { getIssuesByCategory } from "../../../data/issue.data";
import { IssueCard } from "./components/issue-card";

function ForumContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as "your-issues" | "explore-issues") || "your-issues";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`/forum?${params.toString()}`);
  };

  const yourIssues = getIssuesByCategory("your-issues");
  const exploreIssues = getIssuesByCategory("explore-issues");

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteIssue = () => {
    setShowDeleteDialog(true);
  };

  const confirmDeleteIssue = () => {
    setShowDeleteDialog(false);
  };

  const contentMaps = [
    {
      value: "your-issues",
      label: "Your Issue",
      content: yourIssues,
    },
    {
      value: "explore-issues",
      label: "Explore Issue",
      content: exploreIssues,
    },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex flex-col gap-3 sm:gap-4">
            <TabsList className="h-[43px] w-full bg-slate-gray-100 p-1.5 sm:w-auto sm:min-w-[300px]">
              <TabsTrigger value="your-issues">
                <H5 level="body" weight="semibold" className="text-sky-blue-600">
                  Your Issue
                </H5>
              </TabsTrigger>
              <TabsTrigger value="explore-issues">
                <H5 level="body" weight="semibold" className="text-slate-gray-300">
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
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {contentMaps.length > 0 &&
            contentMaps.map(map => (
              <TabsContent key={map.value} value={map.value} className="mt-0 flex flex-col gap-3 p-0 lg:gap-4">
                {map.content.length > 0 ? (
                  map.content.map(issue => (
                    <IssueCard
                      key={issue.id}
                      {...issue}
                      {...(activeTab === "your-issues" && {
                        onDelete: () => handleDeleteIssue(),
                      })}
                      onSeeAttachments={() => {}}
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
