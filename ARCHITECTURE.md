# Pamoja V2 Architecture

## Overview

This document outlines the architecture, patterns, and best practices for the Pamoja V2 frontend codebase.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (main)/            # Route group
│   │   └── v2/            # V2 pages
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Base UI components
│   └── v2/                # V2-specific components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and design system
│   ├── colors/            # Color system
│   ├── typography/        # Typography system
│   ├── spacing/           # Spacing system
│   ├── sizing/            # Sizing system
│   ├── transitions/       # Transition utilities
│   └── utils/             # Utility functions
├── types/                  # TypeScript type definitions
└── constants/             # Application constants
```

## Design Principles

### 1. Type Safety
- Full TypeScript with strict mode enabled
- Shared types in `src/types/`
- No `any` types (use `unknown` when necessary)

### 2. Component Architecture
- **Composition over inheritance**
- **Single Responsibility Principle** - Each component has one clear purpose
- **Props Interface** - All components have typed props interfaces
- **Memoization** - Use `React.memo` for expensive components
- **Performance** - Use `useCallback` and `useMemo` appropriately

### 3. Styling System
- **CSS Variables** - Primary styling method via `globals.css`
- **Design Tokens** - Centralized in `lib/` directories
- **Tailwind Classes** - For utility styling
- **Inline Styles** - For dynamic values only

### 4. Code Organization
- **Barrel Exports** - Use index files for clean imports
- **Named Exports** - Prefer named over default exports
- **File Naming** - PascalCase for components, camelCase for utilities

## Best Practices

### Component Structure

```tsx
'use client'

import React, { useState, useCallback } from 'react'
import { typography } from '@/lib/typography/v2'

/**
 * Component description
 * 
 * @example
 * ```tsx
 * <Component prop="value" />
 * ```
 */
interface ComponentProps {
  /** Prop description */
  prop: string
}

export const Component = React.memo(function Component({
  prop
}: ComponentProps) {
  // Hooks
  const [state, setState] = useState('')
  
  // Callbacks
  const handleClick = useCallback(() => {
    // Handler logic
  }, [])
  
  // Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  )
})
```

### Import Order

1. React and Next.js imports
2. Third-party libraries
3. Internal components
4. Utilities and types
5. Styles and constants

### Error Handling

- Use `ErrorBoundary` for component-level errors
- Handle async errors with try/catch
- Provide user-friendly error messages
- Log errors appropriately

### Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation
- Maintain proper focus management
- Test with screen readers

### Performance

- Lazy load heavy components
- Memoize expensive calculations
- Use `useCallback` for event handlers
- Avoid unnecessary re-renders
- Optimize images and assets

## Design System

### Colors
- Defined in `lib/colors/v2.ts`
- CSS variables in `globals.css`
- Use `colorValues` for inline styles
- Use CSS variables for Tailwind classes

### Typography
- Defined in `lib/typography/v2.ts`
- Font family: Figtree
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Spacing
- Defined in `lib/spacing/v2.ts`
- Use Tailwind spacing classes when possible
- Use constants for dynamic spacing

## Testing Strategy

- Unit tests for utilities
- Component tests for complex components
- Integration tests for user flows
- E2E tests for critical paths

## Code Quality

### Linting
- ESLint with Next.js and TypeScript rules
- Run `npm run lint` before committing

### Type Checking
- TypeScript strict mode enabled
- Run `npm run type-check` before committing

### Formatting
- Consistent code style
- Proper indentation
- Clear variable names

## Deployment

- Vercel for production
- Automatic deployments on push to main
- Environment variables via Vercel dashboard

## Contributing

1. Follow the architecture patterns
2. Write TypeScript with proper types
3. Add JSDoc comments for public APIs
4. Test your changes
5. Update documentation as needed



