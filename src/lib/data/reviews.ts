// =========================================
// MOCK DATA: REVIEWS
// =========================================

import type { Review } from '$lib/types';

export const mockReviews: Review[] = [
    {
        id: "rev-001",
        userId: "user-001",
        userName: "Rahul Sharma",
        userAvatar: "https://i.pravatar.cc/80?img=11",
        restaurantId: "1",
        rating: 5,
        text: "Amazing food and great ambiance! The butter chicken was perfectly spiced. Highly recommended for family dinners.",
        images: [
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&q=80",
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=150&q=80"
        ],
        likes: 24,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
        id: "rev-002",
        userId: "user-002",
        userName: "Priya Patel",
        userAvatar: "https://i.pravatar.cc/80?img=5",
        restaurantId: "1",
        rating: 4,
        text: "Great place for family dinners. Loved the biryani and the service! A bit crowded during weekends but worth it.",
        images: [],
        likes: 12,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
    },
    {
        id: "rev-003",
        userId: "user-003",
        userName: "Arjun Reddy",
        userAvatar: "https://i.pravatar.cc/80?img=12",
        restaurantId: "1",
        rating: 5,
        text: "Best restaurant in Jubilee Hills! Must try the paneer tikka. The vibes are immaculate.",
        images: [
            "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=150&q=80"
        ],
        likes: 45,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 2 weeks ago
    },
    {
        id: "rev-004",
        userId: "user-004",
        userName: "Sneha Gupta",
        userAvatar: "https://i.pravatar.cc/80?img=9",
        restaurantId: "2",
        rating: 5,
        text: "Authentic Hyderabadi biryani! The dum process is visible and the aroma is heavenly.",
        images: [
            "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&q=80"
        ],
        likes: 67,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
        id: "rev-005",
        userId: "user-005",
        userName: "Vikram Singh",
        userAvatar: "https://i.pravatar.cc/80?img=15",
        restaurantId: "3",
        rating: 4,
        text: "Wood-fired pizzas are amazing. The crust is perfectly crispy. Will definitely come back!",
        images: [],
        likes: 18,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
];

// Helper functions
export function getReviewById(id: string): Review | undefined {
    return mockReviews.find(review => review.id === id);
}

export function getReviewsByRestaurant(restaurantId: string): Review[] {
    return mockReviews.filter(review => review.restaurantId === restaurantId);
}

export function getReviewsByUser(userId: string): Review[] {
    return mockReviews.filter(review => review.userId === userId);
}

export function getAverageRating(restaurantId: string): number {
    const reviews = getReviewsByRestaurant(restaurantId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
}

export function getReviewCount(restaurantId: string): number {
    return getReviewsByRestaurant(restaurantId).length;
}

export function formatReviewDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${diffDays >= 14 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${diffDays >= 60 ? 's' : ''} ago`;
}
