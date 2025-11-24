import { useState } from "react";
import LoginModal from "../LoginModal";
import { Button } from "@/components/ui/button";

export default function LoginModalExample() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Button onClick={() => setIsOpen(true)} data-testid="button-open-modal">
        Open Login Modal
      </Button>
      <LoginModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onLogin={(email, password) => console.log("Login:", { email, password })}
        onSignUpClick={() => console.log("Sign up clicked")}
      />
    </div>
  );
}
