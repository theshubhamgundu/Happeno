<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { MapPin, Navigation, ChevronLeft, Search, Crosshair, X, AlertCircle } from 'lucide-svelte';
  import { browser } from '$app/environment';
  import { cn } from '$lib/utils';

  let mapElement: HTMLElement;
  let map: any;
  let address = $state('Fetching location...');
  let subAddress = $state('Place the pin on your exact location');
  let isDragging = $state(false);
  let searchQuery = $state('');
  let suggestions = $state<any[]>([]);
  let showSuggestions = $state(false);
  let isSearching = $state(false);
  let debounceTimer: any;
  let usingFallback = $state(false);

  import { PUBLIC_OLA_MAP_API_KEY as OLA_API_KEY } from '$env/static/public';

  // Ola Maps SDK global
  declare const OlaMaps: any;

  onMount(() => {
    if (browser) {
      console.log("Onboarding: Looking for Ola Maps SDK...");
      let attempts = 0;
      const checkOla = setInterval(() => {
        attempts++;
        if (typeof OlaMaps !== 'undefined') {
          clearInterval(checkOla);
          console.log("Ola Maps SDK found. Initializing...");
          initOlaMaps();
        }
        
        if (attempts > 40) { // 4 seconds fallback
          clearInterval(checkOla);
          if (!map && !usingFallback) {
             console.warn("Ola Maps SDK failed to load. Launching Emergency Fallback...");
             triggerFallback();
          }
        }
      }, 100);

      return () => clearInterval(checkOla);
    }
  });

  function triggerFallback() {
    if (usingFallback) return;
    usingFallback = true;
    if (map && typeof map.remove === 'function') map.remove();
    initLeaflet();
  }

  async function initLeaflet() {
    const L = (await import('leaflet')).default;
    await import('leaflet/dist/leaflet.css');
    
    map = L.map(mapElement, { zoomControl: false, attributionControl: false }).setView([17.385, 78.4867], 15);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);

    map.on('movestart', () => { 
      isDragging = true; 
      address = 'Locating...'; 
    });

    map.on('moveend', async () => {
      isDragging = false;
      const center = map.getCenter();
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${center.lat}&lon=${center.lng}&addressdetails=1`);
        const data = await res.json();
        const addr = data.address;
        const main = addr.amenity || addr.building || addr.road || addr.suburb || data.display_name.split(',')[0];
        const sub = data.display_name.split(',').slice(1, 4).join(', ');
        address = main;
        subAddress = sub;
      } catch (e) {
        address = "Location Selected";
      }
    });

    handleCurrentLocation();
  }

  function initOlaMaps() {
    try {
      const olaMaps = new OlaMaps({
        apiKey: OLA_API_KEY
      });

      map = olaMaps.init({
        style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
        container: mapElement,
        center: [78.4867, 17.3850], // [lng, lat]
        zoom: 15
      });

      // Handle Map Load Success
      map.on('load', () => {
        console.log("Ola Map loaded successfully");
        handleCurrentLocation();
      });

      // Catch Styling/Tiles errors (like 403 Forbidden)
      map.on('error', (e: any) => {
        console.warn("Ola Maps Engine Error:", e);
        // Specifically catch 403 styling errors
        triggerFallback();
      });

      map.on('movestart', () => {
        isDragging = true;
        address = 'Locating...';
      });

      map.on('moveend', async () => {
        isDragging = false;
        const center = map.getCenter();
        
        try {
          const res = await fetch(`https://api.olamaps.io/places/v1/reverse-geocode?latlng=${center.lat},${center.lng}&api_key=${OLA_API_KEY}`);
          if (res.status === 403) throw new Error("403 Forbidden");
          const data = await res.json();
          if (data.results?.[0]) {
            const first = data.results[0];
            address = first.name || first.formatted_address.split(',')[0];
            subAddress = first.formatted_address.split(',').slice(1).join(', ').trim();
          }
        } catch (e) {
          console.error("Ola Reverse Geocode failed:", e);
          // Fallback reverse geocode if Ola fails
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${center.lat}&lon=${center.lng}`);
          const data = await res.json();
          address = data.display_name.split(',')[0];
        }
      });
    } catch (err) {
      console.error("Ola Maps Critical Init Error:", err);
      triggerFallback();
    }
  }

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
          const res = await fetch(`https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(searchQuery)}&api_key=${OLA_API_KEY}`);
          if (res.status === 403) throw new Error("Search 403");
          const data = await res.json();
          if (data.predictions) {
            suggestions = data.predictions.map((p: any) => ({
              placeName: p.structured_formatting.main_text,
              placeAddress: p.structured_formatting.secondary_text,
              // For Ola, we might need a separate Geocode call to get lat/lng from place_id
              // or some predictions might already have location
              placeId: p.place_id
            }));
            showSuggestions = true;
          }
          isSearching = false;
        } else {
          // Fallback search logic
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=15&countrycodes=in&addressdetails=1`);
          const data = await res.json();
          suggestions = data.map((item: any) => ({
            placeName: item.display_name.split(',')[0],
            placeAddress: item.display_name.split(',').slice(1).join(', ').trim(),
            latitude: item.lat,
            longitude: item.lon
          }));
          showSuggestions = true;
          isSearching = false;
        }
      } catch (e) {
        isSearching = false;
      }
    }, 450);
  });

  async function selectSuggestion(suggestion: any) {
    searchQuery = suggestion.placeName;
    
    if (!usingFallback && suggestion.placeId) {
      // Get details for the place
      try {
        const res = await fetch(`https://api.olamaps.io/places/v1/details?place_id=${suggestion.placeId}&api_key=${OLA_API_KEY}`);
        const data = await res.json();
        if (data.result?.geometry?.location) {
          const { lat, lng } = data.result.geometry.location;
          map.setCenter([lng, lat]);
          map.setZoom(17);
        }
      } catch (e) {
        console.error("Place details error", e);
      }
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

  let isLoadingLocation = $state(true);

  async function handleCurrentLocation() {
    if (!map) return;
    isLoadingLocation = true;
    
    // Minimum 1.5s delay for the animation to feel smooth
    const minWait = new Promise(resolve => setTimeout(resolve, 1500));

    navigator.geolocation.getCurrentPosition(async (p) => {
      const { latitude, longitude } = p.coords;
      
      await minWait;
      
      if (usingFallback) map.setView([latitude, longitude], 18);
      else map.setCenter([longitude, latitude]);
      
      isLoadingLocation = false;
    }, (err) => {
      console.error(err);
      isLoadingLocation = false;
    });
  }

  function confirmLocation() {
    localStorage.setItem('userLocation', JSON.stringify({ name: address, address: subAddress }));
    goto('/user/nearby');
  }
</script>

<div class="h-screen flex flex-col bg-bg-app relative overflow-hidden">
  
  <!-- Loading Animation Overlay -->
  {#if isLoadingLocation}
    <div class="absolute inset-0 z-[5000] bg-bg-app flex flex-col items-center justify-center">
      <div class="relative w-full flex items-center justify-center max-w-[450px]">
        <video 
          src="/happeno.mp4" 
          autoplay 
          muted 
          loop 
          playsinline
          class="w-full h-full object-contain"
        ></video>
      </div>
      <div class="absolute bottom-24 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom duration-1000">
        <div class="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p class="text-primary font-black text-sm tracking-[0.2em] uppercase">Locating You...</p>
      </div>
    </div>
  {/if}
  {#if usingFallback}
    <div class="absolute top-0 left-0 right-0 z-[2000] bg-urgency text-white px-4 py-2 flex items-center justify-center gap-2 shadow-lg animate-in slide-in-from-top duration-300">
      <AlertCircle size={14} />
      <span class="text-[10px] font-bold uppercase tracking-wider">Ola Maps Failed - Using Emergency Map</span>
    </div>
  {/if}

  <!-- Top Navigation -->
  <div class={cn(
    "absolute left-0 right-0 z-[1000] p-4 pointer-events-none transition-all duration-300",
    usingFallback ? "top-10" : "top-12"
  )}>
    <div class="flex items-center gap-3 pointer-events-auto max-w-lg mx-auto w-full">
      <button 
        onclick={() => history.back()} 
        class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-black active:scale-95 transition-transform"
      >
        <ChevronLeft size={24} />
      </button>
      
      <div class="flex-1 relative flex flex-col gap-2">
        <div class="bg-white rounded-2xl shadow-xl flex items-center px-4 py-3 gap-3 border border-gray-100">
          <Search size={20} class={cn("transition-colors", isSearching ? "text-primary animate-pulse" : "text-gray-400")} />
          <input 
            bind:value={searchQuery} 
            placeholder="Search for your location..." 
            class="flex-1 bg-transparent text-sm font-bold text-black outline-none placeholder:text-gray-400" 
            autocomplete="off"
            spellcheck="false"
          />
          {#if searchQuery}
            <button onclick={() => { searchQuery = ''; suggestions = []; showSuggestions = false; }} class="text-gray-400 hover:text-black">
              <X size={18} />
            </button>
          {/if}
        </div>

        {#if showSuggestions}
          <div class="bg-white rounded-2xl shadow-2xl border border-gray-100 mt-1 absolute top-full left-0 right-0 z-[1100] max-h-[65vh] overflow-y-auto no-scrollbar animate-in fade-in zoom-in duration-200">
            {#if suggestions.length > 0}
              {#each suggestions as s, i}
                <button 
                  onclick={() => selectSuggestion(s)} 
                  class={cn(
                    "w-full px-5 py-4 flex items-start gap-4 hover:bg-gray-50 text-left transition-colors",
                    i !== suggestions.length - 1 && "border-b border-dashed border-gray-200"
                  )}
                >
                  <MapPin size={18} class="text-gray-400 mt-0.5" />
                  <div class="min-w-0 flex-1">
                    <div class="text-sm font-bold text-black truncate">{s.placeName}</div>
                    <div class="text-[11px] text-gray-500 font-medium line-clamp-2 leading-relaxed">{s.placeAddress}</div>
                  </div>
                </button>
              {/each}
            {:else if isSearching}
              <div class="p-8 flex flex-col items-center justify-center gap-3 text-gray-400 italic">
                <div class="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <span class="text-xs font-bold">Searching...</span>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Map Container -->
  <div class="flex-1 relative bg-gray-100" bind:this={mapElement}>
    <!-- Center Pin -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[900] -mt-8 pointer-events-none flex flex-col items-center">
      <div class="relative drop-shadow-2xl">
        <img 
          src="/logo.png" 
          alt="Pin" 
          class={cn("w-14 h-14 object-contain transition-transform duration-300", isDragging && "scale-110 -translate-y-2")} 
        />
        <div class={cn("w-4 h-4 bg-black/20 rounded-full blur-[2px] absolute bottom-1 left-1/2 -translate-x-1/2 transition-opacity duration-300", isDragging ? "opacity-30" : "opacity-100")}></div>
      </div>
    </div>

    <button 
      onclick={handleCurrentLocation} 
      class="absolute bottom-6 right-6 z-[900] w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-primary border border-gray-100 active:scale-90 transition-transform"
    >
      <Crosshair size={24} />
    </button>
  </div>

  <!-- Bottom Sheet -->
  <div class="bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 pb-8 z-[1000] animate-in slide-in-from-bottom duration-500">
    <div class="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
    
    <div class="flex items-start gap-4 mb-6">
      <div class="p-3 bg-primary/10 rounded-2xl text-primary">
        <MapPin size={24} />
      </div>
      <div class="min-w-0">
        <h2 class="text-xl font-black text-black mb-1 truncate">{address}</h2>
        <p class="text-xs text-gray-500 font-bold leading-relaxed line-clamp-2">{subAddress}</p>
      </div>
    </div>

    <button 
      onclick={confirmLocation}
      class="w-full py-4 bg-primary text-white font-bold text-lg rounded-2xl shadow-lg shadow-primary/25 hover:brightness-110 active:scale-[0.98] transition-all"
    >
      Confirm Location
    </button>
  </div>
</div>

<style>
  :global(.leaflet-control-container),
  :global(.maplibregl-ctrl-logo),
  :global(.maplibregl-ctrl-attrib),
  :global(.mapboxgl-ctrl-logo),
  :global(.mapboxgl-ctrl-attrib),
  :global(.ola-maps-logo),
  :global(.olamaps-logo) { 
    display: none !important; 
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }
  
  :global(.maplibregl-ctrl-bottom-left),
  :global(.maplibregl-ctrl-bottom-right),
  :global(.mapboxgl-ctrl-bottom-left),
  :global(.mapboxgl-ctrl-bottom-right) {
    display: none !important;
  }

  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
