<script lang="ts">
  import { onMount } from 'svelte';
  import Logo from '$lib/components/Logo.svelte';
  import Input from '$lib/components/Input.svelte';
  import Button from '$lib/components/Button.svelte';
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';

  let phone = $state('');
  let otp = $state('');
  let step = $state<'phone' | 'otp'>('phone');
  let loading = $state(false);
  let error = $state('');

  async function handleSendOTP() {
    if (!phone || phone.length < 10) {
      error = 'Please enter a valid phone number';
      return;
    }
    
    loading = true;
    error = '';
    
    setTimeout(() => {
      step = 'otp';
      loading = false;
    }, 800);
  }

  async function handleVerifyOTP() {
    if (!otp || otp.length < 6) {
      error = 'Please enter the 6-digit OTP';
      return;
    }

    loading = true;
    error = '';

    setTimeout(() => {
      loading = false;
      goto('/onboarding');
    }, 800);
  }
</script>

<div class="min-h-screen bg-bg-app text-text-primary flex flex-col">
  <!-- Header -->
  <header class="px-6 pt-12 pb-8 text-center">
    <div class="flex items-center justify-center gap-3 mb-6">
      <Logo size={48} />
      <h1 class="text-3xl font-brand text-primary">Happeno</h1>
    </div>
    <p class="text-text-muted font-medium text-sm">
      Discover restaurants & offers near you
    </p>
  </header>

  <!-- Main Content -->
  <main class="flex-1 px-6 flex flex-col">
    {#if step === 'phone'}
      <div class="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div class="space-y-8">
          <div class="text-center">
            <h2 class="text-2xl font-black text-text-primary mb-2">Login or Sign up</h2>
            <p class="text-sm text-text-muted">Enter your phone number to continue</p>
          </div>

          <div class="space-y-4">
            <div class="flex items-center gap-3 p-4 bg-surface border border-border-dark rounded-2xl shadow-sm">
              <div class="flex items-center gap-2 pr-3 border-r border-border-dark">
                <span class="text-lg">🇮🇳</span>
                <span class="text-sm font-bold text-text-secondary">+91</span>
              </div>
              <input 
                bind:value={phone}
                type="tel"
                placeholder="Enter phone number"
                class="flex-1 bg-transparent outline-none text-lg font-bold placeholder:text-text-muted placeholder:font-normal"
              />
            </div>

            {#if error}
              <p class="text-sm text-urgency font-medium">{error}</p>
            {/if}

            <Button onclick={handleSendOTP} {loading} class="w-full py-4 text-base font-bold bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
              Continue
            </Button>

            <button 
              onclick={() => { phone = '9999900000'; handleSendOTP(); setTimeout(() => { otp = '123456'; handleVerifyOTP(); }, 1000); }} 
              class="w-full py-3 text-sm font-bold text-primary"
            >
              Skip to Demo →
            </button>

            <p class="text-[11px] text-center text-text-muted leading-relaxed">
              By continuing, you agree to our <span class="text-text-primary underline">Terms of Service</span> and <span class="text-text-primary underline">Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    {:else}
      <div class="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div class="space-y-8">
          <div class="text-center">
            <h2 class="text-2xl font-black text-text-primary mb-2">Verify your number</h2>
            <p class="text-sm text-text-muted">Enter the 6-digit code sent to +91 {phone}</p>
          </div>

          <div class="space-y-4">
            <input 
              bind:value={otp}
              type="number"
              placeholder="••••••"
              maxlength="6"
              class="w-full p-4 bg-surface border border-border-dark rounded-2xl text-center text-2xl font-black tracking-[8px] outline-none focus:border-primary transition-colors shadow-sm placeholder:text-text-muted"
            />

            {#if error}
              <p class="text-sm text-urgency font-medium text-center">{error}</p>
            {/if}

            <Button onclick={handleVerifyOTP} {loading} class="w-full py-4 text-base font-bold bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
              Verify & Continue
            </Button>

            <div class="flex items-center justify-center gap-4 text-sm">
              <button class="font-bold text-primary">Resend OTP</button>
              <span class="text-text-muted">•</span>
              <button onclick={() => step = 'phone'} class="font-bold text-text-muted">Change Number</button>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </main>

  <!-- Footer -->
  <footer class="px-6 py-8 text-center">
    <p class="text-xs text-text-muted">
      🏷️ Find exclusive offers from 500+ restaurants in Hyderabad
    </p>
  </footer>
</div>
