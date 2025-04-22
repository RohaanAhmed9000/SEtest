
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AlertTriangle, ShoppingBag } from 'lucide-react';

const CartSummary: React.FC = () => {
  const { totalItems, totalPrice, placeOrder } = useCart();
  const navigate = useNavigate();
  const [isOrdering, setIsOrdering] = useState(false);
  
  const handlePlaceOrder = async () => {
    if (totalItems === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setIsOrdering(true);
    
    try {
      const orderId = await placeOrder();
      navigate('/order-confirmation', { state: { orderId } });
    } catch (error) {
      console.error('Order error:', error);
      toast.error('There was a problem placing your order. Please try again.');
    } finally {
      setIsOrdering(false);
    }
  };
  
  const serviceFee = totalPrice * 0.05; // 5% service fee
  const tax = totalPrice * 0.08; // 8% tax
  const orderTotal = totalPrice + serviceFee + tax;
  
  return (
    <div className="rounded-xl bg-card border border-border p-5 animate-scale-in">
      <h2 className="text-lg font-display font-semibold mb-4">Order Summary</h2>
      
      {totalItems === 0 ? (
        <div className="py-6 text-center">
          <div className="flex justify-center mb-3">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Your cart is empty</p>
          <Button 
            onClick={() => navigate('/restaurants')} 
            className="mt-4"
          >
            Browse Restaurants
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service Fee</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="border-t border-border pt-4 mb-6">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <Button 
            className="w-full btn-primary h-12"
            onClick={handlePlaceOrder}
            disabled={isOrdering}
          >
            {isOrdering ? (
              <div className="loading-dots">
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : 'Place Order'}
          </Button>
          
          <div className="mt-4 text-xs text-muted-foreground flex items-start gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            <p>
              This is a demo application. No real orders will be placed or charged.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSummary;
