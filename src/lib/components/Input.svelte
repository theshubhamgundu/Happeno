<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { cn } from "$lib/utils";
  import { Eye, EyeOff } from "lucide-svelte";

  interface Props extends HTMLInputAttributes {
    label?: string;
    error?: string;
  }

  let {
    label,
    value = $bindable(),
    error,
    class: className,
    type = "text",
    ...rest
  }: Props = $props();

  let showPassword = $state(false);
  let inputType = $derived(type === "password" && showPassword ? "text" : type);
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

  <div class="relative">
    <input
      {...rest}
      type={inputType}
      bind:value
      class={cn(
        "w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-primary/30 focus:shadow-[0_4px_20px_-4px_rgba(236,28,121,0.15)] transition-all duration-300 placeholder:text-slate-300 font-medium text-slate-800",
        error &&
          "border-urgency/50 focus:border-urgency focus:shadow-urgency/10",
        type === "password" && "pr-12",
        className,
      )}
    />

    {#if type === "password"}
      <button
        type="button"
        onclick={() => (showPassword = !showPassword)}
        class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors focus:outline-none"
      >
        {#if showPassword}
          <EyeOff size={20} />
        {:else}
          <Eye size={20} />
        {/if}
      </button>
    {/if}
  </div>

  {#if error}
    <span class="text-xs font-bold text-urgency ml-1">{error}</span>
  {/if}
</div>
