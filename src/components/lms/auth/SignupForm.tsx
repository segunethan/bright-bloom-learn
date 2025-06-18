
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Lock } from 'lucide-react';

interface SignupFormProps {
  signupData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  setSignupData: (data: { name: string; email: string; password: string; confirmPassword: string }) => void;
  onSignup: (e: React.FormEvent) => void;
  isLoading: boolean;
  isSignupFormValid: boolean;
}

const SignupForm = ({
  signupData,
  setSignupData,
  onSignup,
  isLoading,
  isSignupFormValid
}: SignupFormProps) => {
  // Calculate if form is valid locally to ensure button activation
  const isFormValid = signupData.name.trim().length > 0 && 
                     signupData.email.trim().length > 0 && 
                     signupData.password.length >= 6 && 
                     signupData.confirmPassword.length >= 6 &&
                     signupData.password === signupData.confirmPassword;

  return (
    <form onSubmit={onSignup} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="signup-name" className="text-sm font-medium text-gray-700">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            id="signup-name" 
            type="text" 
            placeholder="Enter your full name" 
            value={signupData.name} 
            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
            className="pl-10" 
            required 
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="signup-email" className="text-sm font-medium text-gray-700">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            id="signup-email" 
            type="email" 
            placeholder="your.email@example.com" 
            value={signupData.email} 
            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
            className="pl-10" 
            required 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="signup-password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            id="signup-password" 
            type="password" 
            placeholder="Create a password" 
            value={signupData.password} 
            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
            className="pl-10" 
            required 
            minLength={6} 
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="signup-confirm-password" className="text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            id="signup-confirm-password" 
            type="password" 
            placeholder="Confirm your password" 
            value={signupData.confirmPassword} 
            onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
            className="pl-10" 
            required 
            minLength={6} 
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white" 
        disabled={isLoading || !isFormValid}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default SignupForm;
