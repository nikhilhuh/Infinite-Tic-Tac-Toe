import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export const AIModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [difficulty, setDifficulty] = useState<
    "select" | "easy" | "medium" | "hard"
  >("select");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const startGame = (level: "easy" | "medium" | "hard") => {
    setError("");
    onClose();
    navigate(`/game?mode=ai&difficulty=${level}`);
  };

  const resetModal = () => {
    setDifficulty("select");
    setError("");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-background border border-border rounded-lg p-6 sm:p-8 w-full max-w-md mx-4 shadow-2xl"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {difficulty === "select" && (
              <>
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Play With AI
                </h2>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600 text-white h-12"
                    onClick={() => startGame("easy")}
                  >
                    <span className="mr-2">🙂</span> Easy
                  </Button>

                  <Button
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white h-12"
                    onClick={() => startGame("medium")}
                  >
                    <span className="mr-2">🤔</span> Medium
                  </Button>

                  <Button
                    className="w-full bg-red-500 hover:bg-red-600 text-white h-12"
                    onClick={() => startGame("hard")}
                  >
                    <span className="mr-2">🧠</span> Hard
                  </Button>
                </div>

                {error && (
                  <p className="text-red-400 text-xs lg:text-sm text-center mt-2">
                    {error}
                  </p>
                )}

                <div className="flex justify-center mt-6">
                  <Button variant="ghost" onClick={handleClose}>
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
