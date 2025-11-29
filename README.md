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

## License

Private - Pamoja Resume Coach

