import { useState, useCallback, useRef, useEffect } from "react";

const STORAGE_KEY = "motivation_quote_history";
const MAX_HISTORY_SIZE = 20;
const HISTORY_EXPIRY_DAYS = 7;

interface QuoteHistoryEntry {
  hash: string;
  timestamp: number;
}

// Simple hash function for quotes
const hashQuote = (quote: string): string => {
  let hash = 0;
  for (let i = 0; i < quote.length; i++) {
    const char = quote.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};

// Get quote history from localStorage
const getQuoteHistory = (): QuoteHistoryEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const history: QuoteHistoryEntry[] = JSON.parse(stored);
    const now = Date.now();
    const expiryMs = HISTORY_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    // Filter out expired entries
    return history.filter(entry => now - entry.timestamp < expiryMs);
  } catch {
    return [];
  }
};

// Save quote to history
const saveToHistory = (quote: string): void => {
  try {
    const history = getQuoteHistory();
    const hash = hashQuote(quote);

    // Don't add if already exists
    if (history.some(entry => entry.hash === hash)) return;

    const newHistory = [
      { hash, timestamp: Date.now() },
      ...history
    ].slice(0, MAX_HISTORY_SIZE);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  } catch {
    // Silently fail if localStorage is unavailable
  }
};

// Check if quote was recently shown
const isQuoteInHistory = (quote: string): boolean => {
  const history = getQuoteHistory();
  const hash = hashQuote(quote);
  return history.some(entry => entry.hash === hash);
};

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
  const prefetchedQuoteRef = useRef<string | null>(null);

  const getRandomBackupQuote = useCallback((): string => {
    // Filter out quotes that are in localStorage history
    const available = backupQuotes.filter(q => !isQuoteInHistory(q));
    const pool = available.length > 0 ? available : backupQuotes;
    return pool[Math.floor(Math.random() * pool.length)];
  }, []);

  const fetchQuoteFromAPI = useCallback(async (retries = 3): Promise<string> => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch("https://api.quotable.io/random?tags=inspirational|motivational|success|wisdom");

        if (!response.ok) throw new Error("API failed");

        const data = await response.json();
        const quote = data.content;

        // Check if quote is in history, retry if so
        if (!isQuoteInHistory(quote)) {
          return quote;
        }
      } catch {
        // Try ZenQuotes as fallback
        try {
          const response = await fetch("https://zenquotes.io/api/random");

          if (!response.ok) throw new Error("Backup API failed");

          const data = await response.json();
          const quote = data[0].q;

          // Check if quote is in history, retry if so
          if (!isQuoteInHistory(quote)) {
            return quote;
          }
        } catch {
          // Continue to next attempt or fallback
        }
      }
    }

    // All retries exhausted, use backup quote
    return getRandomBackupQuote();
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

    // Use prefetched quote if available (it's already validated)
    if (prefetchedQuoteRef.current) {
      newQuote = prefetchedQuoteRef.current;
      prefetchedQuoteRef.current = null;

      // Save to localStorage history
      saveToHistory(newQuote);

      // Update quote immediately
      setCurrentQuote(newQuote);
      setIsLoading(false);

      // Reset animation state after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 250);

      // Prefetch the next quote in background
      prefetchNextQuote();
      return;
    }

    // No prefetched quote available, fetch now (slower path)
    newQuote = await fetchQuoteFromAPI();

    // Save to localStorage history
    saveToHistory(newQuote);

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