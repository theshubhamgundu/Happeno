<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import {
    MapPin,
    Navigation,
    ChevronLeft,
    Search,
    Crosshair,
    X,
    AlertCircle,
  } from "lucide-svelte";
  import { browser } from "$app/environment";
  import { cn } from "$lib/utils";
  import { PUBLIC_OLA_MAPS_API_KEY as OLA_API_KEY } from "$env/static/public";

  let mapElement: HTMLElement;
  let map: any;
  let address = $state("Fetching location...");
  let subAddress = $state("Place the pin on your exact location");
  let isDragging = $state(false);
  let searchQuery = $state("");
  let suggestions = $state<any[]>([]);
  let showSuggestions = $state(false);
  let isSearching = $state(false);
  let debounceTimer: any;
  let usingFallback = $state(false);
  let isLoadingLocation = $state(true);

  // Ola Maps SDK global
  declare const OlaMaps: any;

  // --- Function Definitions (Hoisted) ---

  function triggerFallback() {
    if (usingFallback) return;
    usingFallback = true;
    isLoadingLocation = false;
    if (map && typeof map.remove === "function") {
      try {
        map.remove();
      } catch (e) {}
    }
    initLeaflet();
  }

  async function handleCurrentLocation(silent = false) {
    if (!map) return;
    if (!silent) isLoadingLocation = true;

    navigator.geolocation.getCurrentPosition(
      async (p) => {
        const { latitude, longitude } = p.coords;
        if (usingFallback) map.setView([latitude, longitude], 18);
        else map.setCenter([longitude, latitude]);
        isLoadingLocation = false;
      },
      () => {
        isLoadingLocation = false;
      },
      { timeout: 6000 },
    );
  }

  async function initLeaflet() {
    const L = (await import("leaflet")).default;
    await import("leaflet/dist/leaflet.css");
    map = L.map(mapElement, {
      zoomControl: false,
      attributionControl: false,
    }).setView([17.385, 78.4867], 15);
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    ).addTo(map);

    map.on("movestart", () => {
      isDragging = true;
      address = "Locating...";
    });
    map.on("moveend", async () => {
      isDragging = false;
      const center = map.getCenter();
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${center.lat}&lon=${center.lng}&addressdetails=1`,
        );
        const data = await res.json();
        address = data.display_name.split(",")[0];
        subAddress = data.display_name.split(",").slice(1, 4).join(", ");
      } catch (e) {}
    });
    handleCurrentLocation(true);
  }

  function initOlaMaps() {
    if (!mapElement) return;
    try {
      const olaMaps = new OlaMaps({ apiKey: OLA_API_KEY });
      map = olaMaps.init({
        style:
          "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
        container: mapElement,
        center: [78.4867, 17.385],
        zoom: 15,
      });

      map.on("load", () => {
        console.log("Ola Map loaded successfully");
        isLoadingLocation = false;
        handleCurrentLocation(false);
      });

      map.on("error", (e: any) => {
        console.warn("Ola Map SDK Error Detected:", e);
        // Instant Fallback: If style or tiles fail (like a 403), don't stay stuck
        if (!usingFallback) {
          isLoadingLocation = false;
          triggerFallback();
        }
      });

      map.on("movestart", () => {
        isDragging = true;
        address = "Locating...";
      });

      map.on("moveend", async () => {
        isDragging = false;
        const center = map.getCenter();
        try {
          const res = await fetch(
            `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${center.lat},${center.lng}&api_key=${OLA_API_KEY}`,
          );
          const data = await res.json();
          if (data.results?.[0]) {
            address =
              data.results[0].name ||
              data.results[0].formatted_address.split(",")[0];
            subAddress = data.results[0].formatted_address
              .split(",")
              .slice(1)
              .join(", ")
              .trim();
          }
        } catch (e) {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${center.lat}&lon=${center.lng}`,
          );
          const data = await res.json();
          address = data.display_name.split(",")[0];
        }
      });
    } catch (err) {
      console.error("Ola Maps Sync Error:", err);
      triggerFallback();
    }
  }

  function confirmLocation() {
    localStorage.setItem(
      "userLocation",
      JSON.stringify({ name: address, address: subAddress }),
    );
    goto("/user/nearby");
  }

  // --- Component Lifecycle ---

  onMount(() => {
    if (browser) {
      console.log("Onboarding: Initializing JS Location Selection...");
      isLoadingLocation = false;
      initLeaflet();
    }
  });

  $effect(() => {
    if (searchQuery.length < 3) {
      suggestions = [];
      showSuggestions = false;
      return;
    }
    isSearching = true;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        if (!usingFallback) {
          const res = await fetch(
            `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(searchQuery)}&api_key=${OLA_API_KEY}`,
          );
          const data = await res.json();
          if (data.predictions) {
            suggestions = data.predictions.map((p: any) => ({
              placeName: p.structured_formatting.main_text,
              placeAddress: p.structured_formatting.secondary_text,
              placeId: p.place_id,
            }));
            showSuggestions = true;
          }
        } else {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=10&countrycodes=in`,
          );
          const data = await res.json();
          suggestions = data.map((item: any) => ({
            placeName: item.display_name.split(",")[0],
            placeAddress: item.display_name
              .split(",")
              .slice(1)
              .join(", ")
              .trim(),
            latitude: item.lat,
            longitude: item.lon,
          }));
          showSuggestions = true;
        }
      } finally {
        isSearching = false;
      }
    }, 450);
  });

  async function selectSuggestion(suggestion: any) {
    searchQuery = suggestion.placeName;
    if (!usingFallback && suggestion.placeId) {
      try {
        const res = await fetch(
          `https://api.olamaps.io/places/v1/details?place_id=${suggestion.placeId}&api_key=${OLA_API_KEY}`,
        );
        const data = await res.json();
        if (data.result?.geometry?.location) {
          const { lat, lng } = data.result.geometry.location;
          map.setCenter([lng, lat]);
          map.setZoom(17);
        }
      } catch (e) {}
    } else {
      const lat = parseFloat(suggestion.latitude);
      const lng = parseFloat(suggestion.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        if (usingFallback) map.setView([lat, lng], 17);
        else map.setCenter([lng, lat]);
      }
    }
    showSuggestions = false;
  }
