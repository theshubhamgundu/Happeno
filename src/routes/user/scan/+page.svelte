<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { goto } from "$app/navigation";
    import { fade, fly, scale } from "svelte/transition";
    import { cubicOut, backOut } from "svelte/easing";
    import {
        X,
        ScanLine,
        Flashlight,
        CheckCircle2,
        AlertCircle,
        History,
        Zap,
        Sparkles,
    } from "lucide-svelte";

    let videoElement: HTMLVideoElement;
    let canvasElement: HTMLCanvasElement;
    let stream: MediaStream | null = null;
    let scanning = $state(true);
    let flashOn = $state(false);
    let scanResult = $state<string | null>(null);
    let scanError = $state<string | null>(null);
    let cameraReady = $state(false);

    // Realistic Demo Data
    const quickDineSpots = [
        {
            id: "1",
            name: "The Spice Garden",
            table: "4",
            theme: "from-orange-500 to-rose-500",
        },
        {
            id: "2",
            name: "Biryani Blues",
            table: "12",
            theme: "from-blue-500 to-indigo-500",
        },
    ];

    onMount(async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
            });
            if (videoElement) {
                videoElement.srcObject = stream;
                await videoElement.play();
                cameraReady = true;
            }
        } catch (err) {
            console.error("Camera error:", err);
            scanError = "Camera access denied. Enable permissions in settings.";
        }
    });

    onDestroy(() => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
    });

    function simulateScan(spot: (typeof quickDineSpots)[0]) {
        scanning = false;
        // Vibration feedback simulation
        if (navigator.vibrate) navigator.vibrate(50);

        scanResult = `/user/restaurant/${spot.id}/order?table=${spot.table}`;

        setTimeout(() => {
            goto(scanResult!);
        }, 1200);
    }

    function toggleFlash() {
        if (stream) {
            const track = stream.getVideoTracks()[0];
            // @ts-ignore
            if (track.getCapabilities?.()?.torch) {
                // @ts-ignore
                track.applyConstraints({ advanced: [{ torch: !flashOn }] });
                flashOn = !flashOn;
            }
        }
    }
</script>

<div class="fixed inset-0 bg-black z-[100] flex flex-col font-sans">
    <!-- Scanner Window -->
    <div class="flex-1 relative overflow-hidden">
        <video
            bind:this={videoElement}
            class="absolute inset-0 w-full h-full object-cover opacity-80"
            playsinline
            muted
        ></video>

        <!-- Animated Scanner Frame -->
        <div class="absolute inset-0 flex items-center justify-center">
            <!-- Vignette -->
            <div
                class="absolute inset-0 bg-black/40 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]"
            ></div>

            <div class="relative w-80 h-80">
                <!-- Frame Corners -->
                <div
                    class="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary rounded-tl-3xl shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]"
                ></div>
                <div
                    class="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-3xl shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]"
                ></div>
                <div
                    class="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-3xl shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]"
                ></div>
                <div
                    class="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-3xl shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]"
                ></div>

                <!-- Laser Line -->
                <div
                    class="absolute left-6 right-6 h-0.5 bg-primary shadow-[0_0_15px_#FF2E7E] animate-scan z-10"
                ></div>

                <!-- Helper Text -->
                <div class="absolute -bottom-16 inset-x-0 text-center">
                    <p
                        class="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse"
                    >
                        Position QR in center
                    </p>
                </div>
            </div>
        </div>

        <!-- Feedback Overlays -->
        {#if scanResult}
            <div
                class="absolute inset-0 bg-emerald-500/10 backdrop-blur-md flex items-center justify-center z-50"
                transition:fade
            >
                <div
                    class="text-center"
                    in:scale={{ duration: 400, easing: backOut }}
                >
                    <div
                        class="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                    >
                        <CheckCircle2 size={48} class="text-white" />
                    </div>
                    <h3 class="text-white font-black text-2xl tracking-tighter">
                        TABLE DETECTED
                    </h3>
                    <p class="text-white/60 font-medium text-sm mt-1">
                        Syncing menu with table...
                    </p>
                </div>
            </div>
        {/if}

        <!-- Top Bar -->
        <div
            class="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50"
        >
            <button
                onclick={() => goto("/user/nearby")}
                class="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white"
            >
                <X size={24} />
            </button>
            <div
                class="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10"
            >
                <span
                    class="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                >
                    <div
                        class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
                    ></div>
                    Live Scanner
                </span>
            </div>
            <button
                onclick={toggleFlash}
                class="w-12 h-12 {flashOn
                    ? 'bg-yellow-500'
                    : 'bg-white/10'} backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white transition-all"
            >
                <Flashlight size={20} />
            </button>
        </div>
    </div>

    <!-- Bottom Actions Panel -->
    <div
        class="bg-white rounded-t-[48px] p-8 pb-12 relative z-10 -mt-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
    >
        <div
            class="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-100 rounded-full"
        ></div>

        <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-black text-gray-900 tracking-tight">
                Quick Scan
            </h2>
            <button
                class="flex items-center gap-2 text-[10px] font-black py-2 px-4 bg-gray-50 rounded-xl text-gray-400"
            >
                <History size={14} /> RECENT
            </button>
        </div>

        <div class="space-y-4">
            <div
                class="p-6 bg-[#FDF0F6] rounded-[32px] border border-primary/5 flex items-center gap-5 relative overflow-hidden group"
            >
                <div
                    class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full translate-x-16 -translate-y-16"
                ></div>
                <div
                    class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 shrink-0"
                >
                    <ScanLine size={32} />
                </div>
                <div>
                    <h4 class="text-sm font-black text-gray-900 uppercase">
                        Automated Ordering
                    </h4>
                    <p
                        class="text-[10px] font-bold text-gray-400 mt-0.5 leading-relaxed tracking-wide"
                    >
                        Point at the table sticker to start your dining
                        experience instantly.
                    </p>
                </div>
            </div>

            <!-- Demo Spots -->
            <div class="grid grid-cols-2 gap-3 mt-8">
                {#each quickDineSpots as spot}
                    <button
                        onclick={() => simulateScan(spot)}
                        class="p-5 bg-gray-50 rounded-[24px] border border-gray-100 text-left hover:bg-white hover:shadow-xl hover:border-gray-200 transition-all active:scale-[0.97]"
                    >
                        <div
                            class="flex items-center justify-between mb-3 text-gray-400"
                        >
                            <Zap size={18} />
                            <span
                                class="text-[10px] font-black px-2 py-0.5 bg-white rounded-lg border border-gray-100"
                                >TABLE {spot.table}</span
                            >
                        </div>
                        <h5
                            class="text-xs font-black text-gray-900 uppercase tracking-tight line-clamp-1"
                        >
                            {spot.name}
                        </h5>
                    </button>
                {/each}
            </div>
        </div>

        <button
            class="w-full mt-8 py-5 flex items-center justify-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 rounded-2xl border border-primary/10"
        >
            <Sparkles size={16} /> Troubleshoot Scan
        </button>
    </div>
</div>

<style>
    @keyframes scan {
        0% {
            top: 10%;
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            top: 90%;
            opacity: 0;
        }
    }
    .animate-scan {
        animation: scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
</style>
