<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import {
        ScanLine,
        ChevronRight,
        UtensilsCrossed,
        Image as ImageIcon,
        Star,
        Info,
    } from "lucide-svelte";

    // Modular Components
    import RestaurantHero from "$lib/components/restaurant/RestaurantHero.svelte";
    import OfferSection from "$lib/components/restaurant/OfferSection.svelte";
    import MenuTab from "$lib/components/restaurant/MenuTab.svelte";
    import ReviewsTab from "$lib/components/restaurant/ReviewsTab.svelte";
    import PhotosTab from "$lib/components/restaurant/PhotosTab.svelte";
    import AboutTab from "$lib/components/restaurant/AboutTab.svelte";

    // Data & Utils
    import { getRestaurantById } from "$lib/data/restaurants";
    import {
        getMenuItemsByRestaurant,
        mockMenuCategories,
    } from "$lib/data/menu";
    import { getReviewsByRestaurant } from "$lib/data/reviews";
    import { getOffersByRestaurant } from "$lib/data/offers";
    import { getPhotosByRestaurant } from "$lib/data/photos";

    const restaurantId = $page.params.id;
    const restaurant = getRestaurantById(restaurantId);

    // Derived state from mock data
    const menuItems = getMenuItemsByRestaurant(restaurantId);
    const reviews = getReviewsByRestaurant(restaurantId);
    const offers = getOffersByRestaurant(restaurantId);
    const photos = getPhotosByRestaurant(restaurantId);

    let activeTab = $state("menu");
    let isScrolled = $state(false);

    onMount(() => {
        const handleScroll = () => {
            isScrolled = window.scrollY > 100;
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });

    const tabs = [
        { id: "menu", label: "Menu", icon: UtensilsCrossed },
        { id: "photos", label: "Photos", icon: ImageIcon },
        { id: "reviews", label: "Reviews", icon: Star },
        { id: "about", label: "About", icon: Info },
    ];
</script>

{#if restaurant}
    <div class="min-h-screen bg-[#FDFCFB] pb-32">
        <RestaurantHero {restaurant} />

        <main class="px-4 py-8 space-y-12">
            <!-- Scan & Order Quick Action -->
            <section class="max-w-md mx-auto">
                <a
                    href="/user/restaurant/{restaurant.id}/order?table=mock"
                    class="group relative flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[32px] shadow-2xl shadow-gray-200/50 active:scale-[0.98] transition-all"
                >
                    <div class="flex items-center gap-4">
                        <div
                            class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform"
                        >
                            <ScanLine size={28} />
                        </div>
                        <div>
                            <h3
                                class="text-sm font-black text-gray-900 uppercase tracking-tight"
                            >
                                Dine-in Now
                            </h3>
                            <p
                                class="text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                            >
                                Self-order from table
                            </p>
                        </div>
                    </div>
                    <div
                        class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all"
                    >
                        <ChevronRight size={20} />
                    </div>
                </a>
            </section>

            <!-- Offers Section -->
            <OfferSection {offers} />

            <!-- Tabs Navigation -->
            <section
                class="sticky top-0 bg-[#FDFCFB]/95 backdrop-blur-xl z-40 -mx-4 px-4 py-4 border-b border-gray-50"
            >
                <div class="flex gap-2 overflow-x-auto no-scrollbar">
                    {#each tabs as tab}
                        <button
                            onclick={() => (activeTab = tab.id)}
                            class="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all {activeTab ===
                            tab.id
                                ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-105'
                                : 'bg-white text-gray-400 border border-gray-100'}"
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </button>
                    {/each}
                </div>
            </section>

            <!-- Tab Content -->
            <section class="min-h-[500px]">
                {#if activeTab === "menu"}
                    <MenuTab {menuItems} categories={mockMenuCategories} />
                {:else if activeTab === "photos"}
                    <PhotosTab {photos} />
                {:else if activeTab === "reviews"}
                    <ReviewsTab {reviews} />
                {:else if activeTab === "about"}
                    <AboutTab {restaurant} />
                {/if}
            </section>
        </main>

        <!-- Floating Action Button -->
        {#if isScrolled}
            <div
                class="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
                transition:fly={{ y: 50, duration: 400 }}
            >
                <a
                    href="/user/restaurant/{restaurant.id}/order"
                    class="bg-gray-900 text-white px-8 py-4 rounded-full flex items-center gap-3 shadow-2xl active:scale-95 transition-all"
                >
                    <UtensilsCrossed size={18} class="text-primary" />
                    <span
                        class="text-[10px] font-black uppercase tracking-[0.2em]"
                        >ORDER NOW</span
                    >
                </a>
            </div>
        {/if}
    </div>
{:else}
    <div class="min-h-screen flex items-center justify-center p-8 text-center">
        <div>
            <div class="text-6xl mb-6">🏜️</div>
            <h2 class="text-2xl font-black text-gray-900 mb-2">
                Restaurant Not Found
            </h2>
            <p class="text-gray-400 font-bold mb-8">
                This restaurant might have vanished from our map.
            </p>
            <a
                href="/user/nearby"
                class="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl"
                >Back to Nearby</a
            >
        </div>
    </div>
{/if}

<style>
    :global(body) {
        background-color: #fdfcfb;
    }
</style>
