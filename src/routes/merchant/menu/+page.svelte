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
        Pencil,
        AlertCircle,
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
    let fileInput: HTMLInputElement | undefined = $state();

    let editingId = $state<number | null>(null);
    let originalName = $state("");

    function handleImageSelect(e: Event) {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
            newItemImage = target.files[0];
            newItemPreview = URL.createObjectURL(newItemImage);
        }
    }

    // Check if item is in an active offer
    function isItemActive(name: string): boolean {
        return $activeOffersStore.some(
            (o) => o.item === name && o.status !== "Completed",
        );
    }

    function editItem(item: MenuItem) {
        editingId = item.id;
        originalName = item.name;
        newItemName = item.name;
        newItemPrice = item.price;
        newItemDesc = item.desc || "";
        newItemPreview = item.image;
        newItemImage = null; // We use preview unless new file selected
        showAddForm = true;
    }

    function handleSaveItem() {
        if (!newItemName || !newItemPrice) return;

        if (editingId) {
            // Update Existing
            menuItemsStore.update((items) =>
                items.map((item) => {
                    if (item.id === editingId) {
                        return {
                            ...item,
                            name: newItemName,
                            price: newItemPrice,
                            desc: newItemDesc,
                            image: newItemPreview, // Updated preview (file or old url)
                        };
                    }
                    return item;
                }),
            );
        } else {
            // Add New
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
        }

        resetForm();
    }

    function resetForm() {
        newItemName = "";
        newItemPrice = "";
        newItemDesc = "";
        newItemImage = null;
        newItemPreview = null;
        editingId = null;
        originalName = "";
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

        const original = parseFloat(selectedItemForOffer.price);
        const discountVal = parseFloat(offerDiscountValue);
        let final = original;
        let discountString = "";

        if (offerDiscountType === "percent") {
            discountString = `${offerDiscountValue}% OFF`;
            final = original - (original * discountVal) / 100;
        } else {
            discountString = `₹${offerDiscountValue} OFF`;
            final = original - discountVal;
        }

        if (final < 0) final = 0;

        activeOffersStore.update((offers) => [
            {
                id: Date.now(),
                item: selectedItemForOffer!.name,
                discount: discountString,
                originalPrice: selectedItemForOffer!.price,
                finalPrice: Math.round(final).toString(),
                description: selectedItemForOffer!.desc,
                expiry: offerDuration,
                views: 0,
                likes: 0,
                image: selectedItemForOffer!.image,
                status: "Active",
                date: "Today",
                reach: 0,
            },
            ...offers,
        ]);

        selectedItemForOffer = null; // Close form
        goto("/merchant/dashboard");
    }
</script>

<div
    class="min-h-screen bg-bg-app pb-24 transition-colors duration-300 pt-6"
    in:fade={{ duration: 300, easing: cubicOut }}
