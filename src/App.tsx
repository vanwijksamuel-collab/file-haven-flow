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

  try {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Toaster />
            <Sonner />
            {user ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              <Auth onLogin={handleLogin} />
            )}
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error('App render error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">LifeCloud</h1>
          <p>Loading application...</p>
        </div>
      </div>
    );
  }
};

export default App;
