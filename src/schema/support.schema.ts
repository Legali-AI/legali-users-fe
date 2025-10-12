import z from "zod";
import { TicketUrgency } from "../sdk/out";

export const supportTicketSchema = z.object({
  issue_title: z
    .string()
    .min(3, "Please describe your issue")
    .max(200, "Issue description must be less than 200 characters"),
  description: z
    .string()
    .min(10, "Please provide a detailed description with minimum 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  urgency: z.enum(["low", "medium", "high"]).refine(val => val !== undefined, {
    message: "Please select an urgency level",
  }),
  files: z.array(z.instanceof(File)).optional(),
});

export const URGENCY_OPTIONS = Object.values(TicketUrgency).map(value => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));
