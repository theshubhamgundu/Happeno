<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Input from "$lib/components/Input.svelte";
  import {
    MapPin,
    LogOut,
    Store,
    Edit2,
    Save,
    Camera,
    Navigation,
    Clock,
  } from "lucide-svelte";
  import { goto } from "$app/navigation";

  let businessName = $state("Paradise Biryani");

  // Location State
  let street = $state("Plot 12, Hitec City Main Rd");
  let city = $state("Hyderabad");
  let state = $state("Telangana");
  let zip = $state("500081");
  let fullAddress = $derived(`${street}, ${city}, ${state} - ${zip}`);
  let isEditingLocation = $state(false);

  // Timing State
  let openTime = $state("10:00");
  let closeTime = $state("23:00");
  let isEditingTiming = $state(false);

  // Restaurant DP State
  let merchantDp: File | null = $state(null);
  let merchantDpPreview: string | null = $state(
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80",
  );
  let dpInput: HTMLInputElement;

  function handleDpSelect(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      merchantDp = target.files[0];
      merchantDpPreview = URL.createObjectURL(merchantDp);
    }
  }
</script>

<div class="min-h-screen bg-[#FFF5E1] pb-24">
  <!-- Header with DP Upload -->
  <header
    class="relative px-6 pt-12 pb-8 flex flex-col items-center gap-4 text-center bg-white rounded-b-[40px] shadow-sm z-10"
  >
    <div
      class="absolute top-4 right-4 text-xs font-bold text-success bg-success/10 px-3 py-1.5 rounded-full flex items-center gap-1"
    >
      <div class="w-2 h-2 rounded-full bg-success animate-pulse"></div>
      Verified
    </div>

    <button
      onclick={() => dpInput.click()}
      class="relative group w-28 h-28 bg-slate-50 rounded-[36px] border-4 border-white shadow-xl flex items-center justify-center text-primary overflow-hidden cursor-pointer hover:border-primary/30 transition-all"
    >
      {#if merchantDpPreview}
        <img
          src={merchantDpPreview}
          alt="Merchant DP"
          class="w-full h-full object-cover"
        />
        <div
          class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Camera size={24} class="text-white" />
        </div>
      {:else}
        <Store size={40} class="group-hover:scale-110 transition-transform" />
        <div
          class="absolute bottom-2 right-2 bg-primary text-white p-1.5 rounded-full shadow-sm"
        >
          <Edit2 size={10} />
        </div>
      {/if}
    </button>
    <input
      type="file"
      bind:this={dpInput}
      class="hidden"
      accept="image/*"
      onchange={handleDpSelect}
    />

    <div>
      <h1 class="text-2xl font-heading font-extrabold text-text-primary">
        {businessName}
      </h1>
      <p class="text-sm font-bold text-text-secondary mt-1">
        Restaurant Profile
      </p>
    </div>
  </header>

  <main class="px-6 flex flex-col gap-8 mt-6">
    <!-- Location Section (Detailed) -->
    <div class="space-y-4">
      <div class="flex items-center justify-between px-1">
        <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
          <div class="p-1.5 rounded-lg bg-orange-50 text-orange-500">
            <MapPin size={18} />
          </div>
          Location Details
        </h2>
        <button
          onclick={() => (isEditingLocation = !isEditingLocation)}
          class="text-xs font-bold text-primary hover:underline"
        >
          {isEditingLocation ? "Done" : "Edit"}
        </button>
      </div>

      <div
        class="bg-white p-5 rounded-[28px] border border-border-peach shadow-sm"
      >
        {#if isEditingLocation}
          <div
            class="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2"
          >
            <Input
              label="Street Address"
              bind:value={street}
              placeholder="Plot No, Street"
            />
            <div class="grid grid-cols-2 gap-3">
              <Input label="City" bind:value={city} placeholder="City" />
              <Input label="State" bind:value={state} placeholder="State" />
            </div>
            <Input
              label="Zip Code"
              bind:value={zip}
              placeholder="500000"
              type="number"
            />

            <div
              class="h-24 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs font-bold border-2 border-dashed border-slate-200 mt-2"
            >
              <MapPin size={16} class="mr-1" /> Pin Location on Map
            </div>
            <Button
              class="py-3 mt-1"
              onclick={() => (isEditingLocation = false)}
              ><Save size={16} class="mr-2" /> Save Address</Button
            >
          </div>
        {:else}
          <div class="flex flex-col gap-4">
            <div class="flex items-start gap-4">
              <div class="p-3 bg-blue-50 text-blue-500 rounded-2xl shrink-0">
                <Navigation size={24} />
              </div>
              <div>
                <div
                  class="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1"
                >
                  Full Address
                </div>
                <div
                  class="text-base font-bold text-text-primary leading-tight"
                >
                  {fullAddress}
                </div>
              </div>
            </div>

            <button
              class="w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
            >
              <MapPin size={14} /> View on Map
            </button>
          </div>
        {/if}
      </div>
    </div>

    <!-- Restaurant Timings -->
    <div class="space-y-4">
      <div class="flex items-center justify-between px-1">
        <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
          <div class="p-1.5 rounded-lg bg-purple-50 text-purple-500">
            <Clock size={18} />
          </div>
          Timings
        </h2>
        <button
          onclick={() => (isEditingTiming = !isEditingTiming)}
          class="text-xs font-bold text-primary hover:underline"
        >
          {isEditingTiming ? "Done" : "Edit"}
        </button>
      </div>

      <div
        class="bg-white p-5 rounded-[28px] border border-border-peach shadow-sm"
      >
        {#if isEditingTiming}
          <div
            class="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2"
          >
            <div class="space-y-2">
              <label
                class="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1"
                >Opens At</label
              >
              <input
                type="time"
                bind:value={openTime}
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary font-bold text-slate-800"
              />
            </div>
            <div class="space-y-2">
              <label
                class="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1"
                >Closes At</label
              >
              <input
                type="time"
                bind:value={closeTime}
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary font-bold text-slate-800"
              />
            </div>
          </div>
        {:else}
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-purple-50 text-purple-500 rounded-2xl">
                <Clock size={24} />
              </div>
              <div>
                <div
                  class="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1"
                >
                  Everyday
                </div>
                <div class="text-base font-bold text-text-primary">
                  {openTime} - {closeTime}
                </div>
              </div>
            </div>
            <div
              class="px-3 py-1 bg-success/10 text-success text-[10px] font-extrabold uppercase tracking-widest rounded-full"
            >
              Open Now
            </div>
          </div>
        {/if}
      </div>
    </div>

    <div class="pt-8 mb-4">
      <Button
        variant="outline"
        onclick={() => goto("/")}
        class="w-full py-4 border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-urgency transition-colors"
      >
        <LogOut size={18} class="mr-2" /> Logout
      </Button>
    </div>
  </main>
</div>
