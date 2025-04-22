
import React from 'react';
import { useCart } from '@/context/CartContext';
import { CartItem as CartItemType } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  
  return (
    <div className="flex items-center gap-4 py-4 animate-fade-in">
      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.name} 
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-base truncate">{item.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">${item.price.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          size="icon" 
          variant="outline" 
          className="h-8 w-8"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <span className="w-6 text-center">{item.quantity}</span>
        
        <Button 
          size="icon" 
          variant="outline" 
          className="h-8 w-8"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      <Button 
        size="icon" 
        variant="ghost" 
        className="h-8 w-8 text-muted-foreground"
        onClick={() => removeItem(item.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CartItem;
