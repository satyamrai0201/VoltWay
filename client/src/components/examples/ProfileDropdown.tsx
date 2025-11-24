import { useState } from "react";
import ProfileDropdown from "../ProfileDropdown";
import { Button } from "@/components/ui/button";

export default function ProfileDropdownExample() {
  const [open, setOpen] = useState(true);

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="relative">
        <Button onClick={() => setOpen(!open)} data-testid="button-toggle">
          {open ? "Close" : "Open"} Profile Dropdown
        </Button>
        {open && (
          <ProfileDropdown
            onClose={() => setOpen(false)}
            onLogout={() => console.log("Logout clicked")}
          />
        )}
      </div>
    </div>
  );
}
