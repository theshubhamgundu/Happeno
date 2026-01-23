<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { cn } from "$lib/utils";

  interface Props extends HTMLInputAttributes {
    label?: string;
    error?: string;
  }

  let {
    label,
    value = $bindable(),
    error,
    class: className,
    ...rest
  }: Props = $props();
</script>

<div class="flex flex-col gap-1.5 w-full">
  {#if label}
    <label
      class="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1"
      for={rest.id}
    >
      {label}
    </label>
  {/if}

  <input
    {...rest}
    bind:value
    class={cn(
      "w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary/30 focus:shadow-[0_4px_20px_-4px_rgba(236,28,121,0.15)] transition-all duration-300 placeholder:text-slate-300 font-medium text-slate-800",
      error && "border-urgency/50 focus:border-urgency focus:shadow-urgency/10",
      className,
    )}
  />

  {#if error}
    <span class="text-xs font-bold text-urgency ml-1">{error}</span>
  {/if}
</div>
