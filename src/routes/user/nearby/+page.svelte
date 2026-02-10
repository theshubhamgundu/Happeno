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
  import { fly } from "svelte/transition";
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

    // Scroll animation observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          entry.target.classList.remove("animate-out");
        }
      });
    }, observerOptions);

    // Observe all sections and cards
    setTimeout(() => {
      document.querySelectorAll(".scroll-animate").forEach((el) => {
        observer.observe(el);
      });
    }, 100);

    return () => observer.disconnect();
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

      <div class="flex items-center">
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
    <!-- Ultimate Live Offers Card -->
    <section class="px-4 scroll-animate">
      <button
        class="w-full relative h-[150px] rounded-3xl overflow-hidden active:scale-[0.98] transition-transform group shadow-2xl"
      >
        <!-- Premium Multi-Layer Gradient Background -->
        <!-- Base gradient - Deep rich colors -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-[#7928CA] via-[#FF0080] to-[#FF4D4D] bg-[length:200%_200%] animate-gradient-x"
        ></div>

        <!-- Secondary gradient overlay for depth -->
        <div
          class="absolute inset-0 bg-gradient-to-tr from-[#4A00E0]/60 via-transparent to-[#FF6B35]/40"
        ></div>

        <!-- Radial glow spots for mesh effect -->
        <div
          class="absolute top-0 left-1/4 w-32 h-32 bg-[#FF0080] rounded-full blur-3xl opacity-50 animate-pulse"
        ></div>
        <div
          class="absolute bottom-0 right-1/4 w-40 h-40 bg-[#7928CA] rounded-full blur-3xl opacity-40"
        ></div>
        <div
          class="absolute top-1/2 right-0 w-24 h-24 bg-[#FF4D4D] rounded-full blur-2xl opacity-60 animate-float"
        ></div>

        <!-- Noise texture overlay for premium feel -->
        <div
          class="absolute inset-0 opacity-[0.03]"
          style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E');"
        ></div>

        <!-- Shimmer sweep effect -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent bg-[length:200%_100%] animate-shimmer-fast"
        ></div>

        <!-- Glassmorphism inner glow -->
        <div
          class="absolute inset-[1px] rounded-3xl border border-white/20"
        ></div>

        <!-- Premium floating orbs -->
        <div
          class="absolute top-3 right-8 w-3 h-3 rounded-full bg-white/40 animate-bounce-subtle"
        ></div>
        <div
          class="absolute top-6 right-16 w-2 h-2 rounded-full bg-white/30 animate-float"
        ></div>
        <div
          class="absolute bottom-8 right-6 w-4 h-4 rounded-full bg-white/20 blur-sm animate-pulse"
        ></div>

        <!-- Content -->
        <div class="relative z-10 h-full flex flex-col justify-between p-5">
          <!-- Top Row -->
          <div class="flex items-start justify-between">
            <div>
              <!-- Live Indicator -->
              <div class="flex items-center gap-2 mb-2">
                <span class="relative flex h-2.5 w-2.5">
                  <span
                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"
                  ></span>
                  <span
                    class="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"
                  ></span>
                </span>
                <span
                  class="text-[10px] font-bold text-white/90 uppercase tracking-widest"
                  >Live Offers</span
                >
              </div>

              <!-- Main Title -->
              <h2
                class="text-white font-black text-2xl leading-tight tracking-tight"
              >
                Up to <span class="text-3xl">50%</span> OFF
              </h2>
            </div>

            <!-- Arrow Button -->
            <div
              class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-all group-hover:scale-110"
            >
              <ChevronRight
                size={18}
                class="text-white group-hover:translate-x-0.5 transition-transform"
              />
            </div>
          </div>

          <!-- Bottom Row - Scrolling Offers -->
          <div class="overflow-hidden">
            <div
              class="flex items-center gap-4 animate-marquee whitespace-nowrap"
            >
              <span
                class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wide border border-white/20"
              >
                🍕 Pizza Hut - 40% OFF
              </span>
              <span
                class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wide border border-white/20"
              >
                🍔 McDonald's - Buy 1 Get 1
              </span>
              <span
                class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wide border border-white/20"
              >
                🍜 Chinese Wok - 30% OFF
              </span>
              <span
                class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wide border border-white/20"
              >
                ☕ Starbucks - Free Delivery
              </span>
              <!-- Duplicate for seamless loop -->
              <span
                class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wide border border-white/20"
              >
                🍕 Pizza Hut - 40% OFF
              </span>
              <span
                class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wide border border-white/20"
              >
                🍔 McDonald's - Buy 1 Get 1
              </span>
            </div>
          </div>
        </div>
      </button>
    </section>

    <!-- In the Mood For Section - Premium Design -->
    <section class="space-y-5 scroll-animate">
      <div class="flex items-center justify-between px-4">
        <h3 class="text-sm font-bold text-text-primary tracking-tight">
          In the mood for
        </h3>
        <button
          class="text-xs font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all"
        >
          See All <ChevronRight size={14} />
        </button>
      </div>

      <div class="px-4">
        <div class="grid grid-cols-2 gap-3 stagger-children">
          {#each moodCategories as mood}
            <button
              class="relative h-[150px] rounded-2xl overflow-hidden active:scale-[0.97] transition-all duration-300 shadow-md hover:shadow-lg group scroll-animate"
            >
              <!-- Full Image Background -->
              <img
                src={mood.image}
                alt={mood.name}
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              <!-- Gradient Overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
              ></div>

              <!-- Content - Title at bottom -->
              <div class="absolute bottom-0 left-0 right-0 p-3">
                <h4
                  class="text-xs font-bold text-white uppercase tracking-wide"
                >
                  {mood.name}
                </h4>
              </div>
            </button>
          {/each}
        </div>
      </div>
    </section>

    <!-- Must-Tries Arch Section -->
    <section class="space-y-4 scroll-animate">
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
    <section class="space-y-5 pb-32 scroll-animate">
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
          <a href="/user/restaurant/{restaurant.id}" class="block group">
            <!-- Restaurant Card Container -->
            <div
              class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100/50 hover-lift transition-all duration-300 scroll-animate"
            >
              <!-- Image Section -->
              <div class="relative aspect-[16/9] overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                <!-- Gradient Overlay -->
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                ></div>

                <!-- Distance Badge - Top Left -->
                <div
                  class="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full"
                >
                  <span class="text-white text-[10px] font-semibold">
                    {restaurant.distanceValue.toFixed(1)} KM
                  </span>
                </div>

                <!-- Rating Badge - Top Right -->
                <div
                  class="absolute top-3 right-3 bg-success px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg"
                >
                  <span class="text-white text-xs font-bold"
                    >{restaurant.rating}</span
                  >
                  <Star size={10} class="text-white fill-white" />
                </div>

                <!-- Offer Banner - Bottom -->
                {#if restaurant.offer}
                  <div class="absolute bottom-3 left-3 right-3">
                    <div
                      class="bg-gradient-to-r from-primary to-[#FF4D9E] text-white text-[10px] font-semibold px-4 py-2.5 rounded-xl flex items-center justify-between shadow-lg"
                    >
                      <span class="flex items-center gap-2">
                        <span
                          class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"
                        ></span>
                        {restaurant.offer}
                      </span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                {/if}
              </div>

              <!-- Content Section -->
              <div class="p-4">
                <!-- Title & Price Row -->
                <div class="flex justify-between items-start mb-2">
                  <div class="flex-1 min-w-0 pr-3">
                    <h4 class="text-base font-bold text-text-primary truncate">
                      {restaurant.name}
                    </h4>
                    <p
                      class="text-[11px] text-text-muted font-medium mt-0.5 truncate"
                    >
                      {restaurant.cuisines} • {restaurant.area}
                    </p>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <div class="text-base font-bold text-text-primary">
                      ₹1,200
                    </div>
                    <p
                      class="text-[9px] text-text-muted font-medium uppercase tracking-wide"
                    >
                      For two
                    </p>
                  </div>
                </div>

                <!-- Meta Info Row -->
                <div
                  class="flex items-center gap-3 pt-3 border-t border-gray-100"
                >
                  <div
                    class="flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/5 px-2 py-1 rounded-md"
                  >
                    <Clock size={11} /> 25-35 MIN
                  </div>
                  <div
                    class="flex items-center gap-1 text-[10px] font-semibold text-success"
                  >
                    <BadgeCheck size={12} class="fill-success/20" /> Safe handling
                  </div>
                </div>
              </div>
            </div>
          </a>
        {/each}
      </div>
    </section>
  </main>

  <!-- Floating Scan QR Button -->
  <div
    class="fixed bottom-24 left-1/2 -translate-x-1/2 z-[45]"
    in:fly={{ y: 50, duration: 600, delay: 400 }}
  >
    <a
      href="/user/scan"
      class="flex items-center gap-3 bg-gray-900 border border-white/20 text-white px-8 py-4 rounded-full shadow-2xl active:scale-95 transition-all group overflow-hidden relative"
    >
      <!-- Beam animation -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
      ></div>

      <div class="relative flex items-center gap-3">
        <div
          class="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20"
        >
          <ScanLine size={18} />
        </div>
        <span class="text-[10px] font-black uppercase tracking-[0.2em]"
          >Scan to Order</span
        >
      </div>
    </a>
  </div>
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
