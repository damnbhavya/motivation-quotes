// Shared doodle drawing utilities used by AnimatedBackground and useShareImage

export const DOODLE_COLORS = [
  "#FF6B9D", // Pink
  "#C44DFF", // Purple
  "#4DFFFF", // Cyan
  "#FFE66D", // Yellow
  "#FF8B4D", // Orange
  "#7BFF4D", // Green
];

export const DOODLE_TYPES = [
  "star", "heart", "spiral", "zigzag", "circle", "triangle",
  "smiley", "lightning", "cloud", "diamond", "squiggle", "burst"
] as const;

export type DoodleType = typeof DOODLE_TYPES[number];

export const drawStar = (ctx: CanvasRenderingContext2D, size: number) => {
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

export const drawHeart = (ctx: CanvasRenderingContext2D, size: number) => {
  ctx.beginPath();
  ctx.moveTo(0, size * 0.3);
  ctx.bezierCurveTo(-size, -size * 0.3, -size * 0.5, -size, 0, -size * 0.5);
  ctx.bezierCurveTo(size * 0.5, -size, size, -size * 0.3, 0, size * 0.3);
  ctx.closePath();
};

export const drawSpiral = (ctx: CanvasRenderingContext2D, size: number) => {
  ctx.beginPath();
  for (let i = 0; i < 720; i += 15) {
    const angle = (i * Math.PI) / 180;
    const radius = (i / 720) * size;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
};

export const drawZigzag = (ctx: CanvasRenderingContext2D, size: number) => {
  ctx.beginPath();
  ctx.moveTo(-size, 0);
  for (let i = 0; i < 5; i++) {
    const x = -size + (i + 0.5) * (size * 2) / 5;
    const y = (i % 2 === 0 ? -1 : 1) * size * 0.4;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(size, 0);
};

export const drawSmiley = (ctx: CanvasRenderingContext2D, size: number) => {
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

export const drawLightning = (ctx: CanvasRenderingContext2D, size: number) => {
  ctx.beginPath();
  ctx.moveTo(size * 0.2, -size);
  ctx.lineTo(-size * 0.3, -size * 0.1);
  ctx.lineTo(size * 0.1, -size * 0.1);
  ctx.lineTo(-size * 0.2, size);
  ctx.lineTo(size * 0.3, size * 0.1);
  ctx.lineTo(-size * 0.1, size * 0.1);
  ctx.closePath();
};

export const drawCloud = (ctx: CanvasRenderingContext2D, size: number) => {
  ctx.beginPath();
  ctx.arc(-size * 0.5, 0, size * 0.4, 0, Math.PI * 2);
  ctx.arc(0, -size * 0.2, size * 0.5, 0, Math.PI * 2);
  ctx.arc(size * 0.5, 0, size * 0.4, 0, Math.PI * 2);
  ctx.arc(0, size * 0.2, size * 0.45, 0, Math.PI * 2);
};

export const drawDiamond = (ctx: CanvasRenderingContext2D, size: number) => {
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.7, 0);
  ctx.lineTo(0, size);
  ctx.lineTo(-size * 0.7, 0);
  ctx.closePath();
};

export const drawSquiggle = (ctx: CanvasRenderingContext2D, size: number) => {
  ctx.beginPath();
  ctx.moveTo(-size, 0);
  for (let i = 0; i <= 10; i++) {
    const x = -size + (i / 10) * size * 2;
    const y = Math.sin(i * 1.2) * size * 0.4;
    ctx.lineTo(x, y);
  }
};

export const drawBurst = (ctx: CanvasRenderingContext2D, size: number) => {
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

export const drawTriangle = (ctx: CanvasRenderingContext2D, size: number) => {
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.866, size * 0.5);
  ctx.lineTo(-size * 0.866, size * 0.5);
  ctx.closePath();
};

export const drawCircle = (ctx: CanvasRenderingContext2D, size: number) => {
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
};

// Draw a doodle based on type - returns whether to stroke or fill
export const drawDoodleShape = (
  ctx: CanvasRenderingContext2D,
  type: DoodleType,
  size: number
): "stroke" | "fill" | "custom" => {
  switch (type) {
    case "star":
      drawStar(ctx, size);
      return "stroke";
    case "heart":
      drawHeart(ctx, size);
      return "stroke";
    case "spiral":
      drawSpiral(ctx, size);
      return "stroke";
    case "zigzag":
      drawZigzag(ctx, size);
      return "stroke";
    case "circle":
      drawCircle(ctx, size);
      return "stroke";
    case "triangle":
      drawTriangle(ctx, size);
      return "stroke";
    case "smiley":
      drawSmiley(ctx, size);
      return "custom";
    case "lightning":
      drawLightning(ctx, size);
      return "fill";
    case "cloud":
      drawCloud(ctx, size);
      return "stroke";
    case "diamond":
      drawDiamond(ctx, size);
      return "stroke";
    case "squiggle":
      drawSquiggle(ctx, size);
      return "stroke";
    case "burst":
      drawBurst(ctx, size);
      return "stroke";
    default:
      return "stroke";
  }
};
