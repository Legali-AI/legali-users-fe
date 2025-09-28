"use client";

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

export const AOSInit = () => {
  useEffect(() => {
    AOS.init({
      easing: "ease-out-cubic",
      duration: 600,
      once: true,
      offset: 50,
    });
  }, []);

  return null;
};
