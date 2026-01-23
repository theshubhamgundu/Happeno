<script lang="ts">
  import { onMount } from "svelte";
  import Logo from "$lib/components/Logo.svelte";
  import Input from "$lib/components/Input.svelte";
  import Button from "$lib/components/Button.svelte";
  import { supabase } from "$lib/supabase";
  import { goto } from "$app/navigation";

  let phone = $state("");
  let otp = $state("");
  let step = $state("phone"); // phone or otp
  let loading = $state(false);
  let error = $state("");

  async function handleSendOTP() {
    if (!phone || phone.length < 10) {
      error = "Please enter a valid phone number";
      return;
    }

    loading = true;
    error = "";

    // Simulate API call
    setTimeout(() => {
      step = "otp";
      loading = false;
    }, 800);
  }

  async function handleVerifyOTP() {
    if (!otp || otp.length < 6) {
      error = "Please enter the 6-digit OTP";
      return;
    }

    loading = true;
    error = "";

    // Simulate Verification
    setTimeout(() => {
      loading = false;
      goto("/user/onboarding");
    }, 800);
  }
</script>

<div
  class="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden bg-bg-app"
>
  <!-- Background Accents -->
  <div
    class="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl"
  ></div>
  <div
    class="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-urgency/5 rounded-full blur-3xl"
  ></div>

  <div class="w-full max-w-md flex flex-col items-center gap-8 relative z-10">
    <div class="flex flex-col items-center gap-4 text-center">
      <Logo size={100} />
      <div>
        <h1 class="text-5xl brand-text mb-2">Happeno</h1>
        <p class="text-text-muted font-medium px-4">
          Instant deals for instant thrills. Discover what's live around you.
        </p>
      </div>
    </div>

    <div
      class="w-full bg-white/50 backdrop-blur-xl p-8 rounded-[40px] border border-border-peach card-shadow"
    >
      {#if step === "phone"}
        <div class="flex flex-col gap-6">
          <div class="text-center mb-2">
            <h2 class="text-xl font-bold text-text-primary">Welcome!</h2>
            <p class="text-sm text-text-secondary">
              Enter your phone number to get started
            </p>
          </div>

          <div class="relative">
            <span
              class="absolute left-5 top-[52px] -translate-y-1/2 text-text-muted font-semibold"
              >+91</span
            >
            <Input
              label="Phone Number"
              placeholder="00000 00000"
              type="tel"
              bind:value={phone}
              {error}
              class="pl-14"
            />
          </div>

          <Button onclick={handleSendOTP} {loading} class="w-full py-4 text-lg">
            Send OTP
          </Button>

          <button
            onclick={() => {
              phone = "9999900000";
              handleSendOTP();
              setTimeout(() => {
                otp = "123456";
                handleVerifyOTP();
              }, 1000);
            }}
            class="w-full py-3 text-sm font-bold text-primary hover:bg-primary/5 rounded-2xl border border-primary/20 transition-all"
          >
            Demo Login (Skip OTP)
          </button>

          <p
            class="text-[10px] text-center text-text-muted px-4 leading-relaxed"
          >
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      {:else}
        <div class="flex flex-col gap-6">
          <div class="text-center mb-2">
            <h2 class="text-xl font-bold text-text-primary">Verify OTP</h2>
            <p class="text-sm text-text-secondary">
              We sent a 6-digit code to +91 {phone}
            </p>
          </div>

          <Input
            label="OTP Code"
            placeholder="000000"
            type="number"
            maxlength="6"
            bind:value={otp}
            {error}
            class="text-center text-2xl tracking-[0.5em] font-bold"
          />

          <Button
            onclick={handleVerifyOTP}
            {loading}
            class="w-full py-4 text-lg"
          >
            Verify & Continue
          </Button>

          <button
            onclick={() => (step = "phone")}
            class="text-sm font-semibold text-primary hover:text-primary-dark transition-colors self-center"
          >
            Change Phone Number
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>
