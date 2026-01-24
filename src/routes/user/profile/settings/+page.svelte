<script lang="ts">
  import BottomNav from '$lib/components/BottomNav.svelte';
  import { ChevronLeft, Bell, Shield, Eye, Lock, Globe, Trash2, ChevronRight, Moon, Sun } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  let notifications = $state(true);
  let darkMode = $state(false);
  let biometric = $state(true);

  const settingSections = [
    {
      title: 'Preferences',
      items: [
        { id: 'notif', name: 'Push Notifications', icon: Bell, type: 'toggle', value: notifications, setter: (v: boolean) => notifications = v },
        { id: 'dark', name: 'Dark Mode', icon: Moon, type: 'toggle', value: darkMode, setter: (v: boolean) => darkMode = v },
        { id: 'lang', name: 'App Language', icon: Globe, type: 'link', value: 'English (US)' },
      ]
    },
    {
      title: 'Security',
      items: [
        { id: 'bio', name: 'Biometric Login', icon: Shield, type: 'toggle', value: biometric, setter: (v: boolean) => biometric = v },
        { id: 'pw', name: 'Change Password', icon: Lock, type: 'link' },
        { id: 'privacy', name: 'Privacy Policy', icon: Eye, type: 'link' },
      ]
    },
    {
      title: 'Account',
      items: [
        { id: 'delete', name: 'Delete Account', icon: Trash2, type: 'danger' },
      ]
    }
  ];
</script>

<div class="min-h-screen bg-bg-app pb-32 text-text-primary">
  <!-- Header -->
  <header class="px-6 pt-12 pb-6 sticky top-0 bg-bg-app/95 backdrop-blur-xl z-20 flex items-center gap-4 border-b border-border-dark/50">
    <button onclick={() => history.back()} class="p-2 -ml-2">
      <ChevronLeft size={24} />
    </button>
    <h1 class="text-xl font-black">Settings</h1>
  </header>

  <main class="px-6 space-y-8 pt-6">
    {#each settingSections as section}
      <section>
        <h2 class="text-xs font-bold text-text-muted uppercase mb-4 px-1">{section.title}</h2>
        <div class="bg-surface border border-border-dark rounded-[24px] overflow-hidden shadow-sm">
          {#each section.items as item, i}
            <div class={cn(
              "flex items-center justify-between p-5",
              i !== section.items.length - 1 && "border-b border-border-dark"
            )}>
              <div class="flex items-center gap-4">
                <div class={cn(
                  "p-2.5 rounded-xl",
                  item.type === 'danger' ? "bg-urgency/10 text-urgency" : "bg-bg-app text-text-muted"
                )}>
                  <item.icon size={20} strokeWidth={1.5} />
                </div>
                <span class={cn("text-sm font-bold", item.type === 'danger' && "text-urgency")}>{item.name}</span>
              </div>

              {#if item.type === 'toggle'}
                <button 
                  onclick={() => item.setter && item.setter(!item.value)}
                  class={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    item.value ? "bg-primary" : "bg-border-dark"
                  )}
                >
                  <div class={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    item.value ? "right-1" : "left-1"
                  )}></div>
                </button>
              {:else if item.type === 'link'}
                <div class="flex items-center gap-2">
                  {#if item.value}
                    <span class="text-xs text-text-muted font-medium">{item.value}</span>
                  {/if}
                  <ChevronRight size={18} class="text-text-muted" />
                </div>
              {:else if item.type === 'danger'}
                <ChevronRight size={18} class="text-text-muted" />
              {/if}
            </div>
          {/each}
        </div>
      </section>
    {/each}

    <!-- Version Info -->
    <div class="text-center space-y-1">
      <p class="text-[10px] text-text-muted font-bold uppercase tracking-widest">Happeno Desktop Client</p>
      <p class="text-[10px] text-text-muted font-medium">Build 2024.1.24 • ARM64</p>
    </div>
  </main>
</div>

<BottomNav />
