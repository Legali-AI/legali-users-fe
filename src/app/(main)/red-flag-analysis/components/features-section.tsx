import Image from "next/image";

// Feature data types
interface Recommendation {
  title: string;
  description: string;
}

interface Feature {
  id: number;
  image: string;
  title: string;
  description: string;
  badge?: string;
  badgeVariant?: "warning";
  highlight?: string;
  highlightDescription?: string;
  recommendations?: Recommendation[];
}

const FEATURES: Feature[] = [
  {
    id: 1,
    image: "/home/features/rfa-1.png",
    title: "Upload case",
    description:
      "Upload your file or enter case details. Legali automatically highlights clauses, conflicts, and trends that may require attention.",
    badge: "1 conflict detected",
    badgeVariant: "warning",
  },
  {
    id: 2,
    image: "/home/features/rfa-2.png",
    title: "View instant flagged sections",
    description: "View instant flagged sections with plain-English explanations",
    highlight: "Legali AI",
    highlightDescription:
      "Organize evidence, draft documents, connect with affordable attorneys, and fund your case — all on one secure platform.",
  },
  {
    id: 3,
    image: "/home/features/rfa-3.png",
    title: "Get personalized recommendations",
    description: "Get personalized recommendations for next steps: edit, seek review, or escalate for legal support.",
    recommendations: [
      {
        title: "Clarify Payment Terms",
        description: "Clause 4 contains vague wording about due dates, rewrite for clarity.",
      },
      {
        title: "Compliance Check Needed",
        description: "Ask a compliance officer to review the privacy policy in section 8.",
      },
    ],
  },
];

// Server Component
export default function FeaturesSection() {
  return (
    <section className="flex flex-col gap-12 px-4 py-16 sm:gap-16 sm:px-8 sm:py-20 md:px-16 lg:gap-20 lg:px-32 lg:py-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 sm:gap-16 lg:gap-20">
        {FEATURES.map((feature, index) => {
          // Alternating layout: index 0 (left), index 1 (right), index 2 (left)
          const imageOnRight = index % 2 === 1;

          return (
            <div
              key={feature.id}
              className="flex flex-col gap-8 lg:gap-12"
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay={index * 100}>
              <div
                className={`grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 ${
                  imageOnRight ? "lg:grid-flow-dense" : ""
                }`}>
                {/* Image */}
                <div
                  className={`relative aspect-video w-full overflow-hidden rounded-[24px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_40px_-30px_rgba(15,36,71,0.35)] ${
                    imageOnRight ? "lg:col-start-2" : ""
                  }`}>
                  <Image src={feature.image} alt={feature.title} fill className="object-contain p-4" />
                </div>

                {/* Content */}
                <div className={`flex flex-col justify-center gap-4 ${imageOnRight ? "lg:col-start-1" : ""}`}>
                  <h3 className="text-2xl font-semibold text-brand-navy sm:text-3xl md:text-4xl">{feature.title}</h3>
                  <p className="text-base text-brand-navy/80 sm:text-lg md:text-xl">{feature.description}</p>

                  {/* Badge for conflicts */}
                  {feature.badge && <FeatureBadge text={feature.badge} />}

                  {/* Highlight box */}
                  {feature.highlight && (
                    <FeatureHighlight title={feature.highlight} description={feature.highlightDescription || ""} />
                  )}

                  {/* Recommendations */}
                  {feature.recommendations && <FeatureRecommendations recommendations={feature.recommendations} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Sub-components (Server Components)
function FeatureBadge({ text }: { text: string }) {
  return (
    <div className="mt-2">
      <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <title>Warning icon</title>
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        {text}
      </span>
    </div>
  );
}

function FeatureHighlight({ title, description }: { title: string; description: string }) {
  return (
    <div className="mt-4 rounded-xl border border-amber-200/60 bg-amber-50/40 p-4">
      <div className="mb-2 flex items-center gap-2">
        <svg className="h-5 w-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <title>Star icon</title>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="font-semibold text-brand-navy">{title}</span>
      </div>
      <p className="text-sm text-brand-navy/80">{description}</p>
    </div>
  );
}

function FeatureRecommendations({ recommendations }: { recommendations: Recommendation[] }) {
  return (
    <div className="mt-4 space-y-3">
      {recommendations.map((rec, idx) => (
        <div key={idx} className="rounded-xl border border-sky-blue-200/60 bg-white/90 p-4">
          <h4 className="mb-1 font-semibold text-brand-navy">{rec.title}</h4>
          <p className="text-sm text-brand-navy/70">{rec.description}</p>
        </div>
      ))}
    </div>
  );
}
