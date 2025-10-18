import Image from "next/image";
import {
  HOW_IT_WORKS_HEADING,
  HOW_IT_WORKS_STEPS,
  HOW_IT_WORKS_SUBHEADING,
} from "../../../../data/lawyers-marketplace.data";

// Server Component
export default function HowItWorksSection() {
  return (
    <section className="flex flex-col items-center gap-12 px-4 py-16 sm:gap-16 sm:px-8 sm:py-20 md:px-16 lg:gap-20 lg:px-32 lg:py-24">
      {/* Heading */}
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
        <h2
          className="text-3xl font-bold text-brand-navy sm:text-4xl md:text-5xl lg:text-6xl"
          data-aos="fade-up"
          data-aos-duration="600">
          {HOW_IT_WORKS_HEADING}
        </h2>
        <p
          className="text-lg text-brand-navy/70 sm:text-xl md:text-2xl"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="100">
          {HOW_IT_WORKS_SUBHEADING}
        </p>
      </div>

      {/* Steps */}
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 sm:gap-16 lg:gap-20">
        {HOW_IT_WORKS_STEPS.map((step, index) => (
          <HowItWorksStep
            key={index}
            title={step.title}
            description={step.description}
            details={step.details}
            imagePath={step.imagePath}
            backgroundColor={step.backgroundColor || "#FFFFFF"}
            index={index}
            imageOnRight={index % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}

// How It Works Step Component
interface HowItWorksStepProps {
  title: string;
  description: string;
  details: string[];
  imagePath: string;
  backgroundColor: string;
  index: number;
  imageOnRight: boolean;
}

function HowItWorksStep({
  title,
  description,
  details,
  imagePath,
  backgroundColor,
  index,
  imageOnRight,
}: HowItWorksStepProps) {
  return (
    <div
      className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12"
      data-aos="fade-up"
      data-aos-duration="600"
      data-aos-delay={index * 100}>
      {/* Image */}
      <div
        className={`relative aspect-video w-full overflow-hidden rounded-[24px] p-8 shadow-[0_20px_40px_-30px_rgba(15,36,71,0.35)] sm:p-10 lg:aspect-square ${
          imageOnRight ? "lg:order-2" : ""
        }`}
        style={{ backgroundColor }}>
        <Image src={imagePath} alt={title} fill className="object-contain" />
      </div>

      {/* Content */}
      <div className={`flex flex-col justify-center gap-4 ${imageOnRight ? "lg:order-1" : ""}`}>
        <h3 className="text-2xl font-bold text-brand-navy sm:text-3xl md:text-4xl">{title}</h3>
        <p className="text-base leading-relaxed text-brand-navy/80 sm:text-lg md:text-xl">{description}</p>

        {/* Details List */}
        {details.length > 0 && (
          <ul className="flex flex-col gap-2">
            {details.map((detail, idx) => (
              <li key={idx} className="text-sm leading-relaxed text-brand-navy/70 sm:text-base">
                {detail}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
