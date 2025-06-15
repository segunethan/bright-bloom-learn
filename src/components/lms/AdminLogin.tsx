import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLMS } from '../../contexts/LMSContext';
import { Settings, Lock, Mail, User, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ForgotPasswordForm from './ForgotPasswordForm';

const AdminLogin = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signIn, signUp, isAuthenticated, currentUser } = useLMS();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated as admin
  React.useEffect(() => {
    if (isAuthenticated && currentUser?.role === 'admin') {
      navigate('/lms/admin');
    } else if (isAuthenticated && currentUser?.role === 'student') {
      navigate('/lms/student');
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signIn(loginData.email, loginData.password);
      if (result.error) {
        toast({
          title: "Login Failed",
          description: result.error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in."
        });
        // Navigation will be handled by useEffect when currentUser updates
      }
    } catch (error) {
      console.error('Admin login failed:', error);
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
      const result = await signUp(signupData.email, signupData.password, signupData.name, 'admin');
      if (result.error) {
        if (result.error.includes('check your email')) {
          setSignupSuccess(true);
          toast({
            title: "Registration Successful!",
            description: result.error,
            duration: 10000
          });
        } else {
          toast({
            title: "Sign Up Failed",
            description: result.error,
            variant: "destructive"
          });
        }
      } else {
        setSignupSuccess(true);
        toast({
          title: "Admin Account Created!",
          description: "Please check your email to verify your account before signing in.",
          duration: 10000
        });
      }
      // Clear form
      setSignupData({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (error) {
      console.error('Admin sign up failed:', error);
      toast({
        title: "Sign Up Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent">
              Admin Portal
            </h1>
            <p className="text-gray-600 mt-2">Reset your admin password</p>
          </div>
          <ForgotPasswordForm 
            onBack={() => setShowForgotPassword(false)} 
            userType="admin"
          />
        </div>
      </div>
    );
  }

  if (signupSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4 mx-auto">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-green-600">Check Your Email</CardTitle>
              <CardDescription className="text-center">
                We've sent a verification link to your email address. Please click the link to verify your account and complete the registration process.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <strong>Next steps:</strong>
                </p>
                <ol className="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
                  <li>Check your email inbox (and spam folder)</li>
                  <li>Click the verification link in the email</li>
                  <li>Return here to sign in with your credentials</li>
                </ol>
              </div>
              
              <Button 
                onClick={() => setSignupSuccess(false)}
                variant="outline" 
                className="w-full"
              >
                Back to Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent">
            Admin Portal
          </h1>
          <p className="text-gray-600 mt-2">Manage courses and students</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Administrator Access</CardTitle>
            <CardDescription>
              Sign in to manage the LMS or create an admin account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Create Admin</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="admin-email" className="text-sm font-medium text-gray-700">
                      Admin Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@one234tech.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="admin-password" className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="Enter admin password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Access Admin Panel'}
                  </Button>
                </form>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-purple-600 hover:text-purple-700 text-sm"
                  >
                    Forgot your password?
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="admin-signup-name" className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="admin-signup-name"
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
                    <label htmlFor="admin-signup-email" className="text-sm font-medium text-gray-700">
                      Admin Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="admin-signup-email"
                        type="email"
                        placeholder="admin@one234tech.com"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="admin-signup-password" className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="admin-signup-password"
                        type="password"
                        placeholder="Create a secure password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="admin-signup-confirm-password" className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="admin-signup-confirm-password"
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

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-700">
                      <strong>Note:</strong> You'll receive an email verification link after registration. Please check your email (including spam folder) to verify your account.
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Admin Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => navigate('/lms')}
                className="text-purple-600 hover:text-purple-700"
              >
                Back to Student Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
