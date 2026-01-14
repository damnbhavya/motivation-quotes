import { useCallback } from "react";
import {
  DOODLE_COLORS,
  DOODLE_TYPES,
  DoodleType,
  drawDoodleShape,
} from "@/lib/doodleUtils";

interface ShareImageOptions {
  quote: string;
  aspectRatio?: "1:1" | "9:16";
}

const useShareImage = () => {
  const generateImage = useCallback(
    async ({ quote, aspectRatio = "1:1" }: ShareImageOptions): Promise<Blob> => {
      // Canvas dimensions based on aspect ratio
      const width = aspectRatio === "1:1" ? 1080 : 1080;
      const height = aspectRatio === "1:1" ? 1080 : 1920;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;

      // Background gradient (matching the theme)
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#1a1625");
      gradient.addColorStop(0.5, "#2d2640");
      gradient.addColorStop(1, "#1a1a2e");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Add subtle pattern overlay
      ctx.globalAlpha = 0.03;
      for (let i = 0; i < 100; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? "#a78bda" : "#f472b6";
        ctx.beginPath();
        ctx.arc(
          Math.random() * width,
          Math.random() * height,
          Math.random() * 3 + 1,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw decorative doodles
      drawDoodles(ctx, width, height);

      // Draw hand-drawn border
      drawHandDrawnBorder(ctx, width, height);

      // Draw quote text
      await drawQuoteText(ctx, quote, width, height);

      // Draw branding
      drawBranding(ctx, width, height);

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, "image/png");
      });
    },
    []
  );

  const drawDoodles = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const doodleSize = width * 0.035;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Doodle types for share image (excludes circle and triangle for cleaner look)
    const shareImageDoodleTypes: DoodleType[] = [
      "star", "heart", "spiral", "zigzag", "smiley",
      "lightning", "cloud", "diamond", "squiggle", "burst"
    ];

    // Define exclusion zones (quote area in center, branding at bottom)
    const quoteZone = {
      left: width * 0.1,
      right: width * 0.9,
      top: height * 0.25,
      bottom: height * 0.75,
    };
    const brandingZone = {
      left: width * 0.2,
      right: width * 0.8,
      top: height - width * 0.18,
      bottom: height - width * 0.06,
    };

    const isInExclusionZone = (x: number, y: number): boolean => {
      if (x >= quoteZone.left && x <= quoteZone.right &&
          y >= quoteZone.top && y <= quoteZone.bottom) {
        return true;
      }
      if (x >= brandingZone.left && x <= brandingZone.right &&
          y >= brandingZone.top && y <= brandingZone.bottom) {
        return true;
      }
      return false;
    };

    // Grid-based distribution for even spread
    const numDoodles = Math.floor(height / width * 10) + 8;
    const doodleConfigs: { x: number; y: number; type: DoodleType; rotation: number; size: number }[] = [];

    const cols = 4;
    const rows = Math.ceil(numDoodles / cols);
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    let doodleIndex = 0;
    for (let row = 0; row < rows && doodleIndex < numDoodles; row++) {
      for (let col = 0; col < cols && doodleIndex < numDoodles; col++) {
        const padding = 0.2;
        const x = cellWidth * col + cellWidth * (padding + Math.random() * (1 - 2 * padding));
        const y = cellHeight * row + cellHeight * (padding + Math.random() * (1 - 2 * padding));

        if (!isInExclusionZone(x, y)) {
          doodleConfigs.push({
            x,
            y,
            type: shareImageDoodleTypes[Math.floor(Math.random() * shareImageDoodleTypes.length)],
            rotation: (Math.random() - 0.5) * 0.6,
            size: doodleSize * (0.6 + Math.random() * 0.8),
          });
        }
        doodleIndex++;
      }
    }

    doodleConfigs.forEach((config, i) => {
      ctx.save();
      ctx.translate(config.x, config.y);
      ctx.rotate(config.rotation);
      ctx.strokeStyle = DOODLE_COLORS[i % DOODLE_COLORS.length];
      ctx.fillStyle = DOODLE_COLORS[i % DOODLE_COLORS.length];
      ctx.globalAlpha = 0.18 + Math.random() * 0.12;

      const size = config.size || doodleSize;
      const action = drawDoodleShape(ctx, config.type, size);
      if (action === "stroke") ctx.stroke();
      else if (action === "fill") ctx.fill();

      ctx.restore();
    });

    ctx.globalAlpha = 1;
  };

  const drawHandDrawnBorder = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const padding = width * 0.06;
    const cornerRadius = width * 0.04;

    ctx.strokeStyle = "#a78bda";
    ctx.lineWidth = width * 0.005;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Helper to draw a wavy line between two points
    const drawWavyLine = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      segments: number = 8,
      shouldMoveTo: boolean = false
    ) => {
      const dx = (x2 - x1) / segments;
      const dy = (y2 - y1) / segments;
      const wobbleAmount = width * 0.004;

      if (shouldMoveTo) {
        ctx.moveTo(x1, y1);
      }
      for (let i = 1; i <= segments; i++) {
        const wobbleX = (Math.random() - 0.5) * wobbleAmount;
        const wobbleY = (Math.random() - 0.5) * wobbleAmount;
        ctx.lineTo(x1 + dx * i + wobbleX, y1 + dy * i + wobbleY);
      }
    };

    // Helper to draw a wobbly curved corner
    const drawWobblyCorner = (
      cx: number,
      cy: number,
      startAngle: number,
      endAngle: number,
      radius: number
    ) => {
      const segments = 6;
      const angleStep = (endAngle - startAngle) / segments;
      const wobbleAmount = width * 0.003;

      for (let i = 1; i <= segments; i++) {
        const angle = startAngle + angleStep * i;
        const wobble = (Math.random() - 0.5) * wobbleAmount;
        const x = cx + Math.cos(angle) * (radius + wobble);
        const y = cy + Math.sin(angle) * (radius + wobble);
        ctx.lineTo(x, y);
      }
    };

    // Draw outer hand-drawn border with rounded corners
    ctx.beginPath();

    // Start from top-left after corner
    ctx.moveTo(padding + cornerRadius, padding);

    // Top edge
    drawWavyLine(padding + cornerRadius, padding, width - padding - cornerRadius, padding, 10);
    // Top-right corner
    drawWobblyCorner(width - padding - cornerRadius, padding + cornerRadius, -Math.PI / 2, 0, cornerRadius);
    // Right edge
    drawWavyLine(width - padding, padding + cornerRadius, width - padding, height - padding - cornerRadius, 10);
    // Bottom-right corner
    drawWobblyCorner(width - padding - cornerRadius, height - padding - cornerRadius, 0, Math.PI / 2, cornerRadius);
    // Bottom edge
    drawWavyLine(width - padding - cornerRadius, height - padding, padding + cornerRadius, height - padding, 10);
    // Bottom-left corner
    drawWobblyCorner(padding + cornerRadius, height - padding - cornerRadius, Math.PI / 2, Math.PI, cornerRadius);
    // Left edge
    drawWavyLine(padding, height - padding - cornerRadius, padding, padding + cornerRadius, 10);
    // Top-left corner
    drawWobblyCorner(padding + cornerRadius, padding + cornerRadius, Math.PI, Math.PI * 1.5, cornerRadius);

    ctx.closePath();
    ctx.stroke();

    // Inner dashed border - also hand-drawn with rounded corners
    ctx.setLineDash([width * 0.012, width * 0.008]);
    ctx.strokeStyle = "#c9b8e0";
    ctx.lineWidth = width * 0.003;
    ctx.globalAlpha = 0.5;

    const innerPadding = padding + width * 0.025;
    const innerCornerRadius = cornerRadius * 0.7;

    ctx.beginPath();

    // Start from top-left after corner
    ctx.moveTo(innerPadding + innerCornerRadius, innerPadding);

    // Top edge
    drawWavyLine(innerPadding + innerCornerRadius, innerPadding, width - innerPadding - innerCornerRadius, innerPadding, 8);
    // Top-right corner
    drawWobblyCorner(width - innerPadding - innerCornerRadius, innerPadding + innerCornerRadius, -Math.PI / 2, 0, innerCornerRadius);
    // Right edge
    drawWavyLine(width - innerPadding, innerPadding + innerCornerRadius, width - innerPadding, height - innerPadding - innerCornerRadius, 8);
    // Bottom-right corner
    drawWobblyCorner(width - innerPadding - innerCornerRadius, height - innerPadding - innerCornerRadius, 0, Math.PI / 2, innerCornerRadius);
    // Bottom edge
    drawWavyLine(width - innerPadding - innerCornerRadius, height - innerPadding, innerPadding + innerCornerRadius, height - innerPadding, 8);
    // Bottom-left corner
    drawWobblyCorner(innerPadding + innerCornerRadius, height - innerPadding - innerCornerRadius, Math.PI / 2, Math.PI, innerCornerRadius);
    // Left edge
    drawWavyLine(innerPadding, height - innerPadding - innerCornerRadius, innerPadding, innerPadding + innerCornerRadius, 8);
    // Top-left corner
    drawWobblyCorner(innerPadding + innerCornerRadius, innerPadding + innerCornerRadius, Math.PI, Math.PI * 1.5, innerCornerRadius);

    ctx.closePath();
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    // Add corner decorations (small doodles at corners)
    const cornerDoodles = [
      { x: padding + width * 0.025, y: padding + width * 0.035, emoji: "✦" },
      { x: width - padding - width * 0.035, y: padding + width * 0.035, emoji: "✧" },
      { x: padding + width * 0.025, y: height - padding - width * 0.015, emoji: "✧" },
      { x: width - padding - width * 0.035, y: height - padding - width * 0.015, emoji: "✦" },
    ];

    ctx.font = `${width * 0.025}px serif`;
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = "#a78bda";
    cornerDoodles.forEach((doodle) => {
      ctx.fillText(doodle.emoji, doodle.x, doodle.y);
    });
    ctx.globalAlpha = 1;
  };

  const drawQuoteText = async (
    ctx: CanvasRenderingContext2D,
    quote: string,
    width: number,
    height: number
  ) => {
    // Load Caveat font
    const font = new FontFace(
      "Caveat",
      "url(https://fonts.gstatic.com/s/caveat/v18/WnznHAc5bAfYB2QRah7pcpNvOx-pjfJ9SIKjYBxPigs.woff2)"
    );

    try {
      await font.load();
      document.fonts.add(font);
    } catch (e) {
      // Fallback to cursive if font fails to load
    }

    const fontSize = width * 0.065;
    ctx.font = `700 ${fontSize}px Caveat, cursive`;
    ctx.fillStyle = "#e8dff5";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Word wrap
    const maxWidth = width * 0.75;
    const words = quote.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);

    const lineHeight = fontSize * 1.4;
    const totalHeight = lines.length * lineHeight;
    const startY = height / 2 - totalHeight / 2 + lineHeight / 2;

    // Draw text shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    lines.forEach((line, i) => {
      ctx.fillText(line, width / 2 + 3, startY + i * lineHeight + 3);
    });

    // Draw main text
    ctx.fillStyle = "#e8dff5";
    lines.forEach((line, i) => {
      ctx.fillText(line, width / 2, startY + i * lineHeight);
    });
  };

  const drawBranding = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const fontSize = width * 0.032;
    ctx.font = `${fontSize}px Caveat, cursive`;
    ctx.fillStyle = "#a78bda";
    ctx.globalAlpha = 0.8;
    ctx.textAlign = "center";
    // Position branding well inside the border (border padding is 0.06, so use 0.12 from bottom)
    ctx.fillText("dailydoseofmotivation.app", width / 2, height - width * 0.12);
    ctx.globalAlpha = 1;
  };

  const downloadImage = useCallback(async (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const shareImage = useCallback(
    async (blob: Blob, quote: string): Promise<boolean> => {
      if (!navigator.share || !navigator.canShare) {
        return false;
      }

      const file = new File([blob], "motivation-quote.png", { type: "image/png" });

      if (!navigator.canShare({ files: [file] })) {
        return false;
      }

      try {
        await navigator.share({
          title: "Daily Dose of Motivation",
          text: quote,
          files: [file],
        });
        return true;
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Share failed:", error);
        }
        return false;
      }
    },
    []
  );

  const isMobile = useCallback(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }, []);

  const canShare = useCallback(() => {
    return !!navigator.share && !!navigator.canShare;
  }, []);

  return {
    generateImage,
    downloadImage,
    shareImage,
    isMobile,
    canShare,
  };
};

export default useShareImage;
