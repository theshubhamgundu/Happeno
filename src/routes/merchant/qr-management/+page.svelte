<script lang="ts">
    import { qrService } from "$lib/services/qr";
    import { profileStore } from "$lib/stores/merchant";
    import { 
        ChevronLeft, 
        QrCode, 
        Download, 
        Plus, 
        Trash2, 
        Printer,
        LayoutGrid
    } from "lucide-svelte";
    import { fade, fly, scale } from "svelte/transition";
    import { onMount } from "svelte";

    let tableCount = $state(10);
    let selectedTable = $state("1");
    let currentQR = $state<string | null>(null);
    let generatedQRs = $state<Record<string, string>>({});
    let isGenerating = $state(false);

    async function generateAll() {
        isGenerating = true;
        const newQRs: Record<string, string> = {};
        for (let i = 1; i <= tableCount; i++) {
            const qr = await qrService.generateTableQR("1", i.toString());
            if (qr) newQRs[i.toString()] = qr;
        }
        generatedQRs = newQRs;
        isGenerating = false;
        if (generatedQRs[selectedTable]) {
            currentQR = generatedQRs[selectedTable];
        }
    }

    function downloadQR(table: string) {
        const link = document.createElement('a');
        link.download = `Table_${table}_QR.png`;
        link.href = generatedQRs[table];
        link.click();
    }

    onMount(() => {
        generateAll();
    });

    $effect(() => {
        if (generatedQRs[selectedTable]) {
            currentQR = generatedQRs[selectedTable];
        }
    });

</script>

<div class="min-h-screen bg-[#FDFCFB] pb-32">
    <!-- Premium Header -->
    <header class="bg-white/80 backdrop-blur-xl border-b border-gray-100 p-6 sticky top-0 z-50">
        <div class="flex items-center gap-4">
            <a href="/merchant/dashboard" class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                <ChevronLeft size={20} />
            </a>
            <h1 class="text-xl font-black text-gray-900 uppercase tracking-tight">QR Management</h1>
        </div>
    </header>

    <main class="p-6 space-y-8 max-w-4xl mx-auto">
        <!-- Configuration Card -->
        <section class="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/50" in:fly={{ y: 20 }}>
            <div class="flex items-center gap-4 mb-6">
                <div class="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <LayoutGrid size={24} />
                </div>
                <div>
                    <h2 class="text-lg font-black text-gray-900 uppercase">Restaurant Layout</h2>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">Configure your digital tables</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div class="space-y-2">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Number of Tables</label>
                    <div class="flex items-center gap-3">
                        <input 
                            type="number" 
                            bind:value={tableCount}
                            class="flex-1 bg-gray-50 border-none rounded-2xl p-4 font-black text-gray-900 outline-none focus:ring-2 ring-primary/20"
                        />
                        <button 
                            onclick={generateAll}
                            disabled={isGenerating}
                            class="bg-primary text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {isGenerating ? 'Syncing...' : 'Sync QR Codes'}
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- QR Display Grid -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Selector -->
            <div class="lg:col-span-1 space-y-3 max-h-[500px] overflow-y-auto no-scrollbar pr-2">
                {#each Array.from({ length: tableCount }, (_, i) => (i + 1).toString()) as table}
                    <button 
                        onclick={() => selectedTable = table}
                        class="w-full p-4 rounded-2xl border transition-all flex items-center justify-between {selectedTable === table ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}"
                    >
                        <span class="font-black">Table {table}</span>
                        {#if generatedQRs[table]}
                            <QrCode size={16} />
                        {/if}
                    </button>
                {/each}
            </div>

            <!-- Preview Card -->
            <div class="lg:col-span-2 bg-white rounded-[40px] p-10 border border-gray-100 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                {#if currentQR}
                    <div class="relative z-10" in:scale>
                        <div class="bg-white p-6 rounded-[32px] shadow-inner mb-6 border border-gray-50">
                            <img src={currentQR} alt="QR Code" class="w-64 h-64 grayscale group-hover:grayscale-0 transition-all" />
                        </div>
                        <h3 class="text-2xl font-black text-gray-900 mb-1">Table {selectedTable}</h3>
                        <p class="text-sm text-gray-400 font-bold uppercase tracking-[0.2em] mb-8">Scan to Order</p>
                        
                        <div class="flex gap-4">
                            <button 
                                onclick={() => downloadQR(selectedTable)}
                                class="flex-1 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                <Download size={16} /> Download
                            </button>
                            <button class="bg-primary/10 text-primary p-4 rounded-2xl">
                                <Printer size={20} />
                            </button>
                        </div>
                    </div>
                {:else}
                    <div class="text-gray-200 py-20 flex flex-col items-center">
                        <QrCode size={80} strokeWidth={1} />
                        <p class="mt-4 font-black uppercase tracking-widest text-xs">Generating Digital Identity...</p>
                    </div>
                {/if}

                <!-- Subtle Decorative Background -->
                <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50"></div>
            </div>
        </section>
    </main>
</div>

<style>
    .no-scrollbar::-webkit-scrollbar { display: none; }
</style>
