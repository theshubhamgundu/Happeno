<script lang="ts">
  import { onMount } from 'svelte';
  import { cn } from '$lib/utils';
  import { MapPin } from 'lucide-svelte';

  interface Props {
    center?: [number, number]; // [lng, lat]
    zoom?: number;
    markers?: Array<{
      lng: number;
      lat: number;
      title: string;
    }>;
    class?: string;
  }

  let { center = [78.3915, 17.4483], markers = [], class: className }: Props = $props();
  
  let mapContainer: HTMLElement;
  let map: any;

  // Ola Maps SDK global
  declare const OlaMaps: any;

  onMount(() => {
    // Check if OlaMaps is loaded from app.html
    if (typeof OlaMaps !== 'undefined') {
      try {
        const olaMaps = new OlaMaps({
          apiKey: 'kHU0HCI2mlwBKox2kRwcTgpjsfEz0LEXKDPKcGhx'
        });

        map = olaMaps.init({
          style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
          container: mapContainer,
          center: center, // [lng, lat]
          zoom: 15
        });

        map.on('load', () => {
          markers.forEach(m => {
            if (typeof OlaMaps.Marker === 'function') {
              new OlaMaps.Marker()
                .setLngLat([m.lng, m.lat])
                .addTo(map);
            }
          });
        });
      } catch (e) {
        console.error("Ola Maps Component Init Error:", e);
      }
    }
  });
</script>

<div bind:this={mapContainer} class={cn("w-full h-full rounded-[40px] overflow-hidden relative bg-[#f5f5f5]", className)}>
  {#if typeof OlaMaps === 'undefined'}
    <div class="absolute inset-0 flex items-center justify-center">
    <div class="absolute inset-0 bg-[#e5e5e5] flex items-center justify-center overflow-hidden">
      <!-- Grid Pattern for Map Mock -->
      <div 
        class="absolute inset-0 opacity-10" 
        style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 20px 20px;"
      ></div>
      
      <!-- Mock Streets / Shapes -->
      <div class="w-[200%] h-[200%] absolute rotate-12 opacity-20 flex flex-wrap gap-10">
        {#each Array(20) as _}
          <div class="w-96 h-2 bg-white rounded-full"></div>
          <div class="h-96 w-2 bg-white rounded-full mt-20"></div>
        {/each}
      </div>
    </div>

    <!-- Markers -->
    {#each markers as marker}
      <div 
        class="absolute transform -translate-x-1/2 -translate-y-full flex flex-col items-center gap-1 group"
        style="left: 50%; top: 50%;"
      >
        <div class="bg-white px-3 py-1.5 rounded-xl shadow-lg border border-border-peach text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity mb-1">
          {marker.title}
        </div>
        <div class="relative">
          <div class="absolute -inset-2 bg-primary/20 rounded-full animate-ping"></div>
          <div class="relative bg-primary p-2 rounded-full shadow-lg border-2 border-white text-white">
            <MapPin size={16} />
          </div>
        </div>
      </div>
    {/each}

    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-border-peach text-[10px] font-bold tracking-widest uppercase text-text-muted flex items-center gap-2">
      <div class="w-2 h-2 rounded-full bg-success"></div>
      Ola Maps Interface
    </div>
  </div>
  {/if}
</div>

<style>
  :global(.maplibregl-ctrl),
  :global(.maplibregl-ctrl-logo),
  :global(.maplibregl-ctrl-attrib),
  :global(.mapboxgl-ctrl-logo),
  :global(.mapboxgl-ctrl-attrib),
  :global(.olamaps-logo) { 
    display: none !important; 
    visibility: hidden !important;
  }
  
  :global(.maplibregl-ctrl-bottom-left),
  :global(.maplibregl-ctrl-bottom-right) {
    display: none !important;
  }
</style>
