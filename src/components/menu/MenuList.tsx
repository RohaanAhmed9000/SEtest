
import React, { useState, useMemo } from 'react';
import { MenuItem as MenuItemType } from '@/data/mockData';
import MenuItem from './MenuItem';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface MenuListProps {
  items: MenuItemType[];
}

const MenuList: React.FC<MenuListProps> = ({ items }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Group items by category
  const categorizedItems = useMemo(() => {
    const filtered = items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return filtered.reduce((acc, item) => {
      acc[item.category] = [...(acc[item.category] || []), item];
      return acc;
    }, {} as Record<string, MenuItemType[]>);
  }, [items, searchQuery]);
  
  // Get categories and sort them
  const categories = Object.keys(categorizedItems).sort();
  
  return (
    <div className="space-y-8">
      <div className="sticky top-16 z-10 -mx-4 px-4 pt-4 pb-2 bg-background/80 backdrop-blur-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 input-primary"
          />
        </div>
      </div>
      
      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No menu items found. Try a different search.</p>
        </div>
      ) : (
        categories.map((category) => (
          <div key={category} className="animate-fade-in">
            <h2 className="text-xl font-display font-semibold mb-4">{category}</h2>
            <div className="space-y-4">
              {categorizedItems[category].map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MenuList;
