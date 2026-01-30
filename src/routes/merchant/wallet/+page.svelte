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
    Wifi,
    CreditCard,
    Landmark,
    Plus,
  } from "lucide-svelte";
  import { profileStore } from "$lib/stores/merchant";
  import { goto } from "$app/navigation";
  import { toast } from "$lib/stores/toast";
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { reveal } from "$lib/actions/reveal";

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
    toast.add(`Added ₹${amount} to wallet successfully!`, "success");
  }

  function handleBuyPremium() {
    if ($profileStore.isPremium) {
      toast.add("You are already a Premium member!", "info");
      return;
    }
    if (balance < 500) {
      toast.add("Insufficient balance! Please add funds.", "warning");
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

    toast.add("Premium subscription purchased successfully!", "success");
  }
</script>

<div class="min-h-screen bg-bg-app pb-24 transition-colors duration-300 pt-6">
  <main class="px-6 flex flex-col gap-6">
    <!-- Realistic Digital Card -->
    <div
      use:reveal={{ delay: 0, x: 50 }}
      class="group relative h-56 w-full rounded-[24px] overflow-hidden shadow-2xl shadow-slate-900/20 perspective-1000 transition-all hover:scale-[1.02] duration-500"
    >
      <!-- Background Texture (Dark Premium) -->
      <div
        class="absolute inset-0 bg-[#0f172a] bg-gradient-to-br from-slate-800 via-[#0f172a] to-black z-0"
      ></div>
      <div
        class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay z-0"
      ></div>

      <!-- Glossy Reflection -->
      <div
        class="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine left-[150%]"
      ></div>

      <!-- Content -->
      <div class="relative z-10 p-6 flex flex-col justify-between h-full">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-2">
            <div
              class="text-white/80 font-bold font-mono tracking-widest text-lg"
            >
              Happen<span class="text-primary">o</span>
            </div>
          </div>
          <div class="text-white/30 italic font-serif font-black">Debit</div>
        </div>

        <div class="flex items-center gap-4 pl-1">
          <!-- EMV Chip -->
          <div
            class="w-12 h-9 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 rounded-lg shadow-inner border border-yellow-700/30 flex items-center justify-center relative overflow-hidden"
          >
            <div
              class="absolute inset-0 border-[0.5px] border-black/20 rounded-lg m-[2px]"
            ></div>
            <div class="w-full h-[1px] bg-black/20 absolute top-1/3"></div>
            <div class="w-full h-[1px] bg-black/20 absolute bottom-1/3"></div>
            <div class="h-full w-[1px] bg-black/20 absolute left-1/3"></div>
            <div class="h-full w-[1px] bg-black/20 absolute right-1/3"></div>
          </div>
          <!-- Contactless -->
          <div class="rotate-90 opacity-60">
            <Wifi size={24} class="text-white" />
          </div>
        </div>

        <div class="space-y-4">
          <!-- Balance -->
          <div class="flex items-baseline gap-1">
            <span class="text-gray-400 font-sans text-xl">₹</span>
            <span
              class="text-3xl text-white font-mono font-bold tracking-tight shadow-black drop-shadow-md"
            >
              {balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <!-- Details -->
          <div class="flex justify-between items-end">
            <div>
              <div
                class="text-[8px] text-gray-500 uppercase tracking-widest mb-1"
              >
                Card Holder
              </div>
              <div
                class="text-sm text-gray-200 font-medium tracking-wide uppercase font-mono"
              >
                {$profileStore.businessName || "MERCHANT ACCOUNT"}
              </div>
            </div>
            <!-- Logo -->
            <div class="flex items-center gap-1 opacity-80">
              <div
                class="w-8 h-8 rounded-full bg-red-500/90 mix-blend-lighten"
              ></div>
              <div
                class="w-8 h-8 rounded-full bg-orange-500/90 mix-blend-lighten -ml-4"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions Actions -->
    <div class="" use:reveal={{ delay: 100, x: 50 }}>
      <button
        onclick={() => (showAddFunds = true)}
        class="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center gap-3 active:scale-95 transition-all group hover:border-black/5"
      >
        <div
          class="p-2 bg-black text-white rounded-full group-hover:scale-110 transition-transform"
        >
          <Plus size={20} />
        </div>
        <span class="font-bold text-slate-700 text-sm">Add Funds</span>
      </button>
    </div>

    <!-- Subscription Plan -->
    <div
      use:reveal={{ delay: 200, x: 50 }}
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
    <div class="grid grid-cols-2 gap-4" use:reveal={{ delay: 300, x: 50 }}>
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
        {#each transactions as tx, i}
          <div
            use:reveal={{ delay: 400 + i * 100, x: 50 }}
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
