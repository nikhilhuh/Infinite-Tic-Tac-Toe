import React from "react";
import { motion } from "framer-motion";

const Features: React.FC = () => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8 }}
    >
      <div className="text-center p-4 bg-background/50 rounded-lg backdrop-blur-sm">
        <div className="text-2xl sm:text-3xl mb-2">⚡</div>
        <div className="font-semibold text-sm sm:text-base">
          20-Second Moves
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground">
          Moves disappear automatically
        </div>
      </div>
      <div className="text-center p-4 bg-background/50 rounded-lg backdrop-blur-sm">
        <div className="text-2xl sm:text-3xl mb-2">∞</div>
        <div className="font-semibold text-sm sm:text-base">New Match</div>
        <div className="text-xs sm:text-sm text-muted-foreground">
          Next Round starts automatically 
        </div>
      </div>
      <div className="text-center p-4 bg-background/50 rounded-lg backdrop-blur-sm sm:col-span-2 lg:col-span-1">
        <div className="text-2xl sm:text-3xl mb-2">🏆</div>
        <div className="font-semibold text-sm sm:text-base">Live Scoring</div>
        <div className="text-xs sm:text-sm text-muted-foreground">
          Track wins in real-time
        </div>
      </div>
    </motion.div>
  );
};

export default Features;
