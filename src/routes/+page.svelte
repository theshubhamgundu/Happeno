<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Logo from '$lib/components/Logo.svelte';
  import Button from '$lib/components/Button.svelte';

  onMount(() => {
    // In a real app, check auth state and redirect
  });
</script>

<div class="min-h-screen bg-bg-app flex flex-col items-center justify-center p-6 text-center">
  <div class="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-700">
    <Logo size={120} />
    <div>
      <h1 class="text-6xl brand-text tracking-tight">Happeno</h1>
      <p class="text-xl font-medium text-text-secondary mt-2">The flash-deal engine for everyone.</p>
    </div>
  </div>

  <div class="w-full max-w-sm mt-16 flex flex-col gap-4 animate-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
    <Button onclick={() => goto('/login')} class="w-full py-5 text-xl">
      I want to Discover
    </Button>
    <Button onclick={() => goto('/merchant/login')} variant="outline" class="w-full py-5 text-xl">
      I'm a Merchant
    </Button>
  </div>
</div>
