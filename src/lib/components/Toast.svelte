<script lang="ts">
    import { toast } from "$lib/stores/toast";
    import { fly } from "svelte/transition";
    import { CheckCircle, AlertCircle, Info, X } from "lucide-svelte";

    // Subscribe to the store
    // In Svelte 5, we can use $toast directly if it's a store, or we might want to use $derived logic if it were a rune.
    // Since it's a store, $toast works.
</script>

<div
    class="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none"
>
    {#each $toast as t (t.id)}
        <div
            in:fly={{ y: -20, duration: 300 }}
            out:fly={{ y: -20, duration: 200 }}
            class="pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all
        {t.type === 'success'
                ? 'bg-surface/90 border-success/20 text-text-primary'
                : ''}
        {t.type === 'error'
                ? 'bg-surface/90 border-urgency/20 text-text-primary'
                : ''}
        {t.type === 'info'
                ? 'bg-surface/90 border-primary/20 text-text-primary'
                : ''}
        {t.type === 'warning'
                ? 'bg-surface/90 border-orange-500/20 text-text-primary'
                : ''}"
        >
            <div class="shrink-0">
                {#if t.type === "success"}
                    <CheckCircle class="text-success" size={20} />
                {:else if t.type === "error"}
                    <AlertCircle class="text-urgency" size={20} />
                {:else if t.type === "warning"}
                    <AlertCircle class="text-orange-500" size={20} />
                {:else}
                    <Info class="text-primary" size={20} />
                {/if}
            </div>

            <p class="text-sm font-bold flex-1">{t.message}</p>

            <button
                onclick={() => toast.remove(t.id)}
                class="text-text-muted hover:text-text-primary transition-colors"
            >
                <X size={16} />
            </button>
        </div>
    {/each}
</div>
