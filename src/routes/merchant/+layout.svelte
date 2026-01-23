<script lang="ts">
  import { Plus, LayoutDashboard, History, Wallet, User as UserIcon } from 'lucide-svelte';
  import { cn } from '$lib/utils';
  
  let { children } = $props();
</script>

<div class="min-h-screen bg-bg-app flex flex-col">
  <main class="flex-1 pb-24">
    {@render children()}
  </main>

  <nav class="fixed bottom-0 left-0 right-0 bg-text-primary text-white px-6 pt-4 pb-8 flex justify-between items-center z-50 rounded-t-[40px]">
    <a href="/merchant/dashboard" class="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
      <LayoutDashboard size={24} />
      <span class="text-[10px] uppercase font-bold tracking-widest">Dash</span>
    </a>
    <a href="/merchant/history" class="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
      <History size={24} />
      <span class="text-[10px] uppercase font-bold tracking-widest">History</span>
    </a>
    <a href="/merchant/create-offer" class="flex flex-col items-center gap-1 -mt-12 bg-primary p-5 rounded-[28px] shadow-xl shadow-primary/40 active:scale-95 transition-all">
      <Plus size={32} strokeWidth={3} />
    </a>
    <a href="/merchant/wallet" class="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
      <Wallet size={24} />
      <span class="text-[10px] uppercase font-bold tracking-widest">Wallet</span>
    </a>
    <a href="/merchant/profile" class="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
      <UserIcon size={24} />
      <span class="text-[10px] uppercase font-bold tracking-widest">Set</span>
    </a>
  </nav>
</div>
