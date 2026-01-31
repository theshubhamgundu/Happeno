<script lang="ts">
  import { onMount } from "svelte";
  import BottomNav from "$lib/components/BottomNav.svelte";
  import {
    Search,
    ChevronDown,
    CircleUser,
    Mic,
    MapPin,
    ChevronRight,
    Star,
    Clock,
    ArrowRight,
    Wallet,
    Navigation,
    LayoutGrid,
    BadgeCheck,
  } from "lucide-svelte";
  import { NEARBY_DATA, getHexFromLatLng, getHexNeighbors } from "$lib/geo";
  import Map from "$lib/components/Map.svelte";
  import { goto } from "$app/navigation";

  // --- State ---
  let viewMode = $state<"list" | "map">("list");
  let locationName = $state("Hyderabad");
  let locationAddress = $state("Select Location");
  let userCoords = $state({ lat: 17.4485, lng: 78.3915 });
  let currentHex = $state<any>(null);
  let neighborhoodHexes = $state<string[]>([]);
  let isExploringNeighborhood = $state(false);
  let isLoading = $state(true);

  // --- Production Logic: Dynamic Distance and Filtering ---
  function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  let nearbyDataWithDistance = $derived.by(() => {
    return NEARBY_DATA.map((r) => ({
      ...r,
      distanceValue: getDistance(userCoords.lat, userCoords.lng, r.lat, r.lng),
    })).sort((a, b) => a.distanceValue - b.distanceValue);
  });

  let nearbyRestaurants = $derived.by(() => {
    if (!currentHex) return nearbyDataWithDistance.slice(0, 10);
    const allowedHexes = isExploringNeighborhood
      ? [currentHex.id, ...neighborhoodHexes]
      : [currentHex.id];

    const filtered = nearbyDataWithDistance.filter((r) =>
      allowedHexes.includes(r.hexId),
    );
    return filtered.length > 0 ? filtered : nearbyDataWithDistance.slice(0, 10);
  });

  let mapMarkers = $derived(
    nearbyRestaurants.map((r) => ({
      lng: r.lng,
      lat: r.lat,
      title: r.name,
    })),
  );

  const moodCategories = [
    {
      name: "Cozy cafes",
      image:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80",
      color: "bg-[#FFF4E6]",
    },
    {
      name: "Premium dining",
      image:
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80",
      color: "bg-[#F3E8FF]",
    },
    {
      name: "Family dining",
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
      color: "bg-[#ECFDF5]",
    },
    {
      name: "Drink & dine",
      image:
        "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&q=80",
      color: "bg-[#E0F2FE]",
    },
    {
      name: "Party vibes",
      image:
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80",
      color: "bg-[#FFF0F6]",
    },
    {
      name: "Asian flavours",
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80",
      color: "bg-[#F1F3F5]",
    },
    {
      name: "Romantic dining",
      image:
        "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?w=400&q=80",
      color: "bg-[#FFF5F5]",
    },
    {
      name: "Quick bites",
      image:
        "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&q=80",
      color: "bg-[#E7F5FF]",
    },
  ];

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

    setTimeout(() => {
      currentHex = getHexFromLatLng(userCoords.lat, userCoords.lng);
      neighborhoodHexes = getHexNeighbors(currentHex, 1);
      isLoading = false;
    }, 500);
  });
</script>

