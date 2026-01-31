<script lang="ts">
    import {
        History,
        ArrowDownLeft,
        Search,
        ChevronLeft,
        Zap,
        Calendar,
        TrendingUp,
        TrendingDown,
    } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import { cn } from "$lib/utils";
    import { reveal } from "$lib/actions/reveal";

    let searchQuery = $state("");
    let activeFilter = $state<"all" | "credit" | "debit">("all");

    // In a real app, this would come from a store or API
    let allTransactions = $state([
        {
            id: "1",
            title: "Flash Offer Broadcast",
            description: "Hyderabadi Chicken Biryani - 20% OFF",
            amount: "120",
            date: "22 Jan, 2:30 PM",
            type: "debit",
        },
        {
            id: "2",
            title: "Wallet Topup",
            description: "Added via UPI",
            amount: "500",
            date: "20 Jan, 11:15 AM",
            type: "credit",
        },
        {
            id: "3",
            title: "Weekend Sale Broadcast",
            description: "Family Feast Combo - ₹150 OFF",
            amount: "200",
            date: "18 Jan, 6:00 PM",
            type: "debit",
        },
        {
            id: "4",
            title: "Premium Plan Purchase",
            description: "Monthly subscription",
            amount: "500",
            date: "15 Jan, 10:00 AM",
            type: "debit",
        },
        {
            id: "5",
            title: "Wallet Topup",
            description: "Added via Bank Transfer",
            amount: "1000",
            date: "15 Jan, 9:45 AM",
            type: "credit",
        },
        {
            id: "6",
            title: "New Year Special Offer",
            description: "All items - 30% OFF",
            amount: "150",
            date: "01 Jan, 12:00 PM",
            type: "debit",
        },
        {
            id: "7",
            title: "Referral Bonus",
            description: "Referred Paradise Restaurant",
            amount: "100",
            date: "28 Dec, 4:30 PM",
            type: "credit",
        },
        {
            id: "8",
            title: "Christmas Special Broadcast",
            description: "Holiday Feast - Buy 1 Get 1",
            amount: "180",
            date: "25 Dec, 11:00 AM",
            type: "debit",
        },
    ]);

    let filteredTransactions = $derived.by(() => {
        let matches = allTransactions;

        // Search filter
        if (searchQuery) {
            matches = matches.filter(
                (tx) =>
                    tx.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    tx.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
            );
        }

        // Type filter
        if (activeFilter === "credit") {
            matches = matches.filter((tx) => tx.type === "credit");
        } else if (activeFilter === "debit") {
            matches = matches.filter((tx) => tx.type === "debit");
        }

        return matches;
    });

    let totalCredit = $derived(
        allTransactions
            .filter((tx) => tx.type === "credit")
            .reduce((sum, tx) => sum + parseInt(tx.amount), 0),
    );

    let totalDebit = $derived(
        allTransactions
            .filter((tx) => tx.type === "debit")
            .reduce((sum, tx) => sum + parseInt(tx.amount), 0),
    );
</script>