</script>

<div class="h-screen flex flex-col bg-bg-app relative overflow-hidden">
  {#if isLoadingLocation}
    <div
      class="absolute inset-0 z-[5001] bg-bg-app flex flex-col items-center justify-center"
    >
      <div
        class="relative w-full flex items-center justify-center max-w-[450px]"
      >
        <video
          src="/happeno.mp4"
          autoplay
          muted
          loop
          playsinline
          class="w-full h-full object-contain"
        ></video>
      </div>
      <div
        class="absolute bottom-24 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom duration-1000"
      >
        <div
          class="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin"
        ></div>
        <p class="text-primary font-black text-sm tracking-[0.2em] uppercase">
          Locating You...
        </p>
      </div>
    </div>
  {/if}

  <div
    class="absolute left-0 right-0 z-[1000] p-4 pointer-events-none transition-all duration-300 top-12"
  >
    <div
      class="flex items-center gap-3 pointer-events-auto max-w-lg mx-auto w-full"
    >
      <button
        onclick={() => history.back()}
        class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-black active:scale-95 transition-transform"
      >
        <ChevronLeft size={24} />
      </button>
      <div class="flex-1 relative flex flex-col gap-2">
        <div
          class="bg-white rounded-2xl shadow-xl flex items-center px-4 py-3 gap-3 border border-gray-100"
        >
          <Search
            size={20}
            class={cn(
              "transition-colors",
              isSearching ? "text-primary animate-pulse" : "text-gray-400",
            )}
          />
          <input
            bind:value={searchQuery}
            placeholder="Search for your location..."
            class="flex-1 bg-transparent text-sm font-bold text-black outline-none placeholder:text-gray-400"
            autocomplete="off"
          />
          {#if searchQuery}
            <button
              onclick={() => {
                searchQuery = "";
                suggestions = [];
                showSuggestions = false;
              }}
              class="text-gray-400 hover:text-black"><X size={18} /></button
            >
          {/if}
        </div>
        {#if showSuggestions}
          <div
            class="bg-white rounded-2xl shadow-2xl border border-gray-100 mt-1 absolute top-full left-0 right-0 z-[1100] max-h-[65vh] overflow-y-auto no-scrollbar animate-in fade-in zoom-in duration-200"
          >
            {#each suggestions as s}
              <button
                onclick={() => selectSuggestion(s)}
                class="w-full px-5 py-4 flex items-start gap-4 hover:bg-gray-50 text-left border-b border-dashed border-gray-200 last:border-0"
              >
                <MapPin size={18} class="text-gray-400 mt-0.5" />
                <div class="min-w-0 flex-1">
                  <div class="text-sm font-bold text-black truncate">
                    {s.placeName}
                  </div>
                  <div
                    class="text-[11px] text-gray-500 font-medium line-clamp-2 leading-relaxed"
                  >
                    {s.placeAddress}
                  </div>
                </div>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>

  <div class="flex-1 relative bg-gray-100" bind:this={mapElement}>
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[900] -mt-8 pointer-events-none flex flex-col items-center"
    >
      <img
        src="/logo.png"
        alt="Pin"
        class={cn(
          "w-14 h-14 object-contain transition-transform duration-300",
          isDragging && "scale-110 -translate-y-2",
        )}
      />
    </div>
    <button
      onclick={() => handleCurrentLocation(true)}
      class="absolute bottom-6 right-6 z-[900] w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-primary border border-gray-100 active:scale-90 transition-transform"
    >
      <Crosshair size={24} />
    </button>
  </div>

  <div
    class="bg-white rounded-t-[32px] shadow-[0_-10_-40px_rgba(0,0,0,0.1)] p-6 pb-8 z-[1000] animate-in slide-in-from-bottom duration-500"
  >
    <div class="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
    <div class="flex items-start gap-4 mb-6">
      <div class="p-3 bg-primary/10 rounded-2xl text-primary">
        <MapPin size={24} />
      </div>
      <div class="min-w-0">
        <h2 class="text-xl font-black text-black mb-1 truncate">{address}</h2>
        <p class="text-xs text-gray-500 font-bold leading-relaxed line-clamp-2">
          {subAddress}
        </p>
      </div>
    </div>
    <button
      onclick={confirmLocation}
      class="w-full py-4 bg-primary text-white font-bold text-lg rounded-2xl shadow-lg shadow-primary/25 hover:brightness-110 active:scale-[0.98] transition-all"
      >Confirm Location</button
    >
  </div>
</div>

<style>
  :global(.leaflet-control-container),
  :global(.maplibregl-ctrl),
  :global(.olamaps-logo) {
    display: none !important;
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>
