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
    ScanLine,
  } from "lucide-svelte";
  import { fly, fade } from "svelte/transition";
  import { NEARBY_DATA, getHexFromLatLng, getHexNeighbors } from "$lib/geo";
  import Map from "$lib/components/Map.svelte";
  import { goto } from "$app/navigation";

  // Modular Components
  import LiveOffersBanner from "$lib/components/restaurant/LiveOffersBanner.svelte";
  import MoodGrid from "$lib/components/restaurant/MoodGrid.svelte";
  import RestaurantCard from "$lib/components/RestaurantCard.svelte";
  import { syncStatus, nearbyRestaurantsStore } from "$lib/stores/user";
  import { CloudSync, AlertCircle, Loader2 } from "lucide-svelte";

  // Skeleton Components
  import RestaurantCardSkeleton from "$lib/components/skeletons/RestaurantCardSkeleton.svelte";
  import MoodGridSkeleton from "$lib/components/skeletons/MoodGridSkeleton.svelte";
  import LiveOffersBannerSkeleton from "$lib/components/skeletons/LiveOffersBannerSkeleton.svelte";

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
    return $nearbyRestaurantsStore
      .map((r) => ({
        ...r,
        distanceValue: r.coordinates
          ? getDistance(
              userCoords.lat,
              userCoords.lng,
              r.coordinates.lat,
              r.coordinates.lng,
            )
          : 999,
      }))
      .sort((a, b) => a.distanceValue - b.distanceValue);
  });

  let nearbyRestaurants = $derived.by(() => {
    // Stage 1: Filter by Spatial Rings (General Discovery)
    const ringsToSearch = isExploringNeighborhood ? 10 : 5; // ~5km to 11km
    const allowedHexes = currentHex
      ? getHexNeighbors(currentHex, ringsToSearch)
      : [];

    let filtered = nearbyDataWithDistance;

    // If we have location, prioritize the radius
    if (currentHex) {
      filtered = nearbyDataWithDistance.filter((r) => {
        if (!r.coordinates) return false;
        const rHex = getHexFromLatLng(r.coordinates.lat, r.coordinates.lng);
        return allowedHexes.includes(rHex.id);
      });
    }

    // Stage 2: Merchant Broadcast Priority (Boosting)
    // Restaurants with active offers (Broadcasts) are moved to index 0
    const boosted = nearbyRestaurantsStore.getBoostedDiscovery(filtered);

    // Stage 3: Global Fallback (Zomato/Swiggy Style 0-20km)
    // If the immediate hex radius is empty, we show standard 20km sorted list
    return boosted.length > 0 ? boosted : nearbyDataWithDistance.slice(0, 20);
  });

  let mapMarkers = $derived(
    nearbyRestaurants.map((r) => ({
      lng: r.coordinates?.lng || userCoords.lng,
      lat: r.coordinates?.lat || userCoords.lat,
      title: r.name,
    })),
  );

  const moodCategories = [
    {
      name: "Café & Coffee",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=90&fit=crop",
      color: "bg-[#FFF4E6]",
    },
    {
      name: "Fine Dining",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=90&fit=crop",
      color: "bg-[#F3E8FF]",
    },
    {
      name: "Biryani & Kebabs",
      image:
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=90&fit=crop",
      color: "bg-[#ECFDF5]",
    },
    {
      name: "South Indian",
      image:
        "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=90&fit=crop",
      color: "bg-[#E0F2FE]",
    },
    {
      name: "Rooftop & Lounges",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=90&fit=crop",
      color: "bg-[#FFF0F6]",
    },
    {
      name: "Chinese & Thai",
      image:
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=90&fit=crop",
      color: "bg-[#F1F3F5]",
    },
    {
      name: "Pizza & Italian",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=90&fit=crop",
      color: "bg-[#FFF5F5]",
    },
    {
      name: "Street Food",
      image:
        "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&q=90&fit=crop",
      color: "bg-[#E7F5FF]",
    },
  ];

  $effect(() => {
    if (!isLoading) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-in");
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
      );

      // Immediate attempt and then one with a slight delay for safety
      const observe = () => {
        document.querySelectorAll(".scroll-animate").forEach((el) => {
          observer.observe(el);
        });
      };

      observe();
      const timer = setTimeout(observe, 300);

      return () => {
        clearTimeout(timer);
        observer.disconnect();
      };
    }
  });

  onMount(() => {
    // Load location from secondary storage
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

    // Trigger intelligent discovery (Batch fetch with local cache)
    nearbyRestaurantsStore.fetchNearby(userCoords);

    // Simulated network/calculation delay for premium feel
    setTimeout(() => {
      currentHex = getHexFromLatLng(userCoords.lat, userCoords.lng);
      neighborhoodHexes = getHexNeighbors(currentHex, 1);
      isLoading = false;
    }, 1000);
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

      <div class="flex items-center gap-2">
        <!-- Sync Status Indicator -->
        <div class="flex items-center mr-1">
          {#if $syncStatus === "syncing"}
            <div
              class="flex items-center gap-1.5 px-2 py-1 bg-primary/10 text-primary rounded-full"
              transition:fade
            >
              <Loader2 size={12} class="animate-spin" />
              <span class="text-[9px] font-black uppercase tracking-widest"
                >Saving</span
              >
            </div>
          {:else if $syncStatus === "idle"}
            <div
              class="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-full"
              transition:fade
            >
              <CloudSync size={12} />
              <span class="text-[9px] font-black uppercase tracking-widest"
                >Pending</span
              >
            </div>
          {/if}
        </div>

        <a
          href="/user/scan"
          class="w-10 h-10 rounded-full bg-surface shadow-sm border border-border-peach/50 flex items-center justify-center text-primary active:scale-95 transition-transform relative overflow-hidden group"
          aria-label="Scan QR Code"
        >
          <div
            class="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"
          ></div>
          <ScanLine size={18} class="relative" />
        </a>
        <a
          href="/user/profile"
          class="w-10 h-10 rounded-full bg-surface shadow-sm border border-border-peach/50 flex items-center justify-center text-text-primary active:scale-95 transition-transform"
        >
          <CircleUser size={20} />
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

  <main class="space-y-8 pt-4 animate-fade-in-up">
    {#if isLoading}
      <LiveOffersBannerSkeleton />
      <MoodGridSkeleton />
      <div class="space-y-6 px-4">
        <RestaurantCardSkeleton />
        <RestaurantCardSkeleton />
        <RestaurantCardSkeleton />
      </div>
    {:else}
      <!-- Ultimate Live Offers Card -->
      <LiveOffersBanner />

      <!-- In the Mood For Section -->
      <MoodGrid categories={moodCategories} />

      <!-- Must-Tries Arch Section -->
      <section class="space-y-4">
        <div class="flex items-center justify-between px-4">
          <h3
            class="text-[11px] font-bold text-text-muted uppercase tracking-widest"
          >
            Must-tries in {locationName}
          </h3>
          <button
            class="text-[11px] font-bold text-primary uppercase tracking-wide flex items-center gap-1"
          >
            Explore <ArrowRight size={12} />
          </button>
        </div>

        <div
          class="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-2 scroll-smooth-x"
        >
          {#each [{ name: "Top trending spots", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80" }, { name: "Sky high sips", image: "https://images.unsplash.com/photo-1574096079513-d8259312b785?w=400&q=80" }, { name: "Hidden gems", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80" }] as try_}
            <button
              class="relative flex-shrink-0 w-40 aspect-[2/3] rounded-t-full rounded-b-3xl overflow-hidden group shadow-lg hover-lift press-effect scroll-snap-start"
            >
              <img
                src={try_.image}
                alt={try_.name}
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"
              ></div>
              <div class="absolute bottom-6 inset-x-0 text-center px-3">
                <h4
                  class="text-[10px] font-bold text-white uppercase tracking-wider leading-tight"
                >
                  {try_.name}
                </h4>
                <div
                  class="bg-primary h-0.5 w-5 mx-auto mt-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                ></div>
              </div>
            </button>
          {/each}
        </div>
      </section>

      <!-- Popular Nearby - Restaurant Cards -->
      <section class="space-y-5 pb-32">
        <div class="px-4 space-y-3">
          <h3
            class="text-[11px] font-bold text-text-muted uppercase tracking-widest"
          >
            Popular Nearby
          </h3>

          <!-- Filter Pills -->
          <div class="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth-x">
            <button
              class="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-semibold shadow-sm active:scale-95 transition-all whitespace-nowrap"
            >
              <LayoutGrid size={12} class="text-text-muted" /> Filters
            </button>
            <button
              class="flex items-center gap-1.5 px-3.5 py-2 bg-primary/10 border border-primary/20 rounded-xl text-[10px] font-semibold text-primary active:scale-95 transition-all whitespace-nowrap"
            >
              <BadgeCheck size={12} /> Offers
            </button>
            <button
              class="px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-semibold shadow-sm active:scale-95 transition-all whitespace-nowrap"
            >
              Ratings 4.0+
            </button>
            <button
              class="px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-semibold shadow-sm active:scale-95 transition-all whitespace-nowrap"
            >
              Pure Veg
            </button>
          </div>
        </div>

        <!-- Restaurant Cards -->
        <div class="space-y-6 px-4 stagger-children">
          {#each nearbyRestaurants as restaurant}
            <RestaurantCard {restaurant} />
          {/each}
        </div>
      </section>
    {/if}
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
