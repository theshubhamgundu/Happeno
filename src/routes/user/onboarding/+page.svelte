<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { MapPin, Navigation, ChevronLeft, Search, Crosshair } from 'lucide-svelte';
  import { browser } from '$app/environment';

  let mapElement: HTMLElement;
  let map: any;
  let L: any;
  let address = $state('Fetching location...');
  let subAddress = $state('Pace the pin on your exact location');
  let isDragging = $state(false);
  let searchQuery = $state('');

  async function handleSearch() {
    if (!searchQuery) return;
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        map.flyTo([lat, lon], 16);
      } else {
        alert('Location not found');
      }
    } catch (e) {
      alert('Error searching location');
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  onMount(async () => {
    if (browser) {
      const leaflet = await import('leaflet');
      L = leaflet.default;
      await import('leaflet/dist/leaflet.css');

      map = L.map(mapElement, {
        zoomControl: false,
        attributionControl: false
      }).setView([17.3850, 78.4867], 15);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 20
      }).addTo(map);

      map.on('movestart', () => {
        isDragging = true;
        address = 'Locating...';
        subAddress = 'Pace the pin on your exact location';
      });


      map.on('moveend', async () => {
        isDragging = false;
        const center = map.getCenter();
        
        await new Promise(r => setTimeout(r, 600)); // Debounce
        
        try {
          // Nominatim is best for OpenStreetMap data in India
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${center.lat}&lon=${center.lng}&zoom=18&addressdetails=1`
          );
          
          if (!response.ok) throw new Error('Network error');

          const data = await response.json();
          
          if (data && data.address) {
            const addr = data.address;
            
            // Prioritize specific local area names for Indian cities
            const mainName = addr.amenity || 
                            addr.building || 
                            addr.residential || 
                            addr.neighbourhood || 
                            addr.suburb || 
                            addr.village ||
                            addr.road ||
                            'Unknown Location';

            // Construct specific address line
            const sub = [
               addr.road,
               addr.suburb,
               addr.city_district,
               addr.city,
               addr.postcode
            ].filter((val, index, self) => 
               Boolean(val) && val !== mainName && self.indexOf(val) === index
            ).slice(0, 3).join(', ');

            address = mainName;
            subAddress = sub || data.display_name.split(',').slice(0, 2).join(', ');
          }
        } catch (e) {
          address = 'Location Selected';
          subAddress = `${center.lat.toFixed(5)}, ${center.lng.toFixed(5)}`;
        }
      });
    }
  });

  function handleCurrentLocation() {
    if (!map) return;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        // Check if coordinates valid?
        map.flyTo([latitude, longitude], 18);
      }, (error) => {
        console.error("Geo error", error);
        alert("Could not get your location. Please enable location services.");
      });
    } else {
      alert('Geolocation is not supported by your browser');
    }
  }

  function confirmLocation() {
    if (browser) {
      localStorage.setItem('userLocation', JSON.stringify({
        name: address,
        address: subAddress
      }));
      goto('/user/nearby');
    }
  }
</script>

<div class="h-screen flex flex-col bg-bg-app relative overflow-hidden">
  <!-- Top Navigation (Floating) -->
  <div class="absolute top-0 left-0 right-0 z-[1000] p-4 pt-12 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
    <div class="flex items-center gap-3 pointer-events-auto">
      <button 
        onclick={() => history.back()}
        class="w-10 h-10 bg-surface rounded-full flex items-center justify-center shadow-lg text-text-primary"
      >
        <ChevronLeft size={24} />
      </button>
      
      <div class="flex-1 bg-surface rounded-xl shadow-lg flex items-center px-4 py-2.5 gap-3">
        <Search size={18} class="text-text-muted" />
        <input 
          bind:value={searchQuery}
          onkeydown={handleKeydown}
          placeholder="Search for area, street name..."
          class="flex-1 bg-transparent text-sm font-bold text-text-primary outline-none placeholder:text-text-muted font-sans"
        />
      </div>
    </div>
  </div>

  <!-- Map Container -->
  <div class="flex-1 relative bg-gray-100" bind:this={mapElement}>
    <!-- Center Pin (Static Overlay) -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[900] -mt-8 pointer-events-none flex flex-col items-center">
      <div class="relative drop-shadow-xl">
        <img 
          src="/logo.png" 
          alt="Location" 
          class="w-16 h-16 object-contain -mb-1"
        />
        <div class="hidden w-4 h-4 bg-black/20 rounded-full blur-[2px] absolute bottom-1 left-1/2 -translate-x-1/2"></div>
      </div>
      {#if isDragging}
        <div class="bg-black/70 text-white text-[10px] font-bold px-3 py-1 rounded-full mt-2 backdrop-blur-sm">
          Place Pin
        </div>
      {/if}
    </div>

    <!-- Current Location Button -->
    <button 
      onclick={handleCurrentLocation}
      class="absolute bottom-6 right-6 z-[900] w-12 h-12 bg-surface rounded-full shadow-xl flex items-center justify-center text-primary border border-primary/10 active:scale-95 transition-transform"
    >
      <Crosshair size={24} />
    </button>
  </div>

  <!-- Bottom Sheet -->
  <div class="bg-surface rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 pb-8 z-[1000] animate-in slide-in-from-bottom duration-500">
    <div class="w-12 h-1.5 bg-border-dark rounded-full mx-auto mb-6 opacity-50"></div>
    
    <div class="flex items-start gap-4 mb-6">
      <div class="p-3 bg-primary/10 rounded-2xl text-primary mt-1">
        <MapPin size={24} />
      </div>
      <div>
        <h2 class="text-xl font-black text-text-primary mb-1">{address}</h2>
        <p class="text-sm text-text-muted font-medium leading-relaxed">{subAddress}</p>
      </div>
    </div>

    <button 
      onclick={confirmLocation}
      class="w-full py-4 bg-primary text-white font-bold text-lg rounded-2xl shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
    >
      Confirm Location
    </button>
  </div>
</div>

<style>
  :global(.leaflet-control-container) {
    display: none;
  }
</style>
