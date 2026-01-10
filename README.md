# ✨ Daily Motivation 🚀

A beautiful, interactive motivational quote generator featuring a playful comic doodle theme with animated backgrounds and delightful micro-interactions.

![Daily Motivation](https://img.shields.io/badge/React-18.3-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue?logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-5.4-purple?logo=vite)

## 📖 Description

Daily Motivation is a web application designed to inspire you with beautiful motivational quotes. The app features a unique hand-drawn comic aesthetic with floating doodles, smooth animations, and a calming chime sound effect when fetching new quotes.

### ✨ Key Features

- 🎨 **Animated Doodle Background** - Canvas-based animation with 12 different floating doodle types (stars, hearts, smileys, lightning bolts, and more)
- 🖌️ **Hand-Drawn UI Elements** - Custom SVG borders with a sketchy, comic-book style
- 🔊 **Calming Sound Effects** - Gentle C major chord chime plays when getting new quotes
- ⌨️ **Keyboard Support** - Press Enter to get a new quote instantly
- 🎯 **Smart Quote Fetching** - Prefetches next quote for instant delivery, with API fallbacks
- 📱 **Fully Responsive** - Works beautifully on all screen sizes
- 🌙 **Dark Theme** - Easy on the eyes with a beautiful purple-tinted dark palette

## 🛠️ Tech Stack

### Core
| Technology | Version | Purpose |
|------------|---------|---------|
| [React](https://react.dev/) | 18.3 | UI library for building component-based interfaces |
| [TypeScript](https://www.typescriptlang.org/) | 5.8 | Type-safe JavaScript for better developer experience |
| [Vite](https://vitejs.dev/) | 5.4 | Fast build tool and development server |

### Styling
| Technology | Version | Purpose |
|------------|---------|---------|
| [Tailwind CSS](https://tailwindcss.com/) | 3.4 | Utility-first CSS framework |
| [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) | 1.0 | Animation utilities for Tailwind |
| [class-variance-authority](https://cva.style/) | 0.7 | Component variant management |
| [clsx](https://github.com/lukeed/clsx) | 2.1 | Conditional className utility |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | 2.6 | Merge Tailwind classes without conflicts |

### UI Components
| Technology | Version | Purpose |
|------------|---------|---------|
| [Radix UI](https://www.radix-ui.com/) | Latest | Accessible, unstyled UI primitives |
| [Lucide React](https://lucide.dev/) | 0.462 | Beautiful, consistent icon set |

### Routing
| Technology | Version | Purpose |
|------------|---------|---------|
| [React Router](https://reactrouter.com/) | 6.30 | Client-side routing |

### APIs Used
- **[Quotable.io](https://github.com/lukePeavey/quotable)** - Primary source for inspirational quotes
- **[ZenQuotes.io](https://zenquotes.io/)** - Fallback quote API
- **Web Audio API** - For generating the calming chime sound

## 📁 Project Structure

```
src/
├── components/
│   ├── AnimatedBackground.tsx  # Canvas-based doodle animation
│   ├── GlowButton.tsx          # Hand-drawn style button with hover effects
│   ├── QuoteDisplay.tsx        # Animated quote text display
│   └── ui/
│       └── tooltip.tsx         # Radix tooltip component
├── hooks/
│   ├── useQuotes.ts            # Quote fetching with prefetch & fallbacks
│   └── useQuoteSound.ts        # Web Audio API sound generation
├── pages/
│   ├── Index.tsx               # Main homepage
│   └── NotFound.tsx            # 404 error page
├── lib/
│   └── utils.ts                # Utility functions (cn helper)
├── App.tsx                     # App root with routing
├── main.tsx                    # Entry point
└── index.css                   # Global styles & Tailwind config
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher (or yarn/pnpm)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/daily-motivation.git
   cd daily-motivation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:8080
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## 🏗️ Building for Production

```bash
# Create optimized production build
npm run build

# Preview the build locally
npm run preview
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🎨 Customization

### Adding New Quotes
Edit the `backupQuotes` array in `src/hooks/useQuotes.ts` to add your own motivational quotes as fallbacks.

### Changing Colors
The color palette is defined in `src/index.css` using CSS custom properties. Key colors:
- Background: `#1a1a2e` (deep navy)
- Primary accent: `#a78bda` (soft purple)
- Text: `#e8dff5` (light lavender)

### Modifying Doodles
Edit `src/components/AnimatedBackground.tsx` to add new doodle shapes or modify existing ones.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

Made with 💜 and lots of ✨
