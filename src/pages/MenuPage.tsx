import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import MenuList from '@/components/menu/MenuList';
import Container from '@/components/ui/Container';
import { Button } from '@/components/ui/button';
import { Restaurant, MenuItem } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { ShoppingBag } from 'lucide-react';
import { getRestaurants, getMenuItems } from '@/utils/databaseUtils';

const MenuPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { isAuthenticated, isLoading } = useAuth();
  const { totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [restaurantItems, setRestaurantItems] = useState<MenuItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Fetch restaurant and menu items data
  useEffect(() => {
    const fetchData = async () => {
      if (!restaurantId) return;
      
      console.log('Fetching data for restaurantId:', restaurantId);
      
      try {
        // Fetch restaurant data
        const restaurants = await getRestaurants();
        const foundRestaurant = restaurants.find(r => r.id === restaurantId);
        console.log('Found restaurant:', foundRestaurant);
        setRestaurant(foundRestaurant || null);
        
        if (foundRestaurant) {
          // Fetch menu items for this restaurant
          const items = await getMenuItems(restaurantId);
          console.log('Found menu items:', items);
          setRestaurantItems(items);
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchData();
  }, [restaurantId]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Redirect to restaurants if invalid restaurant ID
  useEffect(() => {
    if (!restaurant && !isLoadingData) {
      navigate('/restaurants');
    }
  }, [restaurant, isLoadingData, navigate]);
  
  if (isLoading || isLoadingData || !restaurant) {
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
      
      <div className="h-40 sm:h-56 relative overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <Container>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white drop-shadow-sm">
              {restaurant.name}
            </h1>
            <p className="text-white/90 text-sm sm:text-base max-w-xl line-clamp-2">
              {restaurant.description}
            </p>
          </Container>
        </div>
      </div>
      
      <Container className="py-6 sm:py-8 relative animate-fade-in">
        <MenuList items={restaurantItems} />
        
        {totalItems > 0 && (
          <div className="fixed bottom-6 left-0 right-0 flex justify-center z-20 animate-slide-in-up">
            <Button 
              onClick={() => navigate('/cart')}
              className="btn-primary shadow-lg py-6 px-5 space-x-6 h-auto"
            >
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5" />
                <span className="text-lg font-semibold">{totalItems}</span>
              </div>
              <span className="text-base">View Cart</span>
              <span className="text-base font-semibold">${totalPrice.toFixed(2)}</span>
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default MenuPage;
