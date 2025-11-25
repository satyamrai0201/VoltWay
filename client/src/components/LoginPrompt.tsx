import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import energyVideoUrl from "@assets/generated_videos/ev_charging_power_energy_vortex.mp4";

export default function LoginPrompt() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={energyVideoUrl} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/70 to-accent/30" />
      <div className="text-center max-w-2xl relative z-10">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-lime-400 opacity-20 blur-2xl rounded-full"></div>
            <Zap className="w-24 h-24 text-lime-400 relative" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
          Welcome to <span className="text-lime-400">VoltWay</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto">
          Find, book, and manage electric vehicle charging stations with ease. Login to get started.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row justify-center">
          <Button
            onClick={handleLogin}
            size="lg"
            className="bg-lime-400 text-black hover:bg-lime-500 text-lg px-8 py-6"
            data-testid="button-login"
          >
            Login to VoltWay
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          Demo: Click login to access the platform with sample data
        </p>
      </div>
    </div>
  );
}
