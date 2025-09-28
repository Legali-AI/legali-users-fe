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
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        coral: "rounded-full border-transparent bg-brand-rose text-white",
        "warm-orange": "rounded-full border-transparent bg-warm-orange-400 text-white",
        "sky-blue-light": "rounded-full border-transparent bg-sky-blue-500 text-white",
        "sky-blue": "rounded-full border-transparent bg-sky-blue-900 text-white",
        "outline-warm-orange": "rounded-full bg-warm-orange-200 text-warm-orange-400",
        emerald: "rounded-full border-transparent bg-emerald-green-400 text-white",
      },
      size: {
        default: "px-3 py-2",
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
      className={cn(badgeVariants({ variant, level, weight, align, size }), className)}
      {...props}
    />
  );
}

type BadgeVariantType = VariantProps<typeof badgeVariants>;

export { Badge, badgeVariants, type BadgeVariantType };
