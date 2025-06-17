
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ResetPasswordPage = () => {
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Extract parameters from URL
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const type = searchParams.get('type');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  useEffect(() => {
    const handleResetToken = async () => {
      // Check if there's an error in the URL
      if (error) {
        console.error('URL contains error:', error, errorDescription);
        setTokenValid(false);
        
        let errorMessage = "This password reset link is invalid or has expired.";
        if (error === 'access_denied') {
          if (errorDescription?.includes('expired')) {
            errorMessage = "This password reset link has expired. Please request a new password reset.";
          } else if (errorDescription?.includes('invalid')) {
            errorMessage = "This password reset link is invalid. Please request a new password reset.";
          }
        }
        
        toast({
          title: "Reset Link Error",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }

      // Check if we have the required tokens
      if (!accessToken || !refreshToken || type !== 'recovery') {
        console.error('Missing required tokens or invalid type');
        setTokenValid(false);
        toast({
          title: "Invalid Reset Link",
          description: "This password reset link is invalid or malformed.",
          variant: "destructive"
        });
        return;
      }

      try {
        console.log('Setting session with tokens...');
        // Set the session using the tokens from the URL
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (sessionError) {
          console.error('Session error:', sessionError);
          setTokenValid(false);
          toast({
            title: "Invalid Reset Link",
            description: "This password reset link is invalid or has expired.",
            variant: "destructive"
          });
        } else if (data.session) {
          console.log('Session set successfully, user can reset password');
          setTokenValid(true);
        } else {
          console.error('No session created');
          setTokenValid(false);
          toast({
            title: "Invalid Reset Link",
            description: "Unable to verify reset link. Please try again.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Token handling error:', error);
        setTokenValid(false);
        toast({
          title: "Invalid Reset Link",
          description: "This password reset link is invalid or has expired.",
          variant: "destructive"
        });
      }
    };

    handleResetToken();
  }, [accessToken, refreshToken, type, error, errorDescription, toast]);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tokenValid) {
      toast({
        title: "Invalid Session",
        description: "Your reset session is invalid. Please request a new password reset.",
        variant: "destructive"
      });
      return;
    }

    // Validate passwords
    const passwordError = validatePassword(passwords.newPassword);
    if (passwordError) {
      toast({
        title: "Invalid Password",
        description: passwordError,
        variant: "destructive"
      });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Updating password...');
      const { error } = await supabase.auth.updateUser({
        password: passwords.newPassword
      });

      if (error) {
        console.error('Password update failed:', error);
        toast({
          title: "Update Failed",
          description: error.message || "Failed to update password. Please try again.",
          variant: "destructive"
        });
      } else {
        console.log('Password updated successfully');
        setIsSuccess(true);
        
        // Sign out the user to ensure they log in with new credentials
        await supabase.auth.signOut();
        
        toast({
          title: "Password Updated",
          description: "Your password has been successfully updated. Please log in with your new password."
        });
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/lms', { replace: true });
        }, 2000);
      }
    } catch (error) {
      console.error('Unexpected error during password update:', error);
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestNewReset = () => {
    navigate('/lms', { replace: true });
  };

  // Show loading state while verifying token
  if (tokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-green-50">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying reset link...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state for invalid token
  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-green-50">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4 mx-auto">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-red-600">Reset Link Invalid</CardTitle>
            <CardDescription className="text-center">
              This password reset link is invalid, expired, or has already been used. Please request a new password reset.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-700">
                <strong>Common reasons for this error:</strong>
              </p>
              <ul className="text-sm text-amber-700 mt-2 space-y-1 list-disc list-inside">
                <li>The link was clicked more than once</li>
                <li>The link has expired (links expire after 1 hour)</li>
                <li>The link was corrupted or incomplete</li>
                <li>You already reset your password using this link</li>
              </ul>
            </div>
            
            <Button 
              onClick={handleRequestNewReset}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              Request New Password Reset
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-green-50">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4 mx-auto">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-green-600">Password Updated Successfully</CardTitle>
            <CardDescription>
              Your password has been successfully updated. You will be redirected to the login page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">
                Please log in with your new password to access your account.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Reset Your Password</CardTitle>
            <CardDescription>
              Please enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="new-password" className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  <strong>Password Requirements:</strong>
                </p>
                <ul className="text-xs text-blue-700 mt-1 space-y-1">
                  <li>• At least 6 characters long</li>
                  <li>• Must match the confirmation password</li>
                </ul>
              </div>

              {passwords.newPassword && passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-red-700">
                    Passwords do not match
                  </p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                disabled={isLoading || !passwords.newPassword || !passwords.confirmPassword}
              >
                {isLoading ? 'Updating Password...' : 'Update Password'}
              </Button>

              <div className="text-center">
                <Button 
                  type="button"
                  variant="link"
                  onClick={handleRequestNewReset}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Back to Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
