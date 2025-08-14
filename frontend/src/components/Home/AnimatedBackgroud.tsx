import React from "react";
import { motion } from "framer-motion";

const AnimatedBackground: React.FC = () => {
  const symbols = [
    "×",
    "○",
    "×",
    "○",
    "×",
    "○",
    "×",
    "○",
    "×",
    "○",
    "×",
    "○",
    "×",
    "○",
    "×",
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating symbols - more dynamic */}
      {symbols.map((symbol, i) => (
        <motion.div
          key={i}
          className={`absolute font-bold select-none ${
            symbol === "×" ? "text-game-blue/15" : "text-game-red/15"
          }`}
          style={{
            fontSize: `${3 + Math.random() * 4}rem`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{
            rotate: Math.random() * 360,
            scale: 0.5 + Math.random() * 0.5,
            opacity: 0,
          }}
          animate={{
            rotate: [
              Math.random() * 360,
              Math.random() * 360 + 360,
              Math.random() * 360 + 720,
            ],
            scale: [
              0.5 + Math.random() * 0.5,
              0.8 + Math.random() * 0.4,
              0.5 + Math.random() * 0.5,
            ],
            opacity: [0, 0.8, 0.3, 0.8, 0],
            x: [
              0,
              (Math.random() - 0.5) * 200,
              (Math.random() - 0.5) * 300,
              (Math.random() - 0.5) * 150,
              0,
            ],
            y: [
              0,
              (Math.random() - 0.5) * 150,
              (Math.random() - 0.5) * 200,
              (Math.random() - 0.5) * 100,
              0,
            ],
          }}
          transition={{
            duration: 15 + Math.random() * 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          {symbol}
        </motion.div>
      ))}

      {/* Enhanced Grid lines with animation */}
      <div className="absolute inset-0">
        {/* Vertical lines */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute w-px bg-gradient-to-b from-transparent via-game-grid/10 to-transparent h-full"
            style={{ left: `${10 + i * 11}%` }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{
              scaleY: [0, 1, 0.8, 1],
              opacity: [0, 0.5, 0.2, 0.5],
            }}
            transition={{
              delay: i * 0.3,
              duration: 3,
              repeat: Infinity,
              repeatDelay: 10,
              ease: "easeInOut",
            }}
          />
        ))}
        {/* Horizontal lines */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`h-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-game-grid/10 to-transparent w-full"
            style={{ top: `${15 + i * 14}%` }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: [0, 1, 0.8, 1],
              opacity: [0, 0.5, 0.2, 0.5],
            }}
            transition={{
              delay: i * 0.4 + 1,
              duration: 3,
              repeat: Infinity,
              repeatDelay: 12,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Animated grid intersections */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`dot-${i}`}
            className="absolute w-2 h-2 bg-game-grid/20 rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 0.5, 1, 0],
              opacity: [0, 0.8, 0.4, 0.8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-primary/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [0, -50, -100],
            x: [(Math.random() - 0.5) * 50],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;