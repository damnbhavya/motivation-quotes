import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface GlowButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const GlowButton = ({ onClick, disabled, children }: GlowButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (disabled) return;

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);

    onClick();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      className={cn(
        "relative px-10 py-4",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus-visible:outline-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "border-none outline-none",
      )}
      style={{
        fontFamily: "'Caveat', cursive",
        transform: isPressed ? "scale(0.96)" : isHovered ? "scale(1.02)" : "scale(1)",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Simple hand-drawn style border */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 200 60"
        preserveAspectRatio="none"
      >
        {/* Background fill - muted warm tone */}
        <path
          d="M6,10 Q3,20 4,30 Q3,42 8,50 Q18,57 100,55 Q182,57 192,50 Q197,42 196,30 Q197,18 192,10 Q180,3 100,5 Q20,3 6,10 Z"
          fill={isHovered ? "#3d3655" : "#2d2640"}
          stroke={isHovered ? "#a78bda" : "#7c6a9a"}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "all 0.2s ease" }}
        />
        {/* Inner sketchy line */}
        <path
          d="M12,14 Q7,22 8,30 Q7,40 14,47 Q26,53 100,51 Q174,53 186,47 Q193,40 192,30 Q193,20 186,14 Q172,7 100,9 Q28,7 12,14"
          fill="none"
          stroke={isHovered ? "#c9b8e0" : "#9a8ab8"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4,3"
          opacity="0.6"
          style={{ transition: "stroke 0.2s ease" }}
        />
        {/* Subtle corner accents */}
        <circle cx="16" cy="30" r="2" fill="#a78bda" opacity={isHovered ? "0.8" : "0.4"} style={{ transition: "opacity 0.2s ease" }} />
        <circle cx="184" cy="30" r="2" fill="#a78bda" opacity={isHovered ? "0.8" : "0.4"} style={{ transition: "opacity 0.2s ease" }} />
      </svg>

      {/* Button content */}
      <span
        className="relative z-10 flex items-center gap-2 font-semibold tracking-wide"
        style={{
          color: isHovered ? "#e8dff5" : "#c9b8e0",
          fontSize: "1.4rem",
          transition: "color 0.2s ease",
        }}
      >
        {children}
      </span>

      {/* Floating doodles on hover */}
      <span
        className="absolute pointer-events-none"
        style={{
          top: "-12px",
          left: "8%",
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "translateY(0) rotate(-10deg)" : "translateY(8px) rotate(-10deg)",
          transition: "all 0.3s ease",
          fontSize: "1.1rem",
        }}
      >
        ⚡
      </span>
      <span
        className="absolute pointer-events-none"
        style={{
          top: "-10px",
          right: "12%",
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "translateY(0) rotate(15deg)" : "translateY(8px) rotate(15deg)",
          transition: "all 0.35s ease",
          fontSize: "1rem",
        }}
      >
        ✨
      </span>
      <span
        className="absolute pointer-events-none"
        style={{
          bottom: "-10px",
          left: "18%",
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "translateY(0) rotate(5deg)" : "translateY(-8px) rotate(5deg)",
          transition: "all 0.4s ease",
          fontSize: "0.9rem",
        }}
      >
        🎯
      </span>
      <span
        className="absolute pointer-events-none"
        style={{
          bottom: "-8px",
          right: "15%",
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "translateY(0) rotate(-8deg)" : "translateY(-8px) rotate(-8deg)",
          transition: "all 0.32s ease",
          fontSize: "1rem",
        }}
      >
        💥
      </span>
      <span
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "-16px",
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "translateY(-50%) translateX(0)" : "translateY(-50%) translateX(8px)",
          transition: "all 0.38s ease",
          fontSize: "0.85rem",
        }}
      >
        ★
      </span>
      <span
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          right: "-16px",
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "translateY(-50%) translateX(0)" : "translateY(-50%) translateX(-8px)",
          transition: "all 0.36s ease",
          fontSize: "0.85rem",
        }}
      >
        ★
      </span>
    </button>
  );
};

export default GlowButton;