import { useEffect, useCallback } from "react";
import { Sparkles } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import QuoteDisplay from "@/components/QuoteDisplay";
import GlowButton from "@/components/GlowButton";
import useQuotes from "@/hooks/useQuotes";
import useQuoteSound from "@/hooks/useQuoteSound";

const Index = () => {
  const { currentQuote, isLoading, isAnimating, getNewQuote } = useQuotes();
  const { playSound } = useQuoteSound();

  const handleNewQuote = useCallback(() => {
    playSound();
    getNewQuote();
  }, [playSound, getNewQuote]);

  // Keyboard support - Enter key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isLoading) {
        e.preventDefault();
        handleNewQuote();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNewQuote, isLoading]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <AnimatedBackground />

      {/* Grain overlay for cinematic feel */}
      <div className="grain-overlay" />

      {/* Sticker-style header in top left */}
      <header
        className="absolute top-6 left-6 z-20"
        style={{
          fontFamily: "'Caveat', cursive",
        }}
      >
        <div
          className="relative px-6 py-4"
          style={{
            transform: "rotate(-2deg)",
          }}
        >
          {/* Hand-drawn border SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 180 70"
            preserveAspectRatio="none"
          >
            {/* Transparent fill with sketchy border */}
            <path
              d="M8,12 Q2,20 5,35 Q2,52 10,60 Q22,68 90,66 Q158,68 170,60 Q178,52 175,35 Q178,18 170,10 Q156,2 90,5 Q24,2 8,12 Z"
              fill="rgba(45, 38, 64, 0.4)"
              stroke="#a78bda"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Inner sketchy line */}
            <path
              d="M12,15 Q6,24 8,35 Q6,48 14,56 Q28,63 90,61 Q152,63 166,56 Q174,48 172,35 Q174,22 166,14 Q150,6 90,9 Q30,6 12,15"
              fill="none"
              stroke="#c9b8e0"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="4,3"
              opacity="0.5"
            />
            {/* Decorative doodles */}
            <circle cx="18" cy="20" r="3" fill="#fbbf24" opacity="0.7" />
            <circle cx="162" cy="50" r="2.5" fill="#f472b6" opacity="0.7" />
            <path d="M22,50 L26,46 L30,52 L34,44" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            <path d="M150,18 Q154,14 158,18" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          </svg>

          {/* Title content */}
          <div className="relative z-10 text-center">
            <span
              className="block tracking-wide text-purple-300/70"
              style={{ fontSize: "0.9rem" }}
            >
              daily dose of
            </span>
            <span
              className="block text-3xl font-bold text-purple-100 -mt-0.5"
              style={{
                letterSpacing: "0.02em",
              }}
            >
              Motivation 🚀
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center gap-12 md:gap-12 px-4 py-16 w-full max-w-5xl">

        {/* Quote display */}
        <QuoteDisplay quote={currentQuote} isAnimating={isAnimating} />

        {/* Action button */}
        <div className="mt-4 md:mt-0">
          <GlowButton onClick={handleNewQuote} disabled={isLoading}>
            <Sparkles className="w-5 h-5" />
            Inspire me
          </GlowButton>
        </div>
      </main>
    </div>
  );
};

export default Index;
