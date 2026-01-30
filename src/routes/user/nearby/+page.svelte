<script lang="ts">
  import { onMount } from "svelte";
  import BottomNav from "$lib/components/BottomNav.svelte";
  import {
    MapPin,
    Search,
    ChevronRight,
    Star,
    ChevronDown,
    CircleUser,
    Bell,
    Clock,
    Navigation,
    LayoutGrid,
    BadgeCheck,
  } from "lucide-svelte";
  import { cn } from "$lib/utils";
  import { getHexFromLatLng, getHexNeighbors, NEARBY_DATA } from "$lib/geo";
  import Map from "$lib/components/Map.svelte";

  // --- State ---
  let activeTab = $state<"online" | "dineout">("online");
  let viewMode = $state<"list" | "map">("list");
  let locationName = $state("Hyderabad");
  let locationAddress = $state("Select Location");
  let userCoords = $state({ lat: 17.4485, lng: 78.3915 });
  let currentHex = $state<any>(null);
  let neighborhoodHexes = $state<string[]>([]);
  let isExploringNeighborhood = $state(false);
  let isLoading = $state(true);

  // --- Derived Data (The Power of Geo-Tilling) ---
  let nearbyRestaurants = $derived.by(() => {
    if (!currentHex) return [];
    const allowedHexes = isExploringNeighborhood
      ? [currentHex.id, ...neighborhoodHexes]
      : [currentHex.id];
    return NEARBY_DATA.filter((r) => allowedHexes.includes(r.hexId));
  });

  let featuredRestaurants = $derived(
    nearbyRestaurants.filter((r) => r.offer).slice(0, 4),
  );
  let mapMarkers = $derived(
    nearbyRestaurants.map((r) => ({
      lng: r.lng,
      lat: r.lat,
      title: r.name,
    })),
  );

  onMount(() => {
    const saved = localStorage.getItem("userLocation");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        locationName = data.name || "Hyderabad";
        locationAddress = data.address || "Select Location";
      } catch (e) {
        console.error("Failed to parse location", e);
      }
    }

    // Resolve Zones
    setTimeout(() => {
      currentHex = getHexFromLatLng(userCoords.lat, userCoords.lng);
      neighborhoodHexes = getHexNeighbors(currentHex, 1);
      isLoading = false;
    }, 500);
  });

  const foodCategories = [
    {
      name: "Biryani",
      image:
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80",
    },
    {
      name: "Cakes",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80",
    },
    {
      name: "Pizzas",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80",
    },
    {
      name: "Burgers",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80",
    },
    {
      name: "Ice-Cream",
      image:
        "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=200&q=80",
    },
    {
      name: "Shawarma",
      image:
        "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=200&q=80",
    },
  ];
</script>

