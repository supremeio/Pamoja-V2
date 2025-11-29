/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        // V2 Color Palette
        v2: {
          background: {
            primary: 'var(--v2-background-primary)',
            secondary: 'var(--v2-background-secondary)',
          },
          border: {
            DEFAULT: 'var(--v2-border-default)',
            light: 'var(--v2-border-light)',
          },
          text: {
            primary: 'var(--v2-text-primary)',
            secondary: 'var(--v2-text-secondary)',
            muted: 'var(--v2-text-muted)',
            accent: 'var(--v2-text-accent)',
            button: 'var(--v2-text-button)',
          },
          brand: {
            primary: 'var(--v2-brand-primary)',
          },
          status: {
            error: 'var(--v2-status-error)',
            applied: {
              bg: 'var(--v2-status-applied-bg)',
              border: 'var(--v2-status-applied-border)',
              text: 'var(--v2-status-applied-text)',
            },
            rejected: {
              bg: 'var(--v2-status-rejected-bg)',
              border: 'var(--v2-status-rejected-border)',
              text: 'var(--v2-status-rejected-text)',
            },
            interview: {
              bg: 'var(--v2-status-interview-bg)',
              border: 'var(--v2-status-interview-border)',
              text: 'var(--v2-status-interview-text)',
            },
            offer: {
              bg: 'var(--v2-status-offer-bg)',
              border: 'var(--v2-status-offer-border)',
              text: 'var(--v2-status-offer-text)',
            },
            accepted: {
              bg: 'var(--v2-status-accepted-bg)',
              border: 'var(--v2-status-accepted-border)',
              text: 'var(--v2-status-accepted-text)',
            },
          },
        },
      },
      fontFamily: {
        'figtree': ['var(--font-figtree)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
