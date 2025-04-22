
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthForm from '@/components/auth/AuthForm';
import Container from '@/components/ui/Container';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/restaurants');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Container className="py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-primary">UniEats</h1>
          <p className="text-muted-foreground mt-2">Order ahead. Skip the line.</p>
        </div>
        
        <AuthForm />
      </Container>
    </div>
  );
};

export default LoginPage;
