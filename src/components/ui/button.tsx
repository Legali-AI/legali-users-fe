import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";
import { typographyConfig } from "../elements/typography/typography.config";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none hover:brightness-90 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-brand-rose aria-invalid:ring-brand-rose/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-deep-navy text-primary-foreground shadow-xs hover:bg-deep-navy/90 focus-visible:ring-deep-navy/20 active:bg-deep-navy/95",
        black:
          "bg-black text-white shadow-xs hover:bg-deep-navy/90 focus-visible:ring-deep-navy/20 active:bg-deep-navy/95",
        destructive: "bg-brand-rose text-white shadow-xs hover:bg-brand-rose/90 focus-visible:ring-brand-rose/20",
        outline: "border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        orange: "bg-warm-orange-400 text-white",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        "gradient-blue": "bg-gradient-to-b from-white to-[#A4D1E8] font-semibold text-black",
      },
      size: {
        default: "px-4 py-2",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "rounded-xl px-6 py-3 has-[>svg]:px-4",
        icon: "px-0 py-0",
      },
      level: typographyConfig.variants.level,
      weight: typographyConfig.variants.weight,
      align: typographyConfig.variants.align,
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      level: typographyConfig.defaultVariants.level,
      weight: typographyConfig.defaultVariants.weight,
      align: typographyConfig.defaultVariants.align,
    },
  }
);

function Button({
  className,
  variant,
  size,
  level,
  weight,
  align,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, level, weight, align, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
