import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { ACTION_CARDS } from "../../../../data/lawyers-marketplace.data";

// Server Component
export default function ActionCardsSection() {
  return (
    <section className="flex flex-col items-center gap-8 px-4 py-16 sm:px-8 sm:py-20 md:px-16 lg:px-32 lg:py-24">
      {/* Action Cards Grid - 3 columns */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3 lg:gap-10">
        {ACTION_CARDS.map((card, index) => (
          <ActionCard
            key={index}
            title={card.title}
            description={card.description}
            buttonText={card.buttonText}
            buttonHref={card.buttonHref}
            backgroundColor={card.backgroundColor}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

// Action Card Component
interface ActionCardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  backgroundColor: string;
  index: number;
}

function ActionCard({ title, description, buttonText, buttonHref, backgroundColor, index }: ActionCardProps) {
  return (
    <div
      className="flex flex-col items-center gap-6 rounded-[24px] p-8 text-center shadow-[0_20px_40px_-30px_rgba(15,36,71,0.35)] sm:p-10"
      style={{ backgroundColor }}
      data-aos="fade-up"
      data-aos-duration="600"
      data-aos-delay={index * 100}>
      {/* Title */}
      <h3 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">{title}</h3>

      {/* Description */}
      <p className="text-sm leading-relaxed text-white/90 sm:text-base">{description}</p>

      {/* CTA Button */}
      <Button
        asChild
        variant="default"
        size="lg"
        weight="semibold"
        className="bg-white text-brand-navy hover:bg-white/90">
        <Link href={buttonHref}>{buttonText}</Link>
      </Button>
    </div>
  );
}
