export interface Restaurant {
  id: string;
  name: string;
  image: string;
  description: string;
  waitTime: string;
  rating: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  quantity: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  timestamp: Date;
  total: number;
  restaurantId: string;
}

export const restaurants: Restaurant[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Campus Café',
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    description: 'Fresh, healthy options for breakfast and lunch.',
    waitTime: '10-15 min',
    rating: 4.5,
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'The Grill House',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    description: 'Burgers, sandwiches, and more hot off the grill.',
    waitTime: '15-20 min',
    rating: 4.2,
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Noodle Bar',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    description: 'Asian-inspired noodle dishes and stir-fries.',
    waitTime: '10-15 min',
    rating: 4.7,
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    name: 'Salad Station',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    description: 'Build your own salad or choose from our signature options.',
    waitTime: '5-10 min',
    rating: 4.3,
  },
];

export const menuItems: MenuItem[] = [
  // Campus Café items
  {
    id: '00000000-0000-0000-0000-000000000101',
    restaurantId: '00000000-0000-0000-0000-000000000001',
    name: 'Avocado Toast',
    description: 'Sourdough toast with avocado, cherry tomatoes, and microgreens.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1588137378633-56c6d6b5d5c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Breakfast',
    available: true,
    quantity: 0,
  },
  {
    id: '00000000-0000-0000-0000-000000000102',
    restaurantId: '00000000-0000-0000-0000-000000000001',
    name: 'Granola Bowl',
    description: 'House-made granola with Greek yogurt and seasonal fruits.',
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Breakfast',
    available: true,
    quantity: 0,
  },
  {
    id: '00000000-0000-0000-0000-000000000103',
    restaurantId: '00000000-0000-0000-0000-000000000001',
    name: 'Veggie Wrap',
    description: 'Spinach tortilla with hummus, roasted vegetables, and feta cheese.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1551326844-4df70f78d0e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Lunch',
    available: true,
    quantity: 0,
  },
  {
    id: '00000000-0000-0000-0000-000000000104',
    restaurantId: '00000000-0000-0000-0000-000000000001',
    name: 'Chicken Caesar Salad',
    description: 'Romaine lettuce with grilled chicken, parmesan, and house-made dressing.',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Lunch',
    available: true,
    quantity: 0,
  },
  
  // The Grill House items
  {
    id: '00000000-0000-0000-0000-000000000201',
    restaurantId: '00000000-0000-0000-0000-000000000002',
    name: 'Classic Cheeseburger',
    description: 'Grass-fed beef patty with cheddar cheese, lettuce, tomato, and special sauce.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Burgers',
    available: true,
    quantity: 0,
  },
  {
    id: '00000000-0000-0000-0000-000000000202',
    restaurantId: '00000000-0000-0000-0000-000000000002',
    name: 'Veggie Burger',
    description: 'House-made plant-based patty with avocado, sprouts, and vegan aioli.',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Burgers',
    available: true,
    quantity: 0,
  },
  {
    id: '00000000-0000-0000-0000-000000000203',
    restaurantId: '00000000-0000-0000-0000-000000000002',
    name: 'Chicken Sandwich',
    description: 'Grilled chicken breast with bacon, lettuce, tomato, and honey mustard.',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Sandwiches',
    available: true,
    quantity: 0,
  },
  {
    id: '00000000-0000-0000-0000-000000000204',
    restaurantId: '00000000-0000-0000-0000-000000000002',
    name: 'Sweet Potato Fries',
    description: 'Crispy sweet potato fries with chipotle aioli.',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Sides',
    available: true,
    quantity: 0,
  },
  
  // Noodle Bar items
  {
    id: '00000000-0000-0000-0000-000000000301',
    restaurantId: '00000000-0000-0000-0000-000000000003',
    name: 'Ramen Bowl',
    description: 'Rich miso broth with wheat noodles, soft-boiled egg, and seasonal vegetables.',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Noodles',
    available: true,
    quantity: 0,
  },
  {
    id: '00000000-0000-0000-0000-000000000302',
    restaurantId: '00000000-0000-0000-0000-000000000003',
    name: 'Pad Thai',
    description: 'Rice noodles with tofu, bean sprouts, peanuts, and tamarind sauce.',
    price: 12.50,
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Noodles',
    available: true,
    quantity: 0,
  },
  {
    id: '00000000-0000-0000-0000-000000000303',
    restaurantId: '00000000-0000-0000-0000-000000000003',
    name: 'Vegetable Stir Fry',
    description: 'Seasonal vegetables and tofu stir-fried with garlic sauce, served with rice.',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1512058454905-6b841e7ad132?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Rice Dishes',
    available: true,
    quantity: 0,
  },
  {
    id: '00000000-0000-0000-0000-000000000304',
    restaurantId: '00000000-0000-0000-0000-000000000003',
    name: 'Chicken Yakisoba',
    description: 'Japanese-style stir-fried noodles with chicken and vegetables.',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1617421753170-46511a8d73fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Noodles',
    available: true,
    quantity: 0,
  },
  
  // Salad Station items
  {
    id: '00000000-0000-0000-0000-000000000401',
    restaurantId: '00000000-0000-0000-0000-000000000004',
    name: 'Mediterranean Bowl',
    description: 'Mixed greens with chickpeas, cucumber, tomato, feta, and lemon vinaigrette.',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Signature Salads',
    available: true,
    quantity: 0,
  },
  {
    id: '00000000-0000-0000-0000-000000000402',
    restaurantId: '00000000-0000-0000-0000-000000000004',
    name: 'Protein Power Bowl',
    description: 'Quinoa with grilled chicken, roasted sweet potato, avocado, and tahini dressing.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Grain Bowls',
    available: true,
    quantity: 0,
  },
  {
    id: '00000000-0000-0000-0000-000000000403',
    restaurantId: '00000000-0000-0000-0000-000000000004',
    name: 'Kale Caesar',
    description: 'Kale and romaine with parmesan, croutons, and house-made Caesar dressing.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Signature Salads',
    available: true,
    quantity: 0,
  },
  {
    id: '00000000-0000-0000-0000-000000000404',
    restaurantId: '00000000-0000-0000-0000-000000000004',
    name: 'Build Your Own Salad',
    description: 'Choose your greens, protein, toppings, and dressing.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Custom',
    available: true,
    quantity: 0,
  },
];
