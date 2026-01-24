<script context="module">
  import { cn } from "$lib/utils";
  import { Zap } from "lucide-svelte";
</script>

<script lang="ts">
  import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    TrendingUp,
    History,
  } from "lucide-svelte";

  const transactions = [
    {
      id: "1",
      title: "Flash Offer Broadcast",
      amount: "₹120",
      date: "22 Jan, 2:30 PM",
      type: "debit",
    },
    {
      id: "2",
      title: "Wallet Topup",
      amount: "₹500",
      date: "20 Jan, 11:15 AM",
      type: "credit",
    },
    {
      id: "3",
      title: "Weekend Sale Broadcast",
      amount: "₹200",
      date: "18 Jan, 6:00 PM",
      type: "debit",
    },
  ];
</script>

<div class="min-h-screen bg-bg-app pb-24 transition-colors duration-300">
  <header class="p-8">
    <h1 class="text-3xl font-heading font-extrabold text-text-primary">
      Wallet
    </h1>
    <p class="text-text-secondary font-medium">
      Manage your advertising budget.
    </p>
  </header>

  <main class="px-6 flex flex-col gap-6">
    <!-- Balance Card -->
    <div
      class="bg-primary p-8 rounded-[40px] text-white shadow-2xl shadow-primary/30 relative overflow-hidden"
    >
      <div
        class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
      ></div>

      <div class="flex flex-col gap-1 relative z-10">
        <span class="text-xs font-bold uppercase tracking-widest opacity-80"
          >Current Balance</span
        >
        <div
          class="text-5xl font-heading font-extrabold flex items-center gap-2"
        >
          <span class="text-3xl opacity-70">₹</span>1,240
        </div>
      </div>

      <div class="mt-8 flex gap-3 relative z-10">
        <button
          class="flex-1 py-4 bg-white text-primary font-bold rounded-2xl shadow-lg active:scale-95 transition-all"
        >
          Add Funds
        </button>
        <button
          class="p-4 bg-white/20 backdrop-blur-md text-white rounded-2xl active:scale-95 transition-all"
        >
          <TrendingUp size={24} />
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 gap-4">
      <div
        class="bg-surface p-6 rounded-[32px] border border-border-peach transition-colors duration-300"
      >
        <div
          class="w-10 h-10 bg-success/10 text-success rounded-xl flex items-center justify-center mb-3"
        >
          <ArrowDownLeft size={20} />
        </div>
        <div class="text-xl font-extrabold text-text-primary">₹5,000</div>
        <div
          class="text-[10px] font-bold text-text-muted uppercase tracking-wider"
        >
          Total Added
        </div>
      </div>
      <div
        class="bg-surface p-6 rounded-[32px] border border-border-peach transition-colors duration-300"
      >
        <div
          class="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-3"
        >
          <ArrowUpRight size={20} />
        </div>
        <div class="text-xl font-extrabold text-text-primary">₹3,760</div>
        <div
          class="text-[10px] font-bold text-text-muted uppercase tracking-wider"
        >
          Total Spent
        </div>
      </div>
    </div>

    <!-- History -->
    <div>
      <div class="flex items-center justify-between mb-4 px-2">
        <h2 class="text-xl font-bold text-text-primary flex items-center gap-2">
          <History size={20} /> Activity
        </h2>
        <button class="text-sm font-bold text-primary">View Statement</button>
      </div>

      <div class="flex flex-col gap-3">
        {#each transactions as tx}
          <div
            class="bg-surface p-5 rounded-[28px] border border-border-peach flex items-center justify-between transition-colors duration-300"
          >
            <div class="flex items-center gap-4">
              <div
                class={cn(
                  "p-3 rounded-2xl",
                  tx.type === "credit"
                    ? "bg-success/10 text-success"
                    : "bg-primary/10 text-primary",
                )}
              >
                {#if tx.type === "credit"}
                  <ArrowDownLeft size={20} />
                {:else}
                  <Zap size={20} />
                {/if}
              </div>
              <div>
                <div class="font-bold text-text-primary text-sm">
                  {tx.title}
                </div>
                <div class="text-[10px] font-medium text-text-muted">
                  {tx.date}
                </div>
              </div>
            </div>
            <div
              class={cn(
                "font-extrabold",
                tx.type === "credit" ? "text-success" : "text-text-primary",
              )}
            >
              {tx.type === "credit" ? "+" : "-"}{tx.amount}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </main>
</div>
