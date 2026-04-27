require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userModel');
const Restaurant = require('./models/restaurantModel');
const MenuItem = require('./models/menuItemModel');
const Order = require('./models/orderModels');
const Review = require('./models/reviewModel');

const pizzasData = [
  { name: 'PEPPER BARBECUE CHICKEN', varients: ['small','medium','large'], prices: [{ small: 200, medium: 350, large: 400 }], category: 'nonveg', image: 'https://www.dominos.co.in/files/items/Pepper_Barbeque.jpg', description: 'Pepper Barbecue Chicken I Cheese', isVeg: false },
  { name: 'Farmhouse Pizza', varients: ['small','medium','large'], prices: [{ small: 200, medium: 280, large: 390 }], category: 'veg', image: 'https://media-cdn.tripadvisor.com/media/photo-s/0b/da/61/df/main-order-1-farmhouse.jpg', description: 'Farmhouse pizza I cheese', isVeg: true },
  { name: 'Jalapeno & Red Paprika Pizza', varients: ['small','medium','large'], prices: [{ small: 250, medium: 350, large: 450 }], category: 'veg', image: 'https://www.crazymasalafood.com/wp-content/images/jalepeno.jpg', description: 'Jalapeno & Red Paprika Pizza I Cheese', isVeg: true },
  { name: 'Margerita', varients: ['small','medium','large'], prices: [{ small: 150, medium: 240, large: 380 }], category: 'veg', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV7jY31On5-UCc82OwH5bK7nclEkVQGA7nAQ&usqp=CAU', description: 'Margerita double cheese', isVeg: true },
  { name: 'GOLDEN CORN PIZZA', varients: ['small','medium','large'], prices: [{ small: 180, medium: 220, large: 350 }], category: 'veg', image: 'https://www.crazymasalafood.com/wp-content/images/golden-1.jpg', description: 'Golden corn pizza I Cheese', isVeg: true },
  { name: 'Double Cheese Margerita Pizza', varients: ['small','medium','large'], prices: [{ small: 220, medium: 300, large: 410 }], category: 'veg', image: 'https://www.vhv.rs/dpng/d/408-4083655_dominos-pizza-slice-transparent-margherita-small-hand-tossed.png', description: 'Margerita double cheese', isVeg: true },
];

const burgerMenu = [
  { name: 'Classic Smash Burger', varients: ['regular','double'], prices: [{ regular: 199, double: 299 }], category: 'nonveg', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', description: 'Juicy smash patty with lettuce, tomato, cheese', isVeg: false },
  { name: 'Crispy Chicken Burger', varients: ['regular','spicy'], prices: [{ regular: 179, spicy: 199 }], category: 'nonveg', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400', description: 'Crispy fried chicken with coleslaw', isVeg: false },
  { name: 'Veg Aloo Tikki Burger', varients: ['regular'], prices: [{ regular: 129 }], category: 'veg', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400', description: 'Spiced potato patty with mint chutney', isVeg: true },
];

const biryaniMenu = [
  { name: 'Hyderabadi Dum Biryani', varients: ['half','full'], prices: [{ half: 249, full: 449 }], category: 'nonveg', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', description: 'Slow-cooked basmati rice with tender chicken', isVeg: false },
  { name: 'Veg Dum Biryani', varients: ['half','full'], prices: [{ half: 199, full: 349 }], category: 'veg', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', description: 'Fragrant basmati with mixed vegetables & saffron', isVeg: true },
  { name: 'Mutton Biryani', varients: ['half','full'], prices: [{ half: 299, full: 549 }], category: 'nonveg', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400', description: 'Slow-cooked tender mutton with aromatic spices', isVeg: false },
];

// 97 additional restaurants across categories
const restaurantTemplates = [
  // Pizza chains
  { name: "Pizza Palace", cuisines: ["Pizza","Italian"], cover: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600", delivery: 30, min: 150, rating: 4.1, city: "Mumbai" },
  { name: "Domino's Express", cuisines: ["Pizza","Fast Food"], cover: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600", delivery: 25, min: 149, rating: 4.3, city: "Delhi" },
  { name: "Pizza Corner", cuisines: ["Pizza","Italian","Desserts"], cover: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=600", delivery: 35, min: 200, rating: 3.9, city: "Pune" },
  { name: "Hot Pizza Hub", cuisines: ["Pizza"], cover: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=600", delivery: 40, min: 120, rating: 3.7, city: "Hyderabad" },
  { name: "The Pizza Lab", cuisines: ["Pizza","Burgers"], cover: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=600", delivery: 28, min: 180, rating: 4.4, city: "Bangalore" },
  { name: "Crust & Crumble", cuisines: ["Pizza","Italian"], cover: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600", delivery: 32, min: 199, rating: 4.0, city: "Chennai" },

  // Burger joints
  { name: "Big Bite Burgers", cuisines: ["Burgers","American"], cover: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600", delivery: 20, min: 99, rating: 4.2, city: "Mumbai" },
  { name: "Shake Shack Style", cuisines: ["Burgers","Shakes"], cover: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600", delivery: 22, min: 149, rating: 4.5, city: "Delhi" },
  { name: "The Burger Barn", cuisines: ["Burgers","Fast Food"], cover: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600", delivery: 18, min: 80, rating: 3.8, city: "Bangalore" },
  { name: "Gourmet Patties", cuisines: ["Burgers","American","Sandwiches"], cover: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600", delivery: 35, min: 250, rating: 4.6, city: "Pune" },
  { name: "Street Burger Co", cuisines: ["Burgers","Street Food"], cover: "https://images.unsplash.com/photo-1596956470007-2bf6095e7e16?w=600", delivery: 15, min: 80, rating: 3.9, city: "Hyderabad" },
  { name: "Double Stack Diner", cuisines: ["Burgers","American"], cover: "https://images.unsplash.com/photo-1460306855393-0410f61241c7?w=600", delivery: 25, min: 120, rating: 4.1, city: "Chennai" },

  // Biryani specialists
  { name: "Biryani Blues", cuisines: ["Biryani","North Indian"], cover: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600", delivery: 45, min: 249, rating: 4.4, city: "Hyderabad" },
  { name: "Paradise Biryani", cuisines: ["Biryani","Mughlai"], cover: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600", delivery: 40, min: 200, rating: 4.7, city: "Hyderabad" },
  { name: "Behrouz Biryani", cuisines: ["Biryani","Persian"], cover: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600", delivery: 50, min: 299, rating: 4.5, city: "Mumbai" },
  { name: "Royal Dum Biryani", cuisines: ["Biryani","Mughlai","North Indian"], cover: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600", delivery: 38, min: 220, rating: 4.2, city: "Delhi" },
  { name: "Spice Route Biryani", cuisines: ["Biryani","South Indian"], cover: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600", delivery: 42, min: 199, rating: 4.0, city: "Bangalore" },
  { name: "Dum Pukht Biryani", cuisines: ["Biryani","Awadhi"], cover: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600", delivery: 48, min: 279, rating: 4.3, city: "Lucknow" },

  // Chinese
  { name: "Dragon Palace", cuisines: ["Chinese","Asian"], cover: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600", delivery: 30, min: 150, rating: 3.9, city: "Mumbai" },
  { name: "Wok & Roll", cuisines: ["Chinese","Pan-Asian"], cover: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600", delivery: 28, min: 180, rating: 4.1, city: "Delhi" },
  { name: "Golden Dragon", cuisines: ["Chinese","Dim Sum"], cover: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600", delivery: 35, min: 200, rating: 4.3, city: "Bangalore" },
  { name: "Mandarin Kitchen", cuisines: ["Chinese","Szechuan"], cover: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600", delivery: 40, min: 249, rating: 4.0, city: "Chennai" },
  { name: "Noodle House", cuisines: ["Chinese","Noodles","Soups"], cover: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600", delivery: 25, min: 120, rating: 3.8, city: "Pune" },
  { name: "Panda Express Style", cuisines: ["Chinese","Fast Food"], cover: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600", delivery: 20, min: 100, rating: 3.7, city: "Hyderabad" },

  // Indian
  { name: "Punjabi Dhaba", cuisines: ["North Indian","Punjabi"], cover: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600", delivery: 30, min: 150, rating: 4.2, city: "Delhi" },
  { name: "South Indian Delight", cuisines: ["South Indian","Dosa","Idli"], cover: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600", delivery: 25, min: 100, rating: 4.4, city: "Chennai" },
  { name: "Rajdhani Thali", cuisines: ["Rajasthani","Gujarati","Thali"], cover: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600", delivery: 40, min: 200, rating: 4.3, city: "Ahmedabad" },
  { name: "Kerala Kitchen", cuisines: ["South Indian","Kerala","Seafood"], cover: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600", delivery: 35, min: 180, rating: 4.5, city: "Kochi" },
  { name: "Maa Ki Dal", cuisines: ["North Indian","Home Style"], cover: "https://images.unsplash.com/photo-1618449840665-9ed506d73a34?w=600", delivery: 30, min: 120, rating: 4.6, city: "Mumbai" },
  { name: "Chettinad House", cuisines: ["South Indian","Chettinad"], cover: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600", delivery: 38, min: 199, rating: 4.2, city: "Chennai" },

  // Desserts & Cafes
  { name: "Sweet Tooth Bakery", cuisines: ["Desserts","Bakery","Cakes"], cover: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600", delivery: 20, min: 80, rating: 4.3, city: "Mumbai" },
  { name: "Cravings Dessert Bar", cuisines: ["Desserts","Ice Cream"], cover: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600", delivery: 18, min: 60, rating: 4.5, city: "Bangalore" },
  { name: "The Waffle House", cuisines: ["Desserts","Waffles","Coffee"], cover: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600", delivery: 22, min: 100, rating: 4.4, city: "Delhi" },
  { name: "Gelato Republic", cuisines: ["Desserts","Ice Cream","Italian"], cover: "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=600", delivery: 15, min: 80, rating: 4.6, city: "Pune" },
  { name: "Rolls & Crepes", cuisines: ["Desserts","Crepes","French"], cover: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600", delivery: 25, min: 120, rating: 4.1, city: "Hyderabad" },

  // Fast Food
  { name: "Quick Bites", cuisines: ["Fast Food","Snacks"], cover: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600", delivery: 15, min: 60, rating: 3.8, city: "Mumbai" },
  { name: "Fry Station", cuisines: ["Fast Food","Fried Chicken"], cover: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600", delivery: 18, min: 80, rating: 3.9, city: "Delhi" },
  { name: "Wrap & Go", cuisines: ["Fast Food","Wraps","Rolls"], cover: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600", delivery: 20, min: 90, rating: 4.0, city: "Bangalore" },
  { name: "Taco Fiesta", cuisines: ["Mexican","Fast Food"], cover: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600", delivery: 22, min: 120, rating: 4.2, city: "Mumbai" },
  { name: "Sandwich Republic", cuisines: ["Sandwiches","Wraps","Fast Food"], cover: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600", delivery: 17, min: 80, rating: 4.0, city: "Chennai" },
  { name: "Hotdog Heaven", cuisines: ["Fast Food","American"], cover: "https://images.unsplash.com/photo-1619740455993-9d621e38c04d?w=600", delivery: 19, min: 80, rating: 3.7, city: "Pune" },

  // Healthy / Salads
  { name: "Green Bowl", cuisines: ["Healthy","Salads","Vegan"], cover: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600", delivery: 25, min: 150, rating: 4.3, city: "Bangalore" },
  { name: "Fit & Fresh", cuisines: ["Healthy","Juices","Smoothies"], cover: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600", delivery: 20, min: 120, rating: 4.4, city: "Mumbai" },
  { name: "The Salad Company", cuisines: ["Healthy","Salads"], cover: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600", delivery: 22, min: 130, rating: 4.1, city: "Delhi" },
  { name: "Keto Kitchen", cuisines: ["Healthy","Keto","Diet"], cover: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600", delivery: 30, min: 200, rating: 4.0, city: "Hyderabad" },

  // Seafood
  { name: "Catch of the Day", cuisines: ["Seafood","Coastal"], cover: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600", delivery: 40, min: 300, rating: 4.5, city: "Mumbai" },
  { name: "Goa Shack", cuisines: ["Seafood","Goan","Coastal"], cover: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=600", delivery: 35, min: 250, rating: 4.6, city: "Goa" },
  { name: "Fish & More", cuisines: ["Seafood","British"], cover: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600", delivery: 38, min: 280, rating: 4.2, city: "Chennai" },
  { name: "Prawn Paradise", cuisines: ["Seafood","South Indian"], cover: "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=600", delivery: 42, min: 299, rating: 4.3, city: "Kochi" },

  // Continental
  { name: "Bistro 21", cuisines: ["Continental","European"], cover: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600", delivery: 40, min: 350, rating: 4.4, city: "Mumbai" },
  { name: "The Fork & Knife", cuisines: ["Continental","French"], cover: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=600", delivery: 45, min: 400, rating: 4.5, city: "Delhi" },
  { name: "Mediterranean Bites", cuisines: ["Mediterranean","Greek","Continental"], cover: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600", delivery: 38, min: 300, rating: 4.3, city: "Bangalore" },
  { name: "Casa Italiana", cuisines: ["Italian","Pasta","Continental"], cover: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600", delivery: 35, min: 250, rating: 4.4, city: "Pune" },
  { name: "Le Petit Bistro", cuisines: ["French","Continental","Bakery"], cover: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600", delivery: 42, min: 350, rating: 4.6, city: "Mumbai" },

  // Street Food
  { name: "Chaat Corner", cuisines: ["Street Food","Indian Snacks"], cover: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600", delivery: 15, min: 50, rating: 4.0, city: "Delhi" },
  { name: "Pav Bhaji Palace", cuisines: ["Street Food","Mumbai"], cover: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600", delivery: 18, min: 60, rating: 4.3, city: "Mumbai" },
  { name: "Vada Pav Express", cuisines: ["Street Food","Fast Food"], cover: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600", delivery: 12, min: 40, rating: 4.1, city: "Mumbai" },
  { name: "Dilli Street", cuisines: ["Street Food","Chaat","Delhi"], cover: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600", delivery: 20, min: 80, rating: 4.2, city: "Delhi" },
  { name: "Bhel Puri Hub", cuisines: ["Street Food","Chaat"], cover: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600", delivery: 15, min: 50, rating: 3.9, city: "Ahmedabad" },

  // Thai / Asian
  { name: "Thai Garden", cuisines: ["Thai","Asian"], cover: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=600", delivery: 35, min: 200, rating: 4.3, city: "Mumbai" },
  { name: "Sushi Station", cuisines: ["Japanese","Sushi"], cover: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600", delivery: 40, min: 350, rating: 4.5, city: "Bangalore" },
  { name: "Ramen Republic", cuisines: ["Japanese","Ramen","Asian"], cover: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600", delivery: 35, min: 250, rating: 4.4, city: "Delhi" },
  { name: "Korean BBQ House", cuisines: ["Korean","BBQ","Asian"], cover: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600", delivery: 38, min: 300, rating: 4.2, city: "Mumbai" },
  { name: "Pho & More", cuisines: ["Vietnamese","Asian","Soups"], cover: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600", delivery: 30, min: 180, rating: 4.1, city: "Bangalore" },
  { name: "Pad Thai Corner", cuisines: ["Thai","Noodles"], cover: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600", delivery: 32, min: 160, rating: 4.0, city: "Pune" },

  // Mughlai
  { name: "Mughal Darbar", cuisines: ["Mughlai","North Indian"], cover: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600", delivery: 40, min: 250, rating: 4.4, city: "Delhi" },
  { name: "Nawabi Kitchen", cuisines: ["Mughlai","Awadhi"], cover: "https://images.unsplash.com/photo-1618449840665-9ed506d73a34?w=600", delivery: 45, min: 280, rating: 4.5, city: "Lucknow" },
  { name: "Kabab Factory", cuisines: ["Mughlai","Kebabs","North Indian"], cover: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600", delivery: 35, min: 200, rating: 4.3, city: "Mumbai" },
  { name: "Dum Mahal", cuisines: ["Mughlai","Biryani"], cover: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600", delivery: 42, min: 250, rating: 4.2, city: "Hyderabad" },

  // Breakfast / Brunch
  { name: "Morning Glory Cafe", cuisines: ["Breakfast","Cafe","Bakery"], cover: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600", delivery: 20, min: 100, rating: 4.4, city: "Bangalore" },
  { name: "The Egg Station", cuisines: ["Breakfast","Eggs","Cafe"], cover: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600", delivery: 22, min: 80, rating: 4.2, city: "Mumbai" },
  { name: "Pancake Paradise", cuisines: ["Breakfast","Brunch","Desserts"], cover: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600", delivery: 25, min: 120, rating: 4.5, city: "Delhi" },
  { name: "The Brunch Club", cuisines: ["Brunch","Continental","Cafe"], cover: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=600", delivery: 30, min: 200, rating: 4.3, city: "Bangalore" },

  // BBQ & Grills
  { name: "Smoky Grill House", cuisines: ["BBQ","Grills","American"], cover: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600", delivery: 40, min: 300, rating: 4.4, city: "Mumbai" },
  { name: "The Pit Master", cuisines: ["BBQ","American"], cover: "https://images.unsplash.com/photo-1558030006-450675393462?w=600", delivery: 45, min: 350, rating: 4.5, city: "Bangalore" },
  { name: "Tandoor Nights", cuisines: ["Tandoor","North Indian","Grills"], cover: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600", delivery: 35, min: 200, rating: 4.2, city: "Delhi" },
  { name: "Grill & Chill", cuisines: ["BBQ","Seafood","Grills"], cover: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600", delivery: 38, min: 280, rating: 4.3, city: "Goa" },

  // Vegan / Health
  { name: "Plant Based Co", cuisines: ["Vegan","Healthy"], cover: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600", delivery: 28, min: 180, rating: 4.4, city: "Bangalore" },
  { name: "The Vegan Corner", cuisines: ["Vegan","Salads","Wraps"], cover: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600", delivery: 30, min: 150, rating: 4.2, city: "Delhi" },
  { name: "Raw & Pure", cuisines: ["Vegan","Raw Food","Healthy"], cover: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600", delivery: 35, min: 200, rating: 4.0, city: "Mumbai" },

  // Steak / Non-veg specialty
  { name: "The Steak House", cuisines: ["Steaks","Continental","American"], cover: "https://images.unsplash.com/photo-1558030006-450675393462?w=600", delivery: 45, min: 500, rating: 4.6, city: "Mumbai" },
  { name: "Chick & Fry", cuisines: ["Fried Chicken","Fast Food"], cover: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600", delivery: 20, min: 100, rating: 4.0, city: "Delhi" },
  { name: "Wings & Things", cuisines: ["Chicken Wings","Burgers","American"], cover: "https://images.unsplash.com/photo-1624726175512-19b9baf9fbd1?w=600", delivery: 25, min: 150, rating: 4.1, city: "Bangalore" },
  { name: "Mutton Mania", cuisines: ["North Indian","Mughlai","Kebabs"], cover: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600", delivery: 40, min: 250, rating: 4.3, city: "Hyderabad" },

  // Regional Indian
  { name: "Andhra Spice Garden", cuisines: ["South Indian","Andhra","Spicy"], cover: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600", delivery: 30, min: 150, rating: 4.4, city: "Hyderabad" },
  { name: "Bengali Sweets & Food", cuisines: ["Bengali","Sweets","East Indian"], cover: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600", delivery: 35, min: 180, rating: 4.3, city: "Kolkata" },
  { name: "Maharashtrian Kitchen", cuisines: ["Maharashtrian","Street Food"], cover: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600", delivery: 28, min: 120, rating: 4.1, city: "Pune" },
  { name: "Himachali Dhaba", cuisines: ["Himachali","North Indian"], cover: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600", delivery: 38, min: 160, rating: 4.0, city: "Delhi" },
  { name: "Kashmiri Wazwan", cuisines: ["Kashmiri","Mughlai"], cover: "https://images.unsplash.com/photo-1618449840665-9ed506d73a34?w=600", delivery: 45, min: 300, rating: 4.5, city: "Srinagar" },

  // More variety
  { name: "Bowl'd Over", cuisines: ["Bowls","Healthy","Asian"], cover: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600", delivery: 25, min: 150, rating: 4.2, city: "Bangalore" },
  { name: "The Cloud Kitchen", cuisines: ["Multi-cuisine","Fast Food"], cover: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600", delivery: 20, min: 100, rating: 3.9, city: "Mumbai" },
  { name: "Desi Dhaba", cuisines: ["North Indian","Punjabi","Dal Makhani"], cover: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600", delivery: 32, min: 130, rating: 4.3, city: "Delhi" },
  { name: "Naan Stop", cuisines: ["North Indian","Breads","Curries"], cover: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600", delivery: 35, min: 150, rating: 4.1, city: "Mumbai" },
  { name: "Curry Nation", cuisines: ["Indian","Curries","Multi-cuisine"], cover: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600", delivery: 30, min: 180, rating: 4.0, city: "Bangalore" },
  { name: "Masala Magic", cuisines: ["Indian","Street Food","Chaat"], cover: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600", delivery: 22, min: 100, rating: 4.2, city: "Delhi" },
  { name: "The Thali Place", cuisines: ["Thali","South Indian","North Indian"], cover: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600", delivery: 35, min: 180, rating: 4.4, city: "Ahmedabad" },
  { name: "Idli & More", cuisines: ["South Indian","Breakfast"], cover: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600", delivery: 20, min: 80, rating: 4.3, city: "Chennai" },
  { name: "Filter Coffee House", cuisines: ["Cafe","South Indian","Breakfast"], cover: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600", delivery: 18, min: 60, rating: 4.5, city: "Chennai" },
  { name: "Sugar Rush Desserts", cuisines: ["Desserts","Cakes","Pastries"], cover: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600", delivery: 20, min: 80, rating: 4.6, city: "Pune" },
  { name: "Midnight Munchies", cuisines: ["Fast Food","Burgers","Pizza"], cover: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600", delivery: 15, min: 80, rating: 3.8, city: "Mumbai" },
];

const defaultMenu = [
  { name: 'Chef Special', varients: ['regular','large'], prices: [{ regular: 199, large: 299 }], category: 'special', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300', description: 'Chef curated special dish', isVeg: false },
  { name: 'Veg Platter', varients: ['regular'], prices: [{ regular: 149 }], category: 'veg', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300', description: 'Fresh vegetarian platter', isVeg: true },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await Promise.all([
    User.deleteMany({}), Restaurant.deleteMany({}),
    MenuItem.deleteMany({}), Order.deleteMany({}), Review.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  const [customer, owner1, owner2, owner3, admin] = await User.create([
    { name: 'Test Customer', email: 'customer@test.com', password: 'password123', role: 'customer', phone: '9876543210' },
    { name: 'Shey Pizza Owner', email: 'owner@test.com', password: 'password123', role: 'owner', phone: '9876543211' },
    { name: 'Burger Town Owner', email: 'burger@test.com', password: 'password123', role: 'owner', phone: '9876543212' },
    { name: 'Biryani House Owner', email: 'biryani@test.com', password: 'password123', role: 'owner', phone: '9876543213' },
    { name: 'Admin', email: 'admin@test.com', password: 'admin123', role: 'admin', phone: '9876543214' },
  ]);
  console.log('Users created');

  // Main 3 restaurants
  const [sheyPizza, burgerTown, biryaniHouse] = await Restaurant.create([
    { name: 'SHEY PIZZA', owner: owner1._id, cuisines: ['Pizza','Italian'], address: { street: '12 MG Road', city: 'Bangalore', pincode: '560001' }, isApproved: true, coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600', deliveryTime: 30, minOrder: 150, rating: 4.2 },
    { name: 'Burger Town', owner: owner2._id, cuisines: ['Burgers','American','Fast Food'], address: { street: '45 Brigade Road', city: 'Bangalore', pincode: '560025' }, isApproved: true, coverImage: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600', deliveryTime: 25, minOrder: 100, rating: 4.0 },
    { name: 'Biryani House', owner: owner3._id, cuisines: ['Biryani','North Indian','Mughlai'], address: { street: '78 Commercial Street', city: 'Bangalore', pincode: '560001' }, isApproved: true, coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600', deliveryTime: 40, minOrder: 200, rating: 4.5 },
  ]);

  // 97 extra restaurants (all owned by owner1 for simplicity)
  const extraRestaurants = await Restaurant.create(
    restaurantTemplates.map((r) => ({
      name: r.name,
      owner: owner1._id,
      cuisines: r.cuisines,
      address: { street: '1 Main Street', city: r.city || 'Bangalore', pincode: '560001' },
      isApproved: true,
      coverImage: r.cover,
      deliveryTime: r.delivery,
      minOrder: r.min,
      rating: r.rating,
      totalReviews: Math.floor(Math.random() * 500) + 10,
      isActive: true,
    }))
  );
  console.log(`Created ${extraRestaurants.length + 3} restaurants`);

  // Menu items for main 3
  await MenuItem.create([
    ...pizzasData.map((p) => ({ ...p, restaurant: sheyPizza._id })),
    ...burgerMenu.map((b) => ({ ...b, restaurant: burgerTown._id })),
    ...biryaniMenu.map((b) => ({ ...b, restaurant: biryaniHouse._id })),
    // Default menu for all extra restaurants
    ...extraRestaurants.flatMap((r) =>
      defaultMenu.map((m) => ({ ...m, restaurant: r._id }))
    ),
  ]);
  console.log('Menu items created');

  console.log('\n=== SEED COMPLETE ===');
  console.log(`Total restaurants: ${extraRestaurants.length + 3}`);
  console.log('Login credentials:');
  console.log('  Customer: customer@test.com / password123');
  console.log('  Pizza Owner: owner@test.com / password123');
  console.log('  Admin: admin@test.com / admin123');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
