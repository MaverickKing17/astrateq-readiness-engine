<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/89391439-f559-419b-9312-639a8f3682ed

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Brand Governance

**Astrateq Gadgets branding must only be referenced from `/src/config/brand.ts`.**
Any direct string usage of the brand name (e.g., `"Astrateq Gadgets"`, `"Astrateq Canada"`, `"ASTRATEQ CANADA"`) is considered invalid architecture.

Import the `BRAND` object and use `BRAND.name`, `BRAND.tagline`, or `BRAND.fullLabel` everywhere.

