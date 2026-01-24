<script lang="ts">
  import { onMount } from "svelte";
  import Logo from "$lib/components/Logo.svelte";
  import Input from "$lib/components/Input.svelte";
  import Button from "$lib/components/Button.svelte";
  import { supabase } from "$lib/supabase";
  import { goto } from "$app/navigation";

  let isLogin = $state(true);
  let email = $state("");
  let password = $state("");
  let name = $state("");
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
    if (!isLogin && !name) {
      error = "Please enter your name";
      return;
    }

    loading = true;
    error = "";

    // Simulate API call
    setTimeout(() => {
      loading = false;
      goto("/user/onboarding");
    }, 800);
  }

  function toggleMode() {
    isLogin = !isLogin;
    error = "";
    email = "";
    password = "";
    name = "";
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
      <Logo size={100} class="" />
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
      <div class="flex flex-col gap-6">
        <div class="text-center mb-2">
          <h2 class="text-xl font-bold text-text-primary">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h2>
          <p class="text-sm text-text-secondary">
            {isLogin
              ? "Enter your details to sign in"
              : "Sign up to get started"}
          </p>
        </div>

        {#if !isLogin}
          <Input
            label="Full Name"
            placeholder="John Doe"
            type="text"
            bind:value={name}
          />
        {/if}

        <Input
          label="Email Address"
          placeholder="user@example.com"
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

        <Button onclick={handleSubmit} {loading} class="w-full py-4 text-lg">
          {isLogin ? "Sign In" : "Sign Up"}
        </Button>

        <button
          onclick={() => {
            isLogin = true;
            email = "demo@happeno.com";
            password = "password123";
            handleSubmit();
          }}
          class="w-full py-3 text-sm font-bold text-primary hover:bg-primary/5 rounded-2xl border border-primary/20 transition-all"
        >
          Demo Login
        </button>

        <div class="text-center">
          <button
            onclick={toggleMode}
            class="text-sm text-text-muted hover:text-primary transition-colors cursor-pointer"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </div>

        <p
          class="text-[10px] text-center text-text-muted px-4 leading-relaxed mt-2"
        >
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  </div>
</div>
