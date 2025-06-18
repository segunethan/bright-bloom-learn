
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface StudentAuthTabsProps {
  loginData: {
    email: string;
    password: string;
  };
  setLoginData: (data: { email: string; password: string }) => void;
  signupData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  setSignupData: (data: { name: string; email: string; password: string; confirmPassword: string }) => void;
  onLogin: (e: React.FormEvent) => void;
  onSignup: (e: React.FormEvent) => void;
  isLoading: boolean;
  isLoginFormValid: boolean;
  isSignupFormValid: boolean;
  onForgotPassword: () => void;
}

const StudentAuthTabs = ({
  loginData,
  setLoginData,
  signupData,
  setSignupData,
  onLogin,
  onSignup,
  isLoading,
  isLoginFormValid,
  isSignupFormValid,
  onForgotPassword
}: StudentAuthTabsProps) => {
  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login" className="space-y-4 mt-4">
        <LoginForm
          loginData={loginData}
          setLoginData={setLoginData}
          onLogin={onLogin}
          isLoading={isLoading}
          isLoginFormValid={isLoginFormValid}
          onForgotPassword={onForgotPassword}
        />
      </TabsContent>

      <TabsContent value="signup" className="space-y-4 mt-4">
        <SignupForm
          signupData={signupData}
          setSignupData={setSignupData}
          onSignup={onSignup}
          isLoading={isLoading}
          isSignupFormValid={isSignupFormValid}
        />
      </TabsContent>
    </Tabs>
  );
};

export default StudentAuthTabs;
