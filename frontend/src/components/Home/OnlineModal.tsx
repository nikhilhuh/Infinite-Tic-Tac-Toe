import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { createRoomAPI } from "@/services/api/apiCalls/createRoom";
import { useNavigate } from "react-router-dom";
import { joinRoomAPI } from "@/services/api/apiCalls/joinRoom";
import Cliploader from "../Loaders/Cliploader";

export const OnlineModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [name, setName] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [mode, setMode] = useState<"select" | "create" | "join">("select");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    setError("");
    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }
    try {
      setLoading(true);
      const response = await createRoomAPI(name);
      if (response.success) {
        sessionStorage.setItem("roomId", response.roomId);
        onClose();
        navigate(
          `/game?mode=online&name=${encodeURIComponent(
            name
          )}&room=${encodeURIComponent(response.roomId)}`
        );
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(
        "Failed to create room at the moment, please wait for few seconds and try again"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    setError("");
    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }
    if (!roomId.trim()) {
      setError("Enter Room Id to continue..");
      return;
    }
    try {
      setLoading(true);
      const response = await joinRoomAPI(name, roomId);
      if (response.success) {
        sessionStorage.setItem("roomId", roomId);
        onClose();
        navigate(
          `/game?mode=online&name=${encodeURIComponent(
            name
          )}&room=${encodeURIComponent(roomId)}`
        );
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(
        "Failed to join room at the moment, please wait for few seconds and try again"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setMode("select");
    setName("");
    setRoomId("");
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
            {mode === "select" && (
              <>
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Play Online
                </h2>
                <div className="space-y-4">
                  <Button
                    className="w-full bg-game-blue hover:bg-game-blue/90 text-white h-12"
                    onClick={() => setMode("create")}
                  >
                    <span className="mr-2 text-lg">🚀</span>
                    Create New Room
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-game-red text-game-red hover:bg-game-red hover:text-white h-12"
                    onClick={() => setMode("join")}
                  >
                    <span className="mr-2 text-lg">🔗</span>
                    Join Existing Room
                  </Button>
                </div>

                <div className="flex justify-center mt-6">
                  <Button variant="ghost" onClick={handleClose}>
                    Cancel
                  </Button>
                </div>
              </>
            )}

            {mode === "create" && (
              <>
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Create Room
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="nickname"
                      className="block text-sm font-medium mb-2"
                    >
                      Your Nickname
                    </label>
                    <Input
                      id="nickname"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your nickname"
                      maxLength={20}
                      autoFocus
                    />
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      We'll create a unique room ID for you to share with
                      friends!
                    </p>
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-xs lg:text-sm text-center mt-2">
                    {error}
                  </p>
                )}

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMode("select");
                      setError("");
                    }}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleCreateRoom}
                    disabled={!name.trim() || loading}
                    className={`flex-1 ${loading ? "bg-game-blue/60" : "bg-game-blue hover:bg-game-blue/90"}`}
                  >
                    {loading ? <Cliploader size={12} /> : "Create Room"}
                  </Button>
                </div>
              </>
            )}

            {mode === "join" && (
              <>
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Join Room
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="nickname"
                      className="block text-sm font-medium mb-2"
                    >
                      Your Nickname
                    </label>
                    <Input
                      id="nickname"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your nickname"
                      maxLength={20}
                      autoFocus
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="roomId"
                      className="block text-sm font-medium mb-2"
                    >
                      Room ID
                    </label>
                    <Input
                      id="roomId"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                      placeholder="Enter room ID (e.g., ABC123)"
                      maxLength={10}
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-xs lg:text-sm text-center mt-2">
                    {error}
                  </p>
                )}

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMode("select");
                      setError("");
                    }}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleJoinRoom}
                    disabled={!name.trim() || !roomId.trim() || loading}
                    className={`flex-1 ${loading? "bg-game-red/60" : "bg-game-red hover:bg-game-red/90"}`}
                  >
                    {loading ? <Cliploader size={12} /> : "Join Room"}
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
