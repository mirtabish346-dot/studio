import placeholderImages from "./placeholder-images.json";
import type { MenuItem } from "@/context/cart-context";

export const restaurants = [
  {
    id: "1",
    name: "Milano's Pizzeria",
    description: "Authentic Italian pizza and pasta.",
    cuisine: "Italian",
    rating: 4.5,
    image: placeholderImages.placeholderImages.find((p) => p.id === "restaurant-1")?.imageUrl || "",
    imageHint: "italian restaurant",
  },
  {
    id: "2",
    name: "The Daily Grind",
    description: "Your favorite neighborhood cafe.",
    cuisine: "Cafe",
    rating: 4.7,
    image: placeholderImages.placeholderImages.find((p) => p.id === "restaurant-2")?.imageUrl || "",
    imageHint: "cozy cafe",
  },
  {
    id: "3",
    name: "Taco Fiesta",
    description: "Fresh and flavorful Mexican street food.",
    cuisine: "Mexican",
    rating: 4.3,
    image: placeholderImages.placeholderImages.find((p) => p.id === "restaurant-3")?.imageUrl || "",
    imageHint: "mexican food",
  },
  {
    id: "4",
    name: "Sushi House",
    description: "Premium quality sushi and Japanese dishes.",
    cuisine: "Japanese",
    rating: 4.8,
    image: placeholderImages.placeholderImages.find((p) => p.id === "restaurant-4")?.imageUrl || "",
    imageHint: "sushi bar",
  },
  {
    id: "5",
    name: "Burger Barn",
    description: "Classic American burgers and shakes.",
    cuisine: "American",
    rating: 4.2,
    image: placeholderImages.placeholderImages.find((p) => p.id === "restaurant-5")?.imageUrl || "",
    imageHint: "american diner",
  },
  {
    id: "6",
    name: "Spice Route",
    description: "A journey through the flavors of India.",
    cuisine: "Indian",
    rating: 4.6,
    image: placeholderImages.placeholderImages.find((p) => p.id === "restaurant-6")?.imageUrl || "",
    imageHint: "indian food",
  },
];

type MenuData = {
    [key: string]: {
        restaurantId: string;
        name: string;
        items: MenuItem[];
    }
}

export const menus: MenuData = {
  "1": {
    restaurantId: "1",
    name: "Milano's Pizzeria",
    items: [
      {
        id: "m1-1",
        name: "Margherita Pizza",
        description: "Classic cheese and tomato pizza.",
        price: 12.99,
        image: placeholderImages.placeholderImages.find((p) => p.id === "menu-pizza")?.imageUrl || "",
        imageHint: "margherita pizza",
      },
      {
        id: "m1-2",
        name: "Spaghetti Carbonara",
        description: "Creamy pasta with bacon and parmesan.",
        price: 15.99,
        image: placeholderImages.placeholderImages.find((p) => p.id === "menu-pasta")?.imageUrl || "",
        imageHint: "spaghetti carbonara",
      },
    ],
  },
  "2": {
    restaurantId: "2",
    name: "The Daily Grind",
    items: [
      { id: "m2-1", name: "Avocado Toast", description: "Healthy and delicious.", price: 8.99, image: "", imageHint: "avocado toast" },
      { id: "m2-2", name: "Latte", description: "Freshly brewed espresso with steamed milk.", price: 4.50, image: "", imageHint: "latte coffee" },
    ],
  },
  "3": {
    restaurantId: "3",
    name: "Taco Fiesta",
    items: [
      {
        id: "m3-1",
        name: "Carne Asada Tacos",
        description: "Three grilled steak tacos.",
        price: 10.99,
        image: placeholderImages.placeholderImages.find((p) => p.id === "menu-tacos")?.imageUrl || "",
        imageHint: "beef tacos",
      },
      { id: "m3-2", name: "Chips and Guacamole", description: "Freshly made guacamole.", price: 6.99, image: "", imageHint: "chips guacamole" },
    ],
  },
  "4": {
    restaurantId: "4",
    name: "Sushi House",
    items: [
      {
        id: "m4-1",
        name: "California Roll",
        description: "8 pieces of classic California roll.",
        price: 9.99,
        image: placeholderImages.placeholderImages.find((p) => p.id === "menu-sushi")?.imageUrl || "",
        imageHint: "sushi platter",
      },
      { id: "m4-2", name: "Tuna Nigiri", description: "2 pieces of fresh tuna on rice.", price: 7.99, image: "", imageHint: "tuna nigiri" },
    ],
  },
  "5": {
    restaurantId: "5",
    name: "Burger Barn",
    items: [
      {
        id: "m5-1",
        name: "Classic Cheeseburger",
        description: "Juicy beef patty with cheddar cheese.",
        price: 11.99,
        image: placeholderImages.placeholderImages.find((p) => p.id === "menu-burger")?.imageUrl || "",
        imageHint: "cheeseburger fries",
      },
      { id: "m5-2", name: "Onion Rings", description: "Crispy fried onion rings.", price: 5.99, image: "", imageHint: "onion rings" },
    ],
  },
  "6": {
    restaurantId: "6",
    name: "Spice Route",
    items: [
      {
        id: "m6-1",
        name: "Chicken Tikka Masala",
        description: "Creamy and flavorful chicken curry.",
        price: 16.99,
        image: placeholderImages.placeholderImages.find((p) => p.id === "menu-curry")?.imageUrl || "",
        imageHint: "chicken curry",
      },
      { id: "m6-2", name: "Garlic Naan", description: "Soft bread with garlic and butter.", price: 3.99, image: "", imageHint: "garlic naan" },
    ],
  },
};

