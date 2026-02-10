<script lang="ts">
  import { fade, fly, scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { 
    Store, 
    MapPin, 
    Percent, 
    Bell, 
    Printer, 
    ChefHat, 
    ArrowRight, 
    ArrowLeft, 
    CheckCircle2, 
    Image as ImageIcon,
    Camera,
    Utensils,
    Clock,
    ShieldCheck,
    Coffee,
    Pizza,
    Wine,
    Heart
  } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import { profileStore } from "$lib/stores/merchant";
  import { appSettingsStore } from "$lib/stores/settings";
  import Button from "$lib/components/Button.svelte";
  import Input from "$lib/components/Input.svelte";
  import Logo from "$lib/components/Logo.svelte";

  let step = $state(1);
  let totalSteps = 5;

  // Onboarding State
  let businessData = $state({
    name: "",
    category: "",
    type: "both", // veg, non-veg, both
    phone: "",
    email: "",
    address: "",
    city: "",
    gstRate: 5,
    serviceCharge: 5,
    audioAlerts: true,
    autoBill: true,
    image: null as string | null
  });

  const categories = [
    { id: 'cafe', label: 'Cafe', icon: Coffee, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'fine_dine', label: 'Fine Dine', icon: Wine, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'fast_food', label: 'Fast Food', icon: Pizza, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'bakery', label: 'Bakery', icon: Utensils, color: 'text-amber-500', bg: 'bg-amber-50' }
  ];

  const types = [
    { id: 'veg', label: 'Pure Veg', color: 'text-emerald-500', border: 'border-emerald-200' },
    { id: 'non-veg', label: 'Non-Veg', color: 'text-rose-500', border: 'border-rose-200' },
    { id: 'both', label: 'Both', color: 'text-blue-500', border: 'border-blue-200' }
  ];

  async function nextStep() {
    if (step < totalSteps) {
      step++;
    } else {
      await completeOnboarding();
    }
  }

  function prevStep() {
    if (step > 1) step--;
  }

  async function completeOnboarding() {
    // 1. Update Profile Store
    profileStore.update(p => ({
      ...p,
      businessName: businessData.name,
      category: businessData.category || "Restaurant",
      type: businessData.type as any,
      phone: businessData.phone,
      email: businessData.email,
      street: businessData.address,
      city: businessData.city,
      approvalStatus: 'approved' // Auto-approve for demo
    }));

    // 2. Update Settings Store
    appSettingsStore.save({
      ...$appSettingsStore,
      restaurantName: businessData.name,
      contactPhone: businessData.phone,
      contactEmail: businessData.email,
      address: `${businessData.address}, ${businessData.city}`,
      gstRate: businessData.gstRate,
      serviceChargeRate: businessData.serviceCharge,
      soundAlerts: businessData.audioAlerts,
      autoPrintBill: businessData.autoBill
    });

    // 3. Animation and Redirect
    step = 6; // Success step
    setTimeout(() => {
      goto("/merchant/dashboard");
    }, 2500);
  }

  function handleImageUpload() {
    // Simulate image upload
    businessData.image = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80";
  }
</script>

<svelte:head>
  <title>Onboarding | Happeno Merchant</title>
</svelte:head>

<div class="min-h-screen bg-[#FDFCFB] flex flex-col font-sans selection:bg-primary/10">
  
  <!-- Navigation Header Style -->
  <header class="p-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-50 border-b border-gray-100/50">
    <div class="flex items-center gap-3">
        <Logo size={32} />
        <div class="h-4 w-px bg-gray-200"></div>
        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Partner Onboarding</span>
    </div>
    
    {#if step < 6}
        <div class="flex items-center gap-2">
            {#each Array(totalSteps) as _, i}
                <div class="h-1.5 rounded-full transition-all duration-500 {step > i ? 'w-6 bg-primary' : 'w-2 bg-gray-100'}"></div>
            {/each}
        </div>
    {/if}
  </header>

  <main class="flex-1 flex flex-col items-center justify-center p-6 max-w-xl mx-auto w-full">
    
    {#if step === 1}
      <div class="w-full space-y-8" in:fade={{ duration: 400 }}>
        <div class="text-center space-y-3">
            <div class="w-20 h-20 bg-primary/5 rounded-[32px] flex items-center justify-center mx-auto text-primary mb-6 animate-pulse">
                <Store size={40} />
            </div>
            <h1 class="text-4xl font-black text-gray-900 tracking-tighter leading-none">Welcome to the <br/><span class="text-primary italic">Future of Dining.</span></h1>
            <p class="text-gray-400 font-medium text-lg">Let's set up your digital storefront in <span class="text-gray-900 font-bold">2 minutes.</span></p>
        </div>

        <div class="bg-white p-8 rounded-[48px] border border-gray-100 shadow-2xl shadow-primary/5 space-y-6">
            <Input 
                label="What's your Business Name?" 
                placeholder="e.g. The Golden Platter" 
                bind:value={businessData.name}
                class="brand-input"
            />
            
            <div class="space-y-4">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Business Category</label>
                <div class="grid grid-cols-2 gap-4">
                    {#each categories as cat}
                        <button 
                            onclick={() => businessData.category = cat.label}
                            class="p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 {businessData.category === cat.label ? 'border-primary bg-primary/5' : 'border-gray-50 bg-white hover:border-gray-100'}"
                        >
                            <div class="w-10 h-10 {cat.bg} {cat.color} rounded-2xl flex items-center justify-center">
                                <cat.icon size={20} />
                            </div>
                            <span class="text-xs font-black text-gray-900">{cat.label}</span>
                        </button>
                    {/each}
                </div>
            </div>
        </div>

        <Button onclick={nextStep} class="w-full py-6 text-base shadow-xl shadow-primary/20" disabled={!businessData.name}>
            Begin Onboarding <ArrowRight size={20} class="ml-2" />
        </Button>
      </div>

    {:else if step === 2}
      <div class="w-full space-y-8" in:fly={{ y: 20, duration: 400 }}>
        <div class="space-y-2">
            <button onclick={prevStep} class="text-gray-400 hover:text-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors mb-6">
                <ArrowLeft size={14} /> Go Back
            </button>
            <h1 class="text-3xl font-black text-gray-900 tracking-tight">Your <span class="text-primary">Identity.</span></h1>
            <p class="text-gray-400 font-medium">How customers will recognize your brand.</p>
        </div>

        <div class="bg-white p-8 rounded-[48px] border border-gray-100 shadow-2xl shadow-primary/5 space-y-8">
            <!-- Cover Photo Simulation -->
            <div class="space-y-3">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Cover Photo</label>
                <button 
                    onclick={handleImageUpload}
                    class="w-full h-48 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 gap-2 hover:border-primary/30 hover:bg-primary/5 transition-all overflow-hidden relative group"
                >
                    {#if businessData.image}
                        <img src={businessData.image} alt="Preview" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span class="text-white text-xs font-black uppercase tracking-widest">Change Photo</span>
                        </div>
                    {:else}
                        <div class="p-4 bg-white rounded-2xl shadow-sm">
                            <Camera size={24} />
                        </div>
                        <span class="text-[10px] font-black uppercase tracking-widest">Upload Ambiance Photo</span>
                    {/if}
                </button>
            </div>

            <div class="grid grid-cols-1 gap-6">
                <Input label="Store Email" type="email" placeholder="hello@yourbusiness.com" bind:value={businessData.email} />
                <Input label="Business Phone" type="tel" placeholder="+91 00000 00000" bind:value={businessData.phone} />
            </div>
        </div>

        <Button onclick={nextStep} class="w-full py-6 text-base" disabled={!businessData.email || !businessData.phone}>
            Continue <ArrowRight size={20} class="ml-2" />
        </Button>
      </div>

    {:else if step === 3}
      <div class="w-full space-y-8" in:fly={{ y: 20, duration: 400 }}>
        <div class="space-y-2">
            <button onclick={prevStep} class="text-gray-400 hover:text-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors mb-6">
                <ArrowLeft size={14} /> Go Back
            </button>
            <h1 class="text-3xl font-black text-gray-900 tracking-tight">Sync <span class="text-primary">Location.</span></h1>
            <p class="text-gray-400 font-medium">Pin your restaurant on our hyperlocal map.</p>
        </div>

        <div class="bg-white p-8 rounded-[48px] border border-gray-100 shadow-2xl shadow-primary/5 space-y-8">
            <div class="w-full h-48 bg-blue-50 rounded-[40px] relative overflow-hidden border border-blue-100">
                <!-- Mock Map -->
                <div class="absolute inset-0 opacity-20 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=17.4483,78.3915&zoom=15&size=600x400')] bg-cover"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="relative">
                        <div class="w-12 h-12 bg-primary/20 rounded-full animate-ping absolute -inset-0"></div>
                        <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl shadow-primary/40 relative">
                            <MapPin size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-y-6">
                <Input label="Street Address" placeholder="Building, Area, Landmark" bind:value={businessData.address} />
                <Input label="City" placeholder="Hyderabad" bind:value={businessData.city} />
                
                <div class="space-y-4">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Specialization</label>
                    <div class="grid grid-cols-3 gap-3">
                        {#each types as t}
                            <button 
                                onclick={() => businessData.type = t.id}
                                class="py-3 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest {businessData.type === t.id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-gray-400 border-gray-50'}"
                            >
                                {t.label}
                            </button>
                        {/each}
                    </div>
                </div>
            </div>
        </div>

        <Button onclick={nextStep} class="w-full py-6 text-base" disabled={!businessData.address || !businessData.city}>
            Confirm Operations <ArrowRight size={20} class="ml-2" />
        </Button>
      </div>

    {:else if step === 4}
      <div class="w-full space-y-8" in:fly={{ y: 20, duration: 400 }}>
        <div class="space-y-2">
            <button onclick={prevStep} class="text-gray-400 hover:text-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors mb-6">
                <ArrowLeft size={14} /> Go Back
            </button>
            <h1 class="text-3xl font-black text-gray-900 tracking-tight">Revenue <span class="text-primary">Engine.</span></h1>
            <p class="text-gray-400 font-medium">Configure your taxes and service charges.</p>
        </div>

        <div class="bg-white p-8 rounded-[48px] border border-gray-100 shadow-2xl shadow-primary/5 space-y-10">
            <div class="grid grid-cols-2 gap-8 py-4">
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest">GST Rate</label>
                        <span class="text-lg font-black text-primary">{businessData.gstRate}%</span>
                    </div>
                    <input type="range" min="0" max="28" step="1" bind:value={businessData.gstRate} class="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary" />
                    <p class="text-[8px] font-bold text-gray-400 uppercase">Standard is 5% in INDIA</p>
                </div>
                
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Service Charge</label>
                        <span class="text-lg font-black text-gray-900">{businessData.serviceCharge}%</span>
                    </div>
                    <input type="range" min="0" max="15" step="1" bind:value={businessData.serviceCharge} class="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-gray-900" />
                    <p class="text-[8px] font-bold text-gray-400 uppercase">Optional industry avg: 5-10%</p>
                </div>
            </div>

            <div class="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100 flex items-start gap-4">
                <div class="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                    <ShieldCheck size={20} />
                </div>
                <div>
                    <h4 class="text-xs font-black text-emerald-900 uppercase tracking-widest mb-1">Tax-Ready System</h4>
                    <p class="text-[10px] font-bold text-emerald-700/60 leading-relaxed uppercase tracking-wide">Happeno automatically calculates GST and generates digital compliant invoices for your restaurant.</p>
                </div>
            </div>
        </div>

        <Button onclick={nextStep} class="w-full py-6 text-base">
            Configure Features <ArrowRight size={20} class="ml-2" />
        </Button>
      </div>

    {:else if step === 5}
      <div class="w-full space-y-8" in:fly={{ y: 20, duration: 400 }}>
        <div class="space-y-2">
            <button onclick={prevStep} class="text-gray-400 hover:text-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors mb-6">
                <ArrowLeft size={14} /> Go Back
            </button>
            <h1 class="text-3xl font-black text-gray-900 tracking-tight">Smart <span class="text-primary">Operations.</span></h1>
            <p class="text-gray-400 font-medium">Fine-tune your restaurant's digital behavior.</p>
        </div>

        <div class="bg-white p-8 rounded-[48px] border border-gray-100 shadow-2xl shadow-primary/5 space-y-2">
            <div class="flex items-center justify-between p-6 hover:bg-gray-50 rounded-[32px] transition-all">
                <div class="flex items-center gap-5">
                    <div class="w-12 h-12 bg-blue-50 text-blue-500 rounded-[24px] flex items-center justify-center shadow-inner">
                        <Bell size={22} />
                    </div>
                    <div>
                        <h4 class="font-black text-gray-900">Audio Notifications</h4>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alert staff on every new order</p>
                    </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" bind:checked={businessData.audioAlerts} class="sr-only peer">
                    <div class="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>

            <div class="flex items-center justify-between p-6 hover:bg-gray-50 rounded-[32px] transition-all">
                <div class="flex items-center gap-5">
                    <div class="w-12 h-12 bg-orange-50 text-orange-500 rounded-[24px] flex items-center justify-center shadow-inner">
                        <Printer size={22} />
                    </div>
                    <div>
                        <h4 class="font-black text-gray-900">Auto-Invoicing</h4>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Generate bill when order is served</p>
                    </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" bind:checked={businessData.autoBill} class="sr-only peer">
                    <div class="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>
            
            <div class="flex items-center justify-between p-6 hover:bg-gray-50 rounded-[32px] transition-all">
                <div class="flex items-center gap-5">
                    <div class="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-[24px] flex items-center justify-center shadow-inner">
                        <ChefHat size={22} />
                    </div>
                    <div>
                        <h4 class="font-black text-gray-900">Kitchen Display</h4>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enable KDS Terminal mode</p>
                    </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div class="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
            </div>
        </div>

        <Button onclick={nextStep} class="w-full py-6 text-base group">
            Complete Launch Sequence <ArrowRight size={20} class="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

    {:else if step === 6}
      <div class="w-full flex flex-col items-center justify-center space-y-10" in:scale={{ duration: 600, easing: quintOut }}>
        <div class="relative">
            <div class="w-32 h-32 bg-primary/10 rounded-[48px] flex items-center justify-center text-primary relative z-10">
                <CheckCircle2 size={64} />
            </div>
            <div class="absolute -inset-4 bg-primary/5 rounded-[60px] animate-ping"></div>
            <div class="absolute -inset-10 bg-primary/5 rounded-[80px] animate-pulse"></div>
        </div>

        <div class="text-center space-y-4">
            <h1 class="text-4xl font-black text-gray-900 tracking-tighter">Restaurant <span class="text-primary">Launched!</span></h1>
            <p class="text-gray-400 font-medium text-lg max-w-xs mx-auto">Your digital command center is being provisioned. Setting up your live operations...</p>
        </div>

        <div class="bg-gray-50 px-8 py-5 rounded-full flex items-center gap-4 border border-gray-100">
            <div class="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
            <div class="w-2 h-2 rounded-full bg-primary animate-bounce delay-150"></div>
            <div class="w-2 h-2 rounded-full bg-primary animate-bounce delay-300"></div>
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Redirecting to Dashboard</span>
        </div>
      </div>
    {/if}

  </main>

  <footer class="p-8 text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
    Powered by Happeno Intelligent Systems
  </footer>
</div>

<style>
    :global(body) {
        background-color: #FDFCFB;
    }

    .brand-input :global(input) {
        font-size: 1.25rem;
        padding: 1.5rem;
        border-radius: 1.5rem;
        font-weight: 800;
    }

    /* Custom range slider thumb */
    input[type=range]::-webkit-slider-thumb {
        height: 24px;
        width: 24px;
        border-radius: 12px;
        background: #ffffff;
        cursor: pointer;
        -webkit-appearance: none;
        border: 2px solid currentColor;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
</style>
