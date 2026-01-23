<script lang="ts">
  import Logo from '$lib/components/Logo.svelte';
  import Input from '$lib/components/Input.svelte';
  import Button from '$lib/components/Button.svelte';
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';

  let phone = $state('');
  let otp = $state('');
  let step = $state('phone'); 
  let loading = $state(false);
  let error = $state('');

  async function handleSendOTP() {
    loading = true;
    error = '';
    setTimeout(() => {
      step = 'otp';
      loading = false;
    }, 800);
  }

  async function handleVerifyOTP() {
    loading = true;
    error = '';
    setTimeout(() => {
      loading = false;
      goto('/merchant/dashboard');
    }, 800);
  }
</script>

<div class="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-bg-app">
  <div class="w-full max-w-md flex flex-col gap-8">
    <div class="flex flex-col items-center gap-4 text-center">
      <Logo size={80} />
      <div>
        <h1 class="text-4xl brand-text mb-1">Happeno Merchant</h1>
        <p class="text-text-muted font-medium">Broadcast your offers to nearby customers instantly.</p>
      </div>
    </div>

    <div class="bg-white p-8 rounded-[40px] border border-border-peach shadow-2xl shadow-primary/5">
      {#if step === 'phone'}
        <div class="flex flex-col gap-6">
          <Input label="Phone Number" placeholder="88888 88888" bind:value={phone} error={error} />
          <Button onclick={handleSendOTP} {loading} class="w-full">
            Merchant Login
          </Button>
          <button 
            onclick={() => { phone = '8888888888'; handleSendOTP(); setTimeout(() => { otp = '123456'; handleVerifyOTP(); }, 1000); }} 
            class="w-full py-3 text-sm font-bold text-primary hover:bg-primary/5 rounded-2xl border border-primary/20 transition-all mt-2"
          >
            Demo Login
          </button>
        </div>
      {:else}
        <div class="flex flex-col gap-6">
          <Input label="OTP" placeholder="000 000" bind:value={otp} error={error} />
          <Button onclick={handleVerifyOTP} {loading} class="w-full">
            Verify Merchant
          </Button>
        </div>
      {/if}
    </div>
  </div>
</div>
