# Abel Goh · Portfolio

My portfolio site: reinforcement learning, robotics and embedded systems projects.

Built with Next.js (App Router), TypeScript and Tailwind CSS. Deployed on Vercel.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Editing content

All project write-ups live in `lib/projects.ts`. Each project is a list of sections, and each
section is a list of blocks (paragraphs, lists, tables, figures). Social links are in `lib/site.ts`.

The clips in `public/media` were recorded from the trained models. The charts in `public/figures`
come from the TurtleBot3 write-up.