>
    <main class="px-4 md:px-8 lg:px-12 max-w-7xl mx-auto flex flex-col gap-6">
        <!-- Page Header -->
        <div
            class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
            <div class="flex items-center gap-3">
                <h1
                    class="text-2xl font-bold text-text-primary flex items-center gap-3"
                >
                    <UtensilsCrossed size={24} class="text-[#FF2E7E]" />
                    Menu Management
                </h1>
                <div
                    class="w-8 h-8 rounded-full bg-[#FF2E7E]/10 flex items-center justify-center font-bold text-sm text-[#FF2E7E]"
                >
                    {$menuItemsStore.length}
                </div>
            </div>

            <!-- Search Bar -->
            <div class="relative w-full md:w-80">
                <Search
                    size={20}
                    class="absolute left-4 top-3.5 text-text-muted"
                />
                <input
                    type="text"
                    placeholder="Search items..."
                    class="w-full pl-12 pr-4 py-3 bg-surface rounded-xl border border-border-peach outline-none focus:border-primary font-medium text-text-primary placeholder:text-text-muted shadow-sm transition-all focus:shadow-md"
                />
            </div>
        </div>

        <!-- ADD ITEM FORM -->
        {#if showAddForm}
            <div
                class="bg-surface p-5 rounded-[24px] border-2 border-primary/20 shadow-lg shadow-primary/5 space-y-4 transition-colors duration-300"
                in:slide={{ axis: "y", duration: 400, easing: cubicOut }}
                out:slide={{ axis: "y", duration: 300 }}
            >
                <div class="flex justify-between items-center">
                    <div
                        class="text-sm font-bold text-primary uppercase tracking-wider"
                    >
                        {editingId ? "Edit Dish" : "Add New Dish"}
                    </div>
                    <button
                        onclick={resetForm}
                        class="text-xs font-bold text-text-muted hover:text-text-secondary"
                        >Cancel</button
                    >
                </div>

                <div class="flex gap-4">
                    <button
                        onclick={() => fileInput?.click()}
                        class="w-24 h-24 rounded-2xl bg-highlight border-2 border-dashed border-border-peach flex items-center justify-center shrink-0 overflow-hidden hover:border-primary/50 transition-colors active:scale-95"
                    >
                        {#if newItemPreview}
                            <img
                                src={newItemPreview}
                                alt="Preview"
                                class="w-full h-full object-cover"
                            />
                        {:else}
                            <ImageIcon size={24} class="text-text-muted" />
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
                        <div class="space-y-1">
                            <Input
                                placeholder="Price (₹)"
                                type="number"
                                bind:value={newItemPrice}
                                class="py-2 text-sm {editingId &&
                                isItemActive(originalName)
                                    ? 'opacity-50 cursor-not-allowed bg-gray-100'
                                    : ''}"
                                disabled={!!editingId &&
                                    isItemActive(originalName)}
                            />
                            {#if editingId && isItemActive(originalName)}
                                <div
                                    class="flex items-start gap-1 text-[10px] text-urgency font-bold"
                                >
                                    <AlertCircle size={10} class="mt-0.5" />
                                    <span
                                        >Price locked: Item has active offer.</span
                                    >
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>

                <textarea
                    placeholder="Short description (optional)..."
                    bind:value={newItemDesc}
                    class="w-full p-4 bg-highlight rounded-2xl border-none outline-none text-sm font-medium resize-none h-20 placeholder:text-text-muted text-text-primary focus:ring-2 ring-primary/20 transition-all"
                ></textarea>

                <Button
                    onclick={handleSaveItem}
                    class="w-full py-3 text-sm font-bold"
                    >{editingId ? "Update Item" : "Add to Menu"}</Button
                >
            </div>
        {:else}
            <div in:fade={{ duration: 200 }}>
                <Button
                    variant="outline"
                    onclick={() => (showAddForm = true)}
                    class="w-full py-4 border-dashed border-2 border-border-peach text-text-muted hover:text-primary hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98] transition-all bg-transparent"
                >
                    <Plus size={20} class="mr-2" /> Add New Item
                </Button>
            </div>
        {/if}

        <!-- OFFER CREATION MODAL / OVERLAY -->
        {#if selectedItemForOffer}
            <div
                class="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/60 backdrop-blur-sm"
                in:fade={{ duration: 200 }}
                out:fade={{ duration: 200 }}
            >
                <div
                    class="bg-surface w-full max-w-sm p-6 rounded-[32px] shadow-2xl space-y-5 border border-border-peach"
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
                                class="text-xs font-bold text-text-muted uppercase tracking-wider mb-1"
                            >
                                Create Offer For
                            </div>
                            <h2
                                class="text-xl font-bold text-text-primary line-clamp-1"
                            >
                                {selectedItemForOffer.name}
                            </h2>
                        </div>
                        <button
                            onclick={() => (selectedItemForOffer = null)}
                            class="p-2 bg-highlight rounded-full hover:bg-border-peach text-text-muted transition-colors"
                        >
                            <Trash2 size={16} class="rotate-45" />
                            <!-- Close Icon Hack -->
                        </button>
                    </div>

                    <div class="space-y-4">
                        <!-- Duration Selection -->
                        <div class="space-y-2">
                            <label
                                class="text-sm font-bold text-text-secondary flex items-center gap-2"
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
                                            : 'border-highlight bg-highlight text-text-muted hover:border-border-peach'}"
                                    >
                                        {dur}
                                    </button>
                                {/each}
                            </div>
                        </div>

                        <!-- Discount Selection -->
                        <div class="space-y-2">
                            <label
                                class="text-sm font-bold text-text-secondary flex items-center gap-2"
                            >
                                <Tag size={16} /> Discount
                            </label>
                            <div class="flex gap-3">
                                <div
                                    class="flex bg-highlight rounded-xl p-1 gap-1"
                                >
                                    <button
                                        onclick={() =>
                                            (offerDiscountType = "percent")}
                                        class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all {offerDiscountType ===
                                        'percent'
                                            ? 'bg-surface shadow-sm text-text-primary scale-105'
                                            : 'text-text-muted'}">%</button
                                    >
                                    <button
                                        onclick={() =>
                                            (offerDiscountType = "price")}
                                        class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all {offerDiscountType ===
                                        'price'
                                            ? 'bg-surface shadow-sm text-text-primary scale-105'
                                            : 'text-text-muted'}">₹</button
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
                                        class="w-full px-4 py-2 bg-highlight border border-border-peach rounded-xl font-bold text-text-primary focus:border-primary outline-none transition-all placeholder:text-text-muted"
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

        <!-- Menu Items Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {#each $menuItemsStore as item, i (item.id)}
                <div
                    in:fly={{
                        y: 20,
                        duration: 400,
                        delay: i * 100,
                        easing: quartOut,
                    }}
                    class="bg-surface rounded-[24px] border border-border-peach shadow-sm overflow-hidden transition-all hover:border-primary/30 group hover:shadow-lg duration-300"
                >
                    <!-- Image -->
                    <div
                        class="w-full h-44 bg-highlight overflow-hidden relative"
                    >
                        {#if item.image}
                            <img
                                src={item.image}
                                alt={item.name}
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        {:else}
                            <div
                                class="w-full h-full flex items-center justify-center text-text-muted"
                            >
                                <UtensilsCrossed size={32} />
                            </div>
                        {/if}

                        <!-- Price Badge -->
                        <div
                            class="absolute bottom-3 left-3 px-3 py-1.5 bg-surface/90 backdrop-blur-sm rounded-xl font-black text-primary text-lg shadow-lg"
                        >
                            ₹{item.price}
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="p-4 flex flex-col gap-2">
                        <div class="flex justify-between items-start">
                            <h3
                                class="font-bold text-text-primary text-lg line-clamp-1 flex-1"
                            >
                                {item.name}
                            </h3>
                        </div>

                        <p
                            class="text-xs text-text-muted font-medium line-clamp-2 min-h-[2.5rem]"
                        >
                            {item.desc || "No description provided."}
                        </p>

                        <!-- Actions -->
                        <div
                            class="flex items-center justify-end gap-1 pt-3 border-t border-border-peach mt-auto"
                        >
                            <button
                                onclick={() => editItem(item)}
                                class="p-2.5 text-text-muted hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-colors active:scale-90"
                                title="Edit Item"
                            >
                                <Pencil size={18} />
                            </button>
                            <button
                                onclick={() => openOfferForm(item)}
                                class="p-2.5 text-text-muted hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-colors active:scale-90"
                                title="Create Offer"
                            >
                                <Zap size={18} />
                            </button>
                            <button
                                onclick={() => deleteItem(item.id)}
                                class="p-2.5 text-text-muted hover:text-urgency hover:bg-urgency/5 rounded-xl transition-colors active:scale-90"
                                title="Delete Item"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        {#if $menuItemsStore.length === 0 && !showAddForm}
            <div
                class="py-12 text-center flex flex-col items-center opacity-50"
            >
                <Store size={48} class="text-text-muted mb-4" />
                <p class="text-text-muted font-bold">Your menu is empty.</p>
            </div>
        {/if}
    </main>
</div>

<style>
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }

    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
