import Image from "next/image";
import Link from "next/link";
import { H4, P } from "./typography";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Solutions",
    links: [
      { label: "Red Flag Analysis", href: "/solutions/red-flag-analysis" },
      {
        label: "Smart Document Automation",
        href: "/solutions/document-automation",
      },
      {
        label: "Contract & Agreement Reviews",
        href: "/solutions/contract-reviews",
      },
      {
        label: "Evidence & Litigation Toolkit",
        href: "/solutions/evidence-toolkit",
      },
      { label: "Trial Prep Dashboard", href: "/solutions/trial-prep" },
      { label: "Lawyer Marketplace", href: "/solutions/lawyer-marketplace" },
      { label: "Legali FundBridge", href: "/solutions/fundbridge" },
      { label: "Explore All Features", href: "/solutions/all-features" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help & Support Center", href: "/resources/help-support" },
      {
        label: "Legal Knowledge Library",
        href: "/resources/knowledge-library",
      },
      { label: "Success Stories & Blog", href: "/resources/success-stories" },
      { label: "Product Roadmap Updates", href: "/resources/roadmap" },
      { label: "Integration Marketplace", href: "/resources/integrations" },
      { label: "Partner Opportunities", href: "/resources/partners" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Legali", href: "/company/about" },
      { label: "Careers & Culture", href: "/company/careers" },
      { label: "Security & Data Trust", href: "/company/security" },
      { label: "Contact & Feedback", href: "/company/contact" },
    ],
  },
  {
    title: "Trust & Compliance",
    links: [
      { label: "SOC 2 Certified Security", href: "/trust/soc2" },
      { label: "GDPR & CCPA Compliance", href: "/trust/gdpr-ccpa" },
      { label: "HIPAA-Grade Protection", href: "/trust/hipaa" },
      { label: "Verified for Legal Trust", href: "/trust/verification" },
    ],
  },
  {
    title: "Legal Information",
    links: [
      { label: "Privacy & Data Policy", href: "/legal/privacy" },
      { label: "Trust Center", href: "/legal/trust-center" },
      { label: "Platform Terms of Use", href: "/legal/terms" },
      { label: "Why Legali?", href: "/legal/why-legali" },
    ],
  },
];
export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-brand-gray-50 p-4 sm:p-6 lg:p-10">
      <div className="flex flex-col items-start justify-center gap-8 sm:flex-row sm:gap-16 lg:gap-32">
        {/* Logo */}
        <div className="flex-none">
          <Image src="/logo.png" alt="Legali Logo" width={60} height={25} className="h-[25px] w-[60px]" />
        </div>

        {/* Footer Sections */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {FOOTER_SECTIONS.map(section => (
            <div key={section.title} className="flex flex-col items-start gap-2.5">
              {/* Section Title */}
              <H4 level="label" weight="semibold">
                {section.title}
              </H4>

              {/* Section Links */}
              <div className="flex flex-col items-start gap-2.5">
                {section.links.map(link => (
                  <Link key={link.label} href={link.href} className="w-full">
                    <P level="label" className="text-slate-gray-400 transition-colors hover:text-deep-navy-400">
                      {link.label}
                    </P>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
