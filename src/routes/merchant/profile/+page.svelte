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
    HelpCircle,
    MessageCircle,
    MessageSquare,
    Shield,
    FileText,
    Info,
    ChevronRight,
    ArrowLeft,
    Crown,
  } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import { fly, fade } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { profileStore } from "$lib/stores/merchant";
  import { toast } from "$lib/stores/toast";

  let isEditingDetails = $state(false);

  // Location State
  let street = $state("Plot 12, Hitec City Main Rd");
  let city = $state("Hyderabad");
  let stateProvince = $state("Telangana");
  let zip = $state("500081");
  let fullAddress = $derived(`${street}, ${city}, ${stateProvince} - ${zip}`);
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
  let dpInput: HTMLInputElement | undefined = $state();

  function handleDpSelect(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      merchantDp = target.files[0];
      merchantDpPreview = URL.createObjectURL(merchantDp);
    }
  }

  function submitForApproval() {
    if (
      !$profileStore.businessName ||
      !$profileStore.phone ||
      !$profileStore.email
    ) {
      toast.add("Please fill all required fields!", "error");
      return;
    }

    // Simulate API call
    $profileStore.approvalStatus = "pending";
    isEditingDetails = false;
    toast.add(
      "Details submitted for approval! You will receive a confirmation once approved.",
      "success",
    );
  }
</script>

<div
  class="min-h-screen bg-bg-app pb-24 transition-colors duration-300"
  in:fade={{ duration: 300, easing: cubicOut }}
