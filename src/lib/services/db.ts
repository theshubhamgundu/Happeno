import { writable, get } from 'svelte/store';
import type { Order, MenuItem, KitchenTicket } from '$lib/types';
import { liveOrdersStore, kitchenTicketsStore, merchantStatsStore } from '$lib/stores/merchant';
import { audioService } from './audio';

/**
 * DB SERVICE
 * Simulates a full-stack backend with persistence and real-time state sync.
 */
class DBService {

    constructor() {
        this.init();
    }

    private init() {
        if (typeof localStorage === 'undefined') return;

        // Load initial state from localStorage if available
        const savedOrders = localStorage.getItem('happeno_orders');
        if (savedOrders) {
            liveOrdersStore.set(JSON.parse(savedOrders));
        }

        // Auto-save whenever store changes
        liveOrdersStore.subscribe(orders => {
            localStorage.setItem('happeno_orders', JSON.stringify(orders));
        });
    }

    /**
     * END-TO-END ORDER PLACEMENT
     * Transitions order from Customer cart to Staff Dashboard & Kitchen Terminal
     */
    async placeOrder(order: Order) {
        // 1. Simulate Network Latency
        await new Promise(r => setTimeout(r, 1000));

        // 2. Update Merchant Live Orders
        liveOrdersStore.update(orders => [order, ...orders]);

        // 3. Create Kitchen Ticket
        const ticket: KitchenTicket = {
            orderId: order.id,
            tableNumber: order.tableNumber,
            timeOrdered: new Date(),
            elapsedMinutes: 0,
            priority: 'normal',
            items: order.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                modifications: item.modifications,
                isReady: false
            }))
        };
        kitchenTicketsStore.update(tickets => [ticket, ...tickets]);

        // 4. Trigger Real-time Staff Audio Alert
        audioService.play('order_new');

        // 5. Update Stats
        merchantStatsStore.update(s => ({
            ...s,
            liveOrders: s.liveOrders + 1,
            activeTables: s.activeTables + 1
        }));

        console.log('Order Synced to Staff Terminal:', order.id);
        return { success: true, orderId: order.id };
    }

    /**
     * UPDATE STATUS
     * Syncs status between staff and customer
     */
    updateOrderStatus(orderId: string, status: Order['status']) {
        liveOrdersStore.update(orders =>
            orders.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date() } : o)
        );

        if (status === 'ready') audioService.play('ready');
    }
}

export const dbService = new DBService();
