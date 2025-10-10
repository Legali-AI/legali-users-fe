"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FileAttachment } from "../../../../../components/elements/attachments/file-attachment";
import { H3, H5 } from "../../../../../components/elements/typography";
import { Button } from "../../../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../../components/ui/form";
import { Input } from "../../../../../components/ui/input";
import { Textarea } from "../../../../../components/ui/textarea";
import {
  useForumIssueMutation,
  useForumIssuesQuery,
} from "../../../../../hooks/use-forum";
import {
  type ForumIssueFormData,
  forumIssueSchema,
} from "../../../../../schema/forum.schema";
import type { UpdateIssueApiUserForumIssuesIssueIdPutData } from "../../../../../sdk/out/types.gen";

interface EditForumPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditForumPage({ params }: EditForumPageProps) {
  const router = useRouter();
  const { updateWithToast, isUpdating } = useForumIssueMutation();
  const { data: issuesData, isLoading: isLoadingIssues } =
    useForumIssuesQuery();
  const [attachmentError, setAttachmentError] = React.useState<string>("");

  // Unwrap params Promise
  const resolvedParams = React.use(params);

  // Find the issue to edit
  const issue = issuesData?.data?.find(i => i.issue_id === resolvedParams.id);

  const form = useForm<ForumIssueFormData>({
    resolver: zodResolver(forumIssueSchema),
    defaultValues: {
      title: issue?.title || "",
      description: issue?.description || "",
      files: [],
    },
  });

  // Update form when issue data is loaded
  React.useEffect(() => {
    if (issue) {
      form.reset({
        title: issue.title,
        description: issue.description || "",
        files: [],
      });
    }
  }, [issue, form]);

  const onSubmit = async (data: ForumIssueFormData) => {
    try {
      setAttachmentError("");

      await updateWithToast({
        path: { issue_id: resolvedParams.id },
        body: {
          title: data.title,
          description: data.description || null,
          files: data.files || null,
        },
      } as UpdateIssueApiUserForumIssuesIssueIdPutData);

      router.push(`/forum/${resolvedParams.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update forum issue"
      );
    }
  };

  const {
    formState: { isSubmitting, isDirty, isLoading: stateLoading },
  } = form;
  const isLoading =
    isUpdating || stateLoading || isSubmitting || isLoadingIssues;

  if (isLoadingIssues) {
    return (
      <main className="flex w-full flex-1 flex-col gap-4 lg:gap-5">
        <div className="flex h-32 items-center justify-center">
          <H5 weight="semibold" level="h5" className="text-deep-navy">
            Loading...
          </H5>
        </div>
      </main>
    );
  }

  if (!issue) {
    return (
      <main className="flex w-full flex-1 flex-col gap-4 lg:gap-5">
        <div className="flex h-32 items-center justify-center">
          <H5 weight="semibold" level="h5" className="text-deep-navy">
            Issue not found
          </H5>
        </div>
      </main>
    );
  }

  return (
    <main className="flex w-full flex-1 flex-col gap-4 lg:gap-5">
      {/* Header */}
      <H5 weight="semibold" level="h5">
        Edit your issue
      </H5>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4 lg:space-y-5"
        >
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <H3 weight="semibold" level="title">
                    Title
                  </H3>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Write your issue title..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <H3 weight="semibold" level="title">
                    Description
                  </H3>
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-[180px] lg:min-h-[236px]"
                    placeholder="Write your description..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Files Field */}
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <H3 weight="semibold" level="title">
                    Attachments
                  </H3>
                </FormLabel>
                <FormControl>
                  <FileAttachment
                    value={field.value || []}
                    onChange={field.onChange}
                    onError={setAttachmentError}
                    accept="image/*,.pdf,.doc,.docx,.xlsx,.xls"
                    maxFiles={10}
                    maxSizePerFile={10}
                    placeholder="Attachments"
                  />
                </FormControl>
                <FormMessage />
                {attachmentError && (
                  <p className="text-sm text-destructive">{attachmentError}</p>
                )}
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="h-[39px] w-full rounded-[10px] bg-deep-navy px-5"
            level="title"
            weight="semibold"
            disabled={isLoading || !isDirty}
          >
            {form.formState.isSubmitting ? "Updating..." : "Update Issue"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
