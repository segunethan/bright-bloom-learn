
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock } from 'lucide-react';

interface LoginFormProps {
  loginData: {
    email: string;
    password: string;
  };
  setLoginData: (data: { email: string; password: string }) => void;
  onLogin: (e: React.FormEvent) => void;
  isLoading: boolean;
  isLoginFormValid: boolean;
  onForgotPassword: () => void;
}

const LoginForm = ({
  loginData,
  setLoginData,
  onLogin,
  isLoading,
  isLoginFormValid,
  onForgotPassword
}: LoginFormProps) => {
  // Calculate if form is valid locally to ensure button activation
  const isFormValid = loginData.email.trim().length > 0 && loginData.password.trim().length > 0;

  return (
    <div className="space-y-4">
      <form onSubmit={onLogin} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="login-email" className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              id="login-email" 
              type="email" 
              placeholder="your.email@example.com" 
              value={loginData.email} 
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              className="pl-10" 
              required 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="login-password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              id="login-password" 
              type="password" 
              placeholder="Enter your password" 
              value={loginData.password} 
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              className="pl-10" 
              required 
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white" 
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="text-center">
        <Button 
          type="button" 
          variant="link" 
          onClick={onForgotPassword} 
          className="text-green-600 hover:text-green-700 text-sm"
        >
          Forgot your password?
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
