import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

interface AuthProps {
  onLogin: (email: string, password: string) => void;
}

export const Auth = ({ onLogin }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (email: string, password: string) => {
    onLogin(email, password);
  };

  const handleRegister = (name: string, email: string, password: string) => {
    // For demo purposes, automatically log in after registration
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary-glow/10 rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">LifeCloud</h1>
          <p className="text-muted-foreground">Your secure cloud storage solution</p>
        </div>

        {/* Auth Forms */}
        {isLogin ? (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToRegister={() => setIsLogin(false)}
          />
        ) : (
          <RegisterForm
            onRegister={handleRegister}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
};