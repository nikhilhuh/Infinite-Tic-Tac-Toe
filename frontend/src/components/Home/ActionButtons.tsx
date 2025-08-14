import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface ActionButtonsProps {
  setShowOnlineModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  setShowOnlineModal,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 w-full max-w-lg mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      <Button
        size="lg"
        onClick={() => navigate("/game?mode=local")}
        className="bg-game-blue hover:bg-game-blue/90 text-white text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-auto w-full sm:w-auto"
      >
        <span className="mr-2 text-lg sm:text-2xl">👥</span>
        Play Locally
      </Button>

      <Button
        size="lg"
        variant="outline"
        onClick={() => setShowOnlineModal(true)}
        className="border-game-red text-game-red hover:bg-game-red hover:text-white text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-auto w-full sm:w-auto"
      >
        <span className="mr-2 text-lg sm:text-2xl">🌐</span>
        Play Online with Friends
      </Button>
    </motion.div>
  );
};

export default ActionButtons;
