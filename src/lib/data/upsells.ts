// =========================================
// MOCK DATA: UPSELL ITEMS
// =========================================

export interface UpsellItem {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
}

export const mockUpsellItems: UpsellItem[] = [
    {
        id: 101,
        name: "Fresh Lime Soda",
        price: 80,
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200&q=80",
        category: "drinks"
    },
    {
        id: 102,
        name: "Extra Cheese",
        price: 50,
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&q=80",
        category: "addon"
    },
    {
        id: 103,
        name: "Papad Basket",
        price: 40,
        image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=200&q=80",
        category: "addon"
    },
    {
        id: 104,
        name: "Raita",
        price: 60,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&q=80",
        category: "addon"
    },
    {
        id: 105,
        name: "Gulab Jamun (2pc)",
        price: 80,
        image: "https://images.unsplash.com/photo-1589119672035-420dc958193a?w=200&q=80",
        category: "dessert"
    }
];

// Get upsell suggestions based on current cart
export function getUpsellSuggestions(cartCategories: string[]): UpsellItem[] {
    // Suggest items from categories not in cart
    return mockUpsellItems.filter(item => !cartCategories.includes(item.category));
}

export function getUpsellItemById(id: number): UpsellItem | undefined {
    return mockUpsellItems.find(item => item.id === id);
}
