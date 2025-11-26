import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import energyVideoUrl from "@assets/generated_videos/ev_charging_power_energy_vortex.mp4";
import { playZapSound } from "@/lib/zapSound";

interface LoginPromptProps {
  hideButton?: boolean;
}

export default function LoginPrompt({ hideButton = false }: LoginPromptProps) {
  const [zapTriggered, setZapTriggered] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Trigger zap animation and sound on mount
  useEffect(() => {
    // Play sound on first user interaction
    const handleFirstInteraction = () => {
      playZapSound();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    const timer = setTimeout(() => {
      setZapTriggered(true);
      // Setup play on first interaction
      document.addEventListener('click', handleFirstInteraction);
      document.addEventListener('touchstart', handleFirstInteraction);
    }, 300);

    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(contentTimer);
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  // Zap lightning bolt animation
  const zapVariants = {
    initial: { scale: 0, opacity: 0, rotate: -45 },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: { duration: 0.6, type: "spring", stiffness: 100 },
    },
    glow: {
      boxShadow: [
        "0 0 0px rgba(196, 255, 0, 0)",
        "0 0 30px rgba(196, 255, 0, 0.8)",
        "0 0 60px rgba(196, 255, 0, 0.4)",
        "0 0 0px rgba(196, 255, 0, 0)",
      ],
    },
  };

  // Content fade and slide up
  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Pulse animation for glow
  const glowVariants = {
    initial: { scale: 0.8, opacity: 0.3 },
    animate: {
      scale: [0.8, 1.2, 0.8],
      opacity: [0.3, 0.6, 0.3],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        preload="auto"
      >
        <source src={energyVideoUrl} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/70 to-accent/30" />

      {/* Lightning effect background */}
      {zapTriggered && (
        <motion.div
          className="absolute inset-0 bg-lime-400/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.4 }}
          style={{ pointerEvents: "none" }}
        />
      )}

      <div className="text-center max-w-2xl relative z-10">
        {/* Zap Icon with Animation */}
        <motion.div className="mb-8 flex justify-center">
          <motion.div
            className="relative"
            variants={zapVariants}
            initial="initial"
            animate={zapTriggered ? "animate" : "initial"}
          >
            {/* Outer glow pulse */}
            <motion.div
              className="absolute inset-0 bg-lime-400 opacity-20 blur-2xl rounded-full"
              variants={glowVariants}
              initial="initial"
              animate={zapTriggered ? "animate" : "initial"}
            />

            {/* Lightning rays effect */}
            {zapTriggered && (
              <>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-lime-400 to-transparent opacity-0"
                  animate={{ opacity: [0, 0.8, 0] }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute inset-0 border-2 border-lime-400 rounded-full"
                  animate={{ scale: [1, 1.3, 0.8], opacity: [1, 0.5, 0] }}
                  transition={{ duration: 0.4 }}
                />
              </>
            )}

            <motion.div
              animate={
                zapTriggered
                  ? { filter: ["drop-shadow(0 0 0px rgba(196, 255, 0, 1))", "drop-shadow(0 0 20px rgba(196, 255, 0, 0.8))", "drop-shadow(0 0 0px rgba(196, 255, 0, 0))"] }
                  : {}
              }
              transition={zapTriggered ? { duration: 0.5 } : {}}
            >
              <Zap className="w-24 h-24 text-lime-400 relative" strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Main Content - Fade In */}
        <motion.div
          variants={contentVariants}
          initial="initial"
          animate={showContent ? "animate" : "initial"}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
            Welcome to <span className="text-lime-400">VoltWay</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto">
            Find, book, and manage electric vehicle charging stations with ease. Login to get started.
          </p>

          {!hideButton && (
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleLogin}
                  size="lg"
                  className="bg-lime-400 text-black hover:bg-lime-500 text-lg px-8 py-6"
                  data-testid="button-login"
                >
                  Login to VoltWay
                </Button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
