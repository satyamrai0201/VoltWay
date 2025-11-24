import { useState } from "react";
import BookingStatusTracker from "../BookingStatusTracker";
import { Button } from "@/components/ui/button";

const statuses = ["requested", "confirmed", "en_route", "plugged", "charging", "completed"] as const;

export default function BookingStatusTrackerExample() {
  const [statusIndex, setStatusIndex] = useState(0);

  const nextStatus = () => {
    setStatusIndex((prev) => (prev + 1) % statuses.length);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <BookingStatusTracker
          currentStatus={statuses[statusIndex]}
          stationName="DLF Cyber Hub Station"
          estimatedTime="5 mins"
        />
        <div className="text-center">
          <Button onClick={nextStatus} data-testid="button-next-status">
            Next Status
          </Button>
        </div>
      </div>
    </div>
  );
}
