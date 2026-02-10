// =========================================
// MOCK DATA: OFFERS
// =========================================

import type { Offer } from '$lib/types';

export const mockOffers: Offer[] = [
    {
        id: 1,
        restaurantId: "1",
        menuItemId: 1,
        itemName: "Butter Chicken",
        description: "Classic creamy tomato based gravy with tender chicken",
        discountType: "percent",
        discountValue: 20,
        originalPrice: 450,
        finalPrice: 360,
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
        status: "active",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        views: 1250,
        likes: 245,
        createdAt: new Date()
    },
    {
        id: 2,
        restaurantId: "1",
        menuItemId: 3,
        itemName: "Hyderabadi Biryani",
        description: "Authentic dum biryani with saffron and spices",
        discountType: "flat",
        discountValue: 80,
        originalPrice: 380,
        finalPrice: 300,
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
        status: "expiring",
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
        views: 890,
        likes: 156,
        createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000)
    },
    {
        id: 3,
        restaurantId: "2",
        itemName: "Weekend Combo",
        description: "Biryani + Kebab + Dessert",
        discountType: "percent",
        discountValue: 25,
        originalPrice: 800,
        finalPrice: 600,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
        status: "active",
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 2 days
        views: 2500,
        likes: 430,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
        id: 4,
        restaurantId: "3",
        itemName: "Pizza Party",
        description: "Any 2 Medium Pizzas + Garlic Bread",
        discountType: "flat",
        discountValue: 200,
        originalPrice: 999,
        finalPrice: 799,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
        status: "active",
        expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000), // 3 days
        views: 1800,
        likes: 320,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
    },
    {
        id: 5,
        restaurantId: "1",
        itemName: "Lunch Special",
        description: "Thali with unlimited refills",
        discountType: "percent",
        discountValue: 15,
        originalPrice: 350,
        finalPrice: 298,
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80",
        status: "expired",
        expiresAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Expired 2 hours ago
        views: 3200,
        likes: 567,
        createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000)
    }
];

// Helper functions
export function getOfferById(id: number): Offer | undefined {
    return mockOffers.find(offer => offer.id === id);
}

export function getOffersByRestaurant(restaurantId: string): Offer[] {
    return mockOffers.filter(offer => offer.restaurantId === restaurantId);
}

export function getActiveOffers(): Offer[] {
    return mockOffers.filter(offer =>
        offer.status === 'active' || offer.status === 'expiring'
    );
}

export function getExpiringOffers(): Offer[] {
    return mockOffers.filter(offer => offer.status === 'expiring');
}

export function getExpiredOffers(): Offer[] {
    return mockOffers.filter(offer => offer.status === 'expired');
}

export function formatExpiryTime(date: Date): string {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();

    if (diffMs <= 0) return "Expired";

    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
        const diffMins = Math.floor(diffMs / (60 * 1000));
        return `${diffMins}m left`;
    }
    if (diffHours < 24) return `${diffHours}h left`;
    return `${diffDays}D left`;
}

export function calculateDiscount(originalPrice: number, discountType: 'percent' | 'flat', discountValue: number): number {
    if (discountType === 'percent') {
        return Math.round(originalPrice - (originalPrice * discountValue / 100));
    }
    return originalPrice - discountValue;
}

export function formatDiscountString(discountType: 'percent' | 'flat', discountValue: number): string {
    if (discountType === 'percent') {
        return `${discountValue}% OFF`;
    }
    return `₹${discountValue} OFF`;
}
