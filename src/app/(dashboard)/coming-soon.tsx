"use client";


export default function ComingSoon() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-sky-blue-100 px-4 py-16 absolute inset-0">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        {/* Coming Soon Text */}
        <div className="relative">
          <h1 className="text-[100px] font-bold leading-none text-brand-navy/10 sm:text-[160px] lg:text-[200px]">
            SOON
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-semibold text-brand-navy sm:text-5xl">Coming Soon</span>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-4">
          <p className="text-lg text-brand-navy/80 sm:text-xl">
            We're working hard to bring you something amazing!
          </p>
          <p className="text-base text-brand-navy/70">This feature will be available soon. Stay tuned for updates.</p>
        </div>
      </div>

      {/* Decorative Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-sky-blue-200/40 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-brand-gray-50/30 blur-3xl" />
      </div>
    </div>
  );
}