>
  <!-- Header with DP Upload -->
  <header
    class="relative px-6 pt-12 pb-8 flex flex-col items-center gap-4 text-center bg-surface rounded-b-[40px] shadow-sm z-10 transition-colors duration-300"
  >
    <!-- Dynamic Verification Badge -->
    {#if $profileStore.approvalStatus === "approved"}
      <div
        class="absolute top-4 right-4 text-xs font-bold text-success bg-success/10 px-3 py-1.5 rounded-full flex items-center gap-1"
      >
        <div class="w-2 h-2 rounded-full bg-success animate-pulse"></div>
        Verified
      </div>
    {:else if $profileStore.approvalStatus === "pending"}
      <div
        class="absolute top-4 right-4 text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1.5 rounded-full flex items-center gap-1"
      >
        <div class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
        Pending Approval
      </div>
    {:else}
      <div
        class="absolute top-4 right-4 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full flex items-center gap-1"
      >
        Unverified
      </div>
    {/if}

    <!-- Back Button Removed (Handled by Global Header) -->

    <button
      onclick={() => dpInput?.click()}
      class="relative group w-28 h-28 bg-slate-50 rounded-[36px] border-4 border-surface shadow-xl flex items-center justify-center text-primary cursor-pointer hover:border-primary/30 transition-all active:scale-95"
    >
      {#if merchantDpPreview}
        <img
          src={merchantDpPreview}
          alt="Merchant DP"
          class="w-full h-full object-cover rounded-[32px]"
        />
        <div
          class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]"
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

      {#if $profileStore.isPremium}
        <div
          class="absolute -bottom-2 -right-2 z-20 bg-yellow-400 text-white p-1.5 rounded-full shadow-md border-4 border-bg-app"
        >
          <Crown size={16} fill="currentColor" />
        </div>
      {/if}

      <!-- Veg/Non-Veg Indicator -->
      <div
        class="absolute -bottom-2 -left-2 z-20 bg-white p-1 rounded-full shadow-md border-4 border-bg-app"
      >
        {#if $profileStore.type === "veg"}
          <div
            class="border-2 border-green-600 p-0.5 rounded-sm w-4 h-4 flex items-center justify-center"
          >
            <div class="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
          </div>
        {:else if $profileStore.type === "non-veg"}
          <div
            class="border-2 border-red-600 p-0.5 rounded-sm w-4 h-4 flex items-center justify-center"
          >
            <div class="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
          </div>
        {:else}
          <!-- Both -->
          <div
            class="border-2 border-orange-500 p-0.5 rounded-sm w-4 h-4 flex items-center justify-center"
          >
            <div class="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
          </div>
        {/if}
      </div>
    </button>
    <input
      type="file"
      bind:this={dpInput}
      class="hidden"
      accept="image/*"
      onchange={handleDpSelect}
    />

    <!-- Premium Badge logic moved inside the button -->

    <div>
      <h1 class="text-2xl font-heading font-extrabold text-text-primary">
        {$profileStore.businessName}
      </h1>
      <p class="text-sm font-bold text-text-secondary mt-1">
        Restaurant Profile
      </p>
    </div>
  </header>

  <main class="px-6 flex flex-col gap-8 mt-6">
    <!-- Restaurant Details (Onboarding/Edit) -->
    <div
      class="space-y-4"
      in:fly={{ y: 20, duration: 500, delay: 50, easing: cubicOut }}
    >
      <div class="flex items-center justify-between px-1">
        <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
          <div class="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Store size={18} />
          </div>
          Restaurant Details
        </h2>
        <button
          onclick={() => (isEditingDetails = !isEditingDetails)}
          class="text-xs font-bold text-primary hover:underline"
        >
          {isEditingDetails ? "Cancel" : "Edit"}
        </button>
      </div>

      <div
        class="bg-surface p-5 rounded-[28px] border border-border-peach shadow-sm hover:shadow-md transition-all duration-300"
      >
        {#if isEditingDetails}
          <div class="flex flex-col gap-4" in:fly={{ y: 10, duration: 300 }}>
            <Input
              label="Restaurant Name"
              bind:value={$profileStore.businessName}
              placeholder="e.g. Paradise Biryani"
            />

            <div class="space-y-2">
              <label
                class="text-xs font-bold text-text-muted uppercase tracking-wider ml-1"
                >Category</label
              >
              <select
                bind:value={$profileStore.category}
                class="w-full p-4 bg-bg-app rounded-xl font-bold text-sm outline-none border border-transparent focus:border-primary transition-colors text-text-primary"
              >
                <option value="Restaurant">Restaurant</option>
                <option value="Cafe">Cafe</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Bakery">Bakery</option>
                <option value="Cloud Kitchen">Cloud Kitchen</option>
              </select>
            </div>

            <div class="space-y-2">
              <label
                class="text-xs font-bold text-text-muted uppercase tracking-wider ml-1"
                >Type</label
              >
              <div class="flex gap-2">
                <button
                  onclick={() => ($profileStore.type = "veg")}
                  class="flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all {$profileStore.type ===
                  'veg'
                    ? 'border-success bg-success/10 text-success'
                    : 'border-slate-100 text-slate-400'}">Pure Veg</button
                >
                <button
                  onclick={() => ($profileStore.type = "non-veg")}
                  class="flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all {$profileStore.type ===
                  'non-veg'
                    ? 'border-urgency bg-urgency/10 text-urgency'
                    : 'border-slate-100 text-slate-400'}">Non-Veg</button
                >
                <button
                  onclick={() => ($profileStore.type = "both")}
                  class="flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all {$profileStore.type ===
                  'both'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-slate-100 text-slate-400'}">Both</button
                >
              </div>
            </div>

            <Input
              label="Phone Number"
              bind:value={$profileStore.phone}
              placeholder="9876543210"
              type="tel"
            />
            <Input
              label="Email Address"
              bind:value={$profileStore.email}
              placeholder="contact@example.com"
              type="email"
            />

            <Button onclick={submitForApproval} class="mt-2 py-3">
              Submit for Approval
            </Button>
          </div>
        {:else}
          <div class="flex flex-col gap-4" in:fade={{ duration: 200 }}>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div
                  class="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1"
                >
                  Category
                </div>
                <div class="text-sm font-bold text-text-primary">
                  {$profileStore.category}
                </div>
              </div>
              <div>
                <div
                  class="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1"
                >
                  Type
                </div>
                <div class="text-sm font-bold text-text-primary capitalize">
                  {$profileStore.type}
                </div>
              </div>
              <div>
                <div
                  class="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1"
                >
                  Phone
                </div>
                <div class="text-sm font-bold text-text-primary">
                  {$profileStore.phone}
                </div>
              </div>
              <div>
                <div
                  class="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1"
                >
                  Email
                </div>
                <div class="text-sm font-bold text-text-primary truncate">
                  {$profileStore.email}
                </div>
              </div>
            </div>

            {#if $profileStore.approvalStatus === "pending"}
              <div
                class="bg-orange-50 text-orange-600 p-3 rounded-xl text-xs font-bold text-center border border-orange-100"
              >
                Details under review by Admin
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
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
        class="bg-surface p-5 rounded-[28px] border border-border-peach shadow-sm hover:shadow-md transition-all duration-300"
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
              <Input
                label="State"
                bind:value={stateProvince}
                placeholder="State"
              />
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
        class="bg-surface p-5 rounded-[28px] border border-border-peach shadow-sm hover:shadow-md transition-all duration-300"
      >
        {#if isEditingTiming}
          <div class="grid grid-cols-2 gap-4" in:fly={{ y: 10, duration: 300 }}>
            <div class="space-y-2">
              <label
                for="open-at"
                class="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1"
                >Opens At</label
              >
              <input
                id="open-at"
                type="time"
                bind:value={openTime}
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary font-bold text-slate-800"
              />
            </div>
            <div class="space-y-2">
              <label
                for="closes-at"
                class="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1"
                >Closes At</label
              >
              <input
                id="closes-at"
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
        class="bg-surface rounded-[28px] border border-border-peach shadow-sm overflow-hidden flex flex-col transition-colors duration-300"
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
        class="bg-surface rounded-[28px] border border-border-peach shadow-sm overflow-hidden flex flex-col transition-colors duration-300"
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
