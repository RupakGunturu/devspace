"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface FeatureCarouselImage {
  step1light1?: string;
  step1light2?: string;
  step2light1?: string;
  step2light2?: string;
  step3light?: string;
  step4light?: string;
  step1dark1?: string;
  step1dark2?: string;
  step2dark1?: string;
  step2dark2?: string;
  step3dark?: string;
  step4dark?: string;
  alt: string;
}

interface FeatureCarouselProps {
  title: string;
  description: string;
  image: FeatureCarouselImage;
  bgClass?: string;
  step1img1Class?: string;
  step1img2Class?: string;
  step2img1Class?: string;
  step2img2Class?: string;
  step3imgClass?: string;
  step4imgClass?: string;
}

const STEPS = [
  { label: "Overview", description: "Get a bird's eye view of the platform" },
  { label: "Dashboard", description: "Explore the main dashboard interface" },
  { label: "Analytics", description: "Deep dive into analytics and reporting" },
  { label: "Settings", description: "Configure and customize your experience" },
];

export function FeatureCarousel({
  title,
  description,
  image,
  bgClass = "bg-gradient-to-tr from-neutral-900/90 to-neutral-800/90",
  step1img1Class,
  step1img2Class,
  step2img1Class,
  step2img2Class,
  step3imgClass,
  step4imgClass,
}: FeatureCarouselProps) {
  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % STEPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("group relative w-full overflow-hidden rounded-[24px] p-6 md:p-10", bgClass)}>
      {/* Header */}
      <div className="relative z-20 mb-8">
        <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">{title}</h2>
        <p className="text-sm text-neutral-400 md:text-base">{description}</p>
      </div>

      {/* Step indicators */}
      <div className="relative z-20 mb-8 flex gap-2">
        {STEPS.map((step, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all md:text-sm",
              currentStep === i
                ? "bg-white text-neutral-950"
                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                currentStep === i
                  ? "bg-neutral-950 text-white"
                  : "bg-neutral-700 text-neutral-400",
              )}
            >
              {i + 1}
            </span>
            <span className="hidden md:inline">{step.label}</span>
          </button>
        ))}
      </div>

      {/* Images area */}
      <div className="relative h-[300px] w-full overflow-hidden rounded-xl md:h-[400px]">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {image.step1light1 && (
                <img src={image.step1light1} alt={image.alt} className={cn("absolute", step1img1Class)} />
              )}
              {image.step1light2 && (
                <img src={image.step1light2} alt={image.alt} className={cn("absolute", step1img2Class)} />
              )}
            </motion.div>
          )}
          {currentStep === 1 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {image.step2light1 && (
                <img src={image.step2light1} alt={image.alt} className={cn("absolute", step2img1Class)} />
              )}
              {image.step2light2 && (
                <img src={image.step2light2} alt={image.alt} className={cn("absolute", step2img2Class)} />
              )}
            </motion.div>
          )}
          {currentStep === 2 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {image.step3light && (
                <img src={image.step3light} alt={image.alt} className={cn("absolute", step3imgClass)} />
              )}
            </motion.div>
          )}
          {currentStep === 3 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {image.step4light && (
                <img src={image.step4light} alt={image.alt} className={cn("absolute", step4imgClass)} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Step description */}
      <div className="relative z-20 mt-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-neutral-300"
          >
            {STEPS[currentStep].description}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
