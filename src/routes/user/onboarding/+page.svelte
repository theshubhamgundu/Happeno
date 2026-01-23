<script lang="ts">
  import Logo from "$lib/components/Logo.svelte";
  import Button from "$lib/components/Button.svelte";
  import { goto } from "$app/navigation";
  import { MapPin, Bell } from "lucide-svelte";

  let requesting = $state(false);
  let error = $state("");

  async function requestLocation() {
    requesting = true;
    error = "";

    if (!("geolocation" in navigator)) {
      error = "Geolocation is not supported by your browser";
      requesting = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success! We can move to the next step or home
        // In a real app, you might save this in a store
        goto("/user/nearby");
      },
      (err) => {
        error =
          "We need your location to show nearby offers. Please enable it in your settings.";
        requesting = false;
      },
    );
  }
</script>

<div
  class="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-bg-app"
>
  <div class="w-full max-w-sm flex flex-col items-center text-center gap-10">
    <div class="relative">
      <div
        class="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="relative bg-white p-10 rounded-[40px] shadow-2xl shadow-primary/10 border border-border-peach"
      >
        <MapPin size={64} class="text-primary" />
      </div>
    </div>

    <div class="space-y-4">
      <h1 class="text-3xl font-heading font-extrabold text-text-primary">
        Enable Location
      </h1>
      <p class="text-text-secondary font-medium leading-relaxed">
        To show you live offers happening right now in your street, we need to
        know where you are.
      </p>
    </div>

    <div class="w-full flex flex-col gap-4">
      <Button
        onclick={requestLocation}
        loading={requesting}
        class="w-full py-5 text-xl font-bold rounded-[25px]"
      >
        Allow Location Access
      </Button>

      {#if error}
        <p
          class="text-sm font-medium text-urgency bg-urgency/10 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2"
        >
          {error}
        </p>
      {/if}
    </div>

    <p class="text-xs text-text-muted font-medium italic">
      Your privacy matters. We only use your location to find nearby deals.
    </p>
  </div>
</div>
