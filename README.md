# Pamoja V2

Dark themed frontend interface for Pamoja Resume Coach.

## Overview

This is the V2 frontend interface featuring a modern, dark-themed design system with centralized styling, optimized performance, and reusable components.

## Features

- **Dark Theme**: Modern dark color palette optimized for user experience
- **Component Library**: Reusable, composable React components
- **Type Safe**: Full TypeScript support
- **Performance Optimized**: Components use React.memo, useCallback, and useMemo
- **Centralized Design System**: Colors, typography, and spacing are centrally managed

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React 18**: Latest React features

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── (main)/
│   │   └── v2/              # V2 pages
│   │       ├── dashboard/
│   │       ├── applications/
│   │       ├── toolkit/
│   │       └── result/
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles and CSS variables
├── components/
│   └── v2/                  # V2 components
│       ├── SideNavigation.tsx
│       ├── TopNavigation.tsx
│       ├── TextField.tsx
│       ├── Toast.tsx
│       └── ...
└── lib/
    ├── colors/
    │   └── v2.ts            # Color system
    ├── typography/
    │   └── v2.ts            # Typography system
    ├── spacing/
    │   └── v2.ts            # Spacing system
    ├── sizing/
    │   └── v2.ts            # Sizing system
    ├── transitions/
    │   └── v2.ts            # Transition utilities
    └── utils/
        └── v2/              # V2 utilities
```

## Design System

### Colors

Colors are centrally managed via CSS variables in `globals.css` and TypeScript constants in `src/lib/colors/v2.ts`.

### Typography

Typography system is defined in `src/lib/typography/v2.ts` using the Figtree font family.

### Components

All V2 components are located in `src/components/v2/` and follow consistent patterns:
- TypeScript interfaces for props
- Performance optimizations (memoization)
- Centralized styling

## Development

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Deployment

### Deploy to Vercel (Recommended - Easiest)

1. Go to [Vercel](https://vercel.com) and sign in with your GitHub account
2. Click "Add New Project"
3. Import the `Pamoja-V2` repository
4. Vercel will automatically detect Next.js and configure the build
5. Click "Deploy" - your site will be live in minutes!

Your site will be available at: `https://pamoja-v2.vercel.app` (or a custom domain)

### Deploy to GitHub Pages

1. Go to your repository settings on GitHub
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select "GitHub Actions"
4. The GitHub Actions workflow will automatically deploy on every push to `main`
5. Your site will be available at: `https://supremeio.github.io/Pamoja-V2`

**Note**: For GitHub Pages, you may need to enable static export in `next.config.js` if you encounter issues.

## License

Private - Pamoja Resume Coach

