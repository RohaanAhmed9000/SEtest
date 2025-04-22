import { supabase } from '@/integrations/supabase/client';
import { Restaurant, MenuItem, CartItem, Order, restaurants as mockRestaurants, menuItems as mockMenuItems } from '@/data/mockData';

// Restaurant functions
export const getRestaurants = async () => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*');
    
  if (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
  
  // Map the database schema to the application type
  return data.map(restaurant => ({
    id: restaurant.id,
    name: restaurant.name,
    description: restaurant.description || '',
    image: restaurant.image_url || '/placeholder.svg',
    waitTime: '15-20 min', // Default wait time
    rating: 4.5, // Default rating
    cuisine: restaurant.cuisine_type || '',
  })) as Restaurant[];
};

export const addRestaurant = async (restaurant: Omit<Restaurant, 'id'> & { cuisine?: string }) => {
  const { data, error } = await supabase
    .from('restaurants')
    .insert([{
      name: restaurant.name,
      description: restaurant.description,
      image_url: restaurant.image,
      cuisine_type: restaurant.cuisine || ''
    }])
    .select();
    
  if (error) {
    console.error('Error adding restaurant:', error);
    throw error;
  }
  
  // Map the database response to the application type
  return {
    id: data[0].id,
    name: data[0].name,
    description: data[0].description || '',
    image: data[0].image_url || '/placeholder.svg',
    waitTime: '15-20 min', // Default wait time
    rating: 4.5, // Default rating
    cuisine: data[0].cuisine_type || '',
  } as Restaurant;
};

// Menu item functions
export const getMenuItems = async (restaurantId?: string) => {
  let query = supabase.from('menu_items').select('*');
  
  if (restaurantId) {
    query = query.eq('restaurant_id', restaurantId);
  }
  
  const { data, error } = await query;
    
  if (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
  
  // Map the database schema to the application type
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description || '',
    price: Number(item.price),
    image: item.image_url || '/placeholder.svg',
    restaurantId: item.restaurant_id,
    category: item.category || 'Main',
    available: item.available !== false, // Default to true if not set
    quantity: item.quantity || 0, // Default to 0 if not set
  })) as MenuItem[];
};

export const addMenuItem = async (menuItem: Omit<MenuItem, 'id'>) => {
  const { data, error } = await supabase
    .from('menu_items')
    .insert([{
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      image_url: menuItem.image,
      restaurant_id: menuItem.restaurantId,
      category: menuItem.category,
      available: menuItem.available
    }])
    .select();
    
  if (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
  
  // Map the database response to the application type
  return {
    id: data[0].id,
    name: data[0].name,
    description: data[0].description || '',
    price: Number(data[0].price),
    image: data[0].image_url || '/placeholder.svg',
    restaurantId: data[0].restaurant_id,
    category: data[0].category || 'Main',
    available: data[0].available !== false,
  } as MenuItem;
};

export const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
  // Convert from application type to database schema
  const dbUpdates: any = {};
  if (updates.name) dbUpdates.name = updates.name;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.price !== undefined) dbUpdates.price = updates.price;
  if (updates.image) dbUpdates.image_url = updates.image;
  if (updates.category) dbUpdates.category = updates.category;
  if (updates.available !== undefined) dbUpdates.available = updates.available;
  
  const { data, error } = await supabase
    .from('menu_items')
    .update(dbUpdates)
    .eq('id', id)
    .select();
    
  if (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
  
  // Map the database response to the application type
  return {
    id: data[0].id,
    name: data[0].name,
    description: data[0].description || '',
    price: Number(data[0].price),
    image: data[0].image_url || '/placeholder.svg',
    restaurantId: data[0].restaurant_id,
    category: data[0].category || 'Main',
    available: data[0].available !== false,
  } as MenuItem;
};

export const deleteMenuItem = async (id: string) => {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
  
  return true;
};

