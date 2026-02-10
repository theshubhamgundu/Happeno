<script lang="ts">
    import { 
        ChevronLeft, 
        UserPlus, 
        ShieldCheck, 
        Clock, 
        Trash2,
        ChefHat,
        UserCircle
    } from "lucide-svelte";
    import { fade, fly, scale } from "svelte/transition";

    interface StaffMember {
        id: string;
        name: string;
        role: 'Admin' | 'Chef' | 'Waiter';
        status: 'Online' | 'Offline';
        shiftStart: string;
    }

    let staff = $state<StaffMember[]>([
        { id: 'S1', name: 'Rahul Sharma', role: 'Admin', status: 'Online', shiftStart: '09:00 AM' },
        { id: 'S2', name: 'Priya Verma', role: 'Chef', status: 'Online', shiftStart: '10:30 AM' },
        { id: 'S3', name: 'Amit Singh', role: 'Waiter', status: 'Offline', shiftStart: '12:00 PM' }
    ]);

    onMount(() => {
        const saved = localStorage.getItem('happeno_staff');
        if (saved) staff = JSON.parse(saved);
    });

    $effect(() => {
        localStorage.setItem('happeno_staff', JSON.stringify($state.snapshot(staff)));
    });

    let showAddModal = $state(false);
    let newStaffName = $state("");
    let newStaffRole = $state<'Admin' | 'Chef' | 'Waiter'>('Waiter');

    function addStaff() {
        if (!newStaffName) return;
        staff.push({
            id: 'S' + (staff.length + 1),
            name: newStaffName,
            role: newStaffRole,
            status: 'Offline',
            shiftStart: '--'
        });
        showAddModal = false;
        newStaffName = "";
    }

    function removeStaff(id: string) {
        staff = staff.filter(s => s.id !== id);
    }
</script>

<div class="min-h-screen bg-[#FDFCFB] pb-32">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-xl border-b border-gray-100 p-6 sticky top-0 z-50">
        <div class="flex items-center gap-4">
            <a href="/merchant/dashboard" class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                <ChevronLeft size={20} />
            </a>
            <h1 class="text-xl font-black text-gray-900 uppercase tracking-tight">Staff Management</h1>
        </div>
    </header>

    <main class="p-6 space-y-8 max-w-4xl mx-auto">
        <!-- Summary Section -->
        <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
            {#each [
                { label: 'Total Staff', count: staff.length, color: 'text-gray-900' },
                { label: 'Online', count: staff.filter(s => s.status === 'Online').length, color: 'text-emerald-500' },
                { label: 'Admins', count: staff.filter(s => s.role === 'Admin').length, color: 'text-blue-500' },
                { label: 'Kitchen', count: staff.filter(s => s.role === 'Chef').length, color: 'text-orange-500' }
            ] as stat}
                <div class="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm text-center">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p class="text-2xl font-black {stat.color}">{stat.count}</p>
                </div>
            {/each}
        </section>

        <!-- Staff List -->
        <section class="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden">
            <div class="p-8 border-b border-gray-50 flex items-center justify-between">
                <div>
                    <h2 class="text-lg font-black text-gray-900 uppercase">Team Members</h2>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">Assign roles and permissions</p>
                </div>
                <button 
                    onclick={() => showAddModal = true}
                    class="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                    <UserPlus size={20} />
                </button>
            </div>

            <div class="divide-y divide-gray-50">
                {#each staff as member}
                    <div class="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                                {#if member.role === 'Chef'}<ChefHat size={24} />
                                {:else if member.role === 'Admin'}<ShieldCheck size={24} />
                                {:else}<UserCircle size={24} />{/if}
                            </div>
                            <div>
                                <h3 class="font-black text-gray-900">{member.name}</h3>
                                <div class="flex items-center gap-2">
                                    <span class="text-[10px] font-black uppercase text-primary bg-primary/5 px-2 py-0.5 rounded-full">{member.role}</span>
                                    <span class="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                        <Clock size={10} /> {member.shiftStart}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-6">
                            <div class="text-right">
                                <span class="block text-[10px] font-black uppercase {member.status === 'Online' ? 'text-emerald-500' : 'text-gray-300'}">
                                    {member.status}
                                </span>
                            </div>
                            <button onclick={() => removeStaff(member.id)} class="text-gray-200 hover:text-urgency transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        </section>
    </main>

    <!-- Add Staff Modal -->
    {#if showAddModal}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6" transition:fade>
            <div class="bg-white w-full max-w-sm rounded-[48px] p-10 shadow-2xl" in:scale>
                <h2 class="text-2xl font-black text-gray-900 mb-6">Add New Staff</h2>
                
                <div class="space-y-6">
                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                        <input bind:value={newStaffName} type="text" placeholder="Enter name" class="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-900 outline-none focus:ring-2 ring-primary/20" />
                    </div>

                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Department</label>
                        <div class="grid grid-cols-3 gap-2">
                            {#each ['Admin', 'Chef', 'Waiter'] as r}
                                <button 
                                    onclick={() => newStaffRole = r as any}
                                    class="py-3 rounded-xl text-[10px] font-black transition-all {newStaffRole === r ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}"
                                >{r}</button>
                            {/each}
                        </div>
                    </div>

                    <div class="flex gap-4 pt-4">
                        <button onclick={() => showAddModal = false} class="flex-1 py-4 font-bold text-gray-400">Cancel</button>
                        <button onclick={addStaff} class="flex-[2] bg-primary text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>
