import type { PricingCardProps } from "../app/(main)/pricing/pricing-card";

export const PRICING_DATA: PricingCardProps[] = [
  {
    name: "Freemium",
    price: 0,
    features: ["Up to 1500 tasks", "1M characters knowledge base", "100+ integrations"],
    isActive: true,
    creditLimit: 400,
  },
  {
    name: "Premium",
    features: ["Unlimited tasks", "Unlimited characters knowledge base", "Unlimited integrations"],
    isActive: false,
    creditLimit: 1000,
  },
];
