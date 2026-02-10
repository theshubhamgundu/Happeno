import { writable } from 'svelte/store';

export interface AppSettings {
    restaurantName: string;
    contactPhone: string;
    contactEmail: string;
    gstRate: number;
    serviceChargeRate: number;
    currency: string;
    address: string;
    autoPrintBill: boolean;
    soundAlerts: boolean;
}

const defaultSettings: AppSettings = {
    restaurantName: "The Spice Garden",
    contactPhone: "+91 9876543210",
    contactEmail: "manager@spicegarden.com",
    gstRate: 5,
    serviceChargeRate: 5,
    currency: "₹",
    address: "Hitec City Main Rd, Hyderabad",
    autoPrintBill: true,
    soundAlerts: true
};

function createSettingsStore() {
    const { subscribe, set, update } = writable<AppSettings>(defaultSettings);

    return {
        subscribe,
        set,
        update,
        save: (settings: AppSettings) => {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('happeno_settings', JSON.stringify(settings));
            }
            set(settings);
        },
        load: () => {
            if (typeof localStorage !== 'undefined') {
                const saved = localStorage.getItem('happeno_settings');
                if (saved) {
                    set(JSON.parse(saved));
                }
            }
        }
    };
}

export const appSettingsStore = createSettingsStore();
