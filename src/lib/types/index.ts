// =========================================
// CORE APPLICATION TYPES
// =========================================

// -----------------------------------------
// RESTAURANT TYPES
// -----------------------------------------
export interface Restaurant {
    id: string;
    name: string;
    tagline: string;
    address: string;
    distance: string;
    price: number;
    rating: number;
    reviews: number;
    timing: string;
    cuisines: string[];
    image: string;
    isOpen: boolean;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

export interface RestaurantFacility {
    name: string;
    icon: string; // Icon component name
    color: string;
}

// -----------------------------------------
// MENU TYPES
// -----------------------------------------
export interface MenuItem {
    id: number;
    name: string;
    price: number;
    category: string;
    rating: number;
    type: 'veg' | 'non-veg';
    image: string;
    bestSeller: boolean;
    description: string;
    available: boolean;
}

export interface MenuCategory {
    id: string;
    name: string;
    itemCount: number;
}

// -----------------------------------------
// ORDER TYPES
// -----------------------------------------
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
export type PaymentMethod = 'upi' | 'cash' | 'card';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface OrderItem {
    menuItemId: number;
    name: string;
    price: number;
    quantity: number;
    modifications?: string;
}

export interface Order {
    id: string;
    restaurantId: string;
    tableNumber: string;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    serviceCharge: number;
    total: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod?: PaymentMethod;
    createdAt: Date;
    updatedAt: Date;
    estimatedTime?: number; // minutes
}

// -----------------------------------------
// KITCHEN TYPES
// -----------------------------------------
export interface KitchenTicket {
    orderId: string;
    tableNumber: string;
    timeOrdered: Date;
    elapsedMinutes: number;
    priority: 'normal' | 'high' | 'rush';
    items: KitchenItem[];
}

export interface KitchenItem {
    name: string;
    quantity: number;
    modifications?: string;
    isReady: boolean;
}

// -----------------------------------------
// OFFER TYPES
// -----------------------------------------
export type OfferStatus = 'active' | 'expiring' | 'expired' | 'draft';
export type DiscountType = 'percent' | 'flat';

export interface Offer {
    id: number;
    restaurantId: string;
    menuItemId?: number;
    itemName: string;
    description?: string;
    discountType: DiscountType;
    discountValue: number;
    originalPrice: number;
    finalPrice: number;
    image?: string;
    status: OfferStatus;
    expiresAt: Date;
    views: number;
    likes: number;
    createdAt: Date;
}

// -----------------------------------------
// USER TYPES
// -----------------------------------------
export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
}

export interface UserAddress {
    id: string;
    userId: string;
    label: string;
    address: string;
    landmark?: string;
    isDefault: boolean;
}

// -----------------------------------------
// REVIEW TYPES
// -----------------------------------------
export interface Review {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    restaurantId: string;
    rating: number;
    text: string;
    images?: string[];
    likes: number;
    createdAt: Date;
}

// -----------------------------------------
// CART TYPES
// -----------------------------------------
export interface CartItem extends OrderItem {
    image?: string;
}

export interface Cart {
    restaurantId: string;
    tableNumber: string;
    items: CartItem[];
    subtotal: number;
}

// -----------------------------------------
// NOTIFICATION TYPES
// -----------------------------------------
export type NotificationType = 'order_update' | 'offer' | 'promo' | 'system';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
}

// -----------------------------------------
// MERCHANT TYPES
// -----------------------------------------
export interface MerchantStats {
    liveOrders: number;
    revenueToday: number;
    activeTables: number;
    totalTables: number;
    avgPrepTime: number;
}

export interface DailyEarnings {
    date: Date;
    totalOrders: number;
    totalRevenue: number;
    cashRevenue: number;
    digitalRevenue: number;
}
