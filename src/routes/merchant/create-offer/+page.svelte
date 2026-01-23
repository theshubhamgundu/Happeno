<script lang="ts">
  import Input from "$lib/components/Input.svelte";
  import Button from "$lib/components/Button.svelte";
  import {
    ChevronLeft,
    Gift,
    Upload,
    Image as ImageIcon,
    IndianRupee,
    Tag,
    X,
  } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import { cn } from "$lib/utils";

  // Form State
  let offerTitle = $state("");
  let productName = $state("");
  let originalPrice = $state("");
  let discountedPrice = $state("");
  let imageFile: File | null = $state(null);
  let imagePreview: string | null = $state(null);
  let loading = $state(false);
  let fileInput: HTMLInputElement;

  // Derived Values
  let discountPercentage = $derived.by(() => {
    const original = parseFloat(originalPrice);
    const discounted = parseFloat(discountedPrice);

    if (original > 0 && discounted >= 0 && original > discounted) {
      const off = ((original - discounted) / original) * 100;
      return Math.round(off) + "% OFF";
    }
    return "";
  });

  function handleFileSelect(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      imageFile = target.files[0];
      imagePreview = URL.createObjectURL(imageFile);
    }
  }

  function removeImage() {
    imageFile = null;
    imagePreview = null;
    if (fileInput) fileInput.value = "";
  }

  async function handlePublish() {
    if (
      !offerTitle ||
      !productName ||
      !originalPrice ||
      !discountedPrice ||
      !imageFile
    ) {
      alert("Please fill all details and upload an image!");
      return;
    }

    loading = true;

    // Simulate API call
    setTimeout(() => {
      loading = false;
      goto("/merchant/dashboard");
    }, 1500);
  }
</script>

<div class="min-h-screen bg-bg-app pb-24 relative overflow-x-hidden">
  <!-- Subtle Background Blobs -->
  <div
    class="fixed -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"
  ></div>
  <div
    class="fixed top-1/2 -left-32 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
  ></div>

  <header
    class="px-6 py-6 flex items-center gap-4 sticky top-0 bg-bg-app/80 backdrop-blur-xl z-30 transition-all duration-300"
  >
    <button
      onclick={() => history.back()}
      class="p-3 bg-white/50 border border-slate-100/50 backdrop-blur-md rounded-2xl text-text-primary hover:bg-white hover:shadow-sm transition-all active:scale-95"
    >
      <ChevronLeft size={24} />
    </button>
    <h1
      class="text-2xl font-heading font-extrabold text-text-primary tracking-tight"
    >
      New Offer
    </h1>
  </header>

  <main class="px-6 flex flex-col gap-8 mt-2 relative z-10">
    <!-- Image Upload Section -->
    <div
      class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
          <div class="p-1.5 rounded-lg bg-blue-50 text-blue-500">
            <Gift size={18} />
          </div>
          Offer Visual
        </h2>
        <span
          class="text-[10px] font-bold uppercase tracking-widest text-text-muted bg-white/50 px-2 py-1 rounded-md"
          >Step 1</span
        >
      </div>

      <input
        type="file"
        accept="image/*"
        class="hidden"
        bind:this={fileInput}
        onchange={handleFileSelect}
      />

      {#if imagePreview}
        <div
          class="w-full aspect-video relative rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 animate-in zoom-in-95 duration-300"
        >
          <img
            src={imagePreview}
            alt="Preview"
            class="w-full h-full object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
          ></div>

          <button
            onclick={removeImage}
            class="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white hover:bg-red-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div class="absolute bottom-4 left-4 text-white">
            <div
              class="text-xs font-bold opacity-80 uppercase tracking-widest mb-1"
            >
              Preview
            </div>
            <div class="font-bold text-sm">Tap X to change</div>
          </div>
        </div>
      {:else}
        <button
          onclick={() => fileInput.click()}
          class="w-full aspect-video bg-white/60 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-white hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group active:scale-[0.99]"
        >
          <div
            class="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300"
          >
            <Upload
              size={28}
              class="text-slate-400 group-hover:text-primary transition-colors"
            />
          </div>
          <div class="text-center">
            <div
              class="text-base font-bold text-text-primary group-hover:text-primary transition-colors"
            >
              Upload Product Photo
            </div>
            <div class="text-xs font-medium text-text-muted mt-1">
              Supports JPG, PNG up to 5MB
            </div>
          </div>
        </button>
      {/if}
    </div>

    <!-- Details Section -->
    <div
      class="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-200 fill-mode-both"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
          <div class="p-1.5 rounded-lg bg-orange-50 text-orange-500">
            <Tag size={18} />
          </div>
          Details
        </h2>
        <span
          class="text-[10px] font-bold uppercase tracking-widest text-text-muted bg-white/50 px-2 py-1 rounded-md"
          >Step 2</span
        >
      </div>

      <div class="grid gap-4">
        <Input
          label="Offer Headline"
          placeholder="e.g. 50% Off Lunch Combo"
          bind:value={offerTitle}
        />
        <Input
          label="Item Name"
          placeholder="e.g. Spicy Chicken Burger"
          bind:value={productName}
        />
      </div>
    </div>

    <!-- Pricing Section -->
    <div
      class="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-300 fill-mode-both"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
          <div class="p-1.5 rounded-lg bg-green-50 text-green-500">
            <IndianRupee size={18} />
          </div>
          Pricing
        </h2>
        <span
          class="text-[10px] font-bold uppercase tracking-widest text-text-muted bg-white/50 px-2 py-1 rounded-md"
          >Step 3</span
        >
      </div>

      <div
        class="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4"
      >
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label
              class="text-xs font-bold text-text-muted uppercase tracking-wider ml-1"
              for="original">Original</label
            >
            <div class="relative group">
              <div
                class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
              >
                <IndianRupee size={16} />
              </div>
              <input
                id="original"
                type="number"
                placeholder="000"
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary/20 focus:shadow-lg focus:shadow-primary/5 transition-all font-bold text-lg text-slate-600"
                bind:value={originalPrice}
              />
            </div>
          </div>

          <div class="space-y-2">
            <label
              class="text-xs font-bold text-text-muted uppercase tracking-wider ml-1"
              for="discounted">New Price</label
            >
            <div class="relative group">
              <div
                class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
              >
                <IndianRupee size={16} />
              </div>
              <input
                id="discounted"
                type="number"
                placeholder="000"
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary/20 focus:shadow-lg focus:shadow-primary/5 transition-all font-bold text-lg text-primary"
                bind:value={discountedPrice}
              />
            </div>
          </div>
        </div>

        {#if discountPercentage}
          <div
            class="p-4 bg-gradient-to-r from-success/10 to-transparent border-l-4 border-success rounded-r-xl flex items-center gap-3 animate-in slide-in-from-left-4 fade-in duration-300"
          >
            <div
              class="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center font-bold"
            >
              %
            </div>
            <div>
              <div class="text-sm font-bold text-slate-700">Great Deal!</div>
              <div class="text-xs text-slate-500 font-medium">
                You are offering <span class="text-success font-black"
                  >{discountPercentage}</span
                >
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </main>

  <!-- Publish Bar -->
  <div
    class="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-40 rounded-t-[40px] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-full duration-700 delay-500"
  >
    <Button
      onclick={handlePublish}
      {loading}
      class="w-full py-4 text-lg font-bold shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all"
    >
      Publish Offer
    </Button>
  </div>
</div>
