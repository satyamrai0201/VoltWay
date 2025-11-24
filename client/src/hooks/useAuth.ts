import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isHost: boolean;
}

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const logout = async () => {
    try {
      await fetch("/api/logout");
      // Clear cache and redirect to login
      queryClient.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    user: user as AuthUser | undefined,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
