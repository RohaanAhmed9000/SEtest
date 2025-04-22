import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CartItem, MenuItem, Order } from '../data/mockData';
import { createOrder } from '@/utils/databaseUtils';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  setRestaurantId: (id: string | null) => void;
  placeOrder: () => Promise<string>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('unieats-cart');
    const savedRestaurantId = localStorage.getItem('unieats-restaurant');
    
    console.log('Loading from localStorage:', {
      savedCart,
      savedRestaurantId
    });
    
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    
    if (savedRestaurantId) {
      setRestaurantId(savedRestaurantId);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('unieats-cart', JSON.stringify(items));
  }, [items]);

  // Save restaurantId to localStorage whenever it changes
  useEffect(() => {
    console.log('Saving restaurantId to localStorage:', restaurantId);
    if (restaurantId) {
      localStorage.setItem('unieats-restaurant', restaurantId);
    } else {
      localStorage.removeItem('unieats-restaurant');
    }
  }, [restaurantId]);

  const addItem = (item: MenuItem) => {
    console.log('Adding item to cart:', {
      item,
      currentRestaurantId: restaurantId
    });
    
    // Check if item is available and has sufficient quantity
    if (!item.available || item.quantity <= 0) {
      toast.error(`${item.name} is currently unavailable`);
      return;
    }
    
    // If cart is empty, set the restaurant ID
    if (items.length === 0 && !restaurantId) {
      setRestaurantId(item.restaurantId);
    }
    
    // Check if adding from a different restaurant
    if (restaurantId && restaurantId !== item.restaurantId) {
      if (window.confirm('Adding items from a different restaurant will clear your current cart. Continue?')) {
        setItems([{ ...item, quantity: 1 }]);
        setRestaurantId(item.restaurantId);
        toast.success(`Added ${item.name} to your cart`);
      }
      return;
    }
    
    // Check if item already exists in cart
    const existingItemIndex = items.findIndex(i => i.id === item.id);
    
    if (existingItemIndex >= 0) {
      // Item exists, check if we can add more
      const currentQuantity = items[existingItemIndex].quantity;
      if (currentQuantity + 1 > item.quantity) {
        toast.error(`Only ${item.quantity} ${item.name}(s) available`);
        return;
      }
      
      // Update quantity
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += 1;
      setItems(updatedItems);
    } else {
      // Item doesn't exist, add it
      setItems([...items, { ...item, quantity: 1 }]);
    }
    
    toast.success(`Added ${item.name} to your cart`);
  };

  const removeItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    
    // If cart is empty, reset restaurantId
    if (updatedItems.length === 0) {
      setRestaurantId(null);
    }
    
    toast.info('Item removed from cart');
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    // Check if requested quantity is available
    if (quantity > item.quantity) {
      toast.error(`Only ${item.quantity} ${item.name}(s) available`);
      return;
    }
    
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    );
    
    setItems(updatedItems);
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
    toast.info('Cart cleared');
  };
  
  const placeOrder = async (): Promise<string> => {
    if (!restaurantId) {
      toast.error('No restaurant selected');
      throw new Error('No restaurant selected');
    }
    
    console.log('Placing order with restaurantId:', restaurantId);
    
    try {
      // Create order in database
      const order = await createOrder({
        items: items,
        total: totalPrice,
        restaurantId: restaurantId,
        status: 'pending',
        userId: user?.id
      });
      
      // Clear cart after successful order
      setItems([]);
      setRestaurantId(null);
      localStorage.removeItem('unieats-cart');
      localStorage.removeItem('unieats-restaurant');
      
      toast.success('Order placed successfully!');
      return order.id;
    } catch (error) {
      console.error('Error creating order:', error);
      // Show more detailed error message in the UI
      if (error instanceof Error) {
        toast.error(`Failed to place order: ${error.message}`);
      } else {
        toast.error('There was a problem placing your order. Please try again.');
      }
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        setRestaurantId,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
