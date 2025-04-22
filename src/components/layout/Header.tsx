
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Container from '@/components/ui/Container';
import { Button } from '@/components/ui/button';
import { ShoppingBag, User, LogOut, ChevronLeft } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Determine if scrolled for glass effect
      setScrolled(currentScrollPos > 20);
      
      // Determine visibility for hide/show on scroll
      if (currentScrollPos > prevScrollPos) {
        // Scrolling down
        if (currentScrollPos > 80 && visible) {
          setVisible(false);
        }
      } else {
        // Scrolling up - always show
        if (!visible) {
          setVisible(true);
        }
      }
      
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, visible]);

  // Don't show back button on main pages
  const showBackButton = !['/login', '/restaurants', '/'].includes(location.pathname);
  
  // For menu we want to show the restaurant name
  const isMenuPage = location.pathname.includes('/menu');
  
  // For order confirmation, we want to show "Order Confirmed"
  const isOrderConfirmation = location.pathname.includes('/order-confirmation');

  // Determine page title
  let pageTitle = "";
  if (isMenuPage) {
    pageTitle = "Menu";
  } else if (location.pathname.includes('/cart')) {
    pageTitle = "Your Cart";
  } else if (isOrderConfirmation) {
    pageTitle = "Order Confirmed";
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-morphism backdrop-blur-md' : 'bg-transparent'
      } ${visible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <Container className="flex items-center justify-between h-16">
        {showBackButton ? (
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Back</span>
          </button>
        ) : (
          <Link to="/" className="flex items-center">
            <span className="text-xl font-display font-bold text-primary">UniEats</span>
          </Link>
        )}
        
        {pageTitle && (
          <h1 className="text-lg font-medium absolute left-1/2 transform -translate-x-1/2">
            {pageTitle}
          </h1>
        )}
        
        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-scale-in">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => logout()}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;
