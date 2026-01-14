import { useState, useEffect, useCallback } from "react";
import { X, Download, Share2 } from "lucide-react";
import useShareImage from "@/hooks/useShareImage";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: string;
}

const ShareModal = ({ isOpen, onClose, quote }: ShareModalProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentBlob, setCurrentBlob] = useState<Blob | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const { generateImage, downloadImage, shareImage, isMobile, canShare } =
    useShareImage();

  const generatePreview = useCallback(async () => {
    setIsGenerating(true);
    try {
      const blob = await generateImage({ quote, aspectRatio: "1:1" });
      setCurrentBlob(blob);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (error) {
      console.error("Failed to generate image:", error);
    }
    setIsGenerating(false);
  }, [generateImage, quote]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
      if (quote) generatePreview();
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, quote, generatePreview]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleDownload = async () => {
    if (currentBlob) {
      await downloadImage(currentBlob, "motivation-quote.png");
    }
  };

  const handleShare = async () => {
    if (!currentBlob) return;

    // Try to share with 9:16 ratio for stories
    // The Web Share API doesn't tell us which app was selected,
    // so we generate a 9:16 image which works well for most social media stories
    // and is also acceptable for regular sharing
    setIsGenerating(true);
    try {
      const storyBlob = await generateImage({ quote, aspectRatio: "9:16" });
      const shared = await shareImage(storyBlob, quote);
      if (!shared) {
        // Fallback to 1:1 if 9:16 share fails
        await shareImage(currentBlob, quote);
      }
    } catch (error) {
      console.error("Share failed:", error);
      // Try sharing the 1:1 version as fallback
      await shareImage(currentBlob, quote);
    }
    setIsGenerating(false);
  };

  if (!shouldRender) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-200"
        style={{ opacity: isVisible ? 1 : 0 }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
        style={{
          fontFamily: "'Caveat', cursive",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "scale(1) translateY(0)" : "scale(0.95) translateY(10px)",
        }}
      >
        {/* Hand-drawn border container */}
        <div className="relative p-6 rounded-lg">
          {/* SVG Border */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 400 500"
            preserveAspectRatio="none"
          >
            {/* Background fill */}
            <path
              d="M10,15 Q5,30 8,250 Q5,470 15,485 Q30,495 200,492 Q370,495 385,485 Q395,470 392,250 Q395,30 385,15 Q368,5 200,8 Q32,5 10,15 Z"
              fill="rgba(45, 38, 64, 0.95)"
              stroke="#a78bda"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Inner decorative border */}
            <path
              d="M18,22 Q12,38 15,250 Q12,462 22,477 Q38,487 200,484 Q362,487 378,477 Q388,462 385,250 Q388,38 378,22 Q360,12 200,15 Q40,12 18,22"
              fill="none"
              stroke="#c9b8e0"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="6,4"
              opacity="0.4"
            />
            {/* Corner decorations */}
            <circle cx="25" cy="28" r="4" fill="#fbbf24" opacity="0.7" />
            <circle cx="375" cy="472" r="3.5" fill="#f472b6" opacity="0.7" />
            <path
              d="M365,25 Q372,18 378,25"
              fill="none"
              stroke="#34d399"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />
            <path
              d="M25,465 L30,458 L35,468"
              fill="none"
              stroke="#a78bfa"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />
          </svg>

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-2xl font-bold text-purple-200"
                style={{ letterSpacing: "0.02em" }}
              >
                Share your motivation ✨
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-purple-900/50 transition-colors"
              >
                <X className="w-5 h-5 text-purple-300" />
              </button>
            </div>

            {/* Preview */}
            <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-6 bg-purple-900/30">
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col">
                  {/* Skeleton loading */}
                  <div className="flex-1 p-6 flex flex-col">
                    {/* Top doodles skeleton */}
                    <div className="flex justify-between mb-4">
                      <div className="w-8 h-8 rounded-full bg-purple-700/40 animate-pulse" />
                      <div className="w-6 h-6 rounded-full bg-purple-700/40 animate-pulse" style={{ animationDelay: '0.1s' }} />
                    </div>

                    {/* Quote text skeleton lines */}
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8">
                      <div className="w-full h-6 rounded-full bg-purple-600/30 animate-pulse" />
                      <div className="w-4/5 h-6 rounded-full bg-purple-600/30 animate-pulse" style={{ animationDelay: '0.15s' }} />
                      <div className="w-11/12 h-6 rounded-full bg-purple-600/30 animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-3/5 h-6 rounded-full bg-purple-600/30 animate-pulse" style={{ animationDelay: '0.25s' }} />
                    </div>

                    {/* Bottom branding skeleton */}
                    <div className="flex justify-center mt-4">
                      <div className="w-32 h-4 rounded-full bg-purple-700/40 animate-pulse" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>

                  {/* Border skeleton */}
                  <div className="absolute inset-4 border-2 border-purple-700/30 rounded-lg animate-pulse" />

                  {/* Corner doodle skeletons */}
                  <div className="absolute bottom-6 left-6 w-5 h-5 rounded-full bg-purple-700/30 animate-pulse" style={{ animationDelay: '0.35s' }} />
                  <div className="absolute bottom-6 right-6 w-4 h-4 rounded-full bg-purple-700/30 animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Quote preview"
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>

            {/* Action buttons */}
            <div className="flex gap-4">
              {isMobile() && canShare() && (
                <button
                  onClick={handleShare}
                  disabled={isGenerating || !currentBlob}
                  className="flex-1 relative py-4 px-6 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                >
                  {/* Hand-drawn button border */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 150 50"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M5,8 Q2,15 4,25 Q2,38 8,44 Q18,48 75,46 Q132,48 142,44 Q148,38 146,25 Q148,12 142,8 Q130,2 75,4 Q20,2 5,8 Z"
                      fill="#7c3aed"
                      stroke="#a78bda"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10,12 Q6,18 8,25 Q6,34 12,40 Q24,45 75,43 Q126,45 138,40 Q144,34 142,25 Q144,16 138,12 Q124,6 75,8 Q26,6 10,12"
                      fill="none"
                      stroke="#c9b8e0"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeDasharray="3,2"
                      opacity="0.4"
                    />
                  </svg>
                  <span className="relative z-10 flex items-center justify-center gap-2 text-white" style={{ fontSize: "1.3rem" }}>
                    <Share2 className="w-5 h-5" />
                    Share
                  </span>
                </button>
              )}
              <button
                onClick={handleDownload}
                disabled={isGenerating || !currentBlob}
                className={`${
                  isMobile() && canShare() ? "flex-1" : "w-full"
                } relative py-4 px-6 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]`}
              >
                {/* Hand-drawn button border */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 150 50"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M5,8 Q2,15 4,25 Q2,38 8,44 Q18,48 75,46 Q132,48 142,44 Q148,38 146,25 Q148,12 142,8 Q130,2 75,4 Q20,2 5,8 Z"
                    fill={isMobile() && canShare() ? "#2d2640" : "#7c3aed"}
                    stroke="#a78bda"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10,12 Q6,18 8,25 Q6,34 12,40 Q24,45 75,43 Q126,45 138,40 Q144,34 142,25 Q144,16 138,12 Q124,6 75,8 Q26,6 10,12"
                    fill="none"
                    stroke="#c9b8e0"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeDasharray="3,2"
                    opacity="0.4"
                  />
                </svg>
                <span className="relative z-10 flex items-center justify-center gap-2" style={{ fontSize: "1.3rem", color: "#e8dff5" }}>
                  <Download className="w-5 h-5" />
                  Download
                </span>
              </button>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
