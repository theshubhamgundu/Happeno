<script lang="ts">
  import { Clock, MapPin } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  interface Props {
    offer: {
      id: string;
      merchant_name: string;
      title: string;
      distance: number;
      time_left: string;
      image?: string;
    };
    class?: string;
  }

  let { offer, class: className }: Props = $props();
</script>

<div class={cn("bg-white p-5 rounded-[32px] border border-border-peach card-shadow flex gap-4 items-start active:scale-[0.98] transition-transform cursor-pointer", className)}>
  <div class="w-20 h-20 rounded-2xl bg-highlight flex items-center justify-center flex-shrink-0 text-primary overflow-hidden">
    {#if offer.image}
      <img src={offer.image} alt={offer.merchant_name} class="w-full h-full object-cover" />
    {:else}
      <span class="text-2xl font-bold">{offer.merchant_name[0]}</span>
    {/if}
  </div>

  <div class="flex-1 min-w-0">
    <div class="flex items-center justify-between mb-1">
      <span class="text-[10px] font-bold uppercase tracking-wider text-text-muted">{offer.merchant_name}</span>
      <div class="flex items-center gap-1 text-[10px] font-bold text-urgency bg-urgency/10 px-2 py-0.5 rounded-full">
        <Clock size={10} />
        {offer.time_left} left
      </div>
    </div>
    
    <h3 class="text-lg font-bold text-text-primary leading-tight mb-2 truncate">{offer.title}</h3>
    
    <div class="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
      <div class="flex items-center gap-1">
        <MapPin size={12} class="text-primary" />
        {offer.distance}m away
      </div>
    </div>
  </div>
</div>
