
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Restaurant } from '@/data/mockData';
import { Clock, Star } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="rounded-xl overflow-hidden bg-card shadow-sm border border-border hover:shadow-md card-hover cursor-pointer"
      onClick={() => navigate(`/menu/${restaurant.id}`)}
    >
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
          loading="lazy"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-display font-semibold text-lg">{restaurant.name}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mt-1 mb-3">{restaurant.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-muted-foreground text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>{restaurant.waitTime}</span>
          </div>
          
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-medium text-sm">{restaurant.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
