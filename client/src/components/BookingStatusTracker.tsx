import { motion } from "framer-motion";
import { Check, Clock, Navigation, Plug, Zap, CheckCircle2 } from "lucide-react";

type BookingStatus = "requested" | "confirmed" | "en_route" | "plugged" | "charging" | "completed";

interface BookingStatusTrackerProps {
  currentStatus: BookingStatus;
  stationName: string;
  estimatedTime?: string;
}

const statusSteps = [
  { id: "requested", label: "Requested", icon: Clock },
  { id: "confirmed", label: "Confirmed", icon: Check },
  { id: "en_route", label: "En Route", icon: Navigation },
  { id: "plugged", label: "Plugged In", icon: Plug },
  { id: "charging", label: "Charging", icon: Zap },
  { id: "completed", label: "Completed", icon: CheckCircle2 },
];

export default function BookingStatusTracker({
  currentStatus,
  stationName,
  estimatedTime,
}: BookingStatusTrackerProps) {
  const currentIndex = statusSteps.findIndex((step) => step.id === currentStatus);

  return (
    <div className="bg-card rounded-3xl p-8 border border-card-border" data-testid="tracker-booking-status">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-1">Booking Status</h3>
        <p className="text-muted-foreground">{stationName}</p>
        {estimatedTime && (
          <p className="text-sm text-muted-foreground mt-1">ETA: {estimatedTime}</p>
        )}
      </div>

      <div className="hidden md:block">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-border" />
          <motion.div
            className="absolute top-6 left-0 h-0.5 bg-primary z-10"
            initial={{ width: 0 }}
            animate={{
              width: `${(currentIndex / (statusSteps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center relative z-20">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                  className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                  data-testid={`status-${step.id}`}
                >
                  <Icon size={20} />
                </motion.div>
                <span
                  className={`text-sm font-medium text-center ${
                    isCompleted ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex items-center gap-4">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
                data-testid={`status-mobile-${step.id}`}
              >
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    isCompleted ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <p className="text-sm text-primary">In progress</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
