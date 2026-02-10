import { writable } from 'svelte/store';

export interface MenuItem {
    id: number;
    name: string;
    price: string;
    desc?: string;
    image: string | null;
}

export interface Offer {
    id: number | string;
    item: string; // Title
    discount?: string; // e.g. 20% OFF
    price?: string; // e.g. ₹200 (Legacy/fallback)
    originalPrice?: string; // Added: Real Price
    finalPrice?: string; // Added: Offer Price
    description?: string; // Added: Item Description
    expiry: string;
    views: number;
    likes: number;
    image?: string | null;
    status: 'Active' | 'Expiring' | 'Completed';
    date: string; // Created date or event date
    reach?: string | number;
}

// Demo Data with Images
const initialMenuItems: MenuItem[] = [
    {
        id: 1,
        name: "Hyderabadi Chicken Biryani",
        price: "350",
        desc: "Authentic dum biryani cooked with basmati rice and tender chicken, infused with saffron and spices.",
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 2,
        name: "Double Ka Meetha",
        price: "120",
        desc: "A rich Hyderabadi bread pudding dessert soaked in saffron milk and garnished with dry fruits.",
        image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 3,
        name: "Spicy Chicken 65",
        price: "280",
        desc: "Deep-fried chicken appetizer marinated with ginger, cayenne pepper, mustard powder and vinegar.",
        image: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 4,
        name: "Butter Naan",
        price: "45",
        desc: "Soft and fluffy leavened flatbread baked in a clay oven and brushed with butter.",
        image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=400&q=80",
    }
];

const initialOffers: Offer[] = [
    {
        id: 101,
        item: "Hyderabadi Chicken Biryani",
        discount: "20% OFF",
        originalPrice: "350",
        finalPrice: "280",
        description: "Authentic dum biryani cooked with basmati rice and tender chicken.",
        expiry: "4h 12m",
        views: 1240,
        likes: 85,
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80",
        status: 'Active',
        date: 'Today',
        reach: 2500
    },
    {
        id: 102,
        item: "Family Feast Combo",
        discount: "₹150 OFF",
        originalPrice: "850",
        finalPrice: "700",
        description: "Complete family meal with appetizer, main course and dessert.",
        expiry: "02:30:00",
        views: 850,
        likes: 120,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
        status: 'Expiring',
        date: 'Today',
        reach: 1800
    }
];

const initialPastOffers: Offer[] = [
    {
        id: "1",
        item: "Weekend Flash Sale",
        date: "21 Jan 2026",
        reach: "1,240",
        status: "Completed",
        price: "₹200",
        views: 2400,
        likes: 150,
        expiry: "Ended",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: "2",
        item: "Evening Rush Offer",
        date: "19 Jan 2026",
        reach: "850",
        status: "Completed",
        price: "₹120",
        views: 850,
        likes: 80,
        expiry: "Ended",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: "3",
        item: "New Launch Promo",
        date: "15 Jan 2026",
        reach: "2,100",
        status: "Completed",
        price: "₹500",
        views: 3200,
        likes: 450,
        expiry: "Ended",
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80",
    }
];

export interface MerchantProfile {
    businessName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    image: string | null;
    isPremium: boolean;
    category: string;
    type: 'veg' | 'non-veg' | 'both';
    phone: string;
    email: string;
    approvalStatus: 'new' | 'pending' | 'approved' | 'rejected';
    location: {
        lat: number;
        lng: number;
    };
}

const initialProfile: MerchantProfile = {
    businessName: "Paradise Biryani",
    street: "Plot 12, Hitec City Main Rd",
    city: "Hyderabad",
    state: "Telangana",
    zip: "500081",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80",
    isPremium: false,
    category: "Restaurant",
    type: "both",
    phone: "9876543210",
    email: "contact@paradise.com",
    approvalStatus: "approved",
    location: {
        lat: 17.4460,
        lng: 78.3880
    }
};

import type { Order, KitchenTicket, MerchantStats } from '$lib/types';
import { mockOrders, mockKitchenTickets, getActiveOrders, getCompletedOrders } from '$lib/data/orders';

export const menuItemsStore = writable<MenuItem[]>(initialMenuItems);
export const activeOffersStore = writable<Offer[]>(initialOffers);
export const pastOffersStore = writable<Offer[]>(initialPastOffers);
export const profileStore = writable<MerchantProfile>(initialProfile);

// Restored Stores for Kitchen and Order Management
export const liveOrdersStore = writable<Order[]>(getActiveOrders());
export const completedOrdersStore = writable<Order[]>(getCompletedOrders());
export const kitchenTicketsStore = writable<KitchenTicket[]>(mockKitchenTickets);

// Stats Store
const initialStats: MerchantStats = {
    liveOrders: getActiveOrders().length,
    revenueToday: 12450,
    activeTables: 8,
    totalTables: 24,
    avgPrepTime: 18
};

export const merchantStatsStore = writable<MerchantStats>(initialStats);
