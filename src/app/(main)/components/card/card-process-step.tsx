import Image from "next/image";
import { H4, P } from "../../../../components/elements/typography";
import type { ProcessStep } from "../../../../data/home.data";

interface CardProcessStepProps {
  processStep: ProcessStep;
  index: number;
}

export function CardProcessStep({ processStep, index }: CardProcessStepProps) {
  return (
    <div
      className="flex h-full flex-col gap-4 overflow-hidden rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-[0_20px_40px_-30px_rgba(15,36,71,0.35)] backdrop-blur-sm sm:p-6 lg:p-7"
      style={{
        background: processStep.colorHex
          ? `linear-gradient(135deg, #FFFFFF 0%, ${processStep.colorHex} 100%)`
          : "#FFFFFF",
      }}>
      {/* Number Badge & Title */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#2F7D99] to-[#A4D1E8] text-lg font-bold text-white shadow-md">
          {index + 1}
        </div>
        <H4 level="h5" weight="semibold" className="flex-1 text-deep-navy">
          {processStep.title}
        </H4>
      </div>

      {/* Description */}
      <P level="body" className="text-sm text-brand-slate sm:text-base">
        {processStep.description}
      </P>

      {/* Image Section */}
      {processStep.imageUrl && (
        <div className="mt-2">
          <Image
            src={processStep.imageUrl}
            alt={processStep.title}
            width={400}
            height={250}
            className="h-auto w-full rounded-xl object-contain"
            priority={index === 0}
          />
        </div>
      )}
    </div>
  );
}
