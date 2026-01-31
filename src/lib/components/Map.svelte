<script lang="ts">
  import { onMount } from "svelte";
  import { cn } from "$lib/utils";
  import { MapPin } from "lucide-svelte";

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

  let {
    center = [78.3915, 17.4483],
    markers = [],
    class: className,
  }: Props = $props();

  let mapContainer: HTMLElement;
  let map = $state<any>();

  // Use globalThis for Ola Maps SDK
  const getOlaMaps = () => (globalThis as any).OlaMaps;

  import { PUBLIC_OLA_MAPS_API_KEY as OLA_API_KEY } from "$env/static/public";

  onMount(() => {
    let attempts = 0;
    const loadMap = () => {
      const OlaMaps = getOlaMaps();
      if (typeof OlaMaps !== "undefined" && mapContainer) {
        try {
          const olaMaps = new OlaMaps({ apiKey: OLA_API_KEY });
          map = olaMaps.init({
            style:
              "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
            container: mapContainer,
            center: center,
            zoom: 15,
          });

          map.on("load", () => {
            markers.forEach((m) => {
              if (OlaMaps.Marker) {
                new OlaMaps.Marker().setLngLat([m.lng, m.lat]).addTo(map);
              }
            });
          });

          map.on("error", (e: any) => {
            console.warn("Ola Map SDK Error:", e);
            // We don't nullify map here anymore to prevent premature fallback
          });
        } catch (e) {
          console.error("Ola Maps Init Failed:", e);
          map = null;
        }
      } else if (attempts < 15) {
        attempts++;
        setTimeout(loadMap, 200);
      }
    };
    loadMap();
  });
</script>

<div
  bind:this={mapContainer}
  class={cn(
    "w-full h-full rounded-[40px] overflow-hidden relative bg-[#f5f5f5]",
    className,
  )}
>
  {#if typeof getOlaMaps() === "undefined" || !map}
    <div class="absolute inset-0 flex items-center justify-center bg-[#FDFCFB]">
      <!-- Animated Background Surface -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 hex-pattern opacity-[0.05]"></div>
        <div
          class="absolute inset-0 opacity-[0.02]"
          style="background: radial-gradient(circle at 20% 30%, var(--color-primary) 0%, transparent 50%), 
                     radial-gradient(circle at 80% 70%, var(--color-secondary) 0%, transparent 50%);"
        ></div>

        <!-- Mock Streets (Stylized) -->
        <div class="absolute inset-0 opacity-10">
          <div
            class="absolute top-[20%] left-0 w-full h-[2px] bg-primary/20 rotate-[-15deg]"
          ></div>
          <div
            class="absolute top-[50%] left-0 w-full h-[2px] bg-primary/20 rotate-[5deg]"
          ></div>
          <div
            class="absolute top-0 left-[30%] w-[2px] h-full bg-primary/20 rotate-[10deg]"
          ></div>
          <div
            class="absolute top-0 left-[70%] w-[2px] h-full bg-primary/20 rotate-[-5deg]"
          ></div>
        </div>
      </div>

      <!-- Markers -->
      {#each markers as marker}
        <div
          class="absolute transform -translate-x-1/2 -translate-y-full flex flex-col items-center gap-2 group animate-float"
          style="left: {50 + (Math.random() * 20 - 10)}%; top: {50 +
            (Math.random() * 20 - 10)}%; animation-delay: {Math.random() * 2}s"
        >
          <div
            class="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-xl border border-primary/10 text-[10px] font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0 text-primary uppercase tracking-widest"
          >
            {marker.title}
          </div>
          <div class="relative">
            <div
              class="absolute -inset-3 bg-primary/20 rounded-full animate-ping"
            ></div>
            <div
              class="relative bg-primary p-2.5 rounded-2xl shadow-2xl border-2 border-white text-white transform group-hover:scale-110 transition-transform duration-300"
            >
              <MapPin size={18} fill="currentColor" fill-opacity="0.2" />
            </div>
          </div>
        </div>
      {/each}

      <div
        class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/60 backdrop-blur-2xl px-6 py-3 rounded-[24px] border border-white/40 shadow-[0_8px_32px_0_rgba(255,16,124,0.15)] text-[10px] font-black tracking-[0.25em] uppercase text-primary flex items-center gap-3 active:scale-95 transition-transform cursor-default select-none overflow-hidden group/badge"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/badge:translate-x-full transition-transform duration-1000"
        ></div>
        <span class="relative flex h-2.5 w-2.5">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"
          ></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"
          ></span>
        </span>
        <span class="relative">Geospatial Synapse</span>
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

  :global(.maplibregl-canvas-container),
  :global(.maplibregl-canvas) {
    border-radius: 40px !important;
  }
</style>
