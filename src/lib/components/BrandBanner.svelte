<script lang="ts">
    import { Zap, MapPin } from "lucide-svelte";
    import { fly, scale } from "svelte/transition";
    import { elasticOut, cubicOut } from "svelte/easing";
</script>

<div
    class="flex flex-col items-center justify-center py-8 gap-4 text-center select-none"
    in:fly={{ y: -20, duration: 800, easing: cubicOut }}
>
    <!-- Animated Logo -->
    <div class="relative group cursor-default">
        <!-- Glow behind -->
        <div
            class="absolute inset-0 bg-[#FF2E7E] blur-[20px] opacity-20 rounded-full group-hover:opacity-40 transition-opacity duration-500"
        ></div>

        <!-- Pin Shape Container -->
        <div
            class="relative w-24 h-24 bg-gradient-to-br from-[#FF2E7E] to-[#BE1558] rounded-[32px] shadow-[0_10px_30px_-10px_rgba(255,46,126,0.4)] flex items-center justify-center transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        >
            <!-- Inner Ring/Glow -->
            <div
                class="absolute inset-2 border-2 border-white/20 rounded-[26px]"
            ></div>

            <!-- Lightning Bolt -->
            <div class="relative animate-float">
                <Zap
                    size={48}
                    class="text-[#FFD700] fill-[#FFD700] drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                    strokeWidth={2.5}
                />
                <!-- Sparkles -->
                <div
                    class="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full animate-ping opacity-75"
                ></div>
                <div
                    class="absolute top-1 right-0 w-1.5 h-1.5 bg-yellow-200 rounded-full"
                ></div>
            </div>
        </div>
    </div>

    <!-- Brand Text -->
    <div class="flex flex-col items-center w-full">
        <h1
            class="text-5xl font-[900] text-[#FF2E7E] tracking-tight leading-none drop-shadow-sm"
            in:scale={{
                duration: 600,
                delay: 200,
                start: 0.9,
                easing: elasticOut,
            }}
        >
            Happeno
        </h1>

        <p
            class="text-lg font-bold text-text-primary mt-2 flex items-center gap-1.5 flex-wrap justify-center px-4"
            in:fly={{ y: 10, duration: 600, delay: 400, easing: cubicOut }}
        >
            The flash-deal engine for
            <span class="relative inline-block group">
                <span class="relative z-10 text-[#FF2E7E]">everyone</span>
                <!-- Weird wavy underline animation -->
                <svg
                    class="absolute -bottom-1 left-0 w-full h-1.5"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0 5 Q 5 0, 10 5 T 20 5 T 30 5 T 40 5 T 50 5 T 60 5 T 70 5 T 80 5 T 90 5 T 100 5"
                        fill="none"
                        stroke="#FF2E7E"
                        stroke-width="2"
                        class="animate-wiggle"
                    />
                </svg>
            </span>
            <span class="text-[#FF2E7E] font-black">.</span>
        </p>
    </div>
</div>

<style>
    @keyframes float {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-3px);
        }
    }
    .animate-float {
        animation: float 3s ease-in-out infinite;
    }

    /* Simple Wiggle Keyframe for SVG path if possible, or just use CSS text decoration in fallback */
    @keyframes wiggle {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-5px);
        } /* Simulate wave moving? Hard with path. */
    }
</style>
