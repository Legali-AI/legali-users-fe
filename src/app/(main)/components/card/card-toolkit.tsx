import Link from "next/link";
import { H4, P } from "../../../../components/elements/typography";
import type { ToolkitItem } from "../../../../data/home.data";

interface CardToolkitProps {
  item: ToolkitItem;
}

export function CardToolkit({ item }: CardToolkitProps) {
  const CardContent = (
    <div className="group flex h-full flex-col gap-4 rounded-[24px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_40px_-30px_rgba(15,36,71,0.35)] backdrop-blur-sm transition-all hover:shadow-[0_30px_60px_-30px_rgba(15,36,71,0.5)] sm:p-7 lg:p-8">
      {/* Icon & Title */}
      <div className="flex items-start gap-3">
        <div
          className="rounded-lg bg-gradient-to-br from-[#2F7D99] to-[#A4D1E8] p-2.5 text-white transition-transform group-hover:scale-105"
          aria-hidden="true">
          <item.icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
        </div>
        <div className="flex-1">
          <H4 level="h5" weight="semibold" className="text-deep-navy">
            {item.title}
          </H4>
        </div>
      </div>

      {/* Subtitle */}
      <P level="body" weight="semibold" className="text-[#2F7D99]">
        {item.subtitle}
      </P>

      {/* Description */}
      <P level="body" className="flex-1 text-sm text-brand-slate sm:text-base">
        {item.description}
      </P>
    </div>
  );

  // If href exists, wrap with Link, otherwise just return the card
  if (item.href) {
    return (
      <Link href={item.href} className="block h-full">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}
