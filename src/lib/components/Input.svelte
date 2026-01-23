<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { cn } from "$lib/utils";

  interface Props extends HTMLInputAttributes {
    label?: string;
    error?: string;
  }

  let { label, error, class: className, ...rest }: Props = $props();
</script>

<div class="flex flex-col gap-1.5 w-full">
  {#if label}
    <label class="text-sm font-semibold text-text-secondary ml-1" for={rest.id}>
      {label}
    </label>
  {/if}
  
  <input
    {...rest}
    class={cn(
      "w-full px-5 py-4 bg-white border-2 border-input-rose rounded-2xl outline-none focus:border-primary transition-all duration-300 placeholder:text-text-muted/50 font-medium",
      error && "border-urgency",
      className
    )}
  />

  {#if error}
    <span class="text-xs font-medium text-urgency ml-1">{error}</span>
  {/if}
</div>
