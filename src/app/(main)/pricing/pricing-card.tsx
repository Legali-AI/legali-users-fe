import { CheckIcon } from "lucide-react";
import { H3, H4, P, Span } from "../../../components/elements/typography";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

export interface PricingCardProps {
  name: string;
  price?: number | string;
  features: string[];
  isActive?: boolean;
  creditLimit?: number | string;
  onSubscribe?: () => void;
  disabled?: boolean;
  cta?: React.ReactNode;
}

export default function PricingCard({
  name,
  price,
  features,
  isActive = false,
  creditLimit,
  onSubscribe,
  disabled = false,
  cta,
}: PricingCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-6">
        {/* Plan info */}
        <div className="flex flex-col gap-1">
          {/* Plan name */}
          <H3 weight={"semibold"}>{name}</H3>
          {/* Plan price */}
          <H4
            level={"h2"}
            weight={"semibold"}
            className={typeof price === "undefined" ? "text-sky-blue-800" : ""}
          >
            {typeof price !== "undefined" ? `$${price}` : "Coming soon"}
          </H4>
          {/* Credit limit */}
          <P level={"h5"} weight={"semibold"}>
            {typeof creditLimit !== "undefined"
              ? `${creditLimit} credits/month`
              : " "}
          </P>
        </div>
        {/* Button */}
        {cta ? (
          cta
        ) : (
          <Button
            type="button"
            variant={!isActive ? "gradient-blue" : "outline"}
            className="w-full rounded-md"
            size={"lg"}
            disabled={disabled || isActive}
            onClick={onSubscribe}
          >
            <Span
              level={"title"}
              weight={"medium"}
              className={isActive ? "text-brand-slate" : "text-black"}
            >
              {isActive ? "Your current plan" : `Get ${name}`}
            </Span>
          </Button>
        )}
        {/* Features */}
        <ul className="flex flex-col gap-3">
          {features
            .filter(feature => feature !== "")
            .map(feature => (
              <li key={feature}>
                {/* Feature */}
                <P
                  level={"body"}
                  weight={"semibold"}
                  className="flex items-center gap-2"
                >
                  <CheckIcon width={16} height={16} />
                  {feature}
                </P>
              </li>
            ))}
        </ul>
      </CardContent>
    </Card>
  );
}
