<script lang="ts">
  import { cn } from "$lib/utils";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props extends HTMLButtonAttributes {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    children: any;
  }

  let {
    variant = "primary",
    size = "md",
    loading = false,
    children,
    class: className,
    ...rest
  }: Props = $props();

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]",
    secondary:
      "bg-surface text-primary border-2 border-primary hover:bg-highlight transition-all",
    outline:
      "bg-transparent border-2 border-border-peach text-text-primary hover:border-primary transition-all",
    ghost:
      "bg-transparent text-text-muted hover:text-primary transition-colors",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-xl",
    md: "px-6 py-3 text-base rounded-2xl font-semibold",
    lg: "px-8 py-4 text-lg rounded-[22px] font-bold",
  };
</script>

<button
  class={cn(
    "relative inline-flex items-center justify-center overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed",
    variants[variant],
    sizes[size],
    className,
  )}
  disabled={loading || rest.disabled}
  {...rest}
>
  {#if loading}
    <div class="absolute inset-0 flex items-center justify-center bg-inherit">
      <div
        class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
      ></div>
    </div>
    <span class="opacity-0">{@render children()}</span>
  {:else}
    {@render children()}
  {/if}
</button>
