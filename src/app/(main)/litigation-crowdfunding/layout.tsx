import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Litigation Crowdfunding - Legali",
  description:
    "Invest in vetted legal cases and help plaintiffs get the justice they deserve while earning returns on successful outcomes.",
};

export default function LitigationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
