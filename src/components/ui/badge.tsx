import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";
import { typographyConfig } from "../elements/typography/typography.config";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-2 overflow-hidden rounded-md border px-2 py-0.5 font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
        outline:
          "rounded-full text-sky-blue-900 ring-1 ring-sky-blue-900 [a&]:hover:bg-sky-blue-900 [a&]:hover:text-sky-blue-900 ",
        ghost: "rounded-full border-none text-brand-slate ring-0",
        "gradient-blue":
          "rounded-full bg-gradient-to-b from-white to-[#A4D1E8] text-black",
        emerald:
          "rounded-full border-transparent bg-emerald-green-300 text-emerald-green-700",
        gray: "rounded-full border-transparent bg-slate-gray-100 text-brand-slate",
      },
      size: {
        default: "px-3 py-2",
        md: "px-4 py-2",
        lg: "px-4 py-2.5",
        icon: "px-2 py-1",
      },
      level: typographyConfig.variants.level,
      weight: typographyConfig.variants.weight,
      align: typographyConfig.variants.align,
    },
    defaultVariants: {
      variant: "default",
      level: typographyConfig.defaultVariants.level,
      weight: typographyConfig.defaultVariants.weight,
      align: typographyConfig.defaultVariants.align,
    },
  }
);

function Badge({
  className,
  variant,
  level,
  weight,
  align,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & BadgeVariantType & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(
        badgeVariants({ variant, level, weight, align, size }),
        className
      )}
      {...props}
    />
  );
}

type BadgeVariantType = VariantProps<typeof badgeVariants>;

export { Badge, badgeVariants, type BadgeVariantType };
