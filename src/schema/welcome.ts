import { z } from "zod";

export const welcomeFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  region: z.string().min(1, "Please select a region"),
  profileImage: z
    .any()
    .optional()
    .refine(
      file => {
        if (!file) return true; // Optional field
        if (file instanceof File) {
          return file.size <= 5 * 1024 * 1024; // 5MB limit
        }
        return true;
      },
      {
        message: "File size must be less than 5MB",
      }
    )
    .refine(
      file => {
        if (!file) return true; // Optional field
        if (file instanceof File) {
          const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
          return allowedTypes.includes(file.type);
        }
        return true;
      },
      {
        message: "Only JPEG, PNG, and WebP images are allowed",
      }
    ),
});

export type WelcomeFormData = z.infer<typeof welcomeFormSchema>;

export const regions = [
  { value: "indonesia", label: "Indonesia" },
  { value: "united-states", label: "United States" },
  { value: "bangkok", label: "Bangkok" },
  { value: "singapore", label: "Singapore" },
  { value: "malaysia", label: "Malaysia" },
  { value: "philippines", label: "Philippines" },
  { value: "vietnam", label: "Vietnam" },
  { value: "thailand", label: "Thailand" },
] as const;
