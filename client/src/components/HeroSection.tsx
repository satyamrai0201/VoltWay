import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, Zap } from "lucide-react";
import stationVideoUrl from "@assets/generated_videos/ev_charging_station_neon_night_scene.mp4";

interface HeroSectionProps {
  onHowItWorksClick?: () => void;
  onGetStartedClick?: () => void;
}

export default function HeroSection({ onHowItWorksClick, onGetStartedClick }: HeroSectionProps) {
  const userAvatars = [
    { id: 1, name: "User 1" },
    { id: 2, name: "User 2" },
    { id: 3, name: "User 3" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12 px-6" data-testid="section-hero">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={stationVideoUrl} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background" />
      
      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-3 bg-card rounded-full px-4 py-2 border shadow-sm">
              <div className="flex -space-x-2">
                {userAvatars.map((user) => (
                  <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-sm font-medium">2M+ active users</span>
            </div>

            <h1 className="text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.95]" data-testid="text-hero-title">
              VoltWay.
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
              The charging network that keeps your flow with AI tools and built-in stations across India
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                onClick={onGetStartedClick}
                className="rounded-full px-8 text-base"
                data-testid="button-get-started"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onHowItWorksClick}
                className="rounded-full px-8 text-base gap-2"
                data-testid="button-how-it-works"
              >
                <Play size={18} className="fill-current" />
                How it works?
              </Button>
            </div>

            <div className="flex gap-6 pt-6 text-sm text-muted-foreground">
              <div>
                <span className="block text-foreground font-medium">Web-based</span>
                /01
              </div>
              <div>
                <span className="block text-foreground font-medium">Real-time</span>
                /02
              </div>
              <div>
                <span className="block text-foreground font-medium">Collaborative</span>
                /03
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square bg-gradient-to-br from-primary/20 via-primary/10 to-background rounded-3xl shadow-2xl flex items-center justify-center border border-primary/20">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Zap size={120} className="text-primary/40" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="fixed bottom-8 right-8 z-40 hidden lg:block"
      >
        <Button
          size="icon"
          onClick={onHowItWorksClick}
          className="h-20 w-20 rounded-full bg-primary hover:bg-primary/90 shadow-2xl text-primary-foreground"
          data-testid="button-floating-how-it-works"
        >
          <Play size={24} className="fill-current" />
        </Button>
      </motion.div>
    </section>
  );
}
