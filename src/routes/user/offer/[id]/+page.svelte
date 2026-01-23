<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import Map from '$lib/components/Map.svelte';
  import Button from '$lib/components/Button.svelte';
  import { ChevronLeft, Clock, MapPin, Share2, Bookmark } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  let used = $state(false);

  function handleUse() {
    used = true;
    setTimeout(() => {
      alert('Offer code "HAPPENO50" revealed! Show this at the counter.');
    }, 500);
  }

  // Mock data fetching based on ID
  const offer = {
    id: '1',
    merchant_name: 'Paradise Biryani',
    title: 'Flat 20% Off on Family Packs',
    description: 'Enjoy the legendary taste of Hyderabad. Get a flat 20% discount on all Family Pack Biryanis. Valid for dine-in at Hitech City branch.',
    distance: 350,
    time_left: '2h 15m',
    valid_until: 'Today, 11:00 PM',
    lat: 17.4483,
    lng: 78.3915,
    category: 'Food & Beverage'
  };
</script>

<div class="min-h-screen bg-bg-app pb-32">
  <div class="relative h-64 bg-primary flex items-center justify-center overflow-hidden">
    <!-- Abstract Pattern -->
    <div class="absolute inset-0 opacity-20">
      <div class="absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
    </div>
    
    <button 
      onclick={() => history.back()} 
      class="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/30 transition-all"
    >
      <ChevronLeft size={24} />
    </button>

    <div class="absolute top-6 right-6 flex gap-2 text-white">
      <button class="p-3 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/30 transition-all">
        <Bookmark size={22} />
      </button>
      <button class="p-3 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/30 transition-all">
        <Share2 size={22} />
      </button>
    </div>

    <div class="relative z-10 flex flex-col items-center text-center px-6">
      <div class="w-24 h-24 bg-white rounded-[32px] shadow-2xl flex items-center justify-center mb-4 text-primary font-bold text-4xl">
        {offer.merchant_name[0]}
      </div>
      <span class="text-white/80 text-sm font-bold uppercase tracking-widest">{offer.merchant_name}</span>
    </div>
  </div>

  <main class="px-6 -mt-8 relative z-20">
    <div class="bg-white rounded-[40px] p-8 border border-border-peach shadow-xl">
      <div class="flex items-center gap-2 mb-4">
        <div class="px-3 py-1 bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-widest rounded-full">
          {offer.category}
        </div>
        <div class="px-3 py-1 bg-urgency/10 text-urgency text-[10px] font-extrabold uppercase tracking-widest rounded-full flex items-center gap-1">
          <Clock size={12} />
          Expires in {offer.time_left}
        </div>
      </div>

      <h1 class="text-3xl font-heading font-extrabold text-text-primary mb-4 leading-tight">
        {offer.title}
      </h1>

      <p class="text-text-secondary font-medium leading-relaxed mb-8">
        {offer.description}
      </p>

      <div class="flex items-center justify-between py-6 border-y border-border-peach mb-8">
        <div class="flex flex-col gap-1">
          <span class="text-[10px] font-bold text-text-muted uppercase tracking-widest">Distance</span>
          <div class="flex items-center gap-1.5 text-text-primary font-extrabold">
            <MapPin size={16} class="text-primary" />
            {offer.distance} Meters
          </div>
        </div>
        <div class="flex flex-col gap-1 text-right">
          <span class="text-[10px] font-bold text-text-muted uppercase tracking-widest">Valid Until</span>
          <div class="text-text-primary font-extrabold">{offer.valid_until}</div>
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="text-lg font-bold text-text-primary">Location</h3>
        <div class="h-48 w-full">
          <Map center={[offer.lng, offer.lat]} markers={[{lng: offer.lng, lat: offer.lat, title: offer.merchant_name}]} zoom={15} />
        </div>
      </div>
    </div>
  </main>

  <div class="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-2xl border-t border-border-peach flex items-center justify-center">
    <Button 
      onclick={handleUse} 
      variant={used ? 'secondary' : 'primary'}
      class="w-full max-w-md py-5 text-xl font-bold shadow-2xl shadow-primary/30"
    >
      {used ? 'Offer Revealed' : 'Use Offer'}
    </Button>
  </div>
</div>
