"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { Textarea } from "../../../../../components/ui/textarea";
import {
  useSupportTicketMutation,
  useSupportTicketQuery,
} from "../../../../../hooks/use-support";
import { QueryProvider } from "../../../../../lib/query-client";
import {
  supportTicketSchema,
  URGENCY_OPTIONS,
} from "../../../../../schema/support.schema";
import type {
  TicketUrgency,
  UpdateTicketApiUserSupportTicketsTicketIdPutData,
} from "../../../../../sdk/out";

type SupportTicketFormData = z.infer<typeof supportTicketSchema>;

interface EditSupportPageProps {
  params: Promise<{
    id: string;
  }>;
}

function EditSupportPageContent({ params }: EditSupportPageProps) {
  const [attachmentError, setAttachmentError] = React.useState<string>("");
  const router = useRouter();
  const { updateWithToast, isUpdating } = useSupportTicketMutation();

  // Unwrap params Promise
  const resolvedParams = React.use(params);

  // Get the specific ticket directly by ID
  const {
    data: ticketResponse,
    isLoading: isLoadingTicket,
    error,
  } = useSupportTicketQuery(resolvedParams.id);
  const ticket = ticketResponse?.data;

  const form = useForm<SupportTicketFormData>({
    resolver: zodResolver(supportTicketSchema),
    defaultValues: {
      urgency: ticket?.urgency || "low",
      issue_title: ticket?.issue_title || "",
      description: ticket?.description || "",
      files: [],
    },
  });

  // Update form when ticket data is loaded
  React.useEffect(() => {
    if (ticket) {
      form.reset({
        urgency: ticket.urgency,
        issue_title: ticket.issue_title,
        description: ticket.description || "",
        files: [],
      });
    }
  }, [ticket, form]);

  const onSubmit = async (data: SupportTicketFormData) => {
    setAttachmentError("");

    await updateWithToast(
      resolvedParams.id,
      {
        body: {
          issue_title: data.issue_title,
          description: data.description,
          urgency: data.urgency as TicketUrgency,
          files: data.files || [],
        },
        path: { ticket_id: resolvedParams.id },
      } as UpdateTicketApiUserSupportTicketsTicketIdPutData,
      () => router.push(`/support/${resolvedParams.id}`)
    );
  };

  const {
    formState: { isSubmitting, isDirty, isLoading: stateLoading },
  } = form;
  const isLoading =
    isLoadingTicket || stateLoading || isSubmitting || isUpdating;

  if (isLoadingTicket) {
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

  if (error || !ticket) {
    return (
      <main className="flex w-full flex-1 flex-col gap-4 lg:gap-5">
        <div className="flex h-32 items-center justify-center">
          <H5 weight="semibold" level="h5" className="text-deep-navy">
            Ticket not found
          </H5>
        </div>
      </main>
    );
  }

  return (
    <main className="flex w-full flex-1 flex-col gap-4 lg:gap-5">
      {/* Header */}
      <H5 weight="semibold" level="h5">
        Edit your ticket
      </H5>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4 lg:space-y-5"
        >
          {/* Urgency Field */}
          <FormField
            control={form.control}
            name="urgency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <H3 weight="semibold" level="title">
                    Urgency
                  </H3>
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      {URGENCY_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Issue Field */}
          <FormField
            control={form.control}
            name="issue_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <H3 weight="semibold" level="title">
                    Issue
                  </H3>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Write your issue..." {...field} />
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

          {/* Attachment Field */}
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <H3 weight="semibold" level="title">
                    Attachment
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
                    placeholder="Attachment"
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
            {isUpdating ? "Updating..." : "Update Ticket"}
          </Button>
        </form>
      </Form>
    </main>
  );
}

export default function EditSupportPage({ params }: EditSupportPageProps) {
  return (
    <QueryProvider>
      <EditSupportPageContent params={params} />
    </QueryProvider>
  );
}
