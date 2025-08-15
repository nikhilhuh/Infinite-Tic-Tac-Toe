import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  mode: "local" | "online";
  currentRoomId: string | null;
}

const Header: React.FC<HeaderProps> = ({
  mode,
  currentRoomId,
}) => {
  const navigate = useNavigate();
  return (
    <motion.div
      className="bg-background/80 backdrop-blur-sm border-b border-border px-4 py-2"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex flex-col-reverse">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </Button>
          <div className="text-sm text-muted-foreground">
            {mode === "local"
              ? "Local Game"
              : currentRoomId
              ? `Room: ${currentRoomId}`
              : "Connecting..."}
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold">
            <span className="text-game-blue">∞</span> Tic Tac Toe
          </h1>
        </div>
      </div>
    </motion.div>
  );
};

export default Header;
