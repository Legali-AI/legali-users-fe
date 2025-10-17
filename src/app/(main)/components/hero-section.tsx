"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Paperclip } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import RichInput from "../../../components/elements/rich-input";
import { H1, H2 } from "../../../components/elements/typography";
import { Badge } from "../../../components/ui/badge";
import { NAVIGATION_FEATURES } from "../../../data/home.data";
import type { RichInputPayload } from "../../../components/elements/rich-input";
import { storePendingMessage } from "../../../lib/session-storage";

export default function HeroSection() {
  const router = useRouter();

  // Animated text rotation state
  const animatedTexts = ["AI-law firm", "AI-legal confidant", "AI-legal resources"];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Drag and drop state
  const [isDragOver, setIsDragOver] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cycle through texts every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex(prevIndex => (prevIndex + 1) % animatedTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (payload: RichInputPayload) => {
    const hasContent = payload.text?.trim() || payload.files?.length > 0 || payload.audioBlob;

    if (!hasContent) {
      // No content to send, just navigate to agent page
      router.push("/agent");
      return;
    }

    // If there are files or audio, store in sessionStorage
    if (payload.files?.length > 0 || payload.audioBlob) {
      try {
        await storePendingMessage({
          text: payload.text || "",
          files: payload.files || [],
          audioBlob: payload.audioBlob ?? null,
          audioUrl: payload.audioUrl ?? null,
        });
        // Navigate without message parameter (will be handled by agent page)
        router.push("/agent");
      } catch (error) {
        console.error("Failed to store pending message:", error);
        alert("Failed to prepare files for upload. Please try again.");
      }
    } else if (payload.text?.trim()) {
      // Only text, use URL parameter as before
      const encodedMessage = encodeURIComponent(payload.text.trim());
      router.push(`/agent?message=${encodedMessage}`);
    } else {
      router.push("/agent");
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Clear any existing timeout
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }

    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Clear any existing timeout
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }

    // Only hide overlay if we're actually leaving the container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      dragTimeoutRef.current = setTimeout(() => {
        setIsDragOver(false);
      }, 100);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);

    if (files.length > 0) {
      // Validate file sizes (5MB max per file)
      const maxSize = 5 * 1024 * 1024; // 5MB
      const validFiles = files.filter(file => {
        if (file.size > maxSize) {
          alert(`File "${file.name}" is too large. Maximum size is 5MB.`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        // Add files to dropped files state
        setDroppedFiles(prev => [...prev, ...validFiles]);
      }
    }
  };

  return (
    <section
      className="relative flex min-h-[90vh] items-center justify-center"
      aria-labelledby="hero-heading"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}>
      {/* Background decorations */}
      <div aria-hidden="true">
        <div
          className="absolute top-0 left-1/2 -z-10 aspect-square h-auto w-[400px] -translate-x-1/2 blur-2xl"
          style={{ backgroundColor: "rgba(200, 241, 255, 0.75)" }}
        />
        <div
          className="absolute top-[400px] -left-20 -z-10 aspect-square h-auto w-[400px] blur-2xl"
          style={{ backgroundColor: "rgba(200, 241, 255, 0.75)" }}
        />
        <div
          className="absolute top-[600px] -right-20 -z-10 aspect-square h-auto w-[400px] blur-2xl"
          style={{ backgroundColor: "rgba(200, 241, 255, 0.75)" }}
        />
        <div
          style={{
            borderRadius: "997px",
            background: "rgba(200, 241, 255, 0.5)",
            width: "997px",
            height: "206px",
            flexShrink: 0,
            filter: "blur(54.349998474121094px)",
          }}
          className="absolute top-[800px] left-1/2 -z-10 -translate-x-1/2"
        />
      </div>

      {/* Hero content */}
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-5">
        {/* Main headline with animated text */}
        <div data-aos="zoom-in-down" data-aos-duration="600">
          <H1 weight={"semibold"} align={"center"}>
            <span>Meet your first </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={currentTextIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="inline-block">
                {animatedTexts[currentTextIndex]}
              </motion.span>
            </AnimatePresence>
          </H1>
        </div>

        {/* Subtitle */}
        <div data-aos="zoom-in" data-aos-duration="600" data-aos-delay="100">
          <H2 level={"title"} className="text-brand-slate" align={"center"}>
            Legali lets you build cases, manage evidence, and fund litigation—all on one secure AI platform.
          </H2>
        </div>

        {/* Search input */}
        <div className="mt-4 w-full" data-aos="zoom-in" data-aos-duration="600" data-aos-delay="200">
          <RichInput
            onSubmit={handleSubmit}
            droppedFiles={droppedFiles}
            onClearDroppedFiles={() => setDroppedFiles([])}
          />
        </div>

        {/* Feature badges */}
        <div
          className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="300">
          {NAVIGATION_FEATURES.map((feature, index) => (
            <div key={feature.label} data-aos="flip-up" data-aos-duration="600" data-aos-delay={400 + index * 50}>
              <Badge level={"body"} variant={"gradient-blue"} size={"lg"}>
                <feature.icon size={30} aria-hidden="true" />
                <span className="sr-only hidden">Feature: </span>
                {feature.label}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Drag and Drop Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-sky-blue-50/90 backdrop-blur-sm">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-sky-blue-100">
              <Paperclip className="h-10 w-10 text-sky-blue-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-sky-blue-700">Drop files here to upload</h3>
            <p className="text-sm text-sky-blue-600">Maximum 5MB per file</p>
          </div>
        </div>
      )}
    </section>
  );
}
