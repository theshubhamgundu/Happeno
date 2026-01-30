<script lang="ts">
    import {
        MapPin,
        User,
        LayoutDashboard,
        History,
        Wallet,
        Zap,
        Store,
        ArrowLeft,
        Crown,
    } from "lucide-svelte";
    import { profileStore } from "$lib/stores/merchant";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    let { active = "Dashboard" } = $props();

    const tabs = [
        {
            label: "Dashboard",
            path: "/merchant/dashboard",
            icon: LayoutDashboard,
        },
        { label: "History", path: "/merchant/history", icon: History },
        { label: "Wallet", path: "/merchant/wallet", icon: Wallet },
    ];
</script>

<header
    class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)] transition-all"
>
    <!-- Left: Back + Logo + Brand -->
    <div class="flex items-center gap-2">
        {#if active !== "Dashboard"}
            <button
                onclick={() => goto("/merchant/dashboard")}
                class="p-2 -ml-2 mr-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-colors"
                aria-label="Go Back"
            >
                <ArrowLeft size={22} />
            </button>
        {/if}

        <button
            onclick={() => goto("/merchant/dashboard")}
            class="flex items-center gap-3 group text-left"
        >
            <!-- Animated Logo Icon (Pin Shape) with Particles -->
            <div
                class="relative group-hover:scale-110 transition-transform duration-300 mr-1"
            >
                <div
                    class="w-10 h-10 bg-gradient-to-br from-[#FF2E7E] to-[#BE1558] rounded-full rounded-br-none rotate-45 shadow-lg flex items-center justify-center animate-float border border-white/20 relative overflow-hidden ring-1 ring-black/5"
                >
                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"
                    ></div>

                    <!-- Content (Un-rotated relative to pin) -->
                    <div
                        class="-rotate-45 flex items-center justify-center relative w-full h-full"
                    >
                        <Zap
                            size={20}
                            class="relative z-10 text-[#FFD700] fill-[#FFD700] drop-shadow-md pb-0.5 pl-0.5"
                        />

                        <!-- Radiating Particles (Sparks) -->
                        <div class="absolute inset-0 z-0">
                            <!-- Left Sparks -->
                            <div
                                class="absolute left-1.5 top-3 w-0.5 h-1 bg-white rounded-full -rotate-45 opacity-80 animate-pulse"
                            ></div>
                            <div
                                class="absolute left-0.5 top-5 w-0.5 h-1 bg-white rounded-full rotate-90 opacity-60"
                            ></div>

                            <!-- Right Sparks -->
                            <div
                                class="absolute right-2 top-3 w-0.5 h-1 bg-white rounded-full rotate-45 opacity-80 animate-pulse delay-75"
                            ></div>
                            <div
                                class="absolute right-1 top-5 w-0.5 h-1 bg-white rounded-full -rotate-90 opacity-60"
                            ></div>

                            <!-- Star/Shine -->
                            <div
                                class="absolute top-2 left-2 w-1 h-1 bg-yellow-100 rounded-full animate-ping opacity-90"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="{active === 'Dashboard'
                    ? 'flex'
                    : 'hidden sm:flex'} flex-col items-start leading-none"
            >
                <h1
                    class="text-2xl font-black text-black tracking-tighter group-hover:text-[#FF2E7E] transition-colors"
                >
                    happeno
                </h1>
                <span
                    class="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase group-hover:text-black transition-colors"
                    >MERCHANT</span
                >
            </div>
        </button>
    </div>

    <!-- Center: Tabs (Desktop) -->
    <!-- Large, Wide, Centered -->
    <nav
        class="hidden lg:flex items-center gap-2 bg-gray-50 p-2 rounded-full border border-gray-100 shadow-inner px-4 absolute left-1/2 -translate-x-1/2"
    >
        {#each tabs as tab}
            <button
                onclick={() => goto(tab.path)}
                class="px-8 py-3 rounded-full text-base font-bold tracking-wide transition-all duration-300 {active ===
                tab.label
                    ? 'bg-white text-[#FF2E7E] shadow-sm scale-105'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'}"
            >
                {tab.label}
            </button>
        {/each}
    </nav>

    <!-- Right: Restaurant Info & Profile & Mobile Nav -->
    <div class="flex items-center gap-2 sm:gap-6">
        <!-- Restaurant Info (Right Side - Left Aligned Text) -->
        <button
            class="hidden sm:flex flex-col items-start text-left group/loc mr-2"
        >
            <h2
                class="text-lg font-bold text-gray-900 leading-tight group-hover/loc:text-[#FF2E7E] transition-colors flex items-center gap-2"
            >
                {$profileStore.businessName || "Paradise Biryani"}
                <span
                    class="bg-green-100 text-green-700 text-[9px] px-1.5 py-[1px] rounded-full font-extrabold tracking-wider uppercase border border-green-200"
                    >Open</span
                >
            </h2>

            <div
                class="flex items-center gap-1 text-xs text-gray-500 font-medium mt-0.5"
            >
                <MapPin size={12} class="text-gray-400" />
                <span
                    class="truncate max-w-[200px] opacity-80 group-hover/loc:opacity-100 transition-opacity"
                >
                    {$profileStore.street || "Location"}, {$profileStore.city ||
                        "City"}
                </span>
            </div>
        </button>

        <!-- Mobile Icons (On Right for Layout Balance) -->
        <nav
            class="flex lg:hidden items-center gap-1 pr-2 border-r border-gray-200 mr-2"
        >
            {#each tabs as tab}
                <button
                    onclick={() => goto(tab.path)}
                    class="p-2.5 rounded-full transition-all duration-300 {active ===
                    tab.label
                        ? 'bg-[#FF2E7E]/10 text-[#FF2E7E]'
                        : 'text-gray-400 hover:text-gray-600'}"
                    aria-label={tab.label}
                >
                    <tab.icon size={22} />
                </button>
            {/each}
        </nav>

        <!-- Profile Pic -->
        <button
            onclick={() => goto("/merchant/profile")}
            class="w-10 h-10 sm:w-12 sm:h-12 border-2 shadow-md cursor-pointer transition-all relative group shrink-0 rounded-full {$profileStore.isPremium
                ? 'border-amber-400 ring-2 ring-amber-100 shadow-amber-200'
                : 'border-white hover:border-[#FF2E7E]'}"
        >
            <div class="w-full h-full rounded-full overflow-hidden">
                {#if $profileStore.image}
                    <img
                        src={$profileStore.image}
                        alt="Profile"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                {:else}
                    <div
                        class="w-full h-full bg-gray-100 flex items-center justify-center"
                    >
                        <User size={24} class="text-gray-400" />
                    </div>
                {/if}
            </div>

            {#if $profileStore.isPremium}
                <div
                    class="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-amber-300 to-amber-500 text-white rounded-full p-1 border-2 border-white shadow-sm z-10"
                >
                    <Crown size={10} fill="white" />
                </div>
            {:else}
                <!-- Online Dot -->
                <div
                    class="absolute bottom-0 right-0 translated-x-1/4 translated-y-1/4 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full z-10"
                ></div>
            {/if}
        </button>
    </div>
</header>

<style>
    @keyframes float {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-2px);
        }
    }
    .animate-float {
        animation: float 3s ease-in-out infinite;
    }
</style>
