"use client";

import { useState } from "react";
import { H3, H4 } from "../../../components/elements/typography";
import { TOOLKIT_CONTENT, TOOLKIT_ITEMS } from "../../../data/home.data";
import { cn } from "../../../lib/utils";
import { CardToolkit } from "./card/card-toolkit";

type TabType = "individuals" | "lawyers";

export default function ToolkitSection() {
  const [activeTab, setActiveTab] = useState<TabType>("individuals");

  const activeItems = TOOLKIT_ITEMS.find(cat => cat.category === activeTab)?.items || [];

  return (
    <section className="flex flex-col gap-10 sm:gap-12 lg:gap-16" aria-labelledby="toolkit-heading">
      {/* Heading */}
      <div className="space-y-2 text-center" data-aos="fade-up" data-aos-duration="600">
        <H3
          id="toolkit-heading"
          level="h2"
          align="center"
          weight="semibold"
          className="mx-auto max-w-4xl text-3xl text-brand-navy sm:text-[38px] md:text-[44px] lg:text-[50px]">
          {TOOLKIT_CONTENT.heading}
        </H3>
        <H4 level="h3" align="center" weight="semibold" className="mx-auto max-w-3xl text-brand-navy">
          {TOOLKIT_CONTENT.subheading}
        </H4>
      </div>

      <div
        className="mx-auto flex w-full max-w-6xl items-center gap-3 rounded-full bg-white p-2 shadow-[0_10px_30px_-20px_rgba(15,36,71,0.3)]"
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-delay="100"
        role="tablist"
        aria-label="Toolkit categories">
        <button
          role="tab"
          aria-selected={activeTab === "individuals"}
          aria-controls="individuals-panel"
          onClick={() => setActiveTab("individuals")}
          className={cn(
            "flex-1 rounded-full px-6 py-3 text-center font-semibold transition-all duration-300 sm:px-8 sm:py-4",
            activeTab === "individuals"
              ? "bg-gradient-to-br from-[#2F7D99] to-[#A4D1E8] text-white shadow-md"
              : "hover:bg-sky-blue-50 text-brand-slate"
          )}>
          {TOOLKIT_CONTENT.tabIndividuals}
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "lawyers"}
          aria-controls="lawyers-panel"
          onClick={() => setActiveTab("lawyers")}
          className={cn(
            "flex-1 rounded-full px-6 py-3 text-center font-semibold transition-all duration-300 sm:px-8 sm:py-4",
            activeTab === "lawyers"
              ? "bg-gradient-to-br from-[#2F7D99] to-[#A4D1E8] text-white shadow-md"
              : "hover:bg-sky-blue-50 text-brand-slate"
          )}>
          {TOOLKIT_CONTENT.tabLawyers}
        </button>
      </div>

      {/* Cards Grid - 2 Columns on Desktop */}
      <div
        id={`${activeTab}-panel`}
        role="tabpanel"
        aria-labelledby={`${activeTab}-tab`}
        className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2"
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-delay="200">
        {activeItems.map((item, index) => (
          <div key={item.title} data-aos="zoom-in" data-aos-duration="600" data-aos-delay={250 + index * 100}>
            <CardToolkit item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
