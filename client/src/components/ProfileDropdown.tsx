import { motion } from "framer-motion";
import { Link } from "wouter";
import { User, Bookmark, Calendar, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ProfileDropdownProps {
  onClose: () => void;
}

export default function ProfileDropdown({ onClose }: ProfileDropdownProps) {
  const menuItems = [
    { icon: User, label: "My Profile", href: "/profile" },
  ];

  const handleItemClick = () => {
    onClose();
  };

  const handleLogout = () => {
    onClose();
    window.location.href = "/api/logout";
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        data-testid="overlay-profile-dropdown"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="absolute right-0 top-12 w-56 bg-popover border border-popover-border rounded-2xl shadow-xl z-50 overflow-hidden"
        data-testid="dropdown-profile"
      >
        <div className="p-2">
          {menuItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleItemClick}
              className="flex items-center gap-3 px-3 py-2.5 hover-elevate rounded-lg transition-colors text-sm"
              data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <item.icon size={18} className="text-muted-foreground" />
              <span>{item.label}</span>
            </Link>
          ))}
          <Separator className="my-2" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 hover-elevate rounded-lg transition-colors text-sm w-full text-left text-destructive"
            data-testid="button-logout"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>
    </>
  );
}
