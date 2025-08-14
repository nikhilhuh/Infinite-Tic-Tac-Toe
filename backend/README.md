# Infinite Tic Tac Toe - Backend

Express.js backend with Socket.IO for real-time multiplayer Infinite Tic Tac Toe game.

## Features

- 🚀 Express.js with TypeScript
- 📡 Socket.IO for real-time communication
- 🎮 Room-based multiplayer system
- 🔐 Auto-generated unique room IDs
- ⏱️ Server-side move timer management
- 🏥 Health check endpoints

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

The backend will run on `http://localhost:3001`

## Environment Variables

Create a `.env` file based on `.env.example`:

- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)
- `PING_MESSAGE` - Custom ping response message

## Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run clean` - Clean build directory

## API Endpoints

### HTTP Endpoints

- `GET /health` - Health check endpoint
- `GET /api/ping` - Simple ping endpoint

### Socket.IO Events

#### Client → Server

- `create-room` - Create a new game room

  ```ts
  {
    playerName: string;
  }
  ```

- `join-room` - Join existing room

  ```ts
  { roomId: string, playerName: string }
  ```

- `make-move` - Make a game move
  ```ts
  { roomId: string, x: number, y: number }
  ```

#### Server → Client

- `room-created` - Room creation confirmation

  ```ts
  { success: boolean, roomId: string, players: string[] }
  ```

- `room-joined` - Room join confirmation

  ```ts
  { success: boolean, players: string[], gameState?: GameState }
  ```

- `player-joined` - New player joined

  ```ts
  { playerName: string, players: string[] }
  ```

- `player-left` - Player left room

  ```ts
  { playerName: string, players: string[] }
  ```

- `game-state-update` - Game state changed

  ```ts
  GameState;
  ```

- `error` - Error occurred
  ```ts
  {
    message: string;
  }
  ```

## Game Logic

- **Room Management**: Auto-generated 6-character alphanumeric room IDs
- **Player Assignment**: First player gets 'X', second gets 'O'
- **Move Validation**: Server-side validation for valid moves
- **Win Detection**: 3-in-a-row detection with timer consideration
- **Auto-cleanup**: Moves disappear after 12 seconds
- **Room Cleanup**: Empty rooms are automatically removed

## Project Structure

```
src/
├── routes/
│   └── socket.ts       # Socket.IO event handlers
├── shared/             # Shared types (if needed)
└── index.ts           # Main server file
```

## Development

The backend uses `tsx` for development with auto-reload. TypeScript files are watched and recompiled automatically when changes are detected.

For production deployment, run `npm run build` to compile TypeScript to JavaScript, then `npm start` to run the compiled version.
