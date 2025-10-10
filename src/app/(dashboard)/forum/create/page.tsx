"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FileAttachment } from "../../../../components/elements/attachments/file-attachment";
import { H3, H5 } from "../../../../components/elements/typography";
import { Button } from "../../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { useForumIssueMutation } from "../../../../hooks/use-forum";
import {
  type ForumIssueFormData,
  forumIssueSchema,
} from "../../../../schema/forum.schema";

export default function CreateForumPage() {
  const router = useRouter();
  const { createWithToast } = useForumIssueMutation();
  const [attachmentError, setAttachmentError] = React.useState<string>("");

  const form = useForm<ForumIssueFormData>({
    resolver: zodResolver(forumIssueSchema),
    defaultValues: {
      title: "",
      description: "",
      files: [],
    },
  });

  const onSubmit = async (data: ForumIssueFormData) => {
    try {
      setAttachmentError("");

      await createWithToast({
        title: data.title,
        description: data.description || null,
        files: data.files || null,
      });

      router.push("/forum");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create forum issue"
      );
    }
  };

  return (
    <main className="flex w-full flex-1 flex-col gap-4 lg:gap-5">
      {/* Header */}
      <H5 weight="semibold" level="h5">
        Create your issue
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
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
