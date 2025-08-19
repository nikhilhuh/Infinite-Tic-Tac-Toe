# ♾️ Infinite Tic Tac Toe

An **infinite-grid Tic Tac Toe** game built with **React + TypeScript** and powered by **Socket.IO** for real-time multiplayer.  
Play **locally** with a friend on the same device or against an **AI** with three difficulty levels, or **online** with friend anywhere in the world!  

---

## ✨ Features

- ⚡ **Time-Limited Moves** — Every move disappears after **20 seconds**.
- 🎯 **5-in-a-Row to Win** — Extend your strategy beyond the classic 3x3 board.
- 🔄 **Auto-Reset** — The game automatically resets after each round.
- 🖥 **Local Play** — Challenge a friend on the same device.
- 🤖 Play vs AI — Choose between Easy, Medium, or Hard difficulty.
- 🌍 **Online Multiplayer** — Connect and play in real time with friends via the internet.
- 🎨 Smooth animations with **Framer Motion** and modern UI icons via **Lucide**.

---

## 🛠 Tech Stack

### **Frontend**
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Socket.IO Client](https://socket.io/)
- [Axios](https://axios-http.com/)
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide React](https://lucide.dev/) for icons
- [React Router v6](https://reactrouter.com/) for navigation
- [React Spinners](https://www.davidhu.io/react-spinners/) for loading states
- [UUID](https://www.npmjs.com/package/uuid) for unique identifiers

### **Backend**
- [Express](https://expressjs.com/) for server API
- [Socket.IO](https://socket.io/) for real-time gameplay
- [CORS](https://www.npmjs.com/package/cors) for cross-origin requests
- [dotenv](https://www.npmjs.com/package/dotenv) for environment variables

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/nikhilhuh/infinite-tic-tac-toe.git
cd infinite-tic-tac-toe
```

### 2️⃣ Install Dependencies

### Frontend
```bash
cd frontend
npm install
```
### Backend
```bash
cd backend
npm install
```

### 3️⃣ Environment Variables

### Frontend
```bash
VITE_BACKEND_URL=http://localhost:3001
```
### Backend
```bash
PORT=3001
FRONTEND_URL=http://localhost:3000
PING_MESSAGE=pong
```

---

## 🚀 Running the App

### Start Frontend
```bash
cd frontend
npm run dev

```
### Start Backend
```bash
cd backend
npm run dev
```

The frontend will run at: http://localhost:3000
The backend will run at: http://localhost:3001

---

## 🎮 How to Play

### Local Game

1. Select Play Locally from the menu.
2. Player X and Player O take turns placing marks.
3. Marks disappear after 20 seconds, so plan carefully.
4. First to 5 in a row wins.


### Play vs AI

1. Select Play vs AI from the menu.
2. Choose difficulty level: Easy, Medium, or Hard.
3. Try to beat the computer while managing disappearing moves.

### Online Game

1. Select Online Game.
2. Create a room and share the room code with a friend or join an existing room.
3. Enjoy real-time gameplay with disappearing moves and strategic fun.

---

## 📌 Future Improvements

1. Player profiles & match history
2. Customizable grid sizes & win conditions
3. Spectator mode

---

💡 Tip: Don’t underestimate disappearing moves — your winning strategy might vanish before your eyes! 😉

---

## 🤝 Contributing

This project is **open source** and contributions are welcome! 🎉  

To contribute:  
1. **Fork** the repository  
2. **Create a new branch** (`git checkout -b feature-name`)  
3. **Make your changes** and commit (`git commit -m "Added new feature"`)  
4. **Push** your branch (`git push origin feature-name`)  
5. Open a **Pull Request**  

👉 Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed guidelines before contributing.  

---

## 🌟 Support & Connect

If you like this project, consider giving it a **star** ⭐ on GitHub — it really helps!  

[![GitHub stars](https://img.shields.io/github/stars/nikhilhuh/infinite-tic-tac-toe?style=social)](https://github.com/nikhilhuh/infinite-tic-tac-toe)  
[![GitHub follow](https://img.shields.io/github/followers/nikhilhuh?style=social)](https://github.com/nikhilhuh)  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?logo=linkedin)](https://www.linkedin.com/in/nikhilhuh/)  

