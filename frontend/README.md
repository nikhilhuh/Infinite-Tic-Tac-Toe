# Infinite Tic Tac Toe - Frontend

A beautiful React frontend for the Infinite Tic Tac Toe game with real-time multiplayer support.

## Features

- ⚡ React 18 with TypeScript
- 🎨 TailwindCSS for styling
- 🔄 Framer Motion animations
- 🎮 Real-time multiplayer via Socket.IO
- 📱 Fully responsive design
- ∞ Infinite scrollable game board
- ⏱️ 12-second move timer system

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   ```
3. **Start development server:**
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## Environment Variables

Create a `.env` file based on `.env.example`:

- `VITE_BACKEND_URL` - Backend server URL (default: http://localhost:3001)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + Radix UI
- **Animations**: Framer Motion
- **Real-time**: Socket.IO Client
- **Routing**: React Router 6

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Radix UI components
│   ├── InfiniteBoard.tsx
│   └── ScoreBoard.tsx
├── pages/              # Page components
│   ├── Index.tsx       # Homepage
│   ├── Game.tsx        # Game page
│   └── NotFound.tsx
├── hooks/              # Custom React hooks
│   └── useSocket.ts    # Socket.IO hook
├── types/              # TypeScript type definitions
│   └── game.ts
└── lib/               # Utility functions
    └── utils.ts
```

## Game Features

- **Local Play**: 2-player mode on same device
- **Online Play**: Real-time multiplayer with room system
- **Infinite Board**: Scrollable grid that expands infinitely
- **Timer System**: Moves disappear after 12 seconds
- **Live Scoring**: Real-time win tracking
- **Room Creation**: Auto-generated room IDs for easy sharing

## Development

The frontend connects to the backend server running on port 3001 by default. Make sure the backend is running before starting the frontend development server.
