<script lang="ts">
  import Input from '$lib/components/Input.svelte';
  import Button from '$lib/components/Button.svelte';
  import { ChevronLeft, MapPin, Zap, Clock } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { cn } from '$lib/utils';

  let title = $state('');
  let description = $state('');
  let discount = $state('');
  let radius = $state(1); // 1, 3, 5, 10
  let duration = $state(2); // 2, 6, 12, 24
  let loading = $state(false);

  const radiusOptions = [
    { value: 1, label: '1 km', price: 50, reach: '~120 users' },
    { value: 3, label: '3 km', price: 120, reach: '~500 users' },
    { value: 5, label: '5 km', price: 200, reach: '~1200 users' },
    { value: 10, label: '10 km', price: 500, reach: '~3500 users' },
  ];

  const durationOptions = [
    { value: 2, label: '2 Hours', add: 0 },
    { value: 6, label: '6 Hours', add: 0.2 },
    { value: 12, label: '12 Hours', add: 0.4 },
    { value: 24, label: '24 Hours', add: 0.6 },
  ];

  let totalPrice = $derived.by(() => {
    const base = radiusOptions.find(r => r.value === radius)?.price || 0;
    const multi = 1 + (durationOptions.find(d => d.value === duration)?.add || 0);
    return Math.round(base * multi);
  });

  async function handlePayment() {
    if (!title || !discount) {
      alert('Please fill at least the title and discount!');
      return;
    }

    loading = true;
    
    // Simulate successful broadcast/payment
    setTimeout(() => {
      loading = false;
      goto('/merchant/dashboard');
    }, 1500);
  }
</script>

<div class="min-h-screen bg-bg-app pb-24">
  <header class="px-6 py-6 flex items-center gap-4 sticky top-0 bg-bg-app/80 backdrop-blur-xl z-30">
    <button onclick={() => history.back()} class="p-3 bg-white border border-border-peach rounded-2xl text-text-primary">
      <ChevronLeft size={24} />
    </button>
    <h1 class="text-2xl font-heading font-extrabold text-text-primary">New Broadcast</h1>
  </header>

  <main class="px-6 flex flex-col gap-8 mt-4">
    <div class="space-y-6">
      <div class="flex flex-col gap-4">
        <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
          <Zap size={20} class="text-primary" /> Offer Details
        </h2>
        <Input label="Offer Title" placeholder="e.g. Flash 50% Off Everything" bind:value={title} />
        <Input label="Discount Detail" placeholder="e.g. FLAT 50% OFF" bind:value={discount} />
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-semibold text-text-secondary ml-1" for="desc">Description</label>
          <textarea 
            id="desc"
            placeholder="Tell users more about this offer..."
            class="w-full px-5 py-4 bg-white border-2 border-input-rose rounded-2xl outline-none focus:border-primary transition-all duration-300 min-h-[120px] font-medium"
            bind:value={description}
          ></textarea>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
          <MapPin size={20} class="text-primary" /> Radius Coverage
        </h2>
        
        <!-- Radius Preview Map Mock -->
        <div class="h-48 w-full relative rounded-[32px] overflow-hidden border border-border-peach">
          <div class="absolute inset-0 bg-[#f5f5f5] flex items-center justify-center">
             <div class="w-2 h-2 bg-primary rounded-full relative z-10"></div>
             <div 
               class="border-2 border-primary bg-primary/10 rounded-full transition-all duration-500 flex items-center justify-center"
               style="width: {radius * 20}px; height: {radius * 20}px;"
             >
               <span class="text-[8px] font-bold text-primary opacity-50">{radius}km</span>
             </div>
          </div>
          <div class="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-text-muted border border-border-peach">
            LIVE PREVIEW
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          {#each radiusOptions as option}
            <button 
              onclick={() => radius = option.value}
              class={cn(
                "p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-1",
                radius === option.value 
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" 
                  : "bg-white text-text-primary border-border-peach hover:border-primary/50"
              )}
            >
              <span class="text-base font-extrabold">{option.label}</span>
              <span class={cn("text-[10px] font-bold uppercase", radius === option.value ? "text-white/80" : "text-text-muted")}>
                {option.reach}
              </span>
            </button>
          {/each}
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
          <Clock size={20} class="text-primary" /> Duration
        </h2>
        <div class="flex flex-wrap gap-2">
          {#each durationOptions as option}
            <button 
              onclick={() => duration = option.value}
              class={cn(
                "px-5 py-3 rounded-2xl border-2 transition-all font-bold text-sm",
                duration === option.value 
                  ? "bg-primary text-white border-primary" 
                  : "bg-white text-text-primary border-border-peach"
              )}
            >
              {option.label}
              {#if option.add > 0}
                <span class="ml-1 opacity-70 underline decoration-2">+{option.add * 100}%</span>
              {/if}
            </button>
          {/each}
        </div>
      </div>
    </div>
  </main>

  <!-- Checkout Bar -->
  <div class="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-border-peach flex flex-col gap-4 z-40 rounded-t-[40px] shadow-2xl">
    <div class="flex items-center justify-between px-2">
      <div class="flex flex-col">
        <span class="text-xs font-bold text-text-muted uppercase tracking-widest">Total Price</span>
        <span class="text-3xl font-heading font-extrabold text-text-primary">₹{totalPrice}</span>
      </div>
      <div class="text-right">
        <span class="text-xs font-bold text-success uppercase tracking-widest">Expected Reach</span>
        <div class="text-lg font-bold text-text-primary">
          {radiusOptions.find(r => r.value === radius)?.reach.split(' ')[0]} Users
        </div>
      </div>
    </div>
    <Button onclick={handlePayment} {loading} class="w-full py-5 text-xl font-bold">
      Pay & Broadcast Live
    </Button>
  </div>
</div>
