
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLMS } from '../../contexts/LMSContext';
import { User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ForgotPasswordForm from './ForgotPasswordForm';
import StudentAuthTabs from './auth/StudentAuthTabs';

const StudentLogin = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const {
    signIn,
    signUp,
    isAuthenticated,
    currentUser
  } = useLMS();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated as student
  React.useEffect(() => {
    console.log('StudentLogin - Auth state:', { isAuthenticated, currentUser });
    if (isAuthenticated && currentUser) {
      console.log('User is authenticated, redirecting to dashboard');
      navigate('/lms/student');
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Attempting login with:', loginData.email);
      const result = await signIn(loginData.email, loginData.password);
      
      if (result.error) {
        console.error('Login error:', result.error);
        toast({
          title: "Login Failed",
          description: result.error,
          variant: "destructive"
        });
      } else {
        console.log('Login successful');
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in."
        });
        // Navigation will be handled by useEffect when auth state updates
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    if (signupData.password.length < 6) {
      toast({
        title: "Password Too Short", 
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Attempting signup with:', signupData.email);
      const result = await signUp(signupData.email, signupData.password, signupData.name, 'student');
      
      if (result.error) {
        console.error('Signup error:', result.error);
        toast({
          title: "Sign Up Failed",
          description: result.error,
          variant: "destructive"
        });
      } else {
        console.log('Signup successful');
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account."
        });
        // Clear form
        setSignupData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Sign up failed:', error);
      toast({
        title: "Sign Up Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if signup form is valid - fixed validation logic
  const isSignupFormValid = signupData.name.trim().length > 0 && 
                           signupData.email.trim().length > 0 && 
                           signupData.password.length >= 6 && 
                           signupData.confirmPassword.length >= 6 &&
                           signupData.password === signupData.confirmPassword;

  // Check if login form is valid
  const isLoginFormValid = loginData.email.trim().length > 0 && loginData.password.trim().length > 0;

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              One234 Tech LMS
            </h1>
            <p className="text-gray-600 mt-2">Reset your password</p>
          </div>
          <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} userType="student" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">One234Tech LMS</h1>
          <p className="text-gray-600 mt-2">Access your product courses</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Student Portal</CardTitle>
            <CardDescription>
              Sign in to access your courses or create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StudentAuthTabs
              loginData={loginData}
              setLoginData={setLoginData}
              signupData={signupData}
              setSignupData={setSignupData}
              onLogin={handleLogin}
              onSignup={handleSignup}
              isLoading={isLoading}
              isLoginFormValid={isLoginFormValid}
              isSignupFormValid={isSignupFormValid}
              onForgotPassword={() => setShowForgotPassword(true)}
            />

            <div className="mt-6 text-center">
              <Button variant="link" onClick={() => navigate('/lms/admin/login')} className="text-green-600 hover:text-green-700">
                Admin Access
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentLogin;
