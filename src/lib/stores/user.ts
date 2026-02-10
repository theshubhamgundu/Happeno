import { writable, derived } from 'svelte/store';
import type {
    Cart,
    CartItem,
    Restaurant,
    Order,
    User
} from '$lib/types';
import { mockRestaurants } from '$lib/data';

// --- User Profile Store ---
export const userStore = writable<User>({
    id: "u-782",
    name: "Gundu Shubham",
    email: "shubham@happeno.com",
    phone: "9876543210",
    avatar: "https://i.pravatar.cc/150?u=shubham"
});

// --- Cart Store ---
function createCartStore() {
    const { subscribe, set, update } = writable<Cart>({
        restaurantId: "",
        tableNumber: "",
        items: [],
        subtotal: 0
    });

    return {
        subscribe,
        init: (restaurantId: string, tableNumber: string) => {
            update(c => ({ ...c, restaurantId, tableNumber }));
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
        },
        clear: () => set({ restaurantId: "", tableNumber: "", items: [], subtotal: 0 })
    };
}

export const cartStore = createCartStore();

// Derived store for cart counts
export const cartCount = derived(cartStore, $cart =>
    $cart.items.reduce((acc, item) => acc + item.quantity, 0)
);

// --- Browser / Session Stores ---
export const activeRestaurantId = writable<string | null>(null);
export const activeTableNumber = writable<string | null>(null);
export const currentOrderStore = writable<Order | null>(null);
export const favoriteRestaurantsStore = writable<string[]>(["1", "3"]); // Array of IDs

// --- Discovery Stores ---
export const nearbyRestaurantsStore = writable<Restaurant[]>(mockRestaurants);
export const searchResultsStore = writable<Restaurant[]>([]);
export const selectedCategoryStore = writable<string | null>(null);
