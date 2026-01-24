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
    Palette,
    Moon,
    HelpCircle,
    MessageCircle,
    MessageSquare,
    Shield,
    FileText,
    Info,
    ChevronRight,
  } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import { fly, fade } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

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

<div
  class="min-h-screen bg-[#FFF5E1] pb-24"
  in:fade={{ duration: 300, easing: cubicOut }}
>
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
      class="relative group w-28 h-28 bg-slate-50 rounded-[36px] border-4 border-white shadow-xl flex items-center justify-center text-primary overflow-hidden cursor-pointer hover:border-primary/30 transition-all active:scale-95"
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
    <div
      class="space-y-4"
      in:fly={{ y: 20, duration: 500, delay: 100, easing: cubicOut }}
    >
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
        class="bg-white p-5 rounded-[28px] border border-border-peach shadow-sm hover:shadow-md transition-shadow"
      >
        {#if isEditingLocation}
          <div class="flex flex-col gap-3" in:fly={{ y: 10, duration: 300 }}>
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
          <div class="flex flex-col gap-4" in:fade={{ duration: 200 }}>
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
              class="w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 active:scale-95"
            >
              <MapPin size={14} /> View on Map
            </button>
          </div>
        {/if}
      </div>
    </div>

    <!-- Restaurant Timings -->
    <div
      class="space-y-4"
      in:fly={{ y: 20, duration: 500, delay: 200, easing: cubicOut }}
    >
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
        class="bg-white p-5 rounded-[28px] border border-border-peach shadow-sm hover:shadow-md transition-shadow"
      >
        {#if isEditingTiming}
          <div class="grid grid-cols-2 gap-4" in:fly={{ y: 10, duration: 300 }}>
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
          <div
            class="flex items-center justify-between"
            in:fade={{ duration: 200 }}
          >
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

    <!-- Appearance -->
    <div
      class="space-y-4"
      in:fly={{ y: 20, duration: 500, delay: 300, easing: cubicOut }}
    >
      <div class="flex items-center justify-between px-1">
        <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
          <div class="p-1.5 rounded-lg bg-pink-50 text-pink-500">
            <Palette size={18} />
          </div>
          Appearance
        </h2>
      </div>
      <button
        class="w-full bg-white p-5 rounded-[28px] border border-border-peach shadow-sm flex items-center justify-between hover:border-primary/50 transition-colors group active:scale-[0.98] duration-200 scroll-smooth"
      >
        <div class="flex items-center gap-4">
          <div
            class="p-3 bg-slate-100 text-slate-600 rounded-2xl group-hover:bg-primary/10 group-hover:text-primary transition-colors"
          >
            <Moon size={20} />
          </div>
          <div class="font-bold text-text-primary">Theme</div>
        </div>
        <div class="flex items-center gap-2 text-text-muted font-bold text-sm">
          Dark
          <ChevronRight size={16} />
        </div>
      </button>
    </div>

    <!-- Support -->
    <div
      class="space-y-4"
      in:fly={{ y: 20, duration: 500, delay: 400, easing: cubicOut }}
    >
      <div class="flex items-center justify-between px-1">
        <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
          <div class="p-1.5 rounded-lg bg-blue-50 text-blue-500">
            <HelpCircle size={18} />
          </div>
          Support
        </h2>
      </div>
      <div
        class="bg-white rounded-[28px] border border-border-peach shadow-sm overflow-hidden flex flex-col"
      >
        <button
          onclick={() => goto("/merchant/faq")}
          class="w-full p-5 flex items-center justify-between hover:bg-slate-50 border-b border-slate-50 transition-colors active:bg-slate-100"
        >
          <div class="flex items-center gap-4">
            <div class="p-2.5 bg-slate-100 text-slate-500 rounded-xl">
              <HelpCircle size={18} />
            </div>
            <div class="font-bold text-text-primary text-sm">
              Frequently asked questions
            </div>
          </div>
          <ChevronRight size={18} class="text-slate-300" />
        </button>
        <button
          class="w-full p-5 flex items-center justify-between hover:bg-slate-50 border-b border-slate-50 transition-colors active:bg-slate-100"
        >
          <div class="flex items-center gap-4">
            <div class="p-2.5 bg-slate-100 text-slate-500 rounded-xl">
              <MessageCircle size={18} />
            </div>
            <div class="font-bold text-text-primary text-sm">Chat with us</div>
          </div>
          <ChevronRight size={18} class="text-slate-300" />
        </button>
        <button
          class="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors active:bg-slate-100"
        >
          <div class="flex items-center gap-4">
            <div class="p-2.5 bg-slate-100 text-slate-500 rounded-xl">
              <MessageSquare size={18} />
            </div>
            <div class="font-bold text-text-primary text-sm">
              Share feedback
            </div>
          </div>
          <ChevronRight size={18} class="text-slate-300" />
        </button>
      </div>
    </div>

    <!-- About -->
    <div
      class="space-y-4"
      in:fly={{ y: 20, duration: 500, delay: 500, easing: cubicOut }}
    >
      <div class="flex items-center justify-between px-1">
        <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
          <div class="p-1.5 rounded-lg bg-slate-100 text-slate-500">
            <Info size={18} />
          </div>
          About
        </h2>
      </div>
      <div
        class="bg-white rounded-[28px] border border-border-peach shadow-sm overflow-hidden flex flex-col"
      >
        <button
          onclick={() => goto("/legal/privacy")}
          class="w-full p-5 flex items-center justify-between hover:bg-slate-50 border-b border-slate-50 transition-colors active:bg-slate-100"
        >
          <div class="flex items-center gap-4">
            <div class="p-2.5 bg-slate-100 text-slate-500 rounded-xl">
              <Shield size={18} />
            </div>
            <div class="font-bold text-text-primary text-sm">
              Privacy Policy
            </div>
          </div>
          <ChevronRight size={18} class="text-slate-300" />
        </button>
        <button
          onclick={() => goto("/legal/terms")}
          class="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors active:bg-slate-100"
        >
          <div class="flex items-center gap-4">
            <div class="p-2.5 bg-slate-100 text-slate-500 rounded-xl">
              <FileText size={18} />
            </div>
            <div class="font-bold text-text-primary text-sm">
              Terms of Service
            </div>
          </div>
          <ChevronRight size={18} class="text-slate-300" />
        </button>
      </div>
    </div>

    <div
      class="pt-8 mb-4"
      in:fly={{ y: 20, duration: 500, delay: 600, easing: cubicOut }}
    >
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
