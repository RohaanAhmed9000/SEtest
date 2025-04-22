import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Lock, Mail } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

const AuthForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, resetPassword } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleForgotPassword = async () => {
    const email = form.getValues('email');
    if (!email) {
      toast.error('Please enter your email address first');
      return;
    }
    
    try {
      await resetPassword(email);
    } catch (error) {
      // Error is already handled in the resetPassword function
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      await login(values.email, values.password);
      navigate('/restaurants');
    } catch (error) {
      console.error('Login error:', error);
      // Error is already handled in the login function
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">Sign in to your account to order food</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-scale-in">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Email</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none z-10" />
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="you@university.edu"
                        hasLeftIcon
                        autoComplete="email"
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <button 
                      type="button"
                      className="text-xs text-primary hover:underline transition-all"
                      onClick={handleForgotPassword}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none z-10" />
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        hasLeftIcon
                        placeholder="••••••••"
                        autoComplete="current-password"
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full btn-primary h-12" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-dots">
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : 'Sign In'}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-primary hover:underline font-medium"
              >
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </Form>
      
      <div className="mt-8 pt-8 border-t border-border">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            form.setValue('email', 'guest@university.edu');
            form.setValue('password', 'password');
            toast.info('Guest credentials applied. Click Sign In to continue.');
          }}
        >
          Continue as guest
        </Button>
      </div>
    </div>
  );
};

export default AuthForm;