export const userOrders = [
  {
    id: "ORDER-001",
    restaurantName: "Milano's Pizzeria",
    date: "2024-05-20",
    total: 28.98,
    status: "Delivered",
    items: [
      { itemId: "m1-1", quantity: 1 },
      { itemId: "m1-2", quantity: 1 },
    ]
  },
  {
    id: "ORDER-002",
    restaurantName: "Taco Fiesta",
    date: "2024-05-21",
    total: 17.98,
    status: "Delivered",
    items: [
      { itemId: "m3-1", quantity: 1 },
      { itemId: "m3-2", quantity: 1 },
    ]
  },
  {
    id: "ORDER-003",
    restaurantName: "Burger Barn",
    date: new Date().toLocaleDateString('en-CA'),
    total: 18.98,
    status: "Out for Delivery",
    items: [
        { itemId: "m5-1", quantity: 1 },
        { itemId: "m5-2", quantity: 1 },
    ]
  },
];

export const adminOrders = [
  ...userOrders,
  {
    id: "ORDER-004",
    restaurantName: "Sushi House",
    date: new Date().toLocaleDateString('en-CA'),
    total: 25.50,
    status: "Preparing",
    customer: "Jane Doe",
    deliveryPartner: "Unassigned",
    items: [
        { itemId: "m4-1", quantity: 1 },
        { itemId: "m4-2", quantity: 2 },
    ]
  },
];

export const adminUsers = [
    { id: 'USR-001', name: 'Alice Johnson', email: 'alice@example.com', role: 'Customer', registered: '2023-01-15' },
    { id: 'USR-002', name: 'Bob Williams', email: 'bob@example.com', role: 'Customer', registered: '2023-02-20' },
    { id: 'USR-003', name: 'Charlie Brown', email: 'delivery@omniserve.com', role: 'Delivery Partner', registered: '2023-03-10' },
    { id: 'USR-004', name: 'Diana Prince', email: 'admin@omniserve.com', role: 'Admin', registered: '2023-01-01' },
];

export const adminProviders = [
    { id: 'PROV-001', name: "Dave's Deli", type: 'Food', status: 'Approved', joined: '2023-05-20' },
    { id: 'PROV-002', name: 'Quick Meds', type: 'Medicine', status: 'Approved', joined: '2023-06-15' },
    { id: 'PROV-003', name: "Sarah's Groceries", type: 'Grocery', status: 'Pending', joined: '2024-05-10' },
];

export const deliveryPartners = ["John Smith", "Maria Garcia", "Chen Wei", "Fatima Al-Sayed"];

export const userProfile = {
    name: 'Customer',
    email: 'customer@omniserve.com',
    phone: '123-456-7890',
    addresses: [
      { id: 'addr1', type: 'Home', line1: '123 Main St', city: 'Anytown', pincode: '12345', isDefault: true },
      { id: 'addr2', type: 'Work', line1: '456 Business Ave', city: 'Anytown', pincode: '12345', isDefault: false },
    ]
};
