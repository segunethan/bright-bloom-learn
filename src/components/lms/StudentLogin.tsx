
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLMS } from '../../contexts/LMSContext';
import { User, Lock, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ForgotPasswordForm from './ForgotPasswordForm';

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
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-4">
                <form onSubmit={handleLogin} className="space-y-4">
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
                    disabled={isLoading || !isLoginFormValid}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div className="text-center">
                  <Button 
                    type="button" 
                    variant="link" 
                    onClick={() => setShowForgotPassword(true)} 
                    className="text-green-600 hover:text-green-700 text-sm"
                  >
                    Forgot your password?
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-4">
                <form onSubmit={handleSignup} className="space-y-4">
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
                    disabled={isLoading || !isSignupFormValid}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

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
