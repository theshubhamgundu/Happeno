// =========================================
// MOCK DATA: MENU ITEMS
// =========================================

import type { MenuItem, MenuCategory } from '$lib/types';

export const mockMenuCategories: MenuCategory[] = [
    { id: "best-sellers", name: "Best Sellers", itemCount: 4 },
    { id: "starters", name: "Starters", itemCount: 8 },
    { id: "main-course", name: "Main Course", itemCount: 12 },
    { id: "biryani", name: "Biryani", itemCount: 6 },
    { id: "desserts", name: "Desserts", itemCount: 5 },
    { id: "drinks", name: "Drinks", itemCount: 10 }
];

export const mockMenuItems: MenuItem[] = [
    {
        id: 1,
        name: "Butter Chicken",
        price: 450,
        category: "main-course",
        rating: 4.8,
        type: "non-veg",
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
        bestSeller: true,
        description: "Classic creamy tomato based gravy with tender chicken pieces, slow cooked to perfection.",
        available: true
    },
    {
        id: 2,
        name: "Paneer Tikka",
        price: 320,
        category: "starters",
        rating: 4.7,
        type: "veg",
        image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80",
        bestSeller: true,
        description: "Smoky tandoori paneer cubes marinated in spices, served with bell peppers and onions.",
        available: true
    },
    {
        id: 3,
        name: "Hyderabadi Biryani",
        price: 380,
        category: "biryani",
        rating: 4.9,
        type: "non-veg",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
        bestSeller: true,
        description: "Authentic slow-cooked dum biryani with saffron, served with raita and salan.",
        available: true
    },
    {
        id: 4,
        name: "Dal Makhani",
        price: 280,
        category: "main-course",
        rating: 4.6,
        type: "veg",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80",
        bestSeller: false,
        description: "Rich and creamy black lentils slow cooked overnight with butter and cream.",
        available: true
    },
    {
        id: 5,
        name: "Garlic Naan",
        price: 60,
        category: "main-course",
        rating: 4.5,
        type: "veg",
        image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=400&q=80",
        bestSeller: false,
        description: "Soft leavened bread topped with minced garlic and butter, baked in tandoor.",
        available: true
    },
    {
        id: 6,
        name: "Gulab Jamun",
        price: 120,
        category: "desserts",
        rating: 4.8,
        type: "veg",
        image: "https://images.unsplash.com/photo-1589119672035-420dc958193a?w=400&q=80",
        bestSeller: true,
        description: "Warm milk dumplings soaked in rose flavored sugar syrup, served hot.",
        available: true
    },
    {
        id: 7,
        name: "Chicken Tikka",
        price: 340,
        category: "starters",
        rating: 4.7,
        type: "non-veg",
        image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80",
        bestSeller: false,
        description: "Succulent chicken pieces marinated in yogurt and spices, cooked in clay oven.",
        available: true
    },
    {
        id: 8,
        name: "Veg Biryani",
        price: 280,
        category: "biryani",
        rating: 4.5,
        type: "veg",
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80",
        bestSeller: false,
        description: "Fragrant basmati rice layered with mixed vegetables and aromatic spices.",
        available: true
    },
    {
        id: 9,
        name: "Fresh Lime Soda",
        price: 80,
        category: "drinks",
        rating: 4.4,
        type: "veg",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200&q=80",
        bestSeller: false,
        description: "Refreshing lime soda, choose sweet or salted.",
        available: true
    },
    {
        id: 10,
        name: "Mango Lassi",
        price: 100,
        category: "drinks",
        rating: 4.6,
        type: "veg",
        image: "https://images.unsplash.com/photo-1571006682454-29c37b8698d2?w=200&q=80",
        bestSeller: false,
        description: "Creamy yogurt-based drink blended with fresh mango pulp.",
        available: true
    }
];

// Helper functions
export function getMenuItemById(id: number): MenuItem | undefined {
    return mockMenuItems.find(item => item.id === id);
}

export function getMenuItemsByCategory(categoryId: string): MenuItem[] {
    if (categoryId === "best-sellers") {
        return mockMenuItems.filter(item => item.bestSeller);
    }
    return mockMenuItems.filter(item => item.category === categoryId);
}

export function getMenuItemsByRestaurant(restaurantId: string): MenuItem[] {
    // In production, this would filter by restaurant
    // For now, return all items
    return mockMenuItems;
}

export function searchMenuItems(query: string): MenuItem[] {
    const q = query.toLowerCase();
    return mockMenuItems.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
}

export function getBestSellers(): MenuItem[] {
    return mockMenuItems.filter(item => item.bestSeller);
}

export function getAvailableItems(): MenuItem[] {
    return mockMenuItems.filter(item => item.available);
}
