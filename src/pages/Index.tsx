import { useEffect, useCallback, useState, useRef } from "react";
import { Sparkles } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import QuoteDisplay from "@/components/QuoteDisplay";
import GlowButton from "@/components/GlowButton";
import ShareButton from "@/components/ShareButton";
import ShareModal from "@/components/ShareModal";
import useQuotes from "@/hooks/useQuotes";
import useQuoteSound from "@/hooks/useQuoteSound";

const cooldownMessages = [
  "Whoa there, speed racer! Let the wisdom sink in first.",
  "Take a deep breath... Good things come to those who wait.",
  "Easy tiger! Your motivation isn't going anywhere.",
  "Slow down, you're gonna get a motivation overdose!",
  "The universe is typing... Please hold.",
  "Chill mode activated. Breathe in... breathe out...",
  "Too fast! Even rockets need a countdown",
];

const Index = () => {
  const { currentQuote, isLoading, isAnimating, getNewQuote } = useQuotes();
  const { playSound } = useQuoteSound();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [hasGeneratedQuote, setHasGeneratedQuote] = useState(false);
  const [cooldownMessage, setCooldownMessage] = useState<string | null>(null);
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const clickTimestamps = useRef<number[]>([]);
  const cooldownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNewQuote = useCallback(() => {
    if (isOnCooldown) {
      const randomMessage = cooldownMessages[Math.floor(Math.random() * cooldownMessages.length)];
      setCooldownMessage(randomMessage);

      if (cooldownTimeoutRef.current) {
        clearTimeout(cooldownTimeoutRef.current);
      }
      cooldownTimeoutRef.current = setTimeout(() => {
        setCooldownMessage(null);
        setIsOnCooldown(false);
      }, 3000);
      return;
    }

    const now = Date.now();
    clickTimestamps.current = [...clickTimestamps.current.filter(t => now - t < 2500), now];

    if (clickTimestamps.current.length > 3) {
      const randomMessage = cooldownMessages[Math.floor(Math.random() * cooldownMessages.length)];
      setCooldownMessage(randomMessage);
      setIsOnCooldown(true);
      clickTimestamps.current = [];

      cooldownTimeoutRef.current = setTimeout(() => {
        setCooldownMessage(null);
        setIsOnCooldown(false);
      }, 3000);
      return;
    }

    if (isLoading) return;

    playSound();
    getNewQuote();
    setHasGeneratedQuote(true);
  }, [playSound, getNewQuote, isLoading, isOnCooldown]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isLoading && !isOnCooldown) {
        e.preventDefault();
        handleNewQuote();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNewQuote, isLoading, isOnCooldown]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <AnimatedBackground />
      <div className="grain-overlay" />

      <header
        className="absolute top-4 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 z-20 scale-75 md:scale-100 origin-top"
        style={{ fontFamily: "'Caveat', cursive" }}
      >
        <div className="relative px-6 py-4">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 180 70"
            preserveAspectRatio="none"
          >
            <path
              d="M8,12 Q2,20 5,35 Q2,52 10,60 Q22,68 90,66 Q158,68 170,60 Q178,52 175,35 Q178,18 170,10 Q156,2 90,5 Q24,2 8,12 Z"
              fill="rgba(45, 38, 64, 0.4)"
              stroke="#a78bda"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12,15 Q6,24 8,35 Q6,48 14,56 Q28,63 90,61 Q152,63 166,56 Q174,48 172,35 Q174,22 166,14 Q150,6 90,9 Q30,6 12,15"
              fill="none"
              stroke="#c9b8e0"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="4,3"
              opacity="0.5"
            />
            <circle cx="18" cy="20" r="3" fill="#fbbf24" opacity="0.7" />
            <circle cx="162" cy="50" r="2.5" fill="#f472b6" opacity="0.7" />
            <path d="M22,50 L26,46 L30,52 L34,44" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            <path d="M150,18 Q154,14 158,18" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          </svg>

          <div className="relative z-10 text-center whitespace-nowrap">
            <span className="block tracking-wide text-purple-300/70" style={{ fontSize: "0.9rem" }}>
              daily dose of
            </span>
            <span
              className="block text-3xl font-bold text-purple-100 -mt-0.5"
              style={{ letterSpacing: "0.02em" }}
            >
              Motivation
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center gap-12 md:gap-12 px-4 py-16 w-full max-w-5xl">
        <QuoteDisplay quote={currentQuote} isAnimating={isAnimating} />

        <div
          className="mt-4 md:mt-0 transition-all duration-300"
          style={{
            opacity: isLoading || isOnCooldown ? 0 : 1,
            transform: `scale(${isLoading || isOnCooldown ? 0.95 : 1})`,
            pointerEvents: isLoading || isOnCooldown ? "none" : "auto",
          }}
        >
          <GlowButton onClick={handleNewQuote} disabled={isLoading || isOnCooldown}>
            <Sparkles className="w-5 h-5" />
            Inspire me
          </GlowButton>
        </div>

        <div
          className="fixed left-1/2 top-1/2 z-40 w-[90%] max-w-sm transition-all duration-300"
          style={{
            opacity: cooldownMessage ? 1 : 0,
            transform: `translate(-50%, -50%) scale(${cooldownMessage ? 1 : 0.95})`,
            pointerEvents: cooldownMessage ? "auto" : "none",
          }}
        >
          <div
            className="px-5 py-4 rounded-2xl text-center"
            style={{
              background: "rgba(45, 38, 64, 0.95)",
              border: "2px solid #a78bda",
              fontFamily: "'Caveat', cursive",
              fontSize: "1.4rem",
              color: "#e8dff5",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)",
            }}
          >
            {cooldownMessage}
          </div>
        </div>
      </main>

      {hasGeneratedQuote && (
        <ShareButton onClick={() => setIsShareModalOpen(true)} />
      )}

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        quote={currentQuote}
      />

      <footer className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30">
        <p className="text-sm text-white/40" style={{ fontFamily: "'Caveat', cursive" }}>
          made with ♡ by bhavya
        </p>
      </footer>
    </div>
  );
};

export default Index;
