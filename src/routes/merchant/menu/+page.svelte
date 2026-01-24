<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import Input from "$lib/components/Input.svelte";
    import {
        UtensilsCrossed,
        Plus,
        Image as ImageIcon,
        Trash2,
        Store,
        ChevronLeft,
        Search,
        Zap,
        Clock,
        Tag,
    } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import {
        menuItemsStore,
        activeOffersStore,
        type MenuItem,
    } from "$lib/stores/merchant";
    import { fly, fade, scale, slide } from "svelte/transition";
    import { quartOut, elasticOut, cubicOut } from "svelte/easing";

    // --- Menu Management ---
    let showAddForm = $state(false);
    let newItemName = $state("");
    let newItemPrice = $state("");
    let newItemDesc = $state("");
    let newItemImage: File | null = $state(null);
    let newItemPreview: string | null = $state(null);
    let fileInput: HTMLInputElement;

    function handleImageSelect(e: Event) {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
            newItemImage = target.files[0];
            newItemPreview = URL.createObjectURL(newItemImage);
        }
    }

    function addItem() {
        if (!newItemName || !newItemPrice) return;

        menuItemsStore.update((items) => [
            ...items,
            {
                id: Date.now(),
                name: newItemName,
                price: newItemPrice,
                desc: newItemDesc,
                image: newItemPreview,
            },
        ]);

        newItemName = "";
        newItemPrice = "";
        newItemDesc = "";
        newItemImage = null;
        newItemPreview = null;
        showAddForm = false;
    }

    function deleteItem(id: number) {
        menuItemsStore.update((items) =>
            items.filter((item) => item.id !== id),
        );
    }

    // --- Offer Creation Flow ---
    let selectedItemForOffer = $state<MenuItem | null>(null);
    let offerDuration = $state("24h");
    let offerDiscountValue = $state("");
    let offerDiscountType = $state<"percent" | "price">("percent");

    function openOfferForm(item: MenuItem) {
        selectedItemForOffer = item;
        offerDuration = "24h";
        offerDiscountValue = "";
        offerDiscountType = "percent";
    }

    function publishOffer() {
        if (!selectedItemForOffer || !offerDiscountValue) return;

        let discountString = "";
        if (offerDiscountType === "percent") {
            discountString = `${offerDiscountValue}% OFF`;
        } else {
            discountString = `₹${offerDiscountValue} OFF`;
        }

        activeOffersStore.update((offers) => [
            {
                id: Date.now(),
                item: selectedItemForOffer!.name,
                discount: discountString,
                expiry: offerDuration,
                views: 0,
                likes: 0,
                image: selectedItemForOffer!.image,
            },
            ...offers,
        ]);

        selectedItemForOffer = null; // Close form
        goto("/merchant/dashboard");
    }
</script>

<div
    class="min-h-screen bg-[#FFF5E1] pb-24"
    in:fade={{ duration: 300, easing: cubicOut }}
