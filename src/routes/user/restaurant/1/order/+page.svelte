<script lang="ts">
    import { page } from "$app/stores";
    import { fade, fly, slide, scale } from "svelte/transition";
    import { cubicOut, backOut } from "svelte/easing";
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
    } from "lucide-svelte";

    // Table info from URL
    const tableNumber = $derived($page.url.searchParams.get("table") || "4");

    let activeCategory = $state("Best Sellers");
    let searchQuery = $state("");
    let cart = $state([]);
    let showCartFloating = $state(false);
    let orderStatus = $state("idle"); // idle, placing, confirmed, preparing, ready
    let waitingTime = $state(15); // minutes

    const categories = [
        "Best Sellers",
        "Starters",
        "Main Course",
        "Biryani",
        "Desserts",
        "Drinks",
    ];

    const menu = [
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

    function addToCart(item) {
        const existing = cart.find((i) => i.id === item.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...item, qty: 1 });
        }
    }

    function removeFromCart(item) {
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

    function placeOrder() {
        orderStatus = "placing";
        setTimeout(() => {
            orderStatus = "confirmed";
            setTimeout(() => {
                orderStatus = "preparing";
            }, 2000);
        }, 1500);
    }
</script>

<div class="min-h-screen bg-[#F8F9FA] pb-32">
    <!-- Header -->
    <header
        class="bg-white px-5 pt-8 pb-4 sticky top-0 z-50 border-b border-gray-100 shadow-sm"
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

        <!-- Search -->
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

        <!-- Categories -->
        <div
            class="flex gap-2 overflow-x-auto no-scrollbar mt-4 -mx-5 px-5 py-2"
        >
            {#each categories as cat}
                <button
                    onclick={() => (activeCategory = cat)}
                    class="flex-shrink-0 px-5 py-2.5 rounded-xl text-xs font-black transition-all {activeCategory ===
                    cat
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'bg-white text-gray-400 border border-gray-100'}"
                >
                    {cat}
                </button>
            {/each}
        </div>
    </header>

    <!-- Menu List -->
    <main class="px-5 mt-6">
        <div class="space-y-6">
            {#each menu.filter((m) => (activeCategory === "Best Sellers" ? m.bestSeller : m.category === activeCategory) && m.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())) as dish}
                <div
                    class="bg-white rounded-[28px] p-4 flex gap-4 shadow-xl shadow-gray-200/50 border border-gray-50 group active:scale-[0.98] transition-all"
                >
                    <div
                        class="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative"
                    >
                        <img
                            src={dish.img}
                            alt={dish.name}
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div
                            class="absolute top-2 left-2 w-4 h-4 rounded-sm border border-gray-200 bg-white flex items-center justify-center"
                        >
                            <div
                                class="w-1.5 h-1.5 rounded-full {dish.type ===
                                'veg'
                                    ? 'bg-green-600'
                                    : 'bg-red-600'}"
                            ></div>
                        </div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start">
                            <h3
                                class="font-black text-gray-900 text-base leading-tight truncate"
                            >
                                {dish.name}
                            </h3>
                            <div
                                class="flex items-center gap-0.5 text-yellow-500 font-black text-xs"
                            >
                                <Star size={12} fill="currentColor" />
                                <span>{dish.rating}</span>
                            </div>
                        </div>
                        <p
                            class="text-gray-400 text-[10px] leading-relaxed mt-1 line-clamp-2 font-medium italic"
                        >
                            "{dish.desc}"
                        </p>
                        <div class="flex justify-between items-center mt-3">
                            <p class="text-primary font-black text-base">
                                ₹{dish.price}
                            </p>

                            {#if cart.find((i) => i.id === dish.id)}
                                <div
                                    class="flex items-center gap-3 bg-primary rounded-xl px-2 py-1.5 text-white shadow-md"
                                >
                                    <button
                                        onclick={() => removeFromCart(dish)}
                                        class="w-6 h-6 flex items-center justify-center"
                                        ><Minus size={14} /></button
                                    >
                                    <span
                                        class="text-sm font-black w-4 text-center"
                                        >{cart.find((i) => i.id === dish.id)
                                            .qty}</span
                                    >
                                    <button
                                        onclick={() => addToCart(dish)}
                                        class="w-6 h-6 flex items-center justify-center"
                                        ><Plus size={14} /></button
                                    >
                                </div>
                            {:else}
                                <button
                                    onclick={() => addToCart(dish)}
                                    class="bg-white border-2 border-primary/20 text-primary font-black px-6 py-2 rounded-xl text-xs hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                                >
                                    ADD +
                                </button>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </main>

    <!-- Floating Order Status -->
    {#if orderStatus !== "idle"}
        <div
            in:fly={{ y: 50, duration: 500 }}
            class="fixed bottom-24 left-4 right-4 bg-white rounded-[32px] p-5 shadow-2xl border border-gray-100 z-[60]"
        >
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div
                        class="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 relative overflow-hidden"
                    >
                        {#if orderStatus === "confirmed" || orderStatus === "preparing"}
                            <div
                                class="absolute inset-0 bg-emerald-500/10 animate-pulse"
                            ></div>
                            <Clock size={24} class="relative" />
                        {:else if orderStatus === "ready"}
                            <CheckCircle2 size={24} class="relative" />
                        {/if}
                    </div>
                    <div>
                        <h4 class="font-black text-gray-900 text-sm">
                            {orderStatus === "confirmed"
                                ? "Order Confirmed!"
                                : orderStatus === "preparing"
                                  ? "Chef is cooking..."
                                  : "Order is Ready!"}
                        </h4>
                        <p
                            class="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-0.5"
                        >
                            {orderStatus === "preparing"
                                ? `Preparing • ${waitingTime} mins left`
                                : "Freshly prepared for you"}
                        </p>
                    </div>
                </div>
                {#if orderStatus === "ready"}
                    <span
                        class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black animate-bounce"
                        >NOTIFIED</span
                    >
                {/if}
            </div>

            <!-- Progress Bar -->
            <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                    class="h-full bg-emerald-500 transition-all duration-1000"
                    style="width: {orderStatus === 'confirmed'
                        ? '20%'
                        : orderStatus === 'preparing'
                          ? '65%'
                          : '100%'}"
                ></div>
            </div>
        </div>
    {/if}

    <!-- Cart Bar -->
    {#if cartCount > 0 && orderStatus === "idle"}
        <div
            in:fly={{ y: 100, duration: 400 }}
            class="fixed bottom-4 left-4 right-4 z-[70]"
        >
            <button
                onclick={() => (showCartFloating = true)}
                class="w-full bg-primary text-white p-5 rounded-[28px] flex items-center justify-between shadow-2xl shadow-primary/40 active:scale-95 transition-all group overflow-hidden relative"
            >
                <!-- Animated background element -->
                <div
                    class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                ></div>

                <div class="flex items-center gap-4 relative">
                    <div
                        class="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center"
                    >
                        <ShoppingBag size={22} />
                        <span
                            class="absolute -top-1 -right-1 bg-white text-primary text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
                            >{cartCount}</span
                        >
                    </div>
                    <div class="text-left">
                        <p
                            class="text-[10px] font-black uppercase tracking-widest opacity-80 mb-0.5"
                        >
                            Total Amount
                        </p>
                        <p class="text-xl font-black">₹{cartTotal}</p>
                    </div>
                </div>

                <div class="flex items-center gap-2 relative">
                    <span class="text-sm font-black uppercase tracking-widest"
                        >VIEW CART</span
                    >
                    <ArrowRight
                        size={20}
                        class="group-hover:translate-x-1 transition-transform"
                    />
                </div>
            </button>
        </div>
    {/if}

    <!-- Cart Drawer Overlay -->
    {#if showCartFloating}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
            onclick={() => (showCartFloating = false)}
            transition:fade={{ duration: 200 }}
        ></div>

        <div
            class="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-[90] p-6 pt-10 shadow-2xl"
            in:fly={{ y: "100%", duration: 500, easing: cubicOut }}
            out:fly={{ y: "100%", duration: 400 }}
        >
            <button
                onclick={() => (showCartFloating = false)}
                class="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 rounded-full"
            ></button>

            <div class="flex items-center justify-between mb-8">
                <h2 class="text-2xl font-black text-gray-900">Your Cart</h2>
                <div
                    class="flex items-center gap-2 text-primary font-black text-xs bg-primary/10 px-4 py-2 rounded-xl"
                >
                    <Flame size={14} />
                    <span>POPULAR CHOICE</span>
                </div>
            </div>

            <!-- Cart Items -->
            <div
                class="max-h-[300px] overflow-y-auto no-scrollbar space-y-4 pr-1"
            >
                {#each cart as item}
                    <div
                        class="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100"
                    >
                        <div class="flex items-center gap-4">
                            <img
                                src={item.img}
                                alt=""
                                class="w-14 h-14 rounded-xl object-cover shadow-md"
                            />
                            <div>
                                <h4 class="font-black text-gray-900 text-sm">
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

            <!-- Upsell Section -->
            <div class="mt-8">
                <h3
                    class="text-sm font-black text-gray-900 mb-4 flex items-center gap-2"
                >
                    <Sparkles size={16} class="text-yellow-500" />
                    Complete your meal?
                </h3>
                <div class="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    {#each upsellItems as item}
                        <button
                            onclick={() =>
                                addToCart({ ...item, category: "Upsell" })}
                            class="flex-shrink-0 w-44 bg-blue-50/50 p-3 rounded-2xl flex items-center gap-3 border border-blue-100 active:scale-95 transition-all"
                        >
                            <img
                                src={item.img}
                                alt=""
                                class="w-10 h-10 rounded-lg object-cover shadow-sm"
                            />
                            <div class="text-left">
                                <p
                                    class="text-[10px] font-black text-gray-900 line-clamp-1"
                                >
                                    {item.name}
                                </p>
                                <p class="text-[10px] text-primary font-bold">
                                    ADD ₹{item.price}
                                </p>
                            </div>
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Payment -->
            <div class="mt-8 space-y-4">
                <div
                    class="flex justify-between items-center text-gray-900 px-1"
                >
                    <span class="font-black text-lg">Total Payable</span>
                    <span class="font-black text-2xl">₹{cartTotal}</span>
                </div>

                <div class="flex gap-3">
                    <button
                        onclick={placeOrder}
                        class="flex-[2] bg-primary text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-primary/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                        {#if orderStatus === "placing"}
                            <div
                                class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                            ></div>
                            PLACING...
                        {:else}
                            PLACE ORDER
                        {/if}
                    </button>
                    <button
                        class="flex-1 bg-gray-100 text-gray-600 rounded-2xl font-black text-[10px] uppercase tracking-wider active:scale-95 transition-all"
                    >
                        CASH
                    </button>
                </div>
                <p
                    class="text-center text-gray-400 text-[9px] font-bold uppercase tracking-widest mt-2"
                >
                    Prices include all taxes
                </p>
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
