import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { playZapSound } from "@/lib/zapSound";

export default function WelcomeOverlay() {
  const [isVisible, setIsVisible] = useState(true);
  const [zapTriggered, setZapTriggered] = useState(false);

  useEffect(() => {
    // Trigger zap animation immediately
    setZapTriggered(true);
    playZapSound();

    // Auto dismiss after animation completes (2 seconds)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const zapVariants = {
    animate: {
      scale: [0, 1, 1],
      opacity: [0, 1, 1],
      rotate: [-45, 0, 0],
      transition: { duration: 0.6, type: "spring", stiffness: 100 },
    },
  };

  const glowVariants = {
    animate: {
      scale: [0.8, 1.2, 0.8],
      opacity: [0.3, 0.6, 0.3],
      transition: { duration: 2, ease: "easeInOut" },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ pointerEvents: "none" }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Lightning effect background */}
          {zapTriggered && (
            <motion.div
              className="absolute inset-0 bg-lime-400/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.4 }}
            />
          )}

          {/* Zap Icon */}
          <div className="relative z-10 flex items-center justify-center">
            <motion.div
              className="relative"
              variants={zapVariants}
              initial="initial"
              animate="animate"
            >
              {/* Outer glow pulse */}
              <motion.div
                className="absolute inset-0 bg-lime-400 opacity-20 blur-3xl rounded-full w-40 h-40"
                variants={glowVariants}
                animate="animate"
              />

              {/* Lightning rays effect */}
              {zapTriggered && (
                <>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-lime-400 to-transparent opacity-0 w-40 h-40 rounded-full"
                    animate={{ opacity: [0, 0.8, 0] }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="absolute inset-0 border-2 border-lime-400 w-40 h-40 rounded-full"
                    animate={{
                      scale: [1, 1.3, 0.8],
                      opacity: [1, 0.5, 0],
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </>
              )}

              <motion.div
                animate={
                  zapTriggered
                    ? {
                        filter: [
                          "drop-shadow(0 0 0px rgba(196, 255, 0, 1))",
                          "drop-shadow(0 0 20px rgba(196, 255, 0, 0.8))",
                          "drop-shadow(0 0 0px rgba(196, 255, 0, 0))",
                        ],
                      }
                    : {}
                }
                transition={zapTriggered ? { duration: 0.5 } : {}}
              >
                <Zap className="w-32 h-32 text-lime-400" strokeWidth={1.5} />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