<div class="min-h-screen bg-bg-app pb-24 transition-colors duration-300 pt-6">
    <main class="px-4 md:px-8 lg:px-12 max-w-7xl mx-auto flex flex-col gap-6">
        <!-- Page Header -->
        <div class="flex flex-col gap-4">
            <div class="flex items-center gap-4">
                <button
                    onclick={() => goto("/merchant/wallet")}
                    class="p-2 bg-surface rounded-xl border border-border-peach hover:bg-highlight transition-colors"
                >
                    <ChevronLeft size={20} class="text-text-primary" />
                </button>
                <div>
                    <h1
                        class="text-2xl font-heading font-extrabold text-text-primary"
                    >
                        All Transactions
                    </h1>
                    <p class="text-sm text-text-muted font-medium">
                        Complete transaction history
                    </p>
                </div>
            </div>

            <div
                class="grid grid-cols-2 gap-4"
                use:reveal={{ delay: 100, x: 20 }}
            >
                <div
                    class="bg-surface p-4 rounded-[20px] border border-border-peach flex items-center gap-4"
                >
                    <div
                        class="w-12 h-12 bg-success/10 text-success rounded-xl flex items-center justify-center"
                    >
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <div class="text-xl font-extrabold text-success">
                            ₹{totalCredit}
                        </div>
                        <div
                            class="text-[10px] font-bold text-text-muted uppercase tracking-wider"
                        >
                            Total Credited
                        </div>
                    </div>
                </div>
                <div
                    class="bg-surface p-4 rounded-[20px] border border-border-peach flex items-center gap-4"
                >
                    <div
                        class="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center"
                    >
                        <TrendingDown size={24} />
                    </div>
                    <div>
                        <div class="text-xl font-extrabold text-primary">
                            ₹{totalDebit}
                        </div>
                        <div
                            class="text-[10px] font-bold text-text-muted uppercase tracking-wider"
                        >
                            Total Debited
                        </div>
                    </div>
                </div>
            </div>

            <!-- Search and Filter -->
            <div
                class="flex flex-col md:flex-row gap-4"
                use:reveal={{ delay: 150, x: 20 }}
            >
                <!-- Search Bar -->
                <div class="relative flex-1">
                    <Search
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                        size={20}
                    />
                    <input
                        type="text"
                        bind:value={searchQuery}
                        placeholder="Search transactions..."
                        class="w-full bg-surface border border-border-peach rounded-2xl py-3 pl-12 pr-4 text-text-primary focus:outline-none focus:border-primary/50 transition-all font-bold placeholder:font-normal"
                    />
                </div>

                <!-- Filter Buttons -->
                <div
                    class="flex bg-surface rounded-2xl border border-border-peach p-1"
                >
                    <button
                        onclick={() => (activeFilter = "all")}
                        class={cn(
                            "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                            activeFilter === "all"
                                ? "bg-primary text-white"
                                : "text-text-muted hover:text-text-primary",
                        )}
                    >
                        All
                    </button>
                    <button
                        onclick={() => (activeFilter = "credit")}
                        class={cn(
                            "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                            activeFilter === "credit"
                                ? "bg-success text-white"
                                : "text-text-muted hover:text-text-primary",
                        )}
                    >
                        Credits
                    </button>
                    <button
                        onclick={() => (activeFilter = "debit")}
                        class={cn(
                            "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                            activeFilter === "debit"
                                ? "bg-primary text-white"
                                : "text-text-muted hover:text-text-primary",
                        )}
                    >
                        Debits
                    </button>
                </div>
            </div>
        </div>

        <!-- Transactions Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {#each filteredTransactions as tx, i}
                <div
                    use:reveal={{ delay: 200 + i * 50, x: 30 }}
                    class="bg-surface p-5 rounded-[20px] border border-border-peach transition-all hover:shadow-lg hover:border-primary/20 group"
                >
                    <div class="flex items-start gap-4">
                        <!-- Icon -->
                        <div
                            class={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                                tx.type === "credit"
                                    ? "bg-success/15 text-success"
                                    : "bg-primary/15 text-primary",
                            )}
                        >
                            {#if tx.type === "credit"}
                                <ArrowDownLeft size={22} />
                            {:else}
                                <Zap size={22} />
                            {/if}
                        </div>

                        <!-- Content -->
                        <div class="flex-1 min-w-0">
                            <h3
                                class="font-bold text-text-primary text-sm truncate"
                            >
                                {tx.title}
                            </h3>
                            <p
                                class="text-xs text-text-muted mt-0.5 line-clamp-1"
                            >
                                {tx.description}
                            </p>
                            <div
                                class="flex items-center gap-2 mt-2 text-[10px] text-text-muted"
                            >
                                <Calendar size={10} />
                                <span class="font-medium">{tx.date}</span>
                            </div>
                        </div>

                        <!-- Amount -->
                        <div
                            class={cn(
                                "font-extrabold text-lg shrink-0",
                                tx.type === "credit"
                                    ? "text-success"
                                    : "text-text-primary",
                            )}
                        >
                            {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        {#if filteredTransactions.length === 0}
            <div
                class="py-20 flex flex-col items-center justify-center text-center opacity-50"
            >
                <History size={64} class="mb-4 text-text-muted" />
                <p class="font-bold text-text-secondary">
                    No transactions found
                    {#if searchQuery}
                        matching "{searchQuery}"
                    {/if}
                </p>
            </div>
        {/if}
    </main>
</div>
