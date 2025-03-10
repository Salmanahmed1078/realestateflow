import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, Mail, Lock, Eye, EyeOff, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '../stores/userStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isTemporary, setIsTemporary] = useState(false);
  const [sessionDuration, setSessionDuration] = useState('30');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, temporaryLogin } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Create a user object with the email and a mock name
      const user = {
        name: email.split('@')[0], // Use part of email as name for demo
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=random`
      };
      
      // Store user in the userStore based on login type
      if (isTemporary) {
        temporaryLogin(user, parseInt(sessionDuration));
        toast({
          title: "Temporary Login",
          description: `You have signed in temporarily for ${sessionDuration} minutes!`,
        });
      } else {
        login(user);
        toast({
          title: "Success",
          description: "You have successfully signed in!",
        });
      }
      
      // Navigate to homepage after successful login
      navigate('/');
    }, 1500);
  };

  // Handle Google Sign In
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    
    // In a real implementation, you would redirect to Google OAuth
    // For demo purposes, simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      
      // Create a mock Google user
      const user = {
        name: "Google User",
        email: "google.user@example.com",
        avatar: "https://ui-avatars.com/api/?name=Google+User&background=4285F4&color=fff"
      };
      
      // Store user in the userStore based on login type
      if (isTemporary) {
        temporaryLogin(user, parseInt(sessionDuration));
        toast({
          title: "Temporary Google Login",
          description: `Successfully signed in with Google for ${sessionDuration} minutes!`,
        });
      } else {
        login(user);
        toast({
          title: "Google Sign In",
          description: "Successfully signed in with Google!",
        });
      }
      navigate('/');
    }, 1500);
  };

  // Handle GitHub Sign In
  const handleGitHubSignIn = () => {
    setIsLoading(true);
    
    // In a real implementation, you would redirect to GitHub OAuth
    // For demo purposes, simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      
      // Create a mock GitHub user
      const user = {
        name: "GitHub User",
        email: "github.user@example.com",
        avatar: "https://ui-avatars.com/api/?name=GitHub+User&background=333&color=fff"
      };
      
      // Store user in the userStore based on login type
      if (isTemporary) {
        temporaryLogin(user, parseInt(sessionDuration));
        toast({
          title: "Temporary GitHub Login",
          description: `Successfully signed in with GitHub for ${sessionDuration} minutes!`,
        });
      } else {
        login(user);
        toast({
          title: "GitHub Sign In",
          description: "Successfully signed in with GitHub!",
        });
      }
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 animate-fade-in">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Building className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to access your RealEstateFlow account</p>
          </div>
          
          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/90">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="temporary" 
                  checked={isTemporary}
                  onCheckedChange={(checked) => setIsTemporary(checked === true)}
                />
                <div className="flex flex-col space-y-1">
                  <label
                    htmlFor="temporary"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300 flex items-center"
                  >
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    Temporary login
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Your session will expire after the selected time
                  </p>
                </div>
              </div>
              
              {isTemporary && (
                <div className="pl-6">
                  <label htmlFor="duration" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Session duration (minutes)
                  </label>
                  <Select value={sessionDuration} onValueChange={setSessionDuration}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
          
          {/* Social Login Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                  </g>
                </svg>
                Google
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleGitHubSignIn}
                disabled={isLoading}
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
                GitHub
              </Button>
            </div>
          </div>
          
          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-primary hover:text-primary/90">
                Sign up
              </Link>
            </p>
          </div>
        </div>
        
        {/* Real Estate Themed Background Elements */}
        <div className="fixed -z-10 inset-0 overflow-hidden opacity-10 dark:opacity-5 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full"></div>
          <div className="absolute top-1/4 left-1/4 w-60 h-60 bg-secondary rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-primary/70 rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/70 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;