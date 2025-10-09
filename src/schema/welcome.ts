import { z } from "zod";

export const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_PROFILE_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

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
  stateId: z.string().min(1, "Please select a state"),
  profileImage: z
    .any()
    .optional()
    .refine(
      file => {
        if (!file) return true; // Optional field
        if (file instanceof File) {
          return file.size <= MAX_PROFILE_IMAGE_SIZE;
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
          return ALLOWED_PROFILE_IMAGE_TYPES.includes(file.type);
        }
        return true;
      },
      {
        message: `Only ${ALLOWED_PROFILE_IMAGE_TYPES.join(", ")} images are allowed`,
      }
    ),
});

export type WelcomeFormData = z.infer<typeof welcomeFormSchema>;
