import { useEffect, useRef } from "react";
<<<<<<< HEAD
import {
  DOODLE_COLORS,
  DOODLE_TYPES,
  DoodleType,
  drawDoodleShape,
} from "@/lib/doodleUtils";
=======
>>>>>>> bb85232e51518b754e77f798bfd784280e3815f9

interface Doodle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
<<<<<<< HEAD
  type: DoodleType;
=======
  type: string;
>>>>>>> bb85232e51518b754e77f798bfd784280e3815f9
  color: string;
  floatPhase: number;
  floatSpeed: number;
  floatAmplitude: number;
  opacity: number;
}

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

<<<<<<< HEAD
=======
    // Comic colors palette
    const colors = [
      "#FF6B9D", // Pink
      "#C44DFF", // Purple
      "#4DFFFF", // Cyan
      "#FFE66D", // Yellow
      "#FF8B4D", // Orange
      "#7BFF4D", // Green
    ];

    // Doodle types
    const doodleTypes = [
      "star", "heart", "spiral", "zigzag", "circle", "triangle",
      "smiley", "lightning", "cloud", "diamond", "squiggle", "burst"
    ];

>>>>>>> bb85232e51518b754e77f798bfd784280e3815f9
    // Create doodles - adjust size and count for mobile screens
    const doodles: Doodle[] = [];
    const isMobile = canvas.width < 768;
    const numDoodles = isMobile ? 20 : 35;
    const minSize = isMobile ? 8 : 15;
    const sizeRange = isMobile ? 18 : 35;
    const floatAmpMin = isMobile ? 5 : 10;
    const floatAmpRange = isMobile ? 10 : 20;

    for (let i = 0; i < numDoodles; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      doodles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        size: minSize + Math.random() * sizeRange,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
<<<<<<< HEAD
        type: DOODLE_TYPES[Math.floor(Math.random() * DOODLE_TYPES.length)],
        color: DOODLE_COLORS[Math.floor(Math.random() * DOODLE_COLORS.length)],
=======
        type: doodleTypes[Math.floor(Math.random() * doodleTypes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
>>>>>>> bb85232e51518b754e77f798bfd784280e3815f9
        floatPhase: Math.random() * Math.PI * 2,
        floatSpeed: 0.3 + Math.random() * 0.5,
        floatAmplitude: floatAmpMin + Math.random() * floatAmpRange,
        opacity: 0.15 + Math.random() * 0.25,
      });
    }

