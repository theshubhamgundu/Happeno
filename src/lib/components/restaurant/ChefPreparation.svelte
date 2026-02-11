<script lang="ts">
    import { onMount } from "svelte";
    import { fade, scale, fly } from "svelte/transition";
    import { backOut, cubicOut } from "svelte/easing";

    let { show = false, onClose = () => {} } = $props<{
        show: boolean;
        onClose?: () => void;
    }>();

    let playerEl: any = $state(null);
    let error = $state(false);

    // Manual control of the player for maximum reliability
    $effect(() => {
        if (show && playerEl) {
            const init = async () => {
                try {
                    // Give the browser a moment to register the component if it just appeared
                    if (!customElements.get("dotlottie-player")) {
                        await customElements.whenDefined("dotlottie-player");
                    }

                    // Set attributes manually - some players prefer this over properties
                    playerEl.setAttribute("src", "/animations/chef.lottie");
                    playerEl.setAttribute("background", "transparent");
                    playerEl.setAttribute("speed", "1");
                    playerEl.setAttribute("loop", "");
                    playerEl.setAttribute("autoplay", "");

                    // Also try the JS API if it exists
                    if (typeof playerEl.load === "function") {
                        playerEl.load("/animations/chef.lottie");
                    }
                } catch (e) {
                    console.error("Player initialization failed:", e);
                    error = true;
                }
            };
            init();
        }
    });
</script>

{#if show}
    <div
        class="fixed inset-0 z-[110] flex items-center justify-center p-6 overflow-hidden"
        transition:fade={{ duration: 400 }}
    >
        <!-- Premium Backdrop -->
        <div class="absolute inset-0 bg-white/95 backdrop-blur-3xl"></div>

        <div
            class="relative w-full max-w-sm flex flex-col items-center text-center"
        >
            <!-- Lottie Container -->
            <div
                class="w-80 h-80 mb-8 relative flex items-center justify-center"
                in:scale={{ start: 0.8, duration: 800, easing: backOut }}
            >
                <div
                    class="absolute inset-0 bg-primary/10 rounded-full blur-3xl opacity-30 scale-75"
                ></div>

                {#if !error}
                    <dotlottie-player
                        bind:this={playerEl}
                        class="relative z-10 w-full h-full"
                    ></dotlottie-player>
                {:else}
                    <!-- High Quality Static Fallback -->
                    <div class="text-8xl animate-pulse relative z-10">👨‍🍳</div>
                {/if}
            </div>

            <!-- Text Content -->
            <div
                class="space-y-4 px-4"
                in:fly={{ y: 30, duration: 800, delay: 200, easing: cubicOut }}
            >
                <div
                    class="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full"
                >
                    <span
                        class="w-1.5 h-1.5 bg-primary rounded-full animate-ping"
                    ></span>
                    <span
                        class="text-[10px] font-black text-primary uppercase tracking-widest"
                        >Kitchen is live</span
                    >
                </div>

                <h2
                    class="text-3xl font-black text-gray-900 tracking-tighter leading-tight"
                >
                    Hold tight!<br />Your food is preparing
                </h2>

                <p
                    class="text-gray-400 font-medium text-sm max-w-[240px] mx-auto"
                >
                    Our master chefs are crafting your meal with love and
                    precision.
                </p>
            </div>

            <div
                class="mt-12 w-full px-8"
                in:fly={{ y: 20, duration: 800, delay: 400, easing: cubicOut }}
            >
                <button
                    onclick={onClose}
                    class="w-full py-4 rounded-2xl bg-gray-900 text-white font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all text-center"
                >
                    View Status
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    dotlottie-player {
        display: block;
        width: 100%;
        height: 100%;
        margin: 0 auto;
    }
</style>
