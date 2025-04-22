
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Container from '@/components/ui/Container';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock } from 'lucide-react';

const OrderConfirmationPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(15 * 60); // 15 minutes in seconds
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
    
    // Redirect to restaurants if no order ID in state
    if (!location.state?.orderId) {
      navigate('/restaurants');
    }
  }, [isAuthenticated, isLoading, navigate, location.state]);
  
  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format countdown as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (isLoading || !location.state?.orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <Container className="pt-24 pb-16 animate-fade-in">
        <div className="max-w-lg mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4 animate-pulse-once">
              <CheckCircle className="h-16 w-16 text-primary" />
            </div>
          </div>
          
          <h1 className="text-3xl font-display font-bold mb-4">Order Confirmed!</h1>
          
          <p className="text-muted-foreground mb-8">
            Your order #{location.state.orderId} has been received and is being prepared.
          </p>
          
          <div className="rounded-xl bg-card border border-border p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-medium">Estimated Pickup Time</h2>
            </div>
            
            <div className="text-4xl font-display font-bold mt-2">
              {formatTime(countdown)}
            </div>
            
            <p className="text-muted-foreground mt-4">
              Head to the pickup counter with your student ID to collect your order.
            </p>
          </div>
          
          <Button
            onClick={() => navigate('/restaurants')}
            className="btn-primary"
          >
            Order More Food
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default OrderConfirmationPage;
