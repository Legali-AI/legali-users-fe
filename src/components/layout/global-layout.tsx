"use client";

import { cn } from "@/lib/utils";

interface GlobalLayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "full-height" | "center" | "no-padding";
  hasNavbar?: boolean;
}

/**
 * GlobalLayout component provides consistent spacing and safe area handling for all pages
 *
 * @param children - The content to render
 * @param className - Additional CSS classes to apply
 * @param variant - Layout variant:
 *   - "default": Standard padding with navbar spacing
 *   - "full-height": Full screen height with proper navbar offset
 *   - "center": Centered content with navbar spacing
 *   - "no-padding": No default padding (for custom layouts)
 * @param hasNavbar - Whether the page has a navbar (default: true)
 */
export function GlobalLayout({ children, className, variant = "default", hasNavbar = true }: GlobalLayoutProps) {
  const getVariantStyles = () => {
    const baseNavbarSpacing = hasNavbar ? "pt-24" : "pt-0"; // Account for fixed navbar height + top margin

    switch (variant) {
      case "full-height":
        return cn("min-h-screen", baseNavbarSpacing, "px-4 pb-8 sm:px-6 lg:px-8");

      case "center":
        return cn("flex min-h-screen items-center justify-center", baseNavbarSpacing, "px-4 py-8 sm:px-6 lg:px-8");

      case "no-padding":
        return cn(baseNavbarSpacing);

      default:
        return cn(baseNavbarSpacing, "px-4 py-8 sm:px-6 lg:px-8");
    }
  };

  return <div className={cn(getVariantStyles(), className)}>{children}</div>;
}
