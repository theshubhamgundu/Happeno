// =========================================
// MOCK DATA: RESTAURANTS
// =========================================

import type { Restaurant, RestaurantFacility } from '$lib/types';

export const mockRestaurants: Restaurant[] = [
    {
        id: "1",
        name: "The Spice Garden",
        tagline: "Fine Dining Experience • Vibe King",
        address: "Plot 45, Road No. 10, Jubilee Hills, Hyderabad",
        distance: "2.5 km",
        price: 1200,
        rating: 4.6,
        reviews: 1247,
        timing: "11:00 AM - 11:00 PM",
        cuisines: ["North Indian", "Continental", "Chinese"],
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=90",
        isOpen: true,
        coordinates: { lat: 17.4326, lng: 78.4071 }
    },
    {
        id: "2",
        name: "Biryani Blues",
        tagline: "Authentic Hyderabadi • Since 1985",
        address: "Banjara Hills, Road No. 12",
        distance: "1.8 km",
        price: 800,
        rating: 4.8,
        reviews: 2156,
        timing: "12:00 PM - 10:30 PM",
        cuisines: ["Biryani", "Mughlai", "Kebabs"],
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&q=90",
        isOpen: true,
        coordinates: { lat: 17.4156, lng: 78.4347 }
    },
    {
        id: "3",
        name: "Pizza Paradise",
        tagline: "Wood-fired Goodness",
        address: "Madhapur, Cyber Towers",
        distance: "3.2 km",
        price: 600,
        rating: 4.5,
        reviews: 987,
        timing: "11:00 AM - 11:00 PM",
        cuisines: ["Italian", "Pizza", "Pasta"],
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=90",
        isOpen: true,
        coordinates: { lat: 17.4486, lng: 78.3908 }
    },
    {
        id: "4",
        name: "Sushi Samurai",
        tagline: "Authentic Japanese",
        address: "Hitech City, Gachibowli",
        distance: "4.5 km",
        price: 1500,
        rating: 4.7,
        reviews: 654,
        timing: "12:00 PM - 10:00 PM",
        cuisines: ["Japanese", "Sushi", "Ramen"],
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&q=90",
        isOpen: false,
        coordinates: { lat: 17.4435, lng: 78.3772 }
    },
    {
        id: "5",
        name: "Cafe Mocha",
        tagline: "Cozy Coffee Corner",
        address: "Film Nagar, Road No. 1",
        distance: "1.2 km",
        price: 400,
        rating: 4.4,
        reviews: 432,
        timing: "8:00 AM - 10:00 PM",
        cuisines: ["Cafe", "Desserts", "Continental"],
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=90",
        isOpen: true,
        coordinates: { lat: 17.4256, lng: 78.4165 }
    }
];

export const mockFacilities: RestaurantFacility[] = [
    { name: "Indoor Seating", icon: "Users", color: "bg-blue-100 text-blue-600" },
    { name: "Free WiFi", icon: "Wifi", color: "bg-purple-100 text-purple-600" },
    { name: "Valet Parking", icon: "Car", color: "bg-emerald-100 text-emerald-600" },
    { name: "Card Payment", icon: "CreditCard", color: "bg-orange-100 text-orange-600" },
    { name: "Air Conditioned", icon: "Wind", color: "bg-cyan-100 text-cyan-600" },
    { name: "Live Music", icon: "Music", color: "bg-pink-100 text-pink-600" }
];

export function getRestaurantById(id: string): Restaurant | undefined {
    return mockRestaurants.find(r => r.id === id);
}

export function getRestaurantsBySearch(query: string): Restaurant[] {
    const q = query.toLowerCase();
    return mockRestaurants.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.cuisines.some(c => c.toLowerCase().includes(q))
    );
}

export function getNearbyRestaurants(limit?: number): Restaurant[] {
    const sorted = [...mockRestaurants].sort((a, b) =>
        parseFloat(a.distance) - parseFloat(b.distance)
    );
    return limit ? sorted.slice(0, limit) : sorted;
}

export function getOpenRestaurants(): Restaurant[] {
    return mockRestaurants.filter(r => r.isOpen);
}
