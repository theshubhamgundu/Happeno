<script lang="ts">
    import { appSettingsStore } from "$lib/stores/settings";
    import { profileStore } from "$lib/stores/merchant";
    import { 
        ChevronLeft, 
        Store, 
        Percent, 
        Phone, 
        Mail, 
        MapPin, 
        Bell, 
        Printer,
        Save,
        ShieldCheck
    } from "lucide-svelte";
    import { fade, fly } from "svelte/transition";
    import { onMount } from "svelte";

    let settings = $state({ ...$appSettingsStore });
    let isSaving = $state(false);
    let showSuccess = $state(false);

    onMount(() => {
        appSettingsStore.load();
        settings = { ...$appSettingsStore };
    });

    function handleSave() {
        isSaving = true;
        appSettingsStore.save(settings);
        
        // Sync with Profile Store
        profileStore.update(p => ({
            ...p,
            businessName: settings.restaurantName,
            street: settings.address.split(',')[0] || p.street,
            city: settings.address.split(',')[1]?.trim() || p.city
        }));

        setTimeout(() => {
            isSaving = false;
            showSuccess = true;
            setTimeout(() => showSuccess = false, 3000);
        }, 800);
    }
</script>

<div class="min-h-screen bg-[#FDFCFB] pb-32">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-xl border-b border-gray-100 p-6 sticky top-0 z-50 flex items-center justify-between">
        <div class="flex items-center gap-4">
            <a href="/merchant/dashboard" class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                <ChevronLeft size={20} />
            </a>
            <h1 class="text-xl font-black text-gray-900 uppercase tracking-tight">Configuration</h1>
        </div>
        <button 
            onclick={handleSave}
            disabled={isSaving}
            class="bg-primary text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
        >
            {#if isSaving}
                <div class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            {:else}
                <Save size={14} />
            {/if}
            Save Changes
        </button>
    </header>

    <main class="p-6 space-y-8 max-w-2xl mx-auto">
        {#if showSuccess}
            <div 
                class="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-3 shadow-xl"
                in:fly={{ y: -20 }}
                out:fade
            >
                <ShieldCheck size={20} />
                Settings updated successfully
            </div>
        {/if}

        <!-- Restaurant Identity -->
        <section class="space-y-4">
            <h2 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Business Identity</h2>
            <div class="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm space-y-6">
                <div class="space-y-2">
                    <label class="flex items-center gap-2 text-[10px] font-black text-gray-900 uppercase tracking-widest">
                        <Store size={12} class="text-primary" /> Store Name
                    </label>
                    <input bind:value={settings.restaurantName} class="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-900 outline-none focus:ring-2 ring-primary/20" />
                </div>
                <div class="space-y-2">
                    <label class="flex items-center gap-2 text-[10px] font-black text-gray-900 uppercase tracking-widest">
                        <MapPin size={12} class="text-primary" /> Full Address
                    </label>
                    <textarea bind:value={settings.address} class="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-900 outline-none focus:ring-2 ring-primary/20 h-24 resize-none"></textarea>
                </div>
            </div>
        </section>

        <!-- Financials -->
        <section class="space-y-4">
            <h2 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Financials & Taxes</h2>
            <div class="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm grid grid-cols-2 gap-6">
                <div class="space-y-2">
                    <label class="flex items-center gap-2 text-[10px] font-black text-gray-900 uppercase tracking-widest">
                        <Percent size={12} class="text-primary" /> GST Rate
                    </label>
                    <div class="relative">
                        <input type="number" bind:value={settings.gstRate} class="w-full bg-gray-50 border-none rounded-2xl p-4 pr-10 font-bold text-gray-900 outline-none focus:ring-2 ring-primary/20" />
                        <span class="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-300">%</span>
                    </div>
                </div>
                <div class="space-y-2">
                    <label class="flex items-center gap-2 text-[10px] font-black text-gray-900 uppercase tracking-widest">
                        <Percent size={12} class="text-primary" /> Service Charge
                    </label>
                    <div class="relative">
                        <input type="number" bind:value={settings.serviceChargeRate} class="w-full bg-gray-50 border-none rounded-2xl p-4 pr-10 font-bold text-gray-900 outline-none focus:ring-2 ring-primary/20" />
                        <span class="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-300">%</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- System Preferences -->
        <section class="space-y-4">
            <h2 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">System Preferences</h2>
            <div class="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm space-y-2">
                <div class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                            <Bell size={18} />
                        </div>
                        <div>
                            <p class="font-black text-gray-900 text-sm">Audio Notifications</p>
                            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alert staff on new orders</p>
                        </div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" bind:checked={settings.soundAlerts} class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>

                <div class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                            <Printer size={18} />
                        </div>
                        <div>
                            <p class="font-black text-gray-900 text-sm">Auto-generate Bill</p>
                            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enable digital invoicing</p>
                        </div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" bind:checked={settings.autoPrintBill} class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>
        </section>
    </main>
</div>
