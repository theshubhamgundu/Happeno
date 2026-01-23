<script lang="ts">
  import { 
    ChevronLeft, 
    Trash2, 
    Info, 
    Bell,
    ChevronRight
  } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  const settingsItems = [
    { name: 'Delete Account', icon: Trash2 },
    { name: 'Notification Settings', icon: Info },
    { name: 'Dining Settings', icon: Bell },
  ];
</script>

<div class="min-h-screen bg-bg-app pb-32 text-text-primary">
  <!-- Header -->
  <header class="px-6 pt-12 pb-6 sticky top-0 bg-bg-app/80 backdrop-blur-xl z-20 flex items-center gap-4">
    <button onclick={() => history.back()} class="p-2 -ml-2">
      <ChevronLeft size={24} />
    </button>
    <h1 class="text-xl font-black italic uppercase tracking-wider">Account Settings</h1>
  </header>

  <main class="px-6 py-4 flex flex-col gap-4">
    {#each settingsItems as item}
      <button class="w-full p-6 bg-surface border border-border-dark rounded-[32px] flex items-center justify-between shadow-sm hover:bg-surface-lighter transition-all group">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-bg-app rounded-2xl text-text-muted group-hover:text-primary transition-colors">
            <item.icon size={20} strokeWidth={1.5} />
          </div>
          <span class="text-xs font-bold uppercase tracking-widest">{item.name}</span>
        </div>
        <ChevronRight size={16} class="text-text-muted" />
      </button>
    {/each}
  </main>
</div>
