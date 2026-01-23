<script lang="ts">
  import BottomNav from '$lib/components/BottomNav.svelte';
  import { goto } from '$app/navigation';
  import { 
    ChevronLeft, 
    Pencil, 
    ChevronRight, 
    ClipboardList, 
    Heart,
    MapPin,
    CreditCard,
    HelpCircle,
    Settings,
    LogOut,
    CircleUser
  } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  const menuItems = [
    { name: 'Saved Offers', icon: ClipboardList, path: '/saved-offers' },
    { name: 'Favorite Restaurants', icon: Heart, path: '/favorites' },
    { name: 'Saved Addresses', icon: MapPin, path: '/addresses' },
  ];

  const supportItems = [
    { name: 'Help & Support', icon: HelpCircle, path: '/support' },
    { name: 'Settings', icon: Settings, path: '/profile/settings' },
  ];

  function handleLogout() {
    goto('/');
  }
</script>

<div class="min-h-screen bg-bg-app pb-32 text-text-primary">
  <!-- Header -->
  <header class="px-6 pt-12 pb-6 sticky top-0 bg-bg-app/95 backdrop-blur-xl z-20 flex items-center gap-4 border-b border-border-dark/50">
    <button onclick={() => history.back()} class="p-2 -ml-2">
      <ChevronLeft size={24} />
    </button>
    <h1 class="text-xl font-black">Profile</h1>
  </header>

  <main class="px-6 space-y-8 pt-6">
    <!-- User Info Card -->
    <section class="flex items-center gap-5 p-6 bg-surface border border-border-dark rounded-[24px] shadow-sm">
      <div class="w-16 h-16 bg-bg-app border border-border-dark rounded-full flex items-center justify-center text-text-muted">
         <CircleUser size={40} strokeWidth={1.5} />
      </div>
      <div class="flex-1 text-left">
        <h2 class="text-lg font-bold">Shubham Gundu</h2>
        <p class="text-xs text-text-muted font-medium">+91 86988 46796</p>
        <p class="text-xs text-text-muted">shubham@example.com</p>
      </div>
      <button class="p-3 text-text-muted hover:text-primary transition-colors">
        <Pencil size={18} />
      </button>
    </section>

    <!-- Main Menu -->
    <section class="bg-surface border border-border-dark rounded-[24px] overflow-hidden shadow-sm">
      {#each menuItems as item, i}
        <a 
          href={item.path}
          class={cn(
            "flex items-center justify-between p-5 hover:bg-bg-app transition-colors",
            i !== menuItems.length - 1 && "border-b border-border-dark"
          )}
        >
          <div class="flex items-center gap-4">
            <div class="p-2.5 bg-bg-app rounded-xl text-primary">
              <item.icon size={20} strokeWidth={1.5} />
            </div>
            <span class="text-sm font-bold">{item.name}</span>
          </div>
          <ChevronRight size={18} class="text-text-muted" />
        </a>
      {/each}
    </section>

    <!-- Support Section -->
    <section class="bg-surface border border-border-dark rounded-[24px] overflow-hidden shadow-sm">
      {#each supportItems as item, i}
        <a 
          href={item.path}
          class={cn(
            "flex items-center justify-between p-5 hover:bg-bg-app transition-colors",
            i !== supportItems.length - 1 && "border-b border-border-dark"
          )}
        >
          <div class="flex items-center gap-4">
            <div class="p-2.5 bg-bg-app rounded-xl text-text-muted">
              <item.icon size={20} strokeWidth={1.5} />
            </div>
            <span class="text-sm font-bold">{item.name}</span>
          </div>
          <ChevronRight size={18} class="text-text-muted" />
        </a>
      {/each}
    </section>

    <!-- Logout Button -->
    <button 
      onclick={handleLogout}
      class="w-full flex items-center justify-center gap-3 p-5 bg-surface border border-urgency/30 rounded-[24px] text-urgency font-bold hover:bg-urgency/5 transition-colors shadow-sm"
    >
      <LogOut size={20} />
      <span>Log Out</span>
    </button>

    <!-- App Version -->
    <p class="text-center text-xs text-text-muted font-medium pb-4">
      Happeno v1.0.0 • Made with ❤️ in Hyderabad
    </p>
  </main>
</div>

<BottomNav />
