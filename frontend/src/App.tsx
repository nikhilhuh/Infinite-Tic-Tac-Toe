import "./global.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import NotFound from "./pages/NotFound";
import { SocketProvider } from "./context/SocketContext";

const App = () => (
  <SocketProvider>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/game" element={<Game />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </SocketProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
