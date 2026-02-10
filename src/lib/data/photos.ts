// =========================================
// MOCK DATA: PHOTOS GALLERY
// =========================================

export interface Photo {
    id: string;
    restaurantId: string;
    url: string;
    caption?: string;
    uploadedBy: string;
    createdAt: Date;
}

export const mockPhotos: Photo[] = [
    {
        id: "photo-001",
        restaurantId: "1",
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=90",
        caption: "Beautiful ambiance",
        uploadedBy: "Restaurant",
        createdAt: new Date()
    },
    {
        id: "photo-002",
        restaurantId: "1",
        url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=90",
        caption: "Our signature dish",
        uploadedBy: "Restaurant",
        createdAt: new Date()
    },
    {
        id: "photo-003",
        restaurantId: "1",
        url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=90",
        caption: "Wood-fired pizza",
        uploadedBy: "Customer",
        createdAt: new Date()
    },
    {
        id: "photo-004",
        restaurantId: "1",
        url: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&q=90",
        caption: "Fresh ingredients",
        uploadedBy: "Restaurant",
        createdAt: new Date()
    },
    {
        id: "photo-005",
        restaurantId: "1",
        url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=90",
        caption: "Food presentation",
        uploadedBy: "Customer",
        createdAt: new Date()
    },
    {
        id: "photo-006",
        restaurantId: "1",
        url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=90",
        caption: "Colorful salad",
        uploadedBy: "Restaurant",
        createdAt: new Date()
    },
    {
        id: "photo-007",
        restaurantId: "2",
        url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=90",
        caption: "Hyderabadi Biryani",
        uploadedBy: "Restaurant",
        createdAt: new Date()
    },
    {
        id: "photo-008",
        restaurantId: "3",
        url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=90",
        caption: "Margherita Pizza",
        uploadedBy: "Restaurant",
        createdAt: new Date()
    }
];

// Helper functions
export function getPhotosByRestaurant(restaurantId: string): Photo[] {
    return mockPhotos.filter(photo => photo.restaurantId === restaurantId);
}

export function getPhotoUrls(restaurantId: string): string[] {
    return getPhotosByRestaurant(restaurantId).map(p => p.url);
}
