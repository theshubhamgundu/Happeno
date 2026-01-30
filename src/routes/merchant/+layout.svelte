<script lang="ts">
  import { cn } from "$lib/utils";
  import Toast from "$lib/components/Toast.svelte";
  let { children } = $props();
</script>

<div class="min-h-screen bg-bg-app flex flex-col">
  <Toast />
  <main class="flex-1">
    {@render children()}
  </main>
</div>
