<script lang="ts">
    import { page } from "$app/stores";
    import { fade, fly, slide, scale } from "svelte/transition";
    import { cubicOut, backOut, quintOut } from "svelte/easing";
    import {
        ChevronLeft,
        Search,
        Plus,
        Minus,
        ShoppingBag,
        Clock,
        Star,
        Info,
        CheckCircle2,
        X,
        ArrowRight,
        Flame,
        Zap,
        Sparkles,
        Gift,
        PartyPopper,
    } from "lucide-svelte";
    import { confetti } from "$lib/actions/confetti"; // Simulated action

    // Modular Components
    import SuccessOverlay from "$lib/components/restaurant/SuccessOverlay.svelte";
    import OrderStatusTracker from "$lib/components/restaurant/OrderStatusTracker.svelte";
    import FloatingBillBar from "$lib/components/restaurant/FloatingBillBar.svelte";
    import MenuCard from "$lib/components/restaurant/MenuCard.svelte";
    import MenuCategoryBar from "$lib/components/restaurant/MenuCategoryBar.svelte";
    import ChefPreparation from "$lib/components/restaurant/ChefPreparation.svelte";

    interface CartItem {
        id: number;
        name: string;
        price: number;
        qty: number;
        img: string;
        category?: string;
    }

    interface Dish {
        id: number;
        name: string;
        price: number;
        category: string;
        rating: number;
        type: "veg" | "non-veg";
        img: string;
        bestSeller: boolean;
        desc: string;
    }

    // Table info from URL
    const tableNumber = $derived($page.url.searchParams.get("table") || "4");

    let activeCategory = $state("Best Sellers");
    let searchQuery = $state("");
    let cart = $state<CartItem[]>([]);
    let showCartFloating = $state(false);
    let orderStatus = $state("idle"); // idle, placing, confirmed, preparing, ready
    let waitingTime = $state(15);
    let showSuccessScreen = $state(false);
    let showChefPreparation = $state(false);

    const categories = [
        "Best Sellers",
        "Starters",
        "Main Course",
        "Biryani",
        "Desserts",
        "Drinks",
    ];
    const menu: Dish[] = [
        {
            id: 1,
            name: "Butter Chicken",
            price: 450,
            category: "Main Course",
            rating: 4.8,
            type: "non-veg",
            img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
            bestSeller: true,
            desc: "Classic creamy tomato based gravy with tender chicken.",
        },
        {
            id: 2,
            name: "Paneer Tikka",
            price: 320,
            category: "Starters",
            rating: 4.7,
            type: "veg",
            img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80",
            bestSeller: true,
            desc: "Smoky tandoori paneer cubes with bell peppers.",
        },
        {
            id: 3,
            name: "Hyderabadi Biryani",
            price: 380,
            category: "Biryani",
            rating: 4.9,
            type: "non-veg",
            img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
            bestSeller: true,
            desc: "Authentic slow-cooked dum biryani with saffron.",
        },
        {
            id: 4,
            name: "Dal Makhani",
            price: 280,
            category: "Main Course",
            rating: 4.6,
            type: "veg",
            img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80",
            bestSeller: false,
            desc: "Rich and creamy black lentils slow cooked overnight.",
        },
        {
            id: 5,
            name: "Garlic Naan",
            price: 60,
            category: "Main Course",
            rating: 4.5,
            type: "veg",
            img: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=400&q=80",
            bestSeller: false,
            desc: "Soft leavened bread topped with garlic and butter.",
        },
        {
            id: 6,
            name: "Gulab Jamun",
            price: 120,
            category: "Desserts",
            rating: 4.8,
            type: "veg",
            img: "https://images.unsplash.com/photo-1589119672035-420dc958193a?w=400&q=80",
            bestSeller: true,
            desc: "Warm milk dumplings in rose flavored sugar syrup.",
        },
    ];

    const upsellItems = [
        {
            id: 101,
            name: "Fresh Lime Soda",
            price: 80,
            img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200&q=80",
        },
        {
            id: 102,
            name: "Double Cheese",
            price: 50,
            img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&q=80",
        },
    ];

    function addToCart(item: any) {
        const existing = cart.find((i) => i.id === item.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...item, qty: 1 });
        }
    }

    function removeFromCart(item: any) {
        const index = cart.findIndex((i) => i.id === item.id);
        if (index !== -1) {
            if (cart[index].qty > 1) {
                cart[index].qty -= 1;
            } else {
                cart.splice(index, 1);
            }
        }
    }

    const cartTotal = $derived(
        cart.reduce((acc, item) => acc + item.price * item.qty, 0),
    );
    const cartCount = $derived(cart.reduce((acc, item) => acc + item.qty, 0));

    import { dbService } from "$lib/services/db";
    import type { Order } from "$lib/types";

    async function placeOrder() {
        orderStatus = "placing";
        showCartFloating = false;

        const currentRestaurantId = $page.params.id || "1";
        const newOrder: Order = {
            id: "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
            restaurantId: currentRestaurantId,
            tableNumber: tableNumber,

            items: cart.map((item) => ({
                menuItemId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.qty,
            })),
            subtotal: cartTotal,
            tax: Math.round(cartTotal * 0.05),
            serviceCharge: Math.round(cartTotal * 0.05),
            total: Math.round(cartTotal * 1.1),
            status: "pending",
            paymentStatus: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await dbService.placeOrder(newOrder);

        if (result.success) {
            orderStatus = "confirmed";
            showCartFloating = false;

            // Show the Chef Preparation animation immediately for a premium feel
            showChefPreparation = true;

            localStorage.setItem(
                `current_order_${$page.params.id}`,
                JSON.stringify(newOrder),
            );

            // Clear cart
            cart = [];

            // Auto hide chef animation after 5 seconds or keep it for the preparing state
            setTimeout(() => {
                orderStatus = "preparing";
            }, 3000);
        }
    }
</script>

<div class="min-h-screen bg-[#F8F9FA] pb-32">
    <!-- Header -->
    <header
        class="bg-white/80 backdrop-blur-xl px-5 pt-8 pb-4 sticky top-0 z-50 border-b border-gray-100 shadow-sm"
    >
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
                <a
                    href="/user/restaurant/1"
                    class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600"
                >
                    <ChevronLeft size={20} />
                </a>
                <div>
                    <h1 class="text-lg font-black text-gray-900 leading-tight">
                        The Spice Garden
                    </h1>
                    <div
                        class="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider"
                    >
                        <Zap size={10} fill="currentColor" />
                        <span>Dining at Table {tableNumber}</span>
                    </div>
                </div>
            </div>
            <div
                class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"
            >
                <Info size={20} />
            </div>
        </div>

        <div class="relative mt-2">
            <Search
                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
            />
            <input
                type="text"
                placeholder="Search dishes..."
                bind:value={searchQuery}
                class="w-full bg-gray-100 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
            />
        </div>

        <MenuCategoryBar {categories} bind:activeCategory />
    </header>

    <!-- Menu List -->
    <main class="px-5 mt-6">
        <div class="space-y-6">
            {#each menu.filter((m) => (activeCategory === "Best Sellers" ? m.bestSeller : m.category === activeCategory) && m.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())) as dish}
                <MenuCard
                    {dish}
                    quantity={cart.find((i) => i.id === dish.id)?.qty || 0}
                    onAdd={() => addToCart(dish)}
                    onRemove={() => removeFromCart(dish)}
                />
            {/each}
        </div>
    </main>

    <!-- Success Screen Overlay -->
    <SuccessOverlay
        show={showSuccessScreen}
        {tableNumber}
        restaurantId={$page.params.id}
        onClose={() => (showSuccessScreen = false)}
    />

    <!-- Chef Preparation Animation -->
    <ChefPreparation
        show={showChefPreparation}
        onClose={() => (showChefPreparation = false)}
    />

    <!-- Floating Order Status -->
    {#if !showSuccessScreen}
        <OrderStatusTracker {orderStatus} {waitingTime} />
    {/if}

    <!-- Cart Bar -->
    {#if orderStatus === "idle"}
        <FloatingBillBar
            {cartCount}
            {cartTotal}
            onClick={() => (showCartFloating = true)}
        />
    {/if}

    <!-- Cart Drawer -->
    {#if showCartFloating}
        <div
            class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
            onclick={() => (showCartFloating = false)}
            onkeydown={(e) => e.key === "Escape" && (showCartFloating = false)}
            role="button"
            tabindex="0"
            aria-label="Close cart drawer"
            transition:fade
        ></div>
        <div
            class="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-[90] p-6 pt-10 shadow-2xl"
            in:fly={{ y: "100%", duration: 500, easing: quintOut }}
            out:fly={{ y: "100%", duration: 400 }}
        >
            <button
                onclick={() => (showCartFloating = false)}
                aria-label="Drag down to close"
                class="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 rounded-full"
            ></button>

            <div class="flex items-center justify-between mb-8">
                <h2 class="text-2xl font-black text-gray-900">
                    Your Table Cart
                </h2>
                <div
                    class="flex items-center gap-2 text-primary font-black text-xs bg-primary/10 px-4 py-2 rounded-xl"
                >
                    <Flame size={14} />
                    <span>DINE-IN</span>
                </div>
            </div>

            <div class="max-h-[300px] overflow-y-auto no-scrollbar space-y-4">
                {#each cart as item}
                    <div
                        class="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100"
                    >
                        <div class="flex items-center gap-4">
                            <img
                                src={item.img}
                                alt=""
                                class="w-14 h-14 rounded-xl object-cover"
                            />
                            <div>
                                <h4
                                    class="font-black text-gray-900 text-sm leading-tight"
                                >
                                    {item.name}
                                </h4>
                                <p
                                    class="text-primary font-black text-xs mt-0.5"
                                >
                                    ₹{item.price}
                                </p>
                            </div>
                        </div>
                        <div
                            class="flex items-center gap-3 bg-white rounded-xl px-2 py-1.5 shadow-sm border border-gray-100"
                        >
                            <button
                                onclick={() => removeFromCart(item)}
                                class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-primary"
                                ><Minus size={14} /></button
                            >
                            <span
                                class="text-sm font-black w-4 text-center text-gray-900"
                                >{item.qty}</span
                            >
                            <button
                                onclick={() => addToCart(item)}
                                class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-primary"
                                ><Plus size={14} /></button
                            >
                        </div>
                    </div>
                {/each}
            </div>

            <div class="mt-8">
                <h3
                    class="text-sm font-black text-gray-900 mb-4 flex items-center gap-2 italic"
                >
                    <Sparkles size={16} class="text-yellow-500" />
                    How about a drink?
                </h3>
                <div class="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    {#each upsellItems as item}
                        <button
                            onclick={() =>
                                addToCart({ ...item, category: "Drinks" })}
                            class="flex-shrink-0 w-44 bg-[#F2F8FF] p-3 rounded-2xl flex items-center gap-3 border border-blue-100 active:scale-95 transition-all"
                        >
                            <img
                                src={item.img}
                                alt=""
                                class="w-10 h-10 rounded-lg object-cover"
                            />
                            <div class="text-left">
                                <p
                                    class="text-[10px] font-black text-gray-900 line-clamp-1"
                                >
                                    {item.name}
                                </p>
                                <p class="text-[10px] text-primary font-bold">
                                    +₹{item.price}
                                </p>
                            </div>
                        </button>
                    {/each}
                </div>
            </div>

            <div class="mt-8 space-y-4">
                <div
                    class="flex justify-between items-center text-gray-900 px-1 border-t border-gray-100 pt-6"
                >
                    <span
                        class="font-black text-lg opacity-40 uppercase tracking-tighter"
                        >Total Payable</span
                    >
                    <span class="font-black text-3xl tracking-tighter"
                        >₹{cartTotal}</span
                    >
                </div>
                <button
                    onclick={placeOrder}
                    class="w-full bg-primary text-white py-5 rounded-2xl font-black text-base shadow-xl shadow-primary/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                    {#if orderStatus === "placing"}
                        <div
                            class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                        ></div>
                    {:else}
                        SEND TO KITCHEN
                    {/if}
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    :global(body) {
        background-color: #f8f9fa;
    }
</style>
