import { z } from "zod";

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
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine(
      date => {
        // Handle both YYYY-MM-DD (from date input) and MM/DD/YYYY formats
        let inputDate: Date;

        if (date.includes("-")) {
          // YYYY-MM-DD format from date input
          inputDate = new Date(date);
        } else if (date.includes("/")) {
          // MM/DD/YYYY format
          const [month, day, year] = date.split("/").map(Number);
          inputDate = new Date(year, month - 1, day);
        } else {
          return false;
        }

        const today = new Date();
        const minDate = new Date(1900, 0, 1);

        return inputDate <= today && inputDate >= minDate && !Number.isNaN(inputDate.getTime());
      },
      {
        message: "Please enter a valid date between 01/01/1900 and today",
      }
    ),
  subscriptionType: z
    .string()
    .min(1, "Subscription type is required")
    .refine(value => ["Free", "Premium", "Enterprise"].includes(value), {
      message: "Please select a valid subscription type",
    }),
  region: z.string().min(1, "Please select a region"),
  tokenUsage: z
    .number()
    .min(0, "Token usage cannot be negative")
    .max(100000, "Token usage cannot exceed 100,000"),
  storageUsage: z
    .string()
    .min(1, "Storage usage is required")
    .regex(/^\d+\s*(MB|GB|TB)$/i, "Storage usage must be in format like '20000 MB' or '20 GB'")
    .refine(
      value => {
        const match = value.match(/^(\d+)\s*(MB|GB|TB)$/i);
        if (!match) return false;

        const [, amount, unit] = match;
        const numAmount = parseInt(amount, 10);

        // Convert to MB for comparison
        let totalMB = numAmount;
        if (unit.toUpperCase() === "GB") {
          totalMB = numAmount * 1024;
        } else if (unit.toUpperCase() === "TB") {
          totalMB = numAmount * 1024 * 1024;
        }

        return totalMB <= 100 * 1024 * 1024; // Max 100TB
      },
      {
        message: "Storage usage cannot exceed 100TB",
      }
    ),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

export const subscriptionTypeOptions = [
  { value: "Free", label: "Free" },
  { value: "Premium", label: "Premium" },
  { value: "Enterprise", label: "Enterprise" },
] as const;

export const regionOptions = [
  { value: "united-states", label: "United States" },
  { value: "canada", label: "Canada" },
  { value: "united-kingdom", label: "United Kingdom" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "australia", label: "Australia" },
  { value: "japan", label: "Japan" },
  { value: "singapore", label: "Singapore" },
  { value: "indonesia", label: "Indonesia" },
  { value: "malaysia", label: "Malaysia" },
  { value: "philippines", label: "Philippines" },
  { value: "vietnam", label: "Vietnam" },
  { value: "thailand", label: "Thailand" },
  { value: "india", label: "India" },
  { value: "china", label: "China" },
  { value: "south-korea", label: "South Korea" },
  { value: "brazil", label: "Brazil" },
  { value: "mexico", label: "Mexico" },
  { value: "argentina", label: "Argentina" },
  { value: "south-africa", label: "South Africa" },
] as const;

// Helper function to format date for display (MM/DD/YYYY)
export const formatDateForDisplay = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

// Helper function to format date for input (YYYY-MM-DD)
export const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to parse date from string (handles both formats)
export const parseDateFromString = (dateString: string): Date | null => {
  let date: Date;

  if (dateString.includes("-")) {
    // YYYY-MM-DD format
    date = new Date(dateString);
  } else if (dateString.includes("/")) {
    // MM/DD/YYYY format
    const [month, day, year] = dateString.split("/").map(Number);
    if (Number.isNaN(month) || Number.isNaN(day) || Number.isNaN(year)) return null;
    date = new Date(year, month - 1, day);
  } else {
    return null;
  }

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

// Helper function to format storage usage
export const formatStorageUsage = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} MB`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} GB`;
  return `${Math.round(bytes / (1024 * 1024))} TB`;
};

// Helper function to parse storage usage
export const parseStorageUsage = (usageString: string): number => {
  const match = usageString.match(/^(\d+)\s*(MB|GB|TB)$/i);
  if (!match) return 0;

  const [, amount, unit] = match;
  const numAmount = parseInt(amount, 10);

  switch (unit.toUpperCase()) {
    case "MB":
      return numAmount;
    case "GB":
      return numAmount * 1024;
    case "TB":
      return numAmount * 1024 * 1024;
    default:
      return 0;
  }
};
