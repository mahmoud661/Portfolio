import { useEffect, useState } from "react";
import AnimatedCircularProgressBar from "@/components/ui/animated-circular-progress-bar";

interface LoadingScreenProps {
  onLoaded: () => void;
  isPageReady: boolean;
}
 
export default function LoadingScreen({ onLoaded , isPageReady } : LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let incrementProgress;

    if (!isPageReady) {
      // Simulate incremental progress while waiting for readiness
      incrementProgress = setInterval(() => {
        setProgress((prev) => Math.min(prev + 1, 99)); // Increment up to 99%
      }, 50);
    } else {
      // Smoothly transition to 100% when the page is ready
      setProgress(100);
      const timeout = setTimeout(() => {
        onLoaded(); // Notify parent component to hide the loader
      }, 500); // Allow some delay for smooth animation
      return () => clearTimeout(timeout); // Cleanup timeout
    }

    return () => clearInterval(incrementProgress); // Cleanup interval
  }, [isPageReady, onLoaded]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="text-center">
        <AnimatedCircularProgressBar
          max={100}
          min={0}
          value={progress}
          gaugePrimaryColor="hsl(var(--primary))"
          gaugeSecondaryColor="hsl(var(--muted))"
          className="mb-4"
        />
      </div>
    </div>
  );
}
