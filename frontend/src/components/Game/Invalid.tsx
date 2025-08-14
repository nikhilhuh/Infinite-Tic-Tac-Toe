import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Home } from "lucide-react";

const Invalid: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-game-bg flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Invalid Room</h2>
        <Button onClick={() => navigate("/")}>
          <Home className="w-4 h-4 mr-2" />
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default Invalid;