// Orders functions
export const createOrder = async (order: Omit<Order, 'id' | 'timestamp'> & { userId?: string }) => {
  try {
    console.log('Creating order with data:', {
      restaurantId: order.restaurantId,
      userId: order.userId,
      total: order.total,
      items: order.items
    });

    // First, verify the restaurant exists and get its ID
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('id')
      .eq('id', order.restaurantId)
      .single();

    if (restaurantError) {
      console.error('Error verifying restaurant:', restaurantError);
      throw new Error(`Failed to verify restaurant: ${restaurantError.message}`);
    }

    if (!restaurant) {
      throw new Error(`Restaurant with ID ${order.restaurantId} not found`);
    }

    console.log('Found restaurant:', restaurant);

    // Step 1: Create the order record
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        restaurant_id: restaurant.id, // Use the verified restaurant ID
        user_id: order.userId || '00000000-0000-0000-0000-000000000000', // Default anonymous user ID
        total_amount: order.total,
        status: order.status || 'pending'
      }])
      .select();
      
    if (orderError) {
      console.error('Error creating order record:', orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }
    
    if (!orderData || orderData.length === 0) {
      throw new Error('No order data returned from database');
    }
    
    const newOrderId = orderData[0].id;
    console.log('Order created successfully with ID:', newOrderId);
    
    // Step 2: Create the order items
    const orderItems = [];
    for (const item of order.items) {
      console.log('Creating order item:', {
        orderId: newOrderId,
        menuItemId: item.id,
        quantity: item.quantity,
        price: item.price
      });

      const { data: itemData, error: itemError } = await supabase
        .from('order_items')
        .insert([{
          order_id: newOrderId,
          menu_item_id: item.id,
          quantity: item.quantity,
          price_at_time: item.price
        }])
        .select();
        
      if (itemError) {
        console.error('Error creating order item:', itemError);
        throw new Error(`Failed to create order item: ${itemError.message}`);
      }
      
      if (itemData && itemData.length > 0) {
        orderItems.push(itemData[0]);
      }
    }
    
    console.log('All order items created successfully');
    
    // Step 3: Update menu item quantities
    for (const item of order.items) {
      // Get current quantity
      const { data: menuItem, error: menuItemError } = await supabase
        .from('menu_items')
        .select('quantity')
        .eq('id', item.id)
        .single();
        
      if (menuItemError) {
        console.error('Error fetching menu item quantity:', menuItemError);
        throw new Error(`Failed to fetch menu item quantity: ${menuItemError.message}`);
      }
      
      if (!menuItem) {
        throw new Error(`Menu item with ID ${item.id} not found`);
      }
      
      // Calculate new quantity
      const newQuantity = menuItem.quantity - item.quantity;
      if (newQuantity < 0) {
        throw new Error(`Insufficient quantity for item ${item.name}`);
      }
      
      // Update quantity
      const { error: updateError } = await supabase
        .from('menu_items')
        .update({ quantity: newQuantity })
        .eq('id', item.id);
        
      if (updateError) {
        console.error('Error updating menu item quantity:', updateError);
        throw new Error(`Failed to update menu item quantity: ${updateError.message}`);
      }
    }
    
    console.log('All menu item quantities updated successfully');
    
    // Map the database response to the application type with proper date conversion
    return {
      id: orderData[0].id,
      items: order.items,
      total: Number(orderData[0].total_amount),
      restaurantId: orderData[0].restaurant_id,
      timestamp: new Date(orderData[0].created_at),
      status: orderData[0].status,
      userId: orderData[0].user_id
    } as Order;
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
};

export const getUserOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId);
    
  if (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
  
  // Map the database schema to the application type with proper date conversion
  return data.map(order => ({
    id: order.id,
    items: [], // We'd need to fetch these separately
    total: Number(order.total_amount),
    restaurantId: order.restaurant_id,
    timestamp: new Date(order.created_at),
    status: order.status,
    userId: order.user_id
  })) as Order[];
};

export const getRestaurantOrders = async (restaurantId: string) => {
  // Fetch all orders for a specific restaurant
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false });
    
  if (ordersError) {
    console.error('Error fetching restaurant orders:', ordersError);
    throw ordersError;
  }
  
  // For each order, fetch its items
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          menu_items(*)
        `)
        .eq('order_id', order.id);
        
      if (itemsError) {
        console.error(`Error fetching items for order ${order.id}:`, itemsError);
        return {
          id: order.id,
          items: [],
          total: Number(order.total_amount),
          restaurantId: order.restaurant_id,
          timestamp: new Date(order.created_at),
          status: order.status,
          userId: order.user_id
        };
      }
      
      // Map order items to CartItem type
      const items = orderItems.map(item => {
        const menuItem = item.menu_items;
        return {
          id: menuItem.id,
          name: menuItem.name,
          description: menuItem.description || '',
          price: Number(item.price_at_time), // Use the price at time of order
          image: menuItem.image_url || '/placeholder.svg',
          restaurantId: menuItem.restaurant_id,
          category: menuItem.category || 'Main',
          available: menuItem.available !== false,
          quantity: item.quantity
        } as CartItem;
      });
      
      return {
        id: order.id,
        items: items,
        total: Number(order.total_amount),
        restaurantId: order.restaurant_id,
        timestamp: new Date(order.created_at),
        status: order.status,
        userId: order.user_id
      } as Order;
    })
  );
  
  return ordersWithItems;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select();
    
  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
  
  return {
    id: data[0].id,
    total: Number(data[0].total_amount),
    restaurantId: data[0].restaurant_id,
    timestamp: new Date(data[0].created_at),
    status: data[0].status,
    userId: data[0].user_id
  } as Partial<Order>;
};

// Function to populate the database with mock data
export const populateDatabase = async () => {
  try {
    // First, add all restaurants
    for (const restaurant of mockRestaurants) {
      const { error } = await supabase
        .from('restaurants')
        .insert([{
          id: restaurant.id, // Use the same UUID from mock data
          name: restaurant.name,
          description: restaurant.description,
          image_url: restaurant.image,
          cuisine_type: 'Various' // Default cuisine type
        }]);
      
      if (error) {
        console.error('Error adding restaurant:', error);
        // If it's a duplicate key error, we can ignore it
        if (!error.message.includes('duplicate key')) {
          throw error;
        }
      }
    }
    
    // Then, add all menu items
    for (const item of mockMenuItems) {
      const { error } = await supabase
        .from('menu_items')
        .insert([{
          id: item.id, // Use the same UUID from mock data
          name: item.name,
          description: item.description,
          price: item.price,
          image_url: item.image,
          restaurant_id: item.restaurantId,
          category: item.category,
          available: item.available
        }]);
      
      if (error) {
        console.error('Error adding menu item:', error);
        // If it's a duplicate key error, we can ignore it
        if (!error.message.includes('duplicate key')) {
          throw error;
        }
      }
    }
    
    console.log('Database populated successfully');
  } catch (error) {
    console.error('Error populating database:', error);
    throw error;
  }
};