<div class="min-h-screen bg-bg-app pb-32 text-text-primary">
  <!-- Premium Header -->
  <header
    class="sticky top-0 bg-bg-app/95 backdrop-blur-xl z-30 border-b border-border-peach/30 outline-none"
  >
    <div class="px-4 py-2 flex items-center justify-between">
      <div class="flex flex-col flex-1 min-w-0">
        <button
          onclick={() => goto("/user/onboarding")}
          class="flex items-center gap-1.5 active:opacity-60 transition-opacity text-left"
        >
          <MapPin size={14} class="text-primary fill-primary/10 shrink-0" />
          <span
            class="text-xs font-black text-text-primary uppercase tracking-tighter truncate"
            >{locationName}</span
          >
          <ChevronDown size={14} class="text-text-muted shrink-0" />
        </button>
        <p
          class="text-[10px] text-text-muted font-medium truncate w-full ml-5 mt-0.5"
        >
          {locationAddress}
        </p>
      </div>

      <div class="flex items-center gap-4">
        <button
          class="w-10 h-10 rounded-full bg-surface shadow-sm border border-border-peach/50 flex items-center justify-center text-text-primary active:scale-90 transition-transform"
        >
          <Wallet size={18} />
        </button>
        <a
          href="/user/profile"
          class="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md active:scale-95 transition-transform"
        >
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            alt="Profile"
            class="w-full h-full object-cover bg-primary/10"
          />
        </a>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="px-4 pb-4 pt-2">
      <div class="relative group">
        <div
          class="absolute inset-y-0 left-4 flex items-center pointer-events-none"
        >
          <Search
            size={18}
            class="text-text-muted group-focus-within:text-primary transition-colors"
          />
        </div>
        <input
          type="text"
          placeholder="Restaurant, location or mood..."
          class="w-full h-12 bg-surface border border-border-peach/50 rounded-2xl pl-11 pr-11 text-xs font-bold placeholder:text-text-muted/60 outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
        />
        <div
          class="absolute inset-y-0 right-4 flex items-center text-text-muted"
        >
          <Mic size={18} />
        </div>
      </div>
    </div>
  </header>

  <main class="space-y-12 pt-6">
    <!-- Map Toggle -->
    {#if viewMode === "list"}
      <div class="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
        <button
          onclick={() => (viewMode = "map")}
          class="bg-primary/95 backdrop-blur-xl text-white px-8 py-4 rounded-full flex items-center gap-3 shadow-[0_12px_40px_rgba(255,16,124,0.4)] border border-white/20 active:scale-90 transition-all group overflow-hidden relative"
        >
          <Navigation size={18} class="fill-white/20" />
          <span class="text-xs font-black uppercase tracking-[0.2em]"
            >View Map</span
          >
        </button>
      </div>
    {/if}

    {#if viewMode === "map"}
      <div class="fixed inset-0 top-[120px] z-40 bg-bg-app">
        <Map
          center={[userCoords.lng, userCoords.lat]}
          zoom={14}
          markers={mapMarkers}
          class="h-full w-full"
        />
        <button
          onclick={() => (viewMode = "list")}
          class="absolute bottom-32 left-1/2 -translate-x-1/2 bg-white text-text-primary px-8 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl border border-gray-100 active:scale-95 transition-all"
        >
          Close Map
        </button>
      </div>
    {/if}

    <!-- Hero Duo Section -->
    <section class="grid grid-cols-2 gap-4 px-6">
      <button
        class="bg-[#2D2D2D] rounded-[32px] p-5 h-44 relative overflow-hidden group shadow-lg active:scale-[0.98] transition-all"
      >
        <div class="relative z-10 flex flex-col h-full">
          <span class="text-white font-black text-xl leading-tight"
            >Up to<br />50% OFF</span
          >
          <p
            class="text-white/40 text-[10px] font-bold mt-1 uppercase tracking-widest"
          >
            Limited time
          </p>
          <div class="mt-auto">
            <div
              class="bg-white/10 backdrop-blur-md w-8 h-8 rounded-full flex items-center justify-center border border-white/20"
            >
              <ChevronRight size={16} class="text-white" />
            </div>
          </div>
        </div>
        <div
          class="absolute -right-4 -bottom-4 w-28 h-28 opacity-30 group-hover:scale-110 transition-transform duration-1000"
        >
          <svg viewBox="0 0 100 100" class="w-full h-full fill-white"
            ><rect
              x="20"
              y="20"
              width="60"
              height="60"
              rx="10"
              transform="rotate(15)"
            /></svg
          >
        </div>
      </button>

      <button
        class="bg-[#F8F9FB] border border-border-peach/50 rounded-[32px] p-5 h-44 relative overflow-hidden group shadow-md active:scale-[0.98] transition-all text-left"
      >
        <div class="relative z-10 flex flex-col h-full">
          <span class="text-text-primary font-black text-xl leading-tight"
            >Near and<br />top rated</span
          >
          <p
            class="text-text-muted text-[10px] font-bold mt-1 uppercase tracking-widest"
          >
            Trending spots
          </p>
          <div class="mt-auto">
            <div
              class="bg-primary/5 w-8 h-8 rounded-full flex items-center justify-center border border-primary/10"
            >
              <ChevronRight size={16} class="text-primary" />
            </div>
          </div>
        </div>
        <div
          class="absolute -right-4 -bottom-4 w-28 h-28 opacity-10 group-hover:scale-110 transition-transform duration-1000 rotate-12"
        >
          <MapPin size={100} fill="#FF107C" />
        </div>
      </button>
    </section>

    <!-- In the Mood Section (Edge to Edge) -->
    <section class="space-y-6">
      <div class="flex items-center justify-between px-6">
        <h3
          class="text-[10px] font-black text-text-muted uppercase tracking-widest"
        >
          In the mood for
        </h3>
        <button
          class="text-[10px] font-black text-primary uppercase tracking-widest"
          >See All</button
        >
      </div>
      <div class="grid grid-cols-2 gap-4 px-6">
        {#each moodCategories as mood}
          <button
            class="relative group active:scale-[0.98] transition-all text-left"
          >
            <div
              class="{mood.color} rounded-[32px] p-5 h-40 overflow-hidden relative shadow-sm border border-black/[0.03]"
            >
              <div class="relative z-10 w-2/3">
                <h4
                  class="text-xs font-black text-text-primary leading-tight tracking-tight uppercase"
                >
                  {mood.name}
                </h4>
              </div>
              <div
                class="absolute -right-4 -bottom-4 w-32 h-32 rounded-full overflow-hidden border-4 border-white/40 shadow-lg transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12 translate-x-2 translate-y-2"
              >
                <img
                  src={mood.image}
                  alt={mood.name}
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </button>
        {/each}
      </div>
    </section>

    <!-- Refined Arch Section (Edge to Edge) -->
    <section class="space-y-6">
      <div class="flex items-center justify-between px-6">
        <h3
          class="text-[10px] font-black text-text-muted uppercase tracking-widest"
        >
          Must-tries in {locationName}
        </h3>
        <button
          class="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 group"
        >
          Explore <ArrowRight
            size={12}
            class="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
      <div class="flex gap-5 overflow-x-auto no-scrollbar px-6">
        {#each [{ name: "Top trending spots", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80" }, { name: "Sky high sips", image: "https://images.unsplash.com/photo-1574096079513-d8259312b785?w=400&q=80" }, { name: "Hidden gems", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80" }] as try_}
          <button
            class="relative flex-shrink-0 w-52 aspect-[3/4.5] rounded-t-full rounded-b-[48px] overflow-hidden group shadow-xl border border-white/40"
          >
            <img
              src={try_.image}
              alt={try_.name}
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent"
            ></div>
            <div class="absolute bottom-10 inset-x-0 text-center px-4">
              <h4
                class="text-[10px] font-black text-white leading-tight uppercase tracking-widest"
              >
                {try_.name}
              </h4>
              <div
                class="bg-primary h-0.5 w-6 mx-auto mt-2 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
              ></div>
            </div>
          </button>
        {/each}
      </div>
    </section>

    <!-- Popular Stream -->
    <section class="space-y-8 pb-32">
      <div class="px-6 space-y-4">
        <h3
          class="text-[10px] font-black text-text-muted uppercase tracking-[0.25em]"
        >
          Popular Nearby
        </h3>

        <!-- Pillar Filters -->
        <div class="flex gap-3 overflow-x-auto no-scrollbar py-1">
          <button
            class="flex items-center gap-1.5 px-4 py-2.5 bg-surface border border-border-peach/50 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm active:scale-95 transition-all"
          >
            <LayoutGrid size={14} class="text-text-muted" /> Filters
          </button>
          <button
            class="flex items-center gap-1.5 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary shadow-sm active:scale-95 transition-all"
          >
            <BadgeCheck size={14} class="fill-primary/10" /> Offers
          </button>
          <button
            class="px-4 py-2.5 bg-surface border border-border-peach/50 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm active:scale-95 transition-all whitespace-nowrap"
          >
            Ratings 4.0+
          </button>
        </div>
      </div>

      <div class="space-y-12 px-6">
        {#each nearbyRestaurants as restaurant}
          <a href="/user/restaurant/{restaurant.id}" class="block group">
            <div
              class="relative aspect-[16/10] rounded-[52px] overflow-hidden shadow-[0_32px_80px_-24px_rgba(0,0,0,0.18)] mb-6 border border-black/5"
            >
              <img
                src={restaurant.image}
                alt={restaurant.name}
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
              ></div>

              <div
                class="absolute top-6 right-6 bg-success px-3.5 py-1.5 rounded-2xl text-white flex items-center gap-1.5 shadow-2xl border border-white/20"
              >
                <span class="text-xs font-black">{restaurant.rating}</span>
                <Star size={12} fill="currentColor" />
              </div>

              <div
                class="absolute top-6 left-6 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest border border-white/10"
              >
                {restaurant.distanceValue.toFixed(1)} km
              </div>

              {#if restaurant.offer}
                <div class="absolute bottom-6 left-6 right-6">
                  <div
                    class="bg-primary/95 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-widest px-5 py-3.5 rounded-2xl shadow-xl flex items-center justify-between border border-white/20"
                  >
                    <span class="flex items-center gap-2">
                      <div
                        class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"
                      ></div>
                      {restaurant.offer}
                    </span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              {/if}
            </div>

            <div class="px-2 space-y-4">
              <div class="flex justify-between items-start">
                <div>
                  <h4
                    class="text-2xl font-black text-text-primary tracking-tighter leading-none mb-2"
                  >
                    {restaurant.name}
                  </h4>
                  <p
                    class="text-[11px] font-bold text-text-muted uppercase tracking-wider"
                  >
                    {restaurant.cuisines} • {restaurant.area}
                  </p>
                </div>
                <div class="text-right">
                  <div
                    class="text-lg font-black text-text-primary leading-none mb-1"
                  >
                    ₹1,200
                  </div>
                  <p
                    class="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]"
                  >
                    For two
                  </p>
                </div>
              </div>

              <div
                class="flex items-center gap-4 pt-4 border-t border-border-peach/20"
              >
                <div
                  class="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-primary uppercase bg-primary/5 px-2 py-1 rounded-md"
                >
                  <Clock size={12} class="fill-primary/20" /> 25-35 MIN
                </div>
                <div
                  class="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-text-muted uppercase px-2 py-1"
                >
                  <BadgeCheck size={14} class="text-success fill-success/10" /> Safe
                  handling
                </div>
              </div>
            </div>
          </a>
        {/each}
      </div>
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
</style>
