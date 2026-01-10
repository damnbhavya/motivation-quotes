import { useState, useCallback, useRef, useEffect } from "react";

// High-quality motivational quotes
const backupQuotes = [
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Everything you've ever wanted is on the other side of fear.",
  "The only impossible journey is the one you never begin.",
  "You are never too old to set another goal or to dream a new dream.",
  "What you get by achieving your goals is not as important as what you become by achieving your goals.",
  "The best time to plant a tree was twenty years ago. The second best time is now.",
  "Your limitation is only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Don't stop when you're tired. Stop when you're done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Do something today that your future self will thank you for.",
  "Little things make big days.",
  "Stay patient and trust the journey.",
  "Every moment is a fresh beginning.",
  "Turn your wounds into wisdom.",
  "The secret of getting ahead is getting started.",
  "It always seems impossible until it's done.",
  "Act as if what you do makes a difference. It does.",
  "What we think, we become.",
  "In the middle of difficulty lies opportunity.",
  "Happiness is not something ready made. It comes from your own actions.",
  "The mind is everything. What you think you become.",
  "Strive not to be a success, but rather to be of value.",
  "The best revenge is massive success.",
  "I have not failed. I've just found ten thousand ways that won't work.",
  "A person who never made a mistake never tried anything new.",
  "The only person you are destined to become is the person you decide to be.",
];

const useQuotes = () => {
  const [currentQuote, setCurrentQuote] = useState("Press the button or hit Enter to get inspired!");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const recentQuotesRef = useRef<string[]>([]);
  const prefetchedQuoteRef = useRef<string | null>(null);

  const getRandomBackupQuote = useCallback((): string => {
    const available = backupQuotes.filter(
      (q) => !recentQuotesRef.current.includes(q)
    );
    const pool = available.length > 0 ? available : backupQuotes;
    return pool[Math.floor(Math.random() * pool.length)];
  }, []);

  const fetchQuoteFromAPI = useCallback(async (): Promise<string> => {
    try {
      const response = await fetch("https://api.quotable.io/random?tags=inspirational|motivational|success|wisdom");

      if (!response.ok) throw new Error("API failed");

      const data = await response.json();
      return data.content;
    } catch {
      // Try ZenQuotes as fallback
      try {
        const response = await fetch(
          "https://zenquotes.io/api/random"
        );

        if (!response.ok) throw new Error("Backup API failed");

        const data = await response.json();
        return data[0].q;
      } catch {
        return getRandomBackupQuote();
      }
    }
  }, [getRandomBackupQuote]);

  const prefetchNextQuote = useCallback(async () => {
    const quote = await fetchQuoteFromAPI();
    prefetchedQuoteRef.current = quote;
  }, [fetchQuoteFromAPI]);

  const getNewQuote = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    setIsAnimating(true);

    let newQuote: string;

    // Use prefetched quote if available
    if (prefetchedQuoteRef.current) {
      newQuote = prefetchedQuoteRef.current;
      prefetchedQuoteRef.current = null;
    } else {
      newQuote = await fetchQuoteFromAPI();
    }

    // Ensure we don't repeat recent quotes
    if (recentQuotesRef.current.includes(newQuote)) {
      newQuote = getRandomBackupQuote();
    }

    // Update recent quotes list (keep last 5)
    recentQuotesRef.current = [newQuote, ...recentQuotesRef.current].slice(0, 5);

    // Update quote immediately
    setCurrentQuote(newQuote);
    setIsLoading(false);

    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 250);

    // Prefetch the next quote
    prefetchNextQuote();
  }, [isLoading, fetchQuoteFromAPI, getRandomBackupQuote, prefetchNextQuote]);

  // Prefetch first quote on mount
  useEffect(() => {
    prefetchNextQuote();
  }, [prefetchNextQuote]);

  return {
    currentQuote,
    isLoading,
    isAnimating,
    getNewQuote,
  };
};

export default useQuotes;