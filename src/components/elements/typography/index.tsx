import type { VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../../lib/utils";
import { typographyVariants } from "./typography.variant";

type HTMLAttributesWithoutConflicts = Omit<
  React.HTMLAttributes<HTMLElement>,
  keyof VariantProps<typeof typographyVariants>
>;

export interface TypographyProps extends HTMLAttributesWithoutConflicts, VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
}

const Typography = React.memo(
  React.forwardRef<HTMLElement, TypographyProps>(
    ({ className, level, weight, align = "left", transform, as: Component = "span", ...props }, ref) => {
      const combinedClassName = React.useMemo(
        () =>
          cn(
            typographyVariants({
              level,
              weight,
              align,
              transform,
              className,
            })
          ),
        [level, weight, align, transform, className]
      );

      return <Component ref={ref} className={combinedClassName} {...props} />;
    }
  )
);

Typography.displayName = "Typography";

const H1 = (props: TypographyProps) => <Typography as="h1" level="h1" {...props} />;
H1.displayName = "H1";

const H2 = (props: TypographyProps) => <Typography as="h2" level="h2" {...props} />;
H2.displayName = "H2";

const H3 = (props: TypographyProps) => <Typography as="h3" level="h3" {...props} />;
H3.displayName = "H3";

const H4 = (props: TypographyProps) => <Typography as="h4" level="h4" {...props} />;
H4.displayName = "H4";

const H5 = (props: TypographyProps) => <Typography as="h5" level="h5" {...props} />;
H5.displayName = "H5";

const Lead = (props: TypographyProps) => <Typography as="p" level="title" {...props} />;
Lead.displayName = "Lead";

const P = (props: TypographyProps) => <Typography as="p" level="body" {...props} />;
P.displayName = "P";

const Small = (props: TypographyProps) => <Typography as="small" level="label" {...props} />;
Small.displayName = "Small";

const Muted = (props: TypographyProps) => (
  <Typography as="p" className={cn("text-muted-foreground", props.className)} level="label" {...props} />
);
Muted.displayName = "Muted";

const Span = (props: TypographyProps) => <Typography as="span" level="body" {...props} />;
Span.displayName = "Span";

export { H1, H2, H3, H4, H5, Lead, Muted, P, Small, Span, Typography, typographyVariants };
