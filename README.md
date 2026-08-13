# StrangerChat — Frontend demo

This is a polished front-end demo for a stranger chat website, built with Next.js + TypeScript + Tailwind.

Features:
- Landing page with guest or sign-up options
- Client-side sign-up/login (localStorage) for demo purposes
- Demo pairing implemented with BroadcastChannel (pairs tabs in the same browser)
- Bot fallback when no peer found
- Beautiful responsive UI designed for deployment on Vercel

Local run:
1. Install dependencies:
   npm install

2. Start dev server:
   npm run dev
   Open http://localhost:3000

Deploy to Vercel:
- Push repository to GitHub and connect repository on https://vercel.com/new
- Vercel automatically detects Next.js. Use the default build step `npm run build`.
- Environment variables are not required for the demo.

Integrating a real realtime backend:
- Replace the BroadcastChannel matching & chat messages with:
  - WebSocket server (ws / Socket.io) hosted on a server (Heroku / Render / Railway) OR
  - Realtime services: Supabase Realtime, Firebase Realtime / Firestore with presence, Ably, Pusher Channels
  - For peer-to-peer voice/video + data channels: implement a backend signaling server (WebSocket) to set up WebRTC connections
- I can add server code or adapt the frontend to a specific provider — tell me which one and I’ll implement it.

Security / Production:
- Replace client-side only auth with a proper provider (NextAuth, Clerk, Magic Link, Auth0).
- Do not store production user accounts in localStorage.

Next steps I can take for you:
- Hook this frontend to a backend realtime server (I can build a minimal Node/Socket.io or a Supabase example).
- Create a GitHub repo, push these files, and open a PR; or push directly to your repo and create a Vercel project.
- Add optional features: typing indicator across peers, reporting/ban UI, moderation, image sharing, audio/video.