<<<<<<< HEAD
=======
    // Drawing functions for each doodle type
    const drawStar = (ctx: CanvasRenderingContext2D, size: number) => {
      const spikes = 5;
      const outerRadius = size;
      const innerRadius = size * 0.5;
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    const drawHeart = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      ctx.moveTo(0, size * 0.3);
      ctx.bezierCurveTo(-size, -size * 0.3, -size * 0.5, -size, 0, -size * 0.5);
      ctx.bezierCurveTo(size * 0.5, -size, size, -size * 0.3, 0, size * 0.3);
      ctx.closePath();
    };

    const drawSpiral = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 720; i += 15) {
        const angle = (i * Math.PI) / 180;
        const radius = (i / 720) * size;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
    };

    const drawZigzag = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      ctx.moveTo(-size, 0);
      for (let i = 0; i < 5; i++) {
        const x = -size + (i + 0.5) * (size * 2) / 5;
        const y = (i % 2 === 0 ? -1 : 1) * size * 0.4;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(size, 0);
    };

    const drawSmiley = (ctx: CanvasRenderingContext2D, size: number) => {
      // Face
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.stroke();
      // Eyes
      ctx.beginPath();
      ctx.arc(-size * 0.35, -size * 0.2, size * 0.12, 0, Math.PI * 2);
      ctx.arc(size * 0.35, -size * 0.2, size * 0.12, 0, Math.PI * 2);
      ctx.fill();
      // Smile
      ctx.beginPath();
      ctx.arc(0, size * 0.1, size * 0.5, 0.2, Math.PI - 0.2);
      ctx.stroke();
    };

    const drawLightning = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      ctx.moveTo(size * 0.2, -size);
      ctx.lineTo(-size * 0.3, -size * 0.1);
      ctx.lineTo(size * 0.1, -size * 0.1);
      ctx.lineTo(-size * 0.2, size);
      ctx.lineTo(size * 0.3, size * 0.1);
      ctx.lineTo(-size * 0.1, size * 0.1);
      ctx.closePath();
    };

    const drawCloud = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      ctx.arc(-size * 0.5, 0, size * 0.4, 0, Math.PI * 2);
      ctx.arc(0, -size * 0.2, size * 0.5, 0, Math.PI * 2);
      ctx.arc(size * 0.5, 0, size * 0.4, 0, Math.PI * 2);
      ctx.arc(0, size * 0.2, size * 0.45, 0, Math.PI * 2);
    };

    const drawDiamond = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.7, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.7, 0);
      ctx.closePath();
    };

    const drawSquiggle = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      ctx.moveTo(-size, 0);
      for (let i = 0; i <= 10; i++) {
        const x = -size + (i / 10) * size * 2;
        const y = Math.sin(i * 1.2) * size * 0.4;
        ctx.lineTo(x, y);
      }
    };

    const drawBurst = (ctx: CanvasRenderingContext2D, size: number) => {
      const rays = 8;
      ctx.beginPath();
      for (let i = 0; i < rays * 2; i++) {
        const radius = i % 2 === 0 ? size : size * 0.4;
        const angle = (i * Math.PI) / rays;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

>>>>>>> bb85232e51518b754e77f798bfd784280e3815f9
    const drawDoodle = (ctx: CanvasRenderingContext2D, doodle: Doodle) => {
      ctx.save();
      ctx.translate(doodle.x, doodle.y);
      ctx.rotate(doodle.rotation);
      ctx.strokeStyle = doodle.color;
      ctx.fillStyle = doodle.color;
      ctx.globalAlpha = doodle.opacity;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

<<<<<<< HEAD
      const action = drawDoodleShape(ctx, doodle.type, doodle.size);
      if (action === "stroke") ctx.stroke();
      else if (action === "fill") ctx.fill();
=======
      switch (doodle.type) {
        case "star":
          drawStar(ctx, doodle.size);
          ctx.stroke();
          break;
        case "heart":
          drawHeart(ctx, doodle.size);
          ctx.stroke();
          break;
        case "spiral":
          drawSpiral(ctx, doodle.size);
          ctx.stroke();
          break;
        case "zigzag":
          drawZigzag(ctx, doodle.size);
          ctx.stroke();
          break;
        case "circle":
          ctx.beginPath();
          ctx.arc(0, 0, doodle.size, 0, Math.PI * 2);
          ctx.stroke();
          break;
        case "triangle":
          ctx.beginPath();
          ctx.moveTo(0, -doodle.size);
          ctx.lineTo(doodle.size * 0.866, doodle.size * 0.5);
          ctx.lineTo(-doodle.size * 0.866, doodle.size * 0.5);
          ctx.closePath();
          ctx.stroke();
          break;
        case "smiley":
          drawSmiley(ctx, doodle.size);
          break;
        case "lightning":
          drawLightning(ctx, doodle.size);
          ctx.fill();
          break;
        case "cloud":
          drawCloud(ctx, doodle.size);
          ctx.stroke();
          break;
        case "diamond":
          drawDiamond(ctx, doodle.size);
          ctx.stroke();
          break;
        case "squiggle":
          drawSquiggle(ctx, doodle.size);
          ctx.stroke();
          break;
        case "burst":
          drawBurst(ctx, doodle.size);
          ctx.stroke();
          break;
      }
>>>>>>> bb85232e51518b754e77f798bfd784280e3815f9

      ctx.restore();
    };

    const animate = () => {
      time += 0.016;
      const width = canvas.width;
      const height = canvas.height;

      // Flat comic-style background
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, width, height);

      // Subtle grid pattern
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw doodles
      doodles.forEach((doodle) => {
        // Natural floating motion
        const floatX = Math.sin(time * doodle.floatSpeed + doodle.floatPhase) * doodle.floatAmplitude;
        const floatY = Math.cos(time * doodle.floatSpeed * 0.7 + doodle.floatPhase) * doodle.floatAmplitude * 0.6;

        // Mouse interaction - gentle push away
        let mouseInfluenceX = 0;
        let mouseInfluenceY = 0;

        if (mouseRef.current.active) {
          const dx = doodle.baseX - mouseRef.current.x;
          const dy = doodle.baseY - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 200;

          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 40;
            mouseInfluenceX = (dx / dist) * force;
            mouseInfluenceY = (dy / dist) * force;
          }
        }

        // Apply smooth movement
        doodle.x += (doodle.baseX + floatX + mouseInfluenceX - doodle.x) * 0.08;
        doodle.y += (doodle.baseY + floatY + mouseInfluenceY - doodle.y) * 0.08;

        // Gentle rotation
        doodle.rotation += doodle.rotationSpeed;

        // Draw the doodle
        drawDoodle(ctx, doodle);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      aria-hidden="true"
    />
  );
};

export default AnimatedBackground;