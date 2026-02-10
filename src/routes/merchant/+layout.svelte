<script lang="ts">
  import { cn } from "$lib/utils";
  import Toast from "$lib/components/Toast.svelte";
  import DistrictHeader from "$lib/components/DistrictHeader.svelte";
  import InfiniteGrid from "$lib/components/InfiniteGrid.svelte";
  import { page } from "$app/stores";
  import { liveOrdersStore } from "$lib/stores/merchant";
  import { audioService } from "$lib/services/audio";
  import { appSettingsStore } from "$lib/stores/settings";
  import { onMount } from "svelte";

  let { children } = $props();

  let lastOrderCount = 0;

  onMount(() => {
    appSettingsStore.load();
    const unsubscribe = liveOrdersStore.subscribe(orders => {
        if (orders.length > lastOrderCount && $appSettingsStore.soundAlerts) {
            audioService.play('order_new');
        }
        lastOrderCount = orders.length;
    });
    return unsubscribe;
  });

  let activeTab = $derived.by(() => {
    const path = $page.url.pathname;
    if (path.includes("/merchant/history")) return "History";
    if (path.includes("/merchant/wallet")) return "Wallet";
    if (path === "/merchant/dashboard") return "Dashboard";
    return "Other";
  });
</script>

<div class="min-h-screen bg-bg-app flex flex-col relative">
  <!-- Animated Background Grid -->
  <InfiniteGrid />
  <Toast />
  <!-- Global Merchant Header -->
  {#if !$page.url.pathname.includes("/merchant/login")}
    <DistrictHeader active={activeTab} />
  {/if}

  <main class="flex-1">
    {@render children()}
  </main>
</div>
