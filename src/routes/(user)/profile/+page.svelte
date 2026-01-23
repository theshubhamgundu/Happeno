<script lang="ts">
  import BottomNav from '$lib/components/BottomNav.svelte';
  import Button from '$lib/components/Button.svelte';
  import { goto } from '$app/navigation';
  import { Bell, LogOut, Shield, ChevronRight, User as UserIcon } from 'lucide-svelte';

  let notificationsEnabled = $state(true);

  async function handleLogout() {
    goto('/');
  }
</script>

<div class="min-h-screen bg-bg-app pb-24">
  <header class="px-6 py-12 flex flex-col items-center gap-4 text-center">
    <div class="w-24 h-24 bg-white rounded-[40px] border border-border-peach shadow-xl flex items-center justify-center text-primary">
      <UserIcon size={48} />
    </div>
    <div>
      <h1 class="text-2xl font-heading font-extrabold text-text-primary">+91 99999 00000</h1>
      <p class="text-sm font-bold text-text-muted mt-1 uppercase tracking-widest">Happeno Member</p>
    </div>
  </header>

  <main class="px-6 flex flex-col gap-4">
    <div class="bg-white rounded-[32px] border border-border-peach overflow-hidden shadow-sm">
      <div class="p-6 flex items-center justify-between border-b border-border-peach">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-primary/10 rounded-2xl text-primary">
            <Bell size={20} />
          </div>
          <div>
            <div class="font-bold text-text-primary">Nearby Alerts</div>
            <div class="text-xs font-medium text-text-muted">Notify me when offers are live nearby</div>
          </div>
        </div>
        <button 
          onclick={() => notificationsEnabled = !notificationsEnabled}
          class={cn(
            "w-12 h-6 rounded-full p-1 transition-colors duration-300",
            notificationsEnabled ? "bg-primary" : "bg-border-peach"
          )}
        >
          <div class={cn(
            "w-4 h-4 bg-white rounded-full transition-transform duration-300",
            notificationsEnabled ? "translate-x-6" : "translate-x-0"
          )}></div>
        </button>
      </div>

      <div class="p-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-primary/10 rounded-2xl text-primary">
            <Shield size={20} />
          </div>
          <div>
            <div class="font-bold text-text-primary">Privacy Settings</div>
            <div class="text-xs font-medium text-text-muted">Manage your data and permissions</div>
          </div>
        </div>
        <ChevronRight size={20} class="text-text-muted" />
      </div>
    </div>

    <Button variant="outline" onclick={handleLogout} class="w-full py-5 border-urgency/50 text-urgency hover:bg-urgency/5">
      <LogOut size={20} class="mr-2" /> Logout
    </Button>
  </main>
</div>

<BottomNav />

<script context="module">
  import { cn } from '$lib/utils';
</script>
