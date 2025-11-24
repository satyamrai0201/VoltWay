import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Play } from "lucide-react";
import heroImage from "@assets/generated_images/3d_hero_element_abstract.png";

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
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />
      
      <div className="relative max-w-7xl mx-auto w-full">
        <div className="relative">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 space-y-6 z-10"
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
                <div className="text-left">
                  <div className="text-sm font-semibold">2M+</div>
                  <div className="text-xs text-muted-foreground">World active user</div>
                </div>
              </div>

              <p className="text-base lg:text-lg leading-relaxed max-w-xs">
                The charging network that keeps your flow with AI tools and built-in graphics
              </p>
            </motion.div>

            <div className="lg:col-span-7" />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[12vw] lg:text-[10vw] xl:text-[9rem] font-black tracking-tighter leading-[0.85] -mt-12 lg:-mt-32 relative z-20"
            data-testid="text-hero-title"
          >
            VoltWay.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] lg:w-[60%] xl:w-[55%] z-10 pointer-events-none"
          >
            <img
              src={heroImage}
              alt="VoltWay 3D Element"
              className="w-full h-auto drop-shadow-2xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex justify-end mt-8 lg:mt-12 relative z-10"
          >
            <div className="text-right text-sm text-muted-foreground space-y-1">
              <div>
                <span className="text-foreground font-medium">Web-based</span> /01
              </div>
              <div>
                <span className="text-foreground font-medium">Collaborative</span> /02
              </div>
              <div>
                <span className="text-foreground font-medium">Real-time</span> /03
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="fixed bottom-12 right-12 z-40"
      >
        <Button
          size="icon"
          onClick={onHowItWorksClick}
          className="h-28 w-28 rounded-full bg-primary hover:bg-primary/90 shadow-2xl text-primary-foreground flex items-center justify-center"
          data-testid="button-floating-how-it-works"
        >
          <div className="flex items-center gap-2">
            <Play size={20} className="fill-current" />
            <span className="text-sm font-medium">How it works?</span>
          </div>
        </Button>
      </motion.div>
    </section>
  );
}
