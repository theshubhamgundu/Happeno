// =========================================
// MOCK DATA: ORDERS
// =========================================

import type { Order, KitchenTicket, OrderStatus } from '$lib/types';

// Sample orders for merchant view
export const mockOrders: Order[] = [
    {
        id: "ORD-9281",
        restaurantId: "1",
        tableNumber: "04",
        items: [
            { menuItemId: 1, name: "Butter Chicken", price: 450, quantity: 1 },
            { menuItemId: 5, name: "Garlic Naan", price: 60, quantity: 2 },
            { menuItemId: 4, name: "Jeera Rice", price: 120, quantity: 1 }
        ],
        subtotal: 690,
        tax: 86,
        serviceCharge: 35,
        total: 811,
        status: "preparing",
        paymentStatus: "pending",
        createdAt: new Date(Date.now() - 12 * 60 * 1000), // 12 mins ago
        updatedAt: new Date(),
        estimatedTime: 15
    },
    {
        id: "ORD-9282",
        restaurantId: "1",
        tableNumber: "07",
        items: [
            { menuItemId: 2, name: "Paneer Tikka", price: 320, quantity: 1 },
            { menuItemId: 9, name: "Fresh Lime Soda", price: 80, quantity: 2 }
        ],
        subtotal: 480,
        tax: 60,
        serviceCharge: 24,
        total: 564,
        status: "ready",
        paymentStatus: "pending",
        createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
        updatedAt: new Date(),
        estimatedTime: 0
    },
    {
        id: "ORD-9283",
        restaurantId: "1",
        tableNumber: "11",
        items: [
            { menuItemId: 3, name: "Hyderabadi Biryani", price: 380, quantity: 2 },
            { menuItemId: 9, name: "Coke", price: 60, quantity: 2 }
        ],
        subtotal: 880,
        tax: 110,
        serviceCharge: 44,
        total: 1034,
        status: "served",
        paymentStatus: "pending",
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
        updatedAt: new Date(),
        estimatedTime: 0
    },
    {
        id: "ORD-9280",
        restaurantId: "1",
        tableNumber: "02",
        items: [
            { menuItemId: 4, name: "Dal Makhani", price: 280, quantity: 1 },
            { menuItemId: 5, name: "Roti", price: 30, quantity: 4 }
        ],
        subtotal: 400,
        tax: 50,
        serviceCharge: 20,
        total: 470,
        status: "completed",
        paymentStatus: "paid",
        paymentMethod: "upi",
        createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        updatedAt: new Date()
    }
];

// Kitchen tickets derived from orders
export const mockKitchenTickets: KitchenTicket[] = [
    {
        orderId: "ORD-9281",
        tableNumber: "04",
        timeOrdered: new Date(Date.now() - 12 * 60 * 1000),
        elapsedMinutes: 12,
        priority: "high",
        items: [
            { name: "Butter Chicken", quantity: 1, modifications: "Less spicy", isReady: false },
            { name: "Garlic Naan", quantity: 2, modifications: "Crispy", isReady: true },
            { name: "Jeera Rice", quantity: 1, isReady: false }
        ]
    },
    {
        orderId: "ORD-9284",
        tableNumber: "09",
        timeOrdered: new Date(Date.now() - 5 * 60 * 1000),
        elapsedMinutes: 5,
        priority: "normal",
        items: [
            { name: "Paneer Tikka", quantity: 1, modifications: "Extra mint chutney", isReady: false },
            { name: "Fresh Lime Soda", quantity: 2, modifications: "Salted", isReady: false }
        ]
    },
    {
        orderId: "ORD-9285",
        tableNumber: "12",
        timeOrdered: new Date(Date.now() - 2 * 60 * 1000),
        elapsedMinutes: 2,
        priority: "normal",
        items: [
            { name: "Hyderabadi Biryani", quantity: 2, modifications: "With extra salan", isReady: false }
        ]
    }
];

// Helper functions
export function getOrderById(id: string): Order | undefined {
    return mockOrders.find(order => order.id === id);
}

export function getOrdersByStatus(status: OrderStatus): Order[] {
    return mockOrders.filter(order => order.status === status);
}

export function getActiveOrders(): Order[] {
    return mockOrders.filter(order =>
        order.status !== 'completed' && order.status !== 'cancelled'
    );
}

export function getCompletedOrders(): Order[] {
    return mockOrders.filter(order => order.status === 'completed');
}

export function getOrdersByTable(tableNumber: string): Order[] {
    return mockOrders.filter(order => order.tableNumber === tableNumber);
}

export function getPendingKitchenTickets(): KitchenTicket[] {
    return mockKitchenTickets.filter(ticket =>
        !ticket.items.every(item => item.isReady)
    );
}

export function getKitchenTicketByOrderId(orderId: string): KitchenTicket | undefined {
    return mockKitchenTickets.find(ticket => ticket.orderId === orderId);
}

export function formatOrderTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

export function getElapsedTime(date: Date): number {
    return Math.floor((Date.now() - date.getTime()) / 60000);
}
