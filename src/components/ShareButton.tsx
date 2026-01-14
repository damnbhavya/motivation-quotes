import { useState, useEffect } from "react";
import { Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  onClick: () => void;
}

const ShareButton = ({ onClick }: ShareButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "fixed bottom-6 right-6 z-30",
        "w-14 h-14 md:w-16 md:h-16",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus-visible:outline-none",
        "border-none outline-none"
      )}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isPressed
          ? "scale(0.92)"
          : isHovered
          ? "scale(1.08)"
          : isVisible
          ? "scale(1)"
          : "scale(0.8)",
        WebkitTapHighlightColor: "transparent",
      }}
      aria-label="Share quote"
    >
      {/* Hand-drawn circle border */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 64 64"
        preserveAspectRatio="none"
      >
        {/* Background fill - matching theme */}
        <path
          d="M32,4 Q50,3 58,12 Q64,22 63,32 Q64,44 58,52 Q48,62 32,60 Q14,62 6,52 Q1,42 2,32 Q1,20 6,12 Q16,2 32,4 Z"
          fill={isHovered ? "#3d3655" : "#2d2640"}
          stroke={isHovered ? "#a78bda" : "#7c6a9a"}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "all 0.2s ease" }}
        />
        {/* Inner sketchy circle */}
        <path
          d="M32,8 Q46,7 54,14 Q59,22 58,32 Q59,42 54,50 Q44,57 32,56 Q18,57 10,50 Q5,42 6,32 Q5,20 10,14 Q20,6 32,8"
          fill="none"
          stroke={isHovered ? "#c9b8e0" : "#9a8ab8"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="3,2"
          opacity="0.6"
          style={{ transition: "stroke 0.2s ease" }}
        />
        {/* Decorative dots */}
        <circle
          cx="12"
          cy="20"
          r="2"
          fill="#fbbf24"
          opacity={isHovered ? 0.9 : 0.5}
          style={{ transition: "opacity 0.2s ease" }}
        />
        <circle
          cx="52"
          cy="44"
          r="1.8"
          fill="#f472b6"
          opacity={isHovered ? 0.9 : 0.5}
          style={{ transition: "opacity 0.2s ease" }}
        />
      </svg>

      {/* Icon */}
      <span
        className="relative z-10 flex items-center justify-center w-full h-full"
        style={{
          color: isHovered ? "#e8dff5" : "#c9b8e0",
          transition: "color 0.2s ease",
        }}
      >
        <Share2 className="w-6 h-6 md:w-7 md:h-7" />
      </span>

      {/* Floating decorations on hover */}
      <span
        className="absolute pointer-events-none"
        style={{
          top: "-8px",
          left: "50%",
          transform: isHovered
            ? "translateX(-50%) translateY(0) rotate(-10deg)"
            : "translateX(-50%) translateY(6px) rotate(-10deg)",
          opacity: isHovered ? 1 : 0,
          transition: "all 0.3s ease",
          fontSize: "0.9rem",
        }}
      >
        ✨
      </span>
      <span
        className="absolute pointer-events-none"
        style={{
          bottom: "-6px",
          right: "-4px",
          transform: isHovered
            ? "translateY(0) rotate(10deg)"
            : "translateY(-6px) rotate(10deg)",
          opacity: isHovered ? 1 : 0,
          transition: "all 0.35s ease",
          fontSize: "0.8rem",
        }}
      >
        💜
      </span>
      <span
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "-10px",
          transform: isHovered
            ? "translateY(-50%) translateX(0)"
            : "translateY(-50%) translateX(6px)",
          opacity: isHovered ? 1 : 0,
          transition: "all 0.32s ease",
          fontSize: "0.7rem",
        }}
      >
        ★
      </span>
    </button>
  );
};

export default ShareButton;
