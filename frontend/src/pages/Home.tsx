import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/Home/AnimatedBackgroud";
import ActionButtons from "@/components/Home/ActionButtons";
import Features from "@/components/Home/Features";
import { OnlineModal } from "@/components/Home/OnlineModal";
import { AIModal } from "@/components/Home/AIModal";

export default function Home() {
  const [showOnlineModal, setShowOnlineModal] = useState<boolean>(false);
  const [showAIModal, setShowAIModal] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-game-bg relative overflow-x-hidden">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          className="text-center max-w-4xl mx-auto relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Title */}
          <motion.h1
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 leading-tight"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="text-game-blue">∞</span>
            <span className="text-foreground mx-4">Tic</span>
            <span className="text-game-red">Tac</span>
            <span className="text-foreground mx-4">Toe</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-12 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            The grid where every move counts for 20 seconds
          </motion.p>

          {/* Game features */}
          <Features />

          {/* Action buttons */}
          <ActionButtons
            setShowOnlineModal={setShowOnlineModal}
            setShowAIModal={setShowAIModal}
          />
        </motion.div>
      </div>

      <OnlineModal
        isOpen={showOnlineModal}
        onClose={() => setShowOnlineModal(false)}
      />
      <AIModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} />
    </div>
  );
}
