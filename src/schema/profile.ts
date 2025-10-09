import { z } from "zod";
import { ALLOWED_PROFILE_IMAGE_TYPES, MAX_PROFILE_IMAGE_SIZE } from "./welcome";

export const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
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
        message: "Only JPEG, PNG, and WebP images are allowed",
      }
    ),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine(
      date => {
        let inputDate: Date;

        if (date.includes("-")) {
          inputDate = new Date(date);
        } else if (date.includes("/")) {
          const [month, day, year] = date.split("/").map(Number);
          inputDate = new Date(year, month - 1, day);
        } else {
          return false;
        }

        const today = new Date();
        const minDate = new Date(1900, 0, 1);

        return (
          inputDate <= today &&
          inputDate >= minDate &&
          !Number.isNaN(inputDate.getTime())
        );
      },
      {
        message: "Please enter a valid date between 01/01/1900 and today",
      }
    ),
  subscriptionType: z.string(),
  stateId: z.string().min(1, "Please select a state"),
  tokenUsage: z.number(),
  storageUsage: z.string(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
