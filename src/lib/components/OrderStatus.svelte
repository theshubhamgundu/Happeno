<script lang="ts">
    import { fly } from "svelte/transition";
    import { Clock, CheckCircle2 } from "lucide-svelte";
    import { cn } from "$lib/utils";

    let { status, waitingTime = 15 } = $props<{
        status: "idle" | "placing" | "confirmed" | "preparing" | "ready";
        waitingTime?: number;
    }>();

    const getStatusText = (s: string) => {
        switch (s) {
            case "confirmed":
                return "Order Confirmed!";
            case "preparing":
                return "Chef is cooking...";
            case "ready":
                return "Order is Ready!";
            default:
                return "";
        }
    };

    const getStatusSubtext = (s: string) => {
        switch (s) {
            case "preparing":
                return `Preparing • ${waitingTime} mins left`;
            default:
                return "Freshly prepared for you";
        }
    };

    const progressWidth = $derived(
        status === "confirmed"
            ? "20%"
            : status === "preparing"
              ? "65%"
              : "100%",
    );
</script>

{#if status !== "idle"}
    <div
        in:fly={{ y: 50, duration: 500 }}
        class="fixed bottom-24 left-4 right-4 bg-white rounded-[32px] p-5 shadow-2xl border border-gray-100 z-[60]"
    >
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
                <div
                    class="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 relative overflow-hidden"
                >
                    {#if status === "confirmed" || status === "preparing"}
                        <div
                            class="absolute inset-0 bg-emerald-500/10 animate-pulse"
                        ></div>
                        <Clock size={24} class="relative" />
                    {:else if status === "ready"}
                        <CheckCircle2 size={24} class="relative" />
                    {/if}
                </div>
                <div>
                    <h4 class="font-black text-gray-900 text-sm">
                        {getStatusText(status)}
                    </h4>
                    <p
                        class="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-0.5"
                    >
                        {getStatusSubtext(status)}
                    </p>
                </div>
            </div>
            {#if status === "ready"}
                <span
                    class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black animate-bounce"
                >
                    NOTIFIED
                </span>
            {/if}
        </div>

        <!-- Progress Bar -->
        <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
                class="h-full bg-emerald-500 transition-all duration-1000"
                style="width: {progressWidth}"
            ></div>
        </div>
    </div>
{/if}
