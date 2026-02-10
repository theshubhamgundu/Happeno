<script lang="ts">
    import {
        MapPin,
        Phone,
        Globe,
        Clock,
        ShieldCheck,
        Info,
    } from "lucide-svelte";
    import { fade, fly } from "svelte/transition";

    let { restaurant } = $props<{
        restaurant: {
            name: string;
            address: string;
            timing: string;
            cuisines: string[];
            phone?: string;
            email?: string;
        };
    }>();

    const amenities = [
        {
            name: "Safety First",
            icon: ShieldCheck,
            color: "text-emerald-500 bg-emerald-50",
        },
        {
            name: "Live Music",
            icon: Info,
            color: "text-purple-500 bg-purple-50",
        },
        { name: "Free Wifi", icon: Globe, color: "text-blue-500 bg-blue-50" },
    ];
</script>

<div class="space-y-10 animate-in fade-in duration-500 pb-32">
    <!-- Quick Info Grid -->
    <div class="grid grid-cols-2 gap-4">
        <div
            class="bg-white border border-gray-100 rounded-[32px] p-6 space-y-3"
        >
            <div
                class="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"
            >
                <Clock size={20} />
            </div>
            <div>
                <h4
                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                >
                    Open Hours
                </h4>
                <p class="text-sm font-black text-gray-900">
                    {restaurant.timing}
                </p>
            </div>
        </div>
        <div
            class="bg-white border border-gray-100 rounded-[32px] p-6 space-y-3"
        >
            <div
                class="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"
            >
                <MapPin size={20} />
            </div>
            <div>
                <h4
                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                >
                    Location
                </h4>
                <p class="text-xs font-black text-gray-900 line-clamp-1">
                    {restaurant.address.split(",")[0]}
                </p>
            </div>
        </div>
    </div>

    <!-- Details Section -->
    <div class="space-y-6">
        <h3
            class="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] px-2"
        >
            About The Place
        </h3>
        <div
            class="bg-white border border-gray-100 rounded-[32px] p-8 space-y-6"
        >
            <p class="text-gray-600 text-sm leading-relaxed font-medium">
                Delicious and authentic {restaurant.cuisines.join(", ")} served in
                a vibrant and welcoming atmosphere. We pride ourselves on using fresh
                ingredients and traditional recipes to bring you the best flavor
                of {restaurant.cuisines[0]}.
            </p>

            <div class="grid gap-4">
                {#each amenities as amenity}
                    <div class="flex items-center gap-4">
                        <div
                            class="w-8 h-8 rounded-xl {amenity.color} flex items-center justify-center"
                        >
                            <amenity.icon size={16} />
                        </div>
                        <span
                            class="text-xs font-black text-gray-700 uppercase tracking-wide"
                            >{amenity.name}</span
                        >
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <!-- Contact & Directions -->
    <div class="space-y-4">
        <h3
            class="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] px-2"
        >
            Directions & Contact
        </h3>
        <div
            class="bg-white border border-gray-100 rounded-[40px] p-6 space-y-4 shadow-xl shadow-gray-200/20"
        >
            <!-- Simulated Map -->
            <div
                class="w-full h-40 bg-gray-100 rounded-[28px] overflow-hidden relative"
            >
                <img
                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80"
                    alt="map"
                    class="w-full h-full object-cover opacity-50 grayscale"
                />
                <div class="absolute inset-0 flex items-center justify-center">
                    <div
                        class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl relative"
                    >
                        <MapPin size={24} />
                        <div
                            class="absolute inset-0 bg-primary rounded-full animate-ping opacity-20"
                        ></div>
                    </div>
                </div>
            </div>

            <div class="flex gap-2">
                <button
                    class="flex-1 py-4 bg-gray-50 text-gray-900 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-colors"
                >
                    <Phone size={14} /> Call Now
                </button>
                <button
                    class="flex-1 py-4 bg-primary text-white rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                    <Clock size={14} /> Book Table
                </button>
            </div>
        </div>
    </div>
</div>
