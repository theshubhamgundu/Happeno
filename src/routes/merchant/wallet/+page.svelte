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
    ArrowLeft,
  } from "lucide-svelte";
  import { profileStore } from "$lib/stores/merchant";
  import { goto } from "$app/navigation";

  let balance = $state(1000);
  let showAddFunds = $state(false);
  let amountToAdd = $state("");

  // In a real app, these would come from the backend
  let transactions = $state([
    {
      id: "1",
      title: "Flash Offer Broadcast",
      amount: "120",
      date: "22 Jan, 2:30 PM",
      type: "debit",
    },
    {
      id: "2",
      title: "Wallet Topup",
      amount: "500",
      date: "20 Jan, 11:15 AM",
      type: "credit",
    },
    {
      id: "3",
      title: "Weekend Sale Broadcast",
      amount: "200",
      date: "18 Jan, 6:00 PM",
      type: "debit",
    },
  ]);

  let totalAdded = $derived(
    transactions
      .filter((t) => t.type === "credit")
      .reduce((acc, curr) => acc + parseInt(curr.amount), 0),
  );

  let totalSpent = $derived(
    transactions
      .filter((t) => t.type === "debit")
      .reduce((acc, curr) => acc + parseInt(curr.amount), 0),
  );

  function handleAddFunds() {
    if (!amountToAdd || parseInt(amountToAdd) <= 0) return;

    const amount = parseInt(amountToAdd);
    balance += amount;

    transactions.unshift({
      id: Date.now().toString(),
      title: "Wallet Recharge",
      amount: amount.toString(),
      date: new Date().toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      type: "credit",
    });

    amountToAdd = "";
    showAddFunds = false;
  }

  function handleBuyPremium() {
    if ($profileStore.isPremium) {
      alert("You are already a Premium member!");
      return;
    }
    if (balance < 500) {
      alert("Insufficient balance! Please add funds.");
      return;
    }

    balance -= 500;
    transactions.unshift({
      id: Date.now().toString(),
      title: "Premium Subscription",
      amount: "500",
      date: new Date().toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      type: "debit",
    });

    // Update store
    $profileStore.isPremium = true;

    alert("Premium subscription purchased successfully!");
  }
</script>

<div class="min-h-screen bg-bg-app pb-24 transition-colors duration-300">
  <header class="p-8">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button
          onclick={() => goto("/merchant/dashboard")}
          class="p-2 -ml-2 rounded-full hover:bg-slate-100 text-text-primary transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 class="text-3xl font-heading font-extrabold text-text-primary">
            Wallet
          </h1>
          <p class="text-text-secondary font-medium">Manage your budget.</p>
        </div>
      </div>
      <div
        class="p-3 bg-surface rounded-full shadow-sm border border-border-peach"
      >
        <Wallet class="text-primary" size={24} />
      </div>
    </div>
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
          <span class="text-3xl opacity-70">₹</span>{balance}
        </div>
      </div>

      <div class="mt-8 flex gap-3 relative z-10">
        <button
          onclick={() => (showAddFunds = true)}
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

    <!-- Subscription Plan -->
    <div
      class="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-[32px] text-white shadow-xl relative overflow-hidden"
    >
      <div class="relative z-10">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h2 class="text-xl font-bold font-heading">Premium Plan</h2>
            <p class="opacity-80 text-sm">Unlock full potential</p>
          </div>
          <div
            class="px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm"
          >
            PRO
          </div>
        </div>

        <ul class="space-y-2 mb-6">
          <li class="flex items-center gap-2 text-sm font-medium">
            <div class="bg-white/20 p-1 rounded-full"><Zap size={12} /></div>
            Launch Unlimited Offers
          </li>
          <li class="flex items-center gap-2 text-sm font-medium">
            <div class="bg-white/20 p-1 rounded-full"><Zap size={12} /></div>
            Add Unlimited Menu Items
          </li>
        </ul>

        <div class="flex items-center justify-between">
          <div class="text-2xl font-bold">
            ₹500 <span class="text-sm opacity-70 font-normal">/mo</span>
          </div>
          <button
            onclick={handleBuyPremium}
            class="px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-lg active:scale-95 transition-all hover:bg-indigo-50"
          >
            Buy Now
          </button>
        </div>
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
        <div class="text-xl font-extrabold text-text-primary">
          ₹{totalAdded}
        </div>
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
        <div class="text-xl font-extrabold text-text-primary">
          ₹{totalSpent}
        </div>
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

  <!-- Add Funds Modal -->
  {#if showAddFunds}
    <div class="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onclick={() => (showAddFunds = false)}
      ></div>
      <div
        class="bg-surface w-full max-w-sm p-6 rounded-[32px] shadow-2xl relative z-10 animate-in fade-in zoom-in duration-200"
      >
        <h2 class="text-2xl font-heading font-extrabold text-text-primary mb-2">
          Add Money
        </h2>
        <p class="text-text-secondary text-sm mb-6">
          Enter amount to add to your wallet.
        </p>

        <div class="space-y-4">
          <div>
            <label
              class="text-xs font-bold text-text-muted uppercase tracking-wider ml-1"
              >Amount</label
            >
            <input
              type="number"
              bind:value={amountToAdd}
              placeholder="Enter amount (e.g. 1000)"
              class="w-full mt-1 p-4 bg-bg-app rounded-xl font-bold text-lg outline-none border border-transparent focus:border-primary transition-colors"
              autofocus
            />
          </div>

          <button
            onclick={handleAddFunds}
            class="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-all"
          >
            Proceed to Pay
          </button>
          <button
            onclick={() => (showAddFunds = false)}
            class="w-full py-3 text-text-muted font-bold rounded-xl hover:bg-bg-app transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
