<script lang="ts">
  import { Home, Search, Tag, User } from 'lucide-svelte';
  import { page } from '$app/stores';
  import { cn } from '$lib/utils';
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/user/nearby' },
    { icon: Search, label: 'Search', path: '/user/search' },
    { icon: Tag, label: 'Offers', path: '/user/offers' },
    { icon: User, label: 'Profile', path: '/user/profile' }
  ];
</script>

<nav class="fixed bottom-0 left-0 right-0 bg-bg-app backdrop-blur-xl border-t border-border-dark px-4 pt-2 pb-3 flex justify-around items-center z-50 shadow-lg">
  {#each navItems as item}
    <a 
      href={item.path} 
      class={cn(
        "flex flex-col items-center gap-1 transition-all duration-200 py-2 px-4",
        $page.url.pathname === item.path || ($page.url.pathname === '/' && item.path === '/user/nearby') 
          ? "text-primary" 
          : "text-text-muted hover:text-text-secondary"
      )}
    >
      <item.icon size={22} strokeWidth={$page.url.pathname === item.path ? 2.5 : 2} />
      <span class={cn(
        "text-[9px] font-bold uppercase tracking-wider mt-1",
        $page.url.pathname === item.path ? "text-primary" : "text-text-muted"
      )}>{item.label}</span>
    </a>
  {/each}
</nav>
