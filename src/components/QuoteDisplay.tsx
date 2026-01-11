import { useEffect, useState, useRef } from "react";

interface QuoteDisplayProps {
  quote: string;
  isAnimating: boolean;
}

const QuoteDisplay = ({ quote, isAnimating }: QuoteDisplayProps) => {
  const [displayedQuote, setDisplayedQuote] = useState(quote);
  const [isVisible, setIsVisible] = useState(true);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip animation on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayedQuote(quote);
      return;
    }

    if (isAnimating) {
      // Fade out
      setIsVisible(false);

      // Wait for fade out, then update quote and fade in
      const timer = setTimeout(() => {
        setDisplayedQuote(quote);
        // Small delay before fading in for smoother transition
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      }, 200);

      return () => clearTimeout(timer);
    } else {
      // If not animating but quote changed, just update it
      setDisplayedQuote(quote);
    }
  }, [quote, isAnimating]);

  return (
    <div className="relative min-h-[180px] flex items-center justify-center px-6 md:px-16">
      <p
        className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-center max-w-4xl"
        style={{
          fontFamily: "'Segoe Print', 'Bradley Hand', 'Comic Neue', cursive",
          color: "#e8dff5",
          textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          lineHeight: "1.6",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
        }}
      >
        {displayedQuote}
      </p>
    </div>
  );
};

export default QuoteDisplay;