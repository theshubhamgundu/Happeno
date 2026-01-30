<script lang="ts">
  import BottomNav from '$lib/components/BottomNav.svelte';
  import { Search, Clock, TrendingUp, X, CircleUser, ChevronDown } from 'lucide-svelte';

  let searchQuery = $state('');
  let isFocused = $state(false);

  const recentSearches = [
    'Biryani',
    'Pizza near me',
    'Chinese food',
    'Burger King',
  ];

  const popularSearches = [
    { name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80' },
    { name: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80' },
    { name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80' },
    { name: 'Momos', image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=200&q=80' },
    { name: 'Ice Cream', image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=200&q=80' },
    { name: 'Dosa', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=200&q=80' },
    { name: 'Shawarma', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=200&q=80' },
    { name: 'Cake', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80' },
  ];

  const cuisines = [
    'North Indian',
    'South Indian',
    'Chinese',
    'Italian',
    'Mexican',
    'Thai',
    'Continental',
    'Fast Food',
  ];
</script>

<div class="min-h-screen bg-bg-app pb-32 text-text-primary">
  <!-- Standardized Header -->
  <header class="sticky top-0 bg-bg-app/95 backdrop-blur-xl z-30 border-b border-border-dark/30">
    <div class="px-2 py-2 flex items-center justify-between gap-1">
      <div class="flex items-center gap-1 ml-2">
          <h1 class="text-xl font-black">🔍 Search</h1>
      </div>

      <div class="flex items-center gap-3 shrink-0 mr-1">
        <a href="/user/profile" class="w-10 h-10 bg-surface rounded-full flex items-center justify-center shadow-sm border border-border-dark text-text-primary">
           <CircleUser size={20} />
        </a>
      </div>
    </div>
    
    <div class="px-6 py-4">
    <div class="relative">
      <Search size={20} class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
      <input 
        bind:value={searchQuery}
        onfocus={() => isFocused = true}
        placeholder="Search restaurants, cuisines, or offers"
        class="w-full pl-12 pr-12 py-4 bg-surface border border-border-dark rounded-2xl text-sm font-medium outline-none focus:border-primary transition-all placeholder:text-text-muted shadow-sm"
      />
      {#if searchQuery}
        <button 
          onclick={() => searchQuery = ''}
          class="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
        >
          <X size={18} />
        </button>
      {/if}
    </div>
  </div>
</header>

  <main class="px-6 space-y-10 pt-4">
    <!-- Recent Searches -->
    {#if recentSearches.length > 0}
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-text-secondary flex items-center gap-2">
            <Clock size={16} /> Recent Searches
          </h3>
          <button class="text-xs font-bold text-primary">Clear All</button>
        </div>
        <div class="flex flex-wrap gap-2">
          {#each recentSearches as search}
            <button class="px-4 py-2 bg-surface border border-border-dark rounded-full text-sm font-medium hover:border-primary/50 transition-colors">
              {search}
            </button>
          {/each}
        </div>
      </section>
    {/if}

    <!-- Popular Right Now -->
    <section class="space-y-4">
      <h3 class="text-sm font-bold text-text-secondary flex items-center gap-2">
        <TrendingUp size={16} /> Popular Right Now
      </h3>
      <div class="grid grid-cols-4 gap-4">
        {#each popularSearches as item}
          <button class="flex flex-col items-center gap-2 p-3 bg-surface border border-border-dark rounded-2xl hover:border-primary/30 transition-colors shadow-sm group">
            <div class="w-14 h-14 rounded-full overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
              <img src={item.image} alt={item.name} class="w-full h-full object-cover" />
            </div>
            <span class="text-[10px] font-bold text-text-secondary text-center">{item.name}</span>
          </button>
        {/each}
      </div>
    </section>

    <!-- Cuisines -->
    <section class="space-y-4">
      <h3 class="text-sm font-bold text-text-secondary">Explore by Cuisine</h3>
      <div class="flex flex-wrap gap-2">
        {#each cuisines as cuisine}
          <button class="px-4 py-2.5 bg-surface border border-border-dark rounded-full text-sm font-bold hover:bg-primary hover:text-white hover:border-primary transition-colors shadow-sm">
            {cuisine}
          </button>
        {/each}
      </div>
    </section>
  </main>
</div>

<BottomNav />
