<script lang="ts">
  import Logo from "$lib/components/Logo.svelte";
  import Input from "$lib/components/Input.svelte";
  import Button from "$lib/components/Button.svelte";
  import { supabase } from "$lib/supabase";
  import { goto } from "$app/navigation";

  let isLogin = $state(true);
  let email = $state("");
  let password = $state("");
  let businessName = $state("");
  let loading = $state(false);
  let error = $state("");

  async function handleSubmit() {
    if (!email || !email.includes("@")) {
      error = "Please enter a valid email address";
      return;
    }
    if (!password || password.length < 6) {
      error = "Password must be at least 6 characters";
      return;
    }
    if (!isLogin && !businessName) {
      error = "Please enter your business name";
      return;
    }

    loading = true;
    error = "";

    // Simulate API call
    setTimeout(() => {
      loading = false;
      goto("/merchant/dashboard");
    }, 800);
  }

  function toggleMode() {
    isLogin = !isLogin;
    error = "";
    email = "";
    password = "";
    businessName = "";
  }
</script>

<div
  class="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-bg-app"
>
  <div class="w-full max-w-md flex flex-col gap-8">
    <div class="flex flex-col items-center gap-4 text-center">
      <Logo size={80} class="" />
      <div>
        <h1 class="text-4xl brand-text mb-1">Happeno Merchant</h1>
        <p class="text-text-muted font-medium">
          Broadcast your offers to nearby customers instantly.
        </p>
      </div>
    </div>

    <div
      class="bg-white p-8 rounded-[40px] border border-border-peach shadow-2xl shadow-primary/5"
    >
      <div class="flex flex-col gap-6">
        <div class="text-center mb-2">
          <h2 class="text-xl font-bold text-text-primary">
            {isLogin ? "Merchant Login" : "Partner with us"}
          </h2>
          <p class="text-sm text-text-secondary">
            {isLogin
              ? "Sign in to manage your offers"
              : "Create an account to start selling"}
          </p>
        </div>

        {#if !isLogin}
          <Input
            label="Business Name"
            placeholder="My Awesome Store"
            bind:value={businessName}
          />
        {/if}

        <Input
          label="Email Address"
          placeholder="merchant@business.com"
          type="email"
          bind:value={email}
        />
        <Input
          label="Password"
          placeholder="••••••••"
          type="password"
          bind:value={password}
          {error}
        />

        <Button onclick={handleSubmit} {loading} class="w-full">
          {isLogin ? "Merchant Login" : "Create Merchant Account"}
        </Button>

        <button
          onclick={() => {
            isLogin = true;
            email = "merchant@happeno.com";
            password = "password123";
            handleSubmit();
          }}
          class="w-full py-3 text-sm font-bold text-primary hover:bg-primary/5 rounded-2xl border border-primary/20 transition-all mt-2"
        >
          Demo Login
        </button>

        <div class="text-center">
          <button
            onclick={toggleMode}
            class="text-sm text-text-muted hover:text-primary transition-colors cursor-pointer"
          >
            {isLogin
              ? "New merchant? Register here"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