<div class="min-h-screen bg-bg-app pb-32 text-text-primary">
  <!-- Header (Old UI Style) -->
  <header
    class="sticky top-0 bg-bg-app/95 backdrop-blur-xl z-30 border-b border-border-dark/30"
  >
    <div class="px-1 py-2 flex items-center justify-between gap-1">
      <a
        href="/user/onboarding"
        class="flex items-center gap-1 flex-1 min-w-0 active:opacity-70 transition-opacity"
      >
        <div class="w-12 h-12 shrink-0 ml-1">
          <img
            src="/logo.png"
            alt="Happeno"
            class="w-full h-full object-contain"
          />
        </div>
        <div class="flex flex-col flex-1 min-w-0">
          <div class="flex items-center gap-1">
            <h2 class="text-base font-black text-text-primary leading-none">
              {locationName}
            </h2>
            <ChevronDown size={16} class="text-text-primary" />
          </div>
          <p class="text-xs text-text-muted font-medium truncate w-full">
            {#if isLoading}Resolving Zone...{:else}{locationAddress}{/if}
          </p>
        </div>
      </a>

      <div class="flex items-center gap-3 shrink-0 mr-2">
        <!-- View Toggle -->
        <div class="flex bg-surface border border-border-dark rounded-full p-1">
          <button
            onclick={() => (viewMode = "list")}
            class={cn(
              "p-1.5 rounded-full transition-all",
              viewMode === "list" ? "bg-primary text-white" : "text-text-muted",
            )}
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onclick={() => (viewMode = "map")}
            class={cn(
              "p-1.5 rounded-full transition-all",
              viewMode === "map" ? "bg-primary text-white" : "text-text-muted",
            )}
          >
            <Navigation size={14} />
          </button>
        </div>
        <a
          href="/user/search"
          class="w-10 h-10 bg-surface rounded-full flex items-center justify-center shadow-sm border border-border-dark text-text-primary"
        >
          <Search size={20} />
        </a>
        <a
          href="/user/profile"
          class="w-10 h-10 bg-surface rounded-full flex items-center justify-center shadow-sm border border-border-dark text-text-primary"
        >
          <CircleUser size={20} />
        </a>
      </div>
    </div>
  </header>

  <main class="px-6 space-y-10 pt-6">
    {#if viewMode === "map"}
      <div class="fixed inset-0 top-[64px] z-20 bg-white">
        <Map
          center={[userCoords.lng, userCoords.lat]}
          zoom={14}
          markers={mapMarkers}
          class="h-full w-full"
        />
        <div class="absolute bottom-32 left-6 right-6 z-30">
          <div
            class="bg-white/90 backdrop-blur-md p-5 rounded-[24px] border border-gray-100 shadow-2xl flex items-center justify-between"
          >
            <div>
              <h3 class="font-bold text-base">
                Current Zone: {currentHex?.id || "..."}
              </h3>
              <p class="text-xs text-gray-400">
                {nearbyRestaurants.length} Restaurants available
              </p>
            </div>
            <button
              onclick={() => (viewMode = "list")}
              class="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider"
              >Show List</button
            >
          </div>
        </div>
      </div>
    {/if}

    <!-- Hero Banner (Old UI Style) -->
    <section
      class="relative h-44 rounded-[32px] overflow-hidden shadow-lg group"
    >
      <img
        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
        alt="Banner"
        class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div
        class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"
      ></div>
      <div class="relative h-full p-6 flex flex-col justify-end">
        <div class="flex items-center gap-2 text-white/80 mb-2">
          <div
            class="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-black"
          >
            H
          </div>
          <span class="text-xs font-bold uppercase tracking-widest"
            >Discover Nearby</span
          >
        </div>
        <h2 class="text-xl font-black text-white leading-tight">
          Explore Best Offers<br />
          <span class="text-primary">Near Your Zone</span>
        </h2>
      </div>
    </section>

    <!-- What's on your mind? (Old UI Style) -->
    <section class="space-y-5">
      <h3 class="text-xl font-black text-text-primary">What's on your mind?</h3>
      <div class="flex gap-6 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
        {#each foodCategories as cat}
          <button class="flex flex-col items-center gap-3 group flex-shrink-0">
            <div
              class="w-20 h-20 rounded-full overflow-hidden shadow-lg group-hover:scale-105 transition-transform group-hover:shadow-xl border-2 border-white"
            >
              <img
                src={cat.image}
                alt={cat.name}
                class="w-full h-full object-cover"
              />
            </div>
            <span
              class="text-xs font-semibold text-text-secondary text-center whitespace-nowrap"
              >{cat.name}</span
            >
          </button>
        {/each}
      </div>
    </section>

    <!-- Restaurants With Best Offers (Next Level Card Design) -->
    <section class="space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-black tracking-tight text-text-primary">
          🔥 Exclusive Nearby
        </h3>
        <button
          class="text-xs font-black text-primary uppercase tracking-widest"
          >View All</button
        >
      </div>
      <div class="flex gap-6 overflow-x-auto no-scrollbar pb-6 -mx-6 px-6">
        {#if isLoading}
          {#each Array(4) as _}
            <div
              class="w-52 h-64 bg-surface rounded-[40px] animate-pulse border border-border-dark/50"
            ></div>
          {/each}
        {:else}
          {#each featuredRestaurants as restaurant}
            <a
              href="/restaurant/{restaurant.name}"
              class="flex-shrink-0 w-52 group relative"
            >
              <!-- Main Card Body -->
              <div
                class="relative aspect-[4/5] rounded-[40px] rounded-tr-[12px] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 transform group-hover:-translate-y-1"
              >
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                ></div>

                <!-- Floating Offer Tag -->
                {#if restaurant.offer}
                  <div class="absolute top-4 left-4">
                    <div
                      class={cn(
                        "px-4 py-2 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.1em] shadow-lg backdrop-blur-md bg-opacity-90",
                        restaurant.offerColor,
                      )}
                    >
                      {restaurant.offer}
                    </div>
                  </div>
                {/if}

                <div class="absolute bottom-0 inset-x-0 p-5 space-y-2">
                  <div class="flex items-center gap-1.5">
                    <h4
                      class="font-black text-white text-lg leading-tight group-hover:text-primary transition-colors"
                    >
                      {restaurant.name}
                    </h4>
                    <BadgeCheck
                      size={16}
                      class="text-primary fill-primary/20"
                    />
                  </div>
                  <div class="flex items-center gap-2">
                    <div
                      class="bg-success px-2 py-1 rounded-lg text-white flex items-center gap-1 shadow-md"
                    >
                      <Star size={10} fill="white" />
                      <span class="text-[10px] font-black"
                        >{restaurant.rating}</span
                      >
                    </div>
                    <span
                      class="text-[10px] font-bold text-white/70 tracking-widest uppercase"
                      >25 MIN</span
                    >
                  </div>
                </div>
              </div>
            </a>
          {/each}
        {/if}
      </div>
    </section>

    <!-- Offers / All Restaurants Tabs -->
    <section class="space-y-8">
      <div class="flex items-center gap-8 border-b border-border-dark/50">
        <button
          onclick={() => (activeTab = "online")}
          class={cn(
            "pb-4 text-sm font-black transition-all relative uppercase tracking-widest",
            activeTab === "online" ? "text-primary" : "text-text-muted",
          )}
        >
          Best Offers
          {#if activeTab === "online"}
            <div
              class="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full"
            ></div>
          {/if}
        </button>
        <button
          onclick={() => (activeTab = "dineout")}
          class={cn(
            "pb-4 text-sm font-black transition-all relative uppercase tracking-widest",
            activeTab === "dineout" ? "text-primary" : "text-text-muted",
          )}
        >
          All Restaurants
          {#if activeTab === "dineout"}
            <div
              class="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full"
            ></div>
          {/if}
        </button>
      </div>

      <!-- Main Feed Grid (Next Level Design) -->
      <div class="grid grid-cols-1 gap-8">
        {#if isLoading}
          {#each Array(4) as _}
            <div class="h-48 bg-surface rounded-[40px] animate-pulse"></div>
          {/each}
        {:else}
          {#each nearbyRestaurants as restaurant}
            <a
              href="/restaurant/{restaurant.name}"
              class="group relative flex flex-col sm:flex-row gap-6 bg-white p-4 rounded-[40px] rounded-bl-[12px] border border-border-dark/30 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 items-center"
            >
              <!-- Image Container -->
              <div
                class="relative w-full sm:w-40 h-40 shrink-0 overflow-hidden rounded-[32px] rounded-bl-[8px] shadow-inner"
              >
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {#if restaurant.offer}
                  <div class="absolute inset-0 bg-black/10"></div>
                  <div class="absolute bottom-3 left-3 right-3">
                    <div
                      class={cn(
                        "px-3 py-1.5 rounded-xl text-[9px] font-black text-white text-center uppercase tracking-widest",
                        restaurant.offerColor,
                      )}
                    >
                      {restaurant.offer}
                    </div>
                  </div>
                {/if}
              </div>

              <!-- Content Container -->
              <div class="flex-1 space-y-3 w-full sm:w-auto">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="flex items-center gap-2">
                      <h4
                        class="font-black text-xl text-text-primary group-hover:text-primary transition-colors"
                      >
                        {restaurant.name}
                      </h4>
                      <BadgeCheck
                        size={20}
                        class="text-primary fill-primary/10"
                      />
                    </div>
                    <p
                      class="text-xs text-text-muted font-bold mt-1 uppercase tracking-tight"
                    >
                      {restaurant.cuisines}
                    </p>
                  </div>
                  <div
                    class="bg-success/10 px-3 py-1.5 rounded-xl text-success flex items-center gap-1 border border-success/20"
                  >
                    <span class="text-xs font-black">{restaurant.rating}</span>
                    <Star size={12} fill="currentColor" />
                  </div>
                </div>

                <div
                  class="flex items-center gap-4 text-[10px] font-black text-text-muted uppercase tracking-widest"
                >
                  <div class="flex items-center gap-1.5">
                    <Clock size={14} class="text-primary" />
                    <span>25 MIN</span>
                  </div>
                  <div class="w-1 h-1 rounded-full bg-border-dark/50"></div>
                  <div class="flex items-center gap-1.5">
                    <Navigation size={14} class="text-primary" />
                    <span>{restaurant.area}</span>
                  </div>
                </div>
              </div>

              <!-- CTA Arrow -->
              <div
                class="hidden sm:flex w-12 h-12 rounded-full bg-bg-app border border-border-dark/50 items-center justify-center text-text-muted transition-all group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:translate-x-1"
              >
                <ChevronRight size={20} />
              </div>
            </a>
          {/each}
        {/if}
      </div>

      <!-- Neighborhood Explore (Next Level Load More Card) -->
      {#if !isExploringNeighborhood && !isLoading}
        <div class="pt-6 pb-24 px-2">
          <button
            onclick={() => {
              isLoading = true;
              setTimeout(() => {
                isExploringNeighborhood = true;
                isLoading = false;
              }, 1200);
            }}
            class="group relative w-full bg-white rounded-[40px] p-8 overflow-hidden transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(255,46,126,0.25)] active:scale-[0.97] border border-primary/10 flex flex-col items-center gap-6 animate-float"
          >
            <div
              class="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-colors"
            ></div>
            <div
              class="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-colors"
            ></div>
            <div
              class="absolute inset-0 opacity-[0.03] hex-pattern pointer-events-none"
            ></div>

            <div class="relative space-y-2 text-center">
              <p
                class="text-[10px] font-black text-primary uppercase tracking-[0.3em] leading-none mb-1"
              >
                Unlock New Areas
              </p>
              <h3 class="text-xl font-black text-text-primary leading-tight">
                Explore more nearby<br />
                <span class="text-primary italic">restaurant offers</span>
              </h3>
            </div>

            <div class="relative">
              <div
                class="absolute inset-0 bg-primary blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"
              ></div>
              <div
                class="relative w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-lg transform group-hover:rotate-[360deg] transition-transform duration-700 ease-in-out"
              >
                <ChevronRight size={32} strokeWidth={3} />
              </div>
            </div>

            <div class="relative pt-2">
              <p
                class="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2"
              >
                <span class="w-1 h-1 rounded-full bg-primary animate-ping"
                ></span>
                Discover deals in neighboring zones
              </p>
            </div>
          </button>
        </div>
      {/if}
    </section>
  </main>
</div>

<BottomNav />

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hex-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45v-30z' fill='none' stroke='black' stroke-width='1'/%3E%3C/svg%3E");
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  .animate-float {
    animation: float 4s ease-in-out infinite;
  }
</style>
