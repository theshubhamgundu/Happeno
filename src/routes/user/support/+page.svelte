<script lang="ts">
  import BottomNav from '$lib/components/BottomNav.svelte';
  import { ChevronLeft, MessageCircle, Phone, Mail, HelpCircle, ChevronRight, Search } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  const faqs = [
    { question: 'How do I redeem an offer?', answer: 'Simply show the offer code at the restaurant during checkout.' },
    { question: 'Can I cancel my membership?', answer: 'Yes, you can manage your membership in the settings section.' },
    { question: 'What payment methods are supported?', answer: 'We support all major credit cards, UPI, and net banking.' },
    { question: 'Is Happeno available in other cities?', answer: 'Currently we are only in Hyderabad, but stay tuned!' },
  ];
</script>

<div class="min-h-screen bg-bg-app pb-32 text-text-primary">
  <!-- Header -->
  <header class="px-6 pt-12 pb-6 sticky top-0 bg-bg-app/95 backdrop-blur-xl z-20 flex items-center gap-4 border-b border-border-dark/50">
    <button onclick={() => history.back()} class="p-2 -ml-2">
      <ChevronLeft size={24} />
    </button>
    <h1 class="text-xl font-black">Help & Support</h1>
  </header>

  <main class="main-container px-6 space-y-8 pt-6">
    <!-- Search Support -->
    <div class="relative">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
      <input 
        type="text" 
        placeholder="Search for help..." 
        class="w-full pl-12 pr-4 py-4 bg-surface border border-border-dark rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
      />
    </div>

    <!-- Contact Cards -->
    <section class="grid grid-cols-2 gap-4">
      <button class="bg-surface border border-border-dark rounded-[24px] p-5 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-all active:scale-95 text-center">
        <div class="p-3 bg-secondary/10 text-secondary rounded-2xl">
          <MessageCircle size={24} />
        </div>
        <div>
          <h3 class="font-bold text-sm">Live Chat</h3>
          <p class="text-[10px] text-text-muted mt-0.5">Response in 5m</p>
        </div>
      </button>
      <button class="bg-surface border border-border-dark rounded-[24px] p-5 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-all active:scale-95 text-center">
        <div class="p-3 bg-primary/10 text-primary rounded-2xl">
          <Phone size={24} />
        </div>
        <div>
          <h3 class="font-bold text-sm">Call Us</h3>
          <p class="text-[10px] text-text-muted mt-0.5">24/7 Available</p>
        </div>
      </button>
    </section>

    <!-- Support Form -->
    <section class="bg-surface border border-border-dark rounded-[32px] p-6 shadow-sm">
      <h2 class="text-lg font-bold mb-4">Email Us</h2>
      <form class="space-y-4">
        <div>
          <label for="subject" class="text-xs font-bold text-text-muted uppercase mb-1.5 block px-1">Subject</label>
          <input type="text" id="subject" class="w-full p-4 bg-bg-app border border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" placeholder="What's the issue?" />
        </div>
        <div>
          <label for="message" class="text-xs font-bold text-text-muted uppercase mb-1.5 block px-1">Message</label>
          <textarea id="message" rows="4" class="w-full p-4 bg-bg-app border border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none" placeholder="Tell us more..."></textarea>
        </div>
        <button class="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-soft hover:bg-primary-dark transition-colors">
          Send Ticket
        </button>
      </form>
    </section>

    <!-- FAQ Section -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold">Frequently Asked Questions</h2>
        <button class="text-xs font-bold text-primary">View All</button>
      </div>
      <div class="space-y-3">
        {#each faqs as faq}
          <details class="bg-surface border border-border-dark rounded-2xl group transition-all duration-300">
            <summary class="flex items-center justify-between p-5 cursor-pointer list-none">
              <span class="text-sm font-bold pr-4">{faq.question}</span>
              <ChevronRight size={18} class="text-text-muted group-open:rotate-90 transition-transform" />
            </summary>
            <div class="px-5 pb-5 text-xs text-text-muted font-medium leading-relaxed">
              {faq.answer}
            </div>
          </details>
        {/each}
      </div>
    </section>

    <!-- Version Info -->
    <div class="p-6 bg-surface border border-border-dark rounded-32 text-center">
      <div class="flex items-center justify-center gap-2 mb-2">
        <div class="w-2 h-2 bg-success rounded-full animate-pulse"></div>
        <span class="text-xs font-bold text-success">Server is Online</span>
      </div>
      <p class="text-xs text-text-muted font-medium">Ticket Response ID: #XP-29384</p>
    </div>
  </main>
</div>

<BottomNav />
