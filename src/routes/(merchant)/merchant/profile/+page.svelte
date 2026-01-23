<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Input from '$lib/components/Input.svelte';
  import { MapPin, LogOut, ChevronRight, Store, Phone, Globe } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  let businessName = $state('Paradise Biryani');
  let category = $state('Food & Beverage');
  let address = $state('Hitec City, Hyderabad, TS');
</script>

<div class="min-h-screen bg-bg-app pb-24">
  <header class="px-6 py-12 flex flex-col items-center gap-4 text-center">
    <div class="w-24 h-24 bg-white rounded-[40px] border-4 border-primary/10 shadow-xl flex items-center justify-center text-primary font-bold text-4xl">
      BK
    </div>
    <div>
      <h1 class="text-2xl font-heading font-extrabold text-text-primary">{businessName}</h1>
      <p class="text-sm font-bold text-text-muted mt-1 uppercase tracking-widest">{category}</p>
    </div>
  </header>

  <main class="px-6 flex flex-col gap-6">
    <div class="bg-white rounded-[32px] border border-border-peach overflow-hidden shadow-sm">
      <div class="p-6 flex flex-col gap-6">
        <h3 class="text-sm font-bold text-text-muted uppercase tracking-widest">Business Information</h3>
        
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-bg-app rounded-2xl text-text-secondary">
              <Store size={20} />
            </div>
            <div class="flex-1">
              <div class="text-[10px] font-bold text-text-muted uppercase">Official Name</div>
              <div class="font-bold text-text-primary">{businessName}</div>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="p-3 bg-bg-app rounded-2xl text-text-secondary">
              <Phone size={20} />
            </div>
            <div class="flex-1">
              <div class="text-[10px] font-bold text-text-muted uppercase">Phone Number</div>
              <div class="font-bold text-text-primary">+91 98765 43210</div>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="p-3 bg-bg-app rounded-2xl text-text-secondary">
              <MapPin size={20} />
            </div>
            <div class="flex-1">
              <div class="text-[10px] font-bold text-text-muted uppercase">Address</div>
              <div class="font-bold text-text-primary">{address}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-[32px] border border-border-peach overflow-hidden shadow-sm">
      <button class="w-full p-6 flex items-center justify-between hover:bg-highlight/50 transition-colors">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-primary/10 rounded-2xl text-primary">
            <Globe size={20} />
          </div>
          <div class="text-left">
            <div class="font-bold text-text-primary">Online Presence</div>
            <div class="text-xs font-medium text-text-muted">Website and social links</div>
          </div>
        </div>
        <ChevronRight size={20} class="text-text-muted" />
      </button>
    </div>

    <Button variant="outline" onclick={() => goto('/')} class="w-full py-5 border-urgency/50 text-urgency hover:bg-urgency/5">
      <LogOut size={20} class="mr-2" /> Logout Merchant
    </Button>
  </main>
</div>
