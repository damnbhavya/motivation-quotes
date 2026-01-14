import { useCallback, useRef } from "react";

const useQuoteSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = useCallback(() => {
    try {
      // Create or reuse AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;

      // Resume if suspended (browser autoplay policy)
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const currentTime = ctx.currentTime;

      // Create a gentle, inspiring chime sound
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Connect nodes
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      osc3.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Configure oscillators for a soft, uplifting chime (C major chord)
      osc1.frequency.setValueAtTime(523.25, currentTime); // C5
      osc1.type = "sine";

      osc2.frequency.setValueAtTime(659.25, currentTime); // E5
      osc2.type = "sine";

      osc3.frequency.setValueAtTime(783.99, currentTime); // G5
      osc3.type = "sine";

      // Soft volume envelope - gentle attack, long smooth decay
      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.6);

      // Start and stop
      osc1.start(currentTime);
      osc2.start(currentTime + 0.02);
      osc3.start(currentTime + 0.04);
      osc1.stop(currentTime + 0.6);
      osc2.stop(currentTime + 0.6);
      osc3.stop(currentTime + 0.6);
    } catch (error) {
      // Silently fail if audio isn't available
      console.log("Audio not available");
    }
  }, []);

  return { playSound };
};

export default useQuoteSound;