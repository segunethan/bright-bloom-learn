
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface ForgotPasswordFormProps {
  onBack: () => void;
  userType: 'admin' | 'student';
}

const ForgotPasswordForm = ({ onBack, userType }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Attempting password reset for:', email);
      const result = await resetPassword(email);
      
      if (result.error) {
        console.error('Password reset failed:', result.error);
        toast({
          title: "Reset Failed",
          description: result.error,
          variant: "destructive"
        });
      } else {
        console.log('Password reset successful');
        setIsSuccess(true);
        toast({
          title: "Reset Email Sent",
          description: "Please check your email for password reset instructions."
        });
      }
    } catch (error) {
      console.error('Password reset failed with exception:', error);
      toast({
        title: "Reset Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4 mx-auto">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-green-600">Check Your Email</CardTitle>
          <CardDescription className="text-center">
            We've sent password reset instructions to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              <strong>Next steps:</strong>
            </p>
            <ol className="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the "Reset Password" link in the email</li>
              <li>You'll be redirected to a secure reset page</li>
              <li>Enter and confirm your new password</li>
              <li>Sign in with your new password</li>
            </ol>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-amber-700">
                  <strong>Important:</strong> The reset link will expire in 1 hour for security reasons.
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  If you don't see the email, please check your spam/junk folder.
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Each reset link can only be used once. If you need to reset again, you'll need to request a new link.
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={onBack}
            variant="outline" 
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a secure link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="reset-email" className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="reset-email"
                type="email"
                placeholder={userType === 'admin' ? 'admin@one234tech.com' : 'your.email@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              <strong>Note:</strong> Make sure to enter the email address associated with your {userType} account.
              You'll receive a secure reset link that expires in 1 hour.
            </p>
          </div>

          <Button 
            type="submit" 
            className={`w-full ${
              userType === 'admin' 
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700' 
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
            } text-white`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending Reset Email...' : 'Send Reset Email'}
          </Button>

          <Button 
            type="button"
            onClick={onBack}
            variant="outline" 
            className="w-full"
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
