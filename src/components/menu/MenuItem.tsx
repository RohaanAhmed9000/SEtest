
import React from 'react';
import { useCart } from '@/context/CartContext';
import { MenuItem as MenuItemType } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const { addItem } = useCart();
  
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:shadow-sm transition-shadow">
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-base">{item.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
        <p className="mt-2 font-medium">${item.price.toFixed(2)}</p>
      </div>
      
      <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.name} 
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      
      <Button 
        size="icon" 
        className="rounded-full h-8 w-8 flex-shrink-0 bg-primary"
        onClick={() => addItem(item)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MenuItem;
