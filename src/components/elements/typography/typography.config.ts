export const typographyConfig = {
  variants: {
    level: {
      caption: "text-[9px] lg:text-[10px] leading-[130%]",
      label: "text-[12px] md:text-[13px] leading-[130%]",
      body: "text-[14px] md:text-base lg:text-base leading-[130%]",
      title: "text-[14px] md:text-[16px] xl:text-[20px] leading-[130%]",
      h5: "text-[18px] md:text-[20px] lg:text-[25px] xl:text-[25px] leading-[130%]",
      h4: "text-[24px] xl:text-[31px] leading-[130%]",
      h3: "text-[27px] md:text-[32px]lg:text-[39px] xl:text-[39px] leading-[130%]",
      h2: "text-[27px] md:text-[36px] lg:text-[49px] xl:text-[49px] leading-[130%]",
      h1: "text-[34px] md:text-[40px] lg:text-[61px] xl:text-[61px] leading-[130%]",
      huge: "text-[34px] md:text-[40px] xl:text-7xl",
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    transform: {
      normal: "normal-case",
      uppercase: "uppercase",
      lowercase: "lowercase",
      capitalize: "capitalize",
    },
  },
  defaultVariants: {
    level: "body",
    weight: "normal",
    align: "center",
    transform: "normal",
  },
} as const;
