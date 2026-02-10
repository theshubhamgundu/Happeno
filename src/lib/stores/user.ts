import { writable, derived, get } from 'svelte/store';
import type {
    Cart,
    CartItem,
    Restaurant,
    Order,
    User
} from '$lib/types';
import { mockRestaurants } from '$lib/data';

// --- Types ---
export type SyncStatus = 'idle' | 'syncing' | 'saved' | 'error';

// --- Helper: Persistent Store ---
function createPersistentStore<T>(key: string, initialValue: T) {
    // Determine initial state (Browser vs Server)
    let saved: T = initialValue;
    if (typeof window !== 'undefined') {
        const item = localStorage.getItem(`happeno_${key}`);
        if (item) {
            try {
                saved = JSON.parse(item);
            } catch (e) {
                console.error(`Error parsing storage key ${key}:`, e);
            }
        }
    }

    const { subscribe, set, update } = writable<T>(saved);

    return {
        subscribe,
        set: (value: T) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem(`happeno_${key}`, JSON.stringify(value));
            }
            set(value);
        },
        update: (fn: (v: T) => T) => {
            update(current => {
                const result = fn(current);
                if (typeof window !== 'undefined') {
                    localStorage.setItem(`happeno_${key}`, JSON.stringify(result));
                }
                return result;
            });
        },
        // Reset to initial
        reset: () => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem(`happeno_${key}`);
            }
            set(initialValue);
        }
    };
}

// --- Sync Status Store (Premium touch for UX) ---
export const syncStatus = writable<SyncStatus>('saved');

// --- User Profile Store ---
export const userStore = createPersistentStore<User>('user', {
    id: "u-782",
    name: "Gundu Shubham",
    email: "shubham@happeno.com",
    phone: "9876543210",
    avatar: "https://i.pravatar.cc/150?u=shubham"
});

// --- Cart Store with Debounced Syncing ---
function createCartStore() {
    const initialCart: Cart = {
        restaurantId: "",
        tableNumber: "",
        items: [],
        subtotal: 0
    };

    const store = createPersistentStore<Cart>('cart', initialCart);
    const { subscribe, set, update } = store;

    let syncTimeout: any;

    // Internal sync logic (Simulates Batch API Update)
    const syncWithServer = async () => {
        const cartData = get(store);
        if (cartData.items.length === 0 && !cartData.restaurantId) return;

        syncStatus.set('syncing');

        try {
            // SIMULATED API CALL: POST /api/user/sync-cart
            // In production, this would use fetch()
            console.log('--- Server Sync: Batch updating cart ---', cartData);
            await new Promise(r => setTimeout(r, 1000)); // Simulate network latency

            syncStatus.set('saved');
            // Mocking a response for "Differential Sync":
            // If server had newer data (from another device), we would update local here
        } catch (e) {
            console.error('Sync failed:', e);
            syncStatus.set('error');
        }
    };

    // Debounce wrapper
    const triggerSync = () => {
        syncStatus.set('idle');
        clearTimeout(syncTimeout);
        syncTimeout = setTimeout(syncWithServer, 3000); // Wait 3s after last interaction
    };

    return {
        subscribe,
        init: (restaurantId: string, tableNumber: string) => {
            update(c => ({ ...c, restaurantId, tableNumber }));
            triggerSync();
        },
        addItem: (item: CartItem) => {
            update(c => {
                const existing = c.items.find(i => i.menuItemId === item.menuItemId);
                if (existing) {
                    existing.quantity += 1;
                } else {
                    c.items.push({ ...item, quantity: 1 });
                }
                c.subtotal = c.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
                return { ...c };
            });
            triggerSync();
        },
        removeItem: (menuItemId: number) => {
            update(c => {
                const index = c.items.findIndex(i => i.menuItemId === menuItemId);
                if (index !== -1) {
                    if (c.items[index].quantity > 1) {
                        c.items[index].quantity -= 1;
                    } else {
                        c.items.splice(index, 1);
                    }
                }
                c.subtotal = c.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
                return { ...c };
            });
            triggerSync();
        },
        clear: () => {
            store.reset();
            triggerSync();
        },
        // Rehydrate from server (Used when logging in on new device)
        rehydrate: (serverData: Cart) => {
            set(serverData);
            syncStatus.set('saved');
        }
    };
}

export const cartStore = createCartStore();

// Derived store for cart counts
export const cartCount = derived(cartStore, $cart =>
    $cart.items.reduce((acc, item) => acc + item.quantity, 0)
);

// --- Browser / Session Stores ---
export const activeRestaurantId = createPersistentStore<string | null>('active_restaurant', null);
export const activeTableNumber = createPersistentStore<string | null>('active_table', null);
export const currentOrderStore = createPersistentStore<Order | null>('current_order', null);
export const favoriteRestaurantsStore = createPersistentStore<string[]>('favorites', ["1", "3"]);

// --- Discovery Stores (Intelligence Layer) ---
// We fetch a larger batch of data and cache it locally to minimize server trips.
const CACHE_TTL = 60 * 60 * 1000; // 1 Hour

function createDiscoveryStore() {
    const { subscribe, set } = writable<Restaurant[]>(mockRestaurants);

    return {
        subscribe,
        // Batch fetch with logic to skip API call if local cache is fresh
        fetchNearby: async (coords: { lat: number, lng: number }, force = false) => {
            if (typeof window === 'undefined') return;

            const cacheKey = 'happeno_discovery_cache';
            const cached = localStorage.getItem(cacheKey);
            const now = Date.now();

            if (!force && cached) {
                const { timestamp, data } = JSON.parse(cached);
                if (now - timestamp < CACHE_TTL) {
                    console.log('--- Client Intelligence: Using cached discovery data ---');
                    set(data);
                    return;
                }
            }

            syncStatus.set('syncing');
            try {
                // SIMULATED BATCH API CALL: GET /api/discover/nearby?lat=...&lng=...&radius=5km
                console.log('--- Server Fetch: Batching nearby discovery ---');
                await new Promise(r => setTimeout(r, 800));

                const data = mockRestaurants; // In reality, this would be the fresh API response
                localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data }));
                set(data);
                syncStatus.set('saved');
            } catch (e) {
                syncStatus.set('error');
            }
        },
        // Real-time local filtering (0 API cost)
        filterLocally: (query: string) => {
            // Implementation of client-side recommendation & filtering
        },
        // Boost restaurants that have active merchant-broadcasted offers
        getBoostedDiscovery: (restaurants: Restaurant[]) => {
            // In production, this would check if (restaurant.hasActiveBroadCast)
            return [...restaurants].sort((a, b) => {
                const aHasOffer = a.tagline?.toLowerCase().includes('offer') || false;
                const bHasOffer = b.tagline?.toLowerCase().includes('offer') || false;
                if (aHasOffer && !bHasOffer) return -1;
                if (!aHasOffer && bHasOffer) return 1;
                return 0;
            });
        }
    };
}

export const nearbyRestaurantsStore = createDiscoveryStore();
export const searchResultsStore = writable<Restaurant[]>([]);
export const selectedCategoryStore = writable<string | null>(null);