>
    <header
        class="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center gap-4 shadow-sm"
    >
        <button
            onclick={() => goto("/merchant/dashboard")}
            class="p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-50 transition-all active:scale-90 duration-200"
        >
            <ChevronLeft size={24} />
        </button>
        <div class="flex-1">
            <h1
                class="text-xl font-bold text-slate-800 flex items-center gap-2"
            >
                <UtensilsCrossed size={20} class="text-primary" />
                Menu Management
            </h1>
        </div>
        <div
            class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500"
        >
            {$menuItemsStore.length}
        </div>
    </header>

    <main class="px-6 py-6 flex flex-col gap-6">
        <!-- Search / Filter (Visual only) -->
        <div class="relative">
            <Search size={20} class="absolute left-4 top-3.5 text-slate-400" />
            <input
                type="text"
                placeholder="Search items..."
                class="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-slate-700 placeholder:text-slate-400 shadow-sm transition-all focus:shadow-md"
            />
        </div>

        <!-- ADD ITEM FORM -->
        {#if showAddForm}
            <div
                class="bg-white p-5 rounded-[32px] border-2 border-primary/20 shadow-lg shadow-primary/5 space-y-4"
                in:slide={{ axis: "y", duration: 400, easing: cubicOut }}
                out:slide={{ axis: "y", duration: 300 }}
            >
                <div class="flex justify-between items-center">
                    <div
                        class="text-sm font-bold text-primary uppercase tracking-wider"
                    >
                        Add New Dish
                    </div>
                    <button
                        onclick={() => (showAddForm = false)}
                        class="text-xs font-bold text-slate-400 hover:text-slate-600"
                        >Cancel</button
                    >
                </div>

                <div class="flex gap-4">
                    <button
                        onclick={() => fileInput.click()}
                        class="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center shrink-0 overflow-hidden hover:border-primary/50 transition-colors active:scale-95"
                    >
                        {#if newItemPreview}
                            <img
                                src={newItemPreview}
                                alt="Preview"
                                class="w-full h-full object-cover"
                            />
                        {:else}
                            <ImageIcon size={24} class="text-slate-400" />
                        {/if}
                    </button>
                    <input
                        type="file"
                        bind:this={fileInput}
                        class="hidden"
                        accept="image/*"
                        onchange={handleImageSelect}
                    />

                    <div class="flex-1 space-y-3">
                        <Input
                            placeholder="Dish Name"
                            bind:value={newItemName}
                            class="py-2 text-sm"
                        />
                        <Input
                            placeholder="Price (₹)"
                            type="number"
                            bind:value={newItemPrice}
                            class="py-2 text-sm"
                        />
                    </div>
                </div>

                <textarea
                    placeholder="Short description (optional)..."
                    bind:value={newItemDesc}
                    class="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none text-sm font-medium resize-none h-20 placeholder:text-slate-400 focus:ring-2 ring-primary/20 transition-all"
                ></textarea>

                <Button onclick={addItem} class="w-full py-3 text-sm font-bold"
                    >Add to Menu</Button
                >
            </div>
        {:else}
            <div in:fade={{ duration: 200 }}>
                <Button
                    variant="outline"
                    onclick={() => (showAddForm = true)}
                    class="w-full py-4 border-dashed border-2 border-slate-300 text-slate-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98] transition-all"
                >
                    <Plus size={20} class="mr-2" /> Add New Item
                </Button>
            </div>
        {/if}

        <!-- OFFER CREATION MODAL / OVERLAY -->
        {#if selectedItemForOffer}
            <div
                class="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/40 backdrop-blur-sm"
                in:fade={{ duration: 200 }}
                out:fade={{ duration: 200 }}
            >
                <div
                    class="bg-white w-full max-w-sm p-6 rounded-[32px] shadow-2xl space-y-5"
                    in:scale={{
                        start: 0.9,
                        duration: 400,
                        easing: elasticOut,
                        opacity: 0,
                    }}
                    out:scale={{ start: 0.95, duration: 200, opacity: 0 }}
                >
                    <div class="flex justify-between items-start">
                        <div>
                            <div
                                class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1"
                            >
                                Create Offer For
                            </div>
                            <h2
                                class="text-xl font-bold text-slate-800 line-clamp-1"
                            >
                                {selectedItemForOffer.name}
                            </h2>
                        </div>
                        <button
                            onclick={() => (selectedItemForOffer = null)}
                            class="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
                        >
                            <Trash2 size={16} class="rotate-45" />
                            <!-- Close Icon Hack -->
                        </button>
                    </div>

                    <div class="space-y-4">
                        <!-- Duration Selection -->
                        <div class="space-y-2">
                            <label
                                class="text-sm font-bold text-slate-600 flex items-center gap-2"
                            >
                                <Clock size={16} /> Duration
                            </label>
                            <div class="flex gap-2">
                                {#each ["12h", "24h", "2D", "3D"] as dur}
                                    <button
                                        onclick={() => (offerDuration = dur)}
                                        class="flex-1 py-2 rounded-xl border-2 text-sm font-bold transition-all {offerDuration ===
                                        dur
                                            ? 'border-primary bg-primary/5 text-primary scale-105 shadow-sm'
                                            : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}"
                                    >
                                        {dur}
                                    </button>
                                {/each}
                            </div>
                        </div>

                        <!-- Discount Selection -->
                        <div class="space-y-2">
                            <label
                                class="text-sm font-bold text-slate-600 flex items-center gap-2"
                            >
                                <Tag size={16} /> Discount
                            </label>
                            <div class="flex gap-3">
                                <div
                                    class="flex bg-slate-100 rounded-xl p-1 gap-1"
                                >
                                    <button
                                        onclick={() =>
                                            (offerDiscountType = "percent")}
                                        class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all {offerDiscountType ===
                                        'percent'
                                            ? 'bg-white shadow-sm text-slate-800 scale-105'
                                            : 'text-slate-400'}">%</button
                                    >
                                    <button
                                        onclick={() =>
                                            (offerDiscountType = "price")}
                                        class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all {offerDiscountType ===
                                        'price'
                                            ? 'bg-white shadow-sm text-slate-800 scale-105'
                                            : 'text-slate-400'}">₹</button
                                    >
                                </div>
                                <div class="flex-1 relative">
                                    <input
                                        type="number"
                                        bind:value={offerDiscountValue}
                                        placeholder={offerDiscountType ===
                                        "percent"
                                            ? "Percentage (e.g. 50)"
                                            : "Amount off (e.g. 100)"}
                                        class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button
                        onclick={publishOffer}
                        class="w-full py-4 text-base font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                    >
                        <Zap size={20} class="mr-2 fill-white" /> Publish Offer
                    </Button>
                </div>
            </div>
        {/if}

        <div class="grid grid-cols-1 gap-4">
            {#each $menuItemsStore as item, i (item.id)}
                <div
                    in:fly={{
                        y: 20,
                        duration: 400,
                        delay: i * 100,
                        easing: quartOut,
                    }}
                    class="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm flex gap-4 transition-all hover:border-primary/30 group hover:shadow-md hover:-translate-y-1 duration-300"
                >
                    <div
                        class="w-24 h-24 bg-slate-100 rounded-2xl shrink-0 overflow-hidden"
                    >
                        {#if item.image}
                            <img
                                src={item.image}
                                alt={item.name}
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        {:else}
                            <div
                                class="w-full h-full flex items-center justify-center text-slate-300"
                            >
                                <UtensilsCrossed size={24} />
                            </div>
                        {/if}
                    </div>

                    <div class="flex-1 flex flex-col justify-between py-1">
                        <div>
                            <div class="flex justify-between items-start">
                                <h3
                                    class="font-bold text-slate-800 text-lg line-clamp-1"
                                >
                                    {item.name}
                                </h3>
                                <div class="flex gap-1 -mr-2 -mt-2">
                                    <button
                                        onclick={() => openOfferForm(item)}
                                        class="p-2 text-slate-300 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors active:scale-90"
                                        title="Create Offer"
                                    >
                                        <Zap size={18} />
                                    </button>
                                    <button
                                        onclick={() => deleteItem(item.id)}
                                        class="p-2 text-slate-300 hover:text-urgency hover:bg-urgency/5 rounded-lg transition-colors active:scale-90"
                                        title="Delete Item"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <p
                                class="text-xs text-text-muted font-medium line-clamp-2 mt-1"
                            >
                                {item.desc || "No description provided."}
                            </p>
                        </div>
                        <div class="font-black text-primary text-lg">
                            ₹{item.price}
                        </div>
                    </div>
                </div>
            {/each}

            {#if $menuItemsStore.length === 0 && !showAddForm}
                <div
                    class="py-12 text-center flex flex-col items-center opacity-50"
                >
                    <Store size={48} class="text-slate-300 mb-4" />
                    <p class="text-slate-400 font-bold">Your menu is empty.</p>
                </div>
            {/if}
        </div>
    </main>
</div>
