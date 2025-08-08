import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Auth } from "./pages/Auth";
import { Dashboard } from "@/components/dashboard/Dashboard";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const handleLogin = (email: string, password: string) => {
    // Simulate authentication - in real app, this would validate with backend
    const userData = {
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email: email
    };
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {user ? (
          <Dashboard user={user} onLogout={handleLogout} />
        ) : (
          <Auth onLogin={handleLogin} />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
