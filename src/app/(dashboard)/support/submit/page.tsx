"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { H3, H5 } from "../../../../components/elements/typography";
import { Button } from "../../../../components/ui/button";
import { FileAttachment } from "../../../../components/ui/file-attachment";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Textarea } from "../../../../components/ui/textarea";

const URGENCY_OPTIONS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];

const supportTicketSchema = z.object({
  urgency: z.string().min(1, "Please select an urgency level"),
  issue: z
    .string()
    .min(1, "Please describe your issue")
    .max(200, "Issue description must be less than 200 characters"),
  description: z
    .string()
    .min(10, "Please provide a detailed description")
    .max(1000, "Description must be less than 1000 characters"),
  attachments: z.array(z.instanceof(File)).optional(),
});

type SupportTicketFormData = z.infer<typeof supportTicketSchema>;

export default function SubmitSupportPage() {
  const [attachmentError, setAttachmentError] = React.useState<string>("");

  const form = useForm<SupportTicketFormData>({
    resolver: zodResolver(supportTicketSchema),
    defaultValues: {
      urgency: "",
      issue: "",
      description: "",
      attachments: [],
    },
  });

  const onSubmit = (data: SupportTicketFormData) => {
    console.log("Form submitted:", data);
    setAttachmentError(""); // Clear any attachment errors on successful submission
    // Handle form submission here
  };

  return (
    <main className="flex w-full flex-1 flex-col gap-5 overflow-hidden">
      {/* Header */}
      <H5 weight="semibold" level="h5">
        Create your ticket
      </H5>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-5"
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
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      {URGENCY_OPTIONS.map((option) => (
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
            name="issue"
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
                    className="min-h-[236px]"
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
            name="attachments"
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
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
