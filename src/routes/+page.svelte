<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Logo from "$lib/components/Logo.svelte";
  import Button from "$lib/components/Button.svelte";

  let mounted = $state(false);
  let checkingSession = $state(true);

  onMount(() => {
    const saved = localStorage.getItem("userLocation");
    if (saved) {
      goto("/user/nearby");
    } else {
      checkingSession = false;
      mounted = true;
    }
  });
</script>

{#if !checkingSession}
<div
  class="relative min-h-screen w-full overflow-hidden bg-bg-app flex flex-col items-center justify-center p-6 text-center"
>
  <!-- Dynamic Background -->
  <div
    class="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
  >
    <!-- Pink Blob -->
    <div
      class="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-primary/30 rounded-full blur-3xl opacity-70 animate-float-slow mix-blend-multiply"
    ></div>
    <!-- Orange Blob -->
    <div
      class="absolute top-[20%] right-[-10%] w-[35rem] h-[35rem] bg-urgency/30 rounded-full blur-3xl opacity-70 animate-float-delayed mix-blend-multiply"
    ></div>
    <!-- Green/Blue Blob for fresh accent -->
    <div
      class="absolute bottom-[-10%] left-[20%] w-[45rem] h-[45rem] bg-success/10 rounded-full blur-3xl opacity-50 animate-pulse-slow mix-blend-multiply"
    ></div>
  </div>

  <!-- Content Container (Glass) -->
  <div
    class="relative z-10 flex flex-col items-center p-12 rounded-[3.5rem] border border-white/60 bg-white/40 backdrop-blur-xl shadow-[0_8px_40px_rgba(236,28,121,0.15)] transition-all duration-1000 transform {mounted
      ? 'translate-y-0 opacity-100'
      : 'translate-y-12 opacity-0'}"
  >
    <!-- Logo Area -->
    <div class="mb-8 relative">
      <div
        class="absolute inset-0 bg-white/60 rounded-full blur-2xl transform scale-125"
      ></div>
      <Logo
        size={140}
        class="relative transform hover:scale-105 transition-transform duration-500 hover:rotate-2"
      />
    </div>

    <!-- Typography -->
    <div class="space-y-4 mb-12 max-w-lg">
      <h1
        class="text-7xl brand-text font-black tracking-tighter drop-shadow-sm leading-[0.9]"
      >
        Happeno
      </h1>
      <p
        class="text-2xl font-heading font-medium text-text-secondary leading-relaxed"
      >
        The flash-deal engine for <span
          class="text-primary font-bold underline decoration-wavy decoration-from-font underline-offset-4"
          >everyone</span
        >.
      </p>
    </div>

    <!-- Action Buttons -->
    <div class="w-full max-w-xs flex flex-col gap-4">
      <Button
        onclick={() => goto("/user/login")}
        class="w-full py-6 text-xl font-bold shadow-xl shadow-primary/25 hover:shadow-primary/50 tracking-wide"
      >
        I want to Discover
      </Button>

      <Button
        onclick={() => goto("/merchant/login")}
        variant="outline"
        class="w-full py-6 text-xl font-bold border-2 bg-white/60 hover:bg-white/90 backdrop-blur-sm border-white/50 text-text-muted hover:text-primary"
      >
        I'm a Merchant
      </Button>
    </div>
  </div>

  <p
    class="mt-12 text-sm font-heading font-medium text-text-muted opacity-60 tracking-widest uppercase animate-pulse"
  >
    Your city is happening
  </p>
</div>
{/if}

<style>
  @keyframes float {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    33% {
      transform: translate(30px, -50px) rotate(10deg);
    }
    66% {
      transform: translate(-20px, 20px) rotate(-5deg);
    }
    100% {
      transform: translate(0, 0) rotate(0deg);
    }
  }

  .animate-float-slow {
    animation: float 20s infinite ease-in-out;
  }

  .animate-float-delayed {
    animation: float 25s infinite ease-in-out reverse;
    animation-delay: -5s;
  }

  .animate-pulse-slow {
    animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>
