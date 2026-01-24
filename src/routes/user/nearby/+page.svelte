<script lang="ts">
  import { onMount } from 'svelte';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import { 
    MapPin, 
    Search, 
    ChevronRight, 
    Star,
    ChevronDown,
    CircleUser,
    Bell
  } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  let activeTab = $state<'online' | 'dineout'>('online');
  let locationName = $state('Hyderabad');
  let locationAddress = $state('Select Location');

  onMount(() => {
    const saved = localStorage.getItem('userLocation');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        locationName = data.name || 'Current Location';
        locationAddress = data.address || 'Unknown Address';
      } catch (e) {
        console.error('Failed to parse location', e);
      }
    }
  });
  
  const foodCategories = [
    { name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80' },
    { name: 'Cakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80' },
    { name: 'Pizzas', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80' },
    { name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80' },
    { name: 'Ice-Cream', image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=200&q=80' },
    { name: 'Shawarma', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=200&q=80' },
    { name: 'Waffle', image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=200&q=80' },
    { name: 'Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80' },
    { name: 'Pastry', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&q=80' },
    { name: 'Kebabs', image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=200&q=80' },
    { name: 'Tea', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&q=80' },
    { name: 'Juice', image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=200&q=80' },
  ];


  const featuredRestaurants = [
    { 
      name: 'Pizza Hut', 
      rating: 4.5, 
      time: '40-45 mins', 
      cuisines: 'Pizzas', 
      area: 'Kachiguda',
      offer: 'ITEMS AT ₹59',
      offerColor: 'bg-primary',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80'
    },
    { 
      name: 'Imperial Kitchen', 
      rating: 4.3, 
      time: '30-35 mins', 
      cuisines: 'Biryani, Chinese, Indian...', 
      area: 'Redhills',
      offer: '40% OFF UPTO ₹80',
      offerColor: 'bg-gradient-to-r from-amber-500 to-orange-500',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'
    },
    { 
      name: 'Zomoz - The Momo', 
      rating: 4.2, 
      time: '45-50 mins', 
      cuisines: 'Momos, Chinese', 
      area: 'Masab Tank',
      offer: '50% OFF UPTO ₹100',
      offerColor: 'bg-gradient-to-r from-teal-500 to-emerald-500',
      image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&q=80'
    },
    { 
      name: 'McDonalds', 
      rating: 4.4, 
      time: '25-30 mins', 
      cuisines: 'Burgers, Fast Food', 
      area: 'Mehdipatnam',
      offer: 'FREE DELIVERY',
      offerColor: 'bg-gradient-to-r from-indigo-500 to-purple-600',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80'
    },
  ];

  const allRestaurants = [
    { 
      name: 'Prasuma Momo Kitchen', 
      rating: 4.3, 
      time: '40-45 mins', 
      cuisines: 'Chinese, Pan-Asian, Beverages...', 
      area: 'Banjara Hills',
      offer: '60% OFF UPTO ₹120',
      offerColor: 'bg-gradient-to-r from-pink-500 to-rose-500',
      image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80'
    },
    { 
      name: 'Al Taza', 
      rating: 4.5, 
      time: '25-30 mins', 
      cuisines: 'Arabian, Juices, Beverages', 
      area: 'Mehdipatnam',
      offer: null,
      offerColor: '',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80'
    },
    { 
      name: 'Paradise Biryani', 
      rating: 4.6, 
      time: '35-40 mins', 
      cuisines: 'Biryani, North Indian', 
      area: 'Secunderabad',
      offer: 'FLAT ₹50 OFF',
      offerColor: 'bg-primary',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80'
    },
    { 
      name: 'The Rameshwaram Cafe', 
      rating: 4.4, 
      time: '30-35 mins', 
      cuisines: 'South Indian, Dosa', 
      area: 'Jubilee Hills',
      offer: '20% OFF',
      offerColor: 'bg-gradient-to-r from-amber-500 to-orange-500',
      image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80'
    },
  ];
</script>

<div class="min-h-screen bg-bg-app pb-32 text-text-primary">
  <!-- Header -->
  <header class="sticky top-0 bg-bg-app/95 backdrop-blur-xl z-30 border-b border-border-dark/30">
    <!-- Top Row: Logo, Location, Icons -->
    <!-- Top Row: Logo, Location, Icons -->
    <div class="px-1 py-2 flex items-center justify-between gap-1">
      <!-- Left: Logo & Location -->
      <a href="/user/onboarding" class="flex items-center gap-1 flex-1 min-w-0 active:opacity-70 transition-opacity">
        <!-- Logo -->
        <!-- Logo -->
        <div class="w-12 h-12 shrink-0 ml-1">
          <img src="/logo.png" alt="Happeno" class="w-full h-full object-contain" />
        </div>
        
        <!-- Location Info -->
        <div class="flex flex-col flex-1 min-w-0">
          <div class="flex items-center gap-1">
            <h2 class="text-base font-black text-text-primary leading-none">{locationName}</h2>
            <ChevronDown size={16} class="text-text-primary" />
          </div>
          <p class="text-xs text-text-muted font-medium truncate w-full">
            {locationAddress}
          </p>
        </div>
      </a>

      <!-- Right: Icons -->
      <div class="flex items-center gap-3 shrink-0">
        <!-- Search Button -->
        <a href="/user/search" class="w-10 h-10 bg-surface rounded-full flex items-center justify-center shadow-sm border border-border-dark text-text-primary">
          <Search size={20} />
        </a>
        <!-- Profile Button -->
        <a href="/user/profile" class="w-10 h-10 bg-surface rounded-full flex items-center justify-center shadow-sm border border-border-dark text-text-primary">
           <CircleUser size={20} />
        </a>
      </div>
    </div>

    <!-- Sub-Header Search Bar (Optional, keeping for UX but styled minimally if desired, or relying on the Search Icon above) -->
    <!-- Based on image, search is an icon. I will hide the big bar inside this header to match the image strictly. 
         Users can click the search icon to search. -->
  </header>

  <main class="px-6 space-y-10 pt-6">
    <!-- Hero Banner -->
    <section class="relative h-44 rounded-[32px] overflow-hidden shadow-lg group">
      <img 
        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80" 
        alt="Restaurant Banner" 
        class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
      <div class="relative h-full p-6 flex flex-col justify-end">
        <div class="flex items-center gap-2 text-white/80 mb-2">
          <div class="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-black">H</div>
          <span class="text-xs font-bold uppercase tracking-widest">Discover</span>
        </div>
        <h2 class="text-xl font-black text-white leading-tight">
          Explore Offers &<br/>
          <span class="text-primary">Restaurants Near You</span>
        </h2>
      </div>
    </section>

    <!-- What's on your mind? -->
    <section class="space-y-5">
      <h3 class="text-xl font-black text-text-primary">What's on your mind?</h3>
      <div class="flex gap-6 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
        {#each foodCategories as cat}
          <button class="flex flex-col items-center gap-3 group flex-shrink-0">
            <div class="w-20 h-20 rounded-full overflow-hidden shadow-lg group-hover:scale-105 transition-transform group-hover:shadow-xl border-2 border-white">
              <img 
                src={cat.image} 
                alt={cat.name} 
                class="w-full h-full object-cover"
              />
            </div>
            <span class="text-xs font-semibold text-text-secondary text-center whitespace-nowrap">{cat.name}</span>
          </button>
        {/each}
      </div>
    </section>


    <!-- Restaurants With Best Offers -->
    <section class="space-y-5">
      <h3 class="text-xl font-black text-text-primary">🔥 Exclusive Offers Near You</h3>
      <div class="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
        {#each featuredRestaurants as restaurant}
          <a href="/restaurant/{restaurant.name}" class="flex-shrink-0 w-44 group">
            <div class="relative aspect-square rounded-[24px] overflow-hidden border border-border-dark shadow-md">
              <img src={restaurant.image} alt={restaurant.name} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              {#if restaurant.offer}
                <div class="absolute bottom-3 left-3 right-3">
                  <div class={cn("px-3 py-1.5 rounded-lg text-[10px] font-black text-white uppercase tracking-wider", restaurant.offerColor)}>
                    {restaurant.offer}
                  </div>
                </div>
              {/if}
            </div>
            <div class="mt-3 space-y-1">
              <h4 class="font-bold text-sm line-clamp-1">{restaurant.name}</h4>
              <div class="flex items-center gap-1.5 text-[11px]">
                <div class="flex items-center gap-0.5 px-1.5 py-0.5 bg-success text-white rounded font-bold">
                  <Star size={10} fill="white" /> {restaurant.rating}
                </div>
                <span class="text-text-muted font-medium">• {restaurant.time}</span>
              </div>
              <p class="text-[10px] text-text-muted line-clamp-1">{restaurant.cuisines}</p>
              <p class="text-[10px] text-text-muted font-medium">{restaurant.area}</p>
            </div>
          </a>
        {/each}
      </div>
    </section>

    <!-- Offers / All Restaurants Tabs -->
    <section class="space-y-6">
      <div class="flex items-center gap-8 border-b border-border-dark">
        <button 
          onclick={() => activeTab = 'online'}
          class={cn(
            "pb-3 text-sm font-bold transition-all relative",
            activeTab === 'online' ? "text-text-primary" : "text-text-muted"
          )}
        >
          Best Offers
          {#if activeTab === 'online'}
            <div class="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full"></div>
          {/if}
        </button>
        <button 
          onclick={() => activeTab = 'dineout'}
          class={cn(
            "pb-3 text-sm font-bold transition-all relative",
            activeTab === 'dineout' ? "text-text-primary" : "text-text-muted"
          )}
        >
          All Restaurants
          {#if activeTab === 'dineout'}
            <div class="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full"></div>
          {/if}
        </button>
      </div>

      <div class="space-y-4">
        <h3 class="text-lg font-black text-text-primary">Popular Order Food Online restaurants near me</h3>
        <button class="flex items-center gap-2 px-4 py-2 bg-surface border border-border-dark rounded-full text-xs font-bold shadow-sm">
          Sort By <ChevronDown size={14} />
        </button>
      </div>

      <!-- Restaurant Grid -->
      <div class="grid grid-cols-2 gap-5">
        {#each allRestaurants as restaurant}
          <a href="/restaurant/{restaurant.name}" class="group">
            <div class="relative aspect-square rounded-[24px] overflow-hidden border border-border-dark shadow-md">
              <img src={restaurant.image} alt={restaurant.name} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              {#if restaurant.offer}
                <div class="absolute bottom-3 left-3 right-3">
                  <div class={cn("px-3 py-1.5 rounded-lg text-[10px] font-black text-white uppercase tracking-wider", restaurant.offerColor)}>
                    {restaurant.offer}
                  </div>
                </div>
              {/if}
            </div>
            <div class="mt-3 space-y-1">
              <h4 class="font-bold text-sm line-clamp-1">{restaurant.name}</h4>
              <div class="flex items-center gap-1.5 text-[11px]">
                <div class="flex items-center gap-0.5 px-1.5 py-0.5 bg-success text-white rounded font-bold">
                  <Star size={10} fill="white" /> {restaurant.rating}
                </div>
                <span class="text-text-muted font-medium">• {restaurant.time}</span>
              </div>
              <p class="text-[10px] text-text-muted line-clamp-1">{restaurant.cuisines}</p>
              <p class="text-[10px] text-text-muted font-medium">{restaurant.area}</p>
            </div>
          </a>
        {/each}
      </div>
    </section>
  </main>
</div>

<BottomNav />
