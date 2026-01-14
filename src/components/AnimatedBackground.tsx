import { useEffect, useRef } from "react";
import {
  DOODLE_COLORS,
  DOODLE_TYPES,
  DoodleType,
  drawDoodleShape,
} from "@/lib/doodleUtils";

interface Doodle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  type: DoodleType;
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
        type: DOODLE_TYPES[Math.floor(Math.random() * DOODLE_TYPES.length)],
        color: DOODLE_COLORS[Math.floor(Math.random() * DOODLE_COLORS.length)],
        floatPhase: Math.random() * Math.PI * 2,
        floatSpeed: 0.3 + Math.random() * 0.5,
        floatAmplitude: floatAmpMin + Math.random() * floatAmpRange,
        opacity: 0.15 + Math.random() * 0.25,
      });
    }

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

      const action = drawDoodleShape(ctx, doodle.type, doodle.size);
      if (action === "stroke") ctx.stroke();
      else if (action === "fill") ctx.fill();

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
