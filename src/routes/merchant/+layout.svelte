<script lang="ts">
  import { cn } from "$lib/utils";
  let { children } = $props();
</script>

<div class="min-h-screen bg-bg-app flex flex-col">
  <main class="flex-1">
    {@render children()}
  </main>
</div>
