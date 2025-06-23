This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Design System Foundations

This project uses a custom design system based on the following foundations:

### Color Palette
- **Primary, Secondary, Neutral, Accent, Semantic (Success, Warning, Error, Info)**
- Defined in `tailwind.config.js` and as CSS variables in `src/styles/design-tokens.css`

### Typography
- Font families: Geist Sans (sans), Geist Mono (mono)
- Font sizes, weights, and line heights are set in Tailwind config and CSS variables
- Base styles in `src/app/globals.css`

### Spacing
- Consistent 4px/8px grid
- Spacing tokens in Tailwind config and CSS variables

### How to Verify
- Inspect elements in the browser developer tools
- Check that colors, fonts, and spacing match the design tokens
- All tokens are available as CSS variables and Tailwind classes

### Files
- `tailwind.config.js`: Theme extension
- `src/app/globals.css`: Base styles and resets
- `src/styles/design-tokens.css`: CSS variables for design tokens
