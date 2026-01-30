import { writable } from 'svelte/store';

export interface MenuItem {
    id: number;
    name: string;
    price: string;
    desc?: string;
    image: string | null;
}

export interface Offer {
    id: number;
    item: string;
    discount: string;
    expiry: string;
    views: number;
    likes: number;
    image?: string | null; // Added image property
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
        expiry: "4h 12m",
        views: 1240,
        likes: 85,
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 102,
        item: "Family Feast Combo",
        discount: "₹150 OFF",
        expiry: "02:30:00",
        views: 850,
        likes: 120,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"
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
    approvalStatus: "approved"
};

export const menuItemsStore = writable<MenuItem[]>(initialMenuItems);
export const activeOffersStore = writable<Offer[]>(initialOffers);
export const profileStore = writable<MerchantProfile>(initialProfile);
