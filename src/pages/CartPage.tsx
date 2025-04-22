
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import Container from '@/components/ui/Container';

const CartPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { items, restaurantId } = useCart();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  if (isLoading) {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="space-y-1 mb-6">
              <h1 className="text-2xl font-display font-bold">Your Cart</h1>
              <p className="text-muted-foreground">
                Review your items before placing your order
              </p>
            </div>
            
            <div className="space-y-2 divide-y divide-border">
              {items.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  Your cart is empty. Add some items to get started.
                </p>
              ) : (
                items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))
              )}
            </div>
          </div>
          
          <div className="md:col-span-1">
            <CartSummary />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CartPage;
