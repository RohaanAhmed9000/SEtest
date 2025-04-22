import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import RestaurantList from '@/components/restaurants/RestaurantList';
import Container from '@/components/ui/Container';
import { Restaurant } from '@/data/mockData';
import { getRestaurants, populateDatabase } from '@/utils/databaseUtils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const RestaurantsPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);
  const [isPopulating, setIsPopulating] = useState(false);
  
  // Fetch restaurants from database
  const fetchRestaurants = async () => {
    try {
      const data = await getRestaurants();
      setRestaurants(data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast.error('Failed to load restaurants');
    } finally {
      setIsLoadingRestaurants(false);
    }
  };
  
  useEffect(() => {
    fetchRestaurants();
  }, []);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  const handlePopulateDatabase = async () => {
    setIsPopulating(true);
    try {
      await populateDatabase();
      toast.success('Database populated successfully');
      // Refresh the restaurants list
      await fetchRestaurants();
    } catch (error) {
      console.error('Error populating database:', error);
      toast.error('Failed to populate database');
    } finally {
      setIsPopulating(false);
    }
  };
  
  if (isLoading || isLoadingRestaurants) {
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
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-display font-bold">Restaurants</h1>
            {restaurants.length === 0 && (
              <Button 
                onClick={handlePopulateDatabase}
                disabled={isPopulating}
              >
                {isPopulating ? 'Adding Restaurants...' : 'Add Sample Restaurants'}
              </Button>
            )}
          </div>
          <p className="text-muted-foreground">
            Select a restaurant to view their menu and place an order
          </p>
        </div>
        
        <RestaurantList restaurants={restaurants} />
      </Container>
    </div>
  );
};

export default RestaurantsPage;
