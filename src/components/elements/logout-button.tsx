"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../hooks/use-auth";
import { Button } from "../ui/button";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function LogoutButton({ className, children, variant }: LogoutButtonProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout(() => {
        // Redirect to login page after successful logout
        router.push("/login");
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, redirect to login page
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant || "outline"}
      className={`flex items-center gap-2 ${className}`}
      onClick={handleLogout}
      disabled={isLoading}>
      <LogOut className="h-4 w-4" />
      {isLoading ? "Logging out..." : children || "Logout"}
    </Button>
  );
}
