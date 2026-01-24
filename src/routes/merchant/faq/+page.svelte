<script lang="ts">
    import { fade, slide } from "svelte/transition";
    import { ChevronDown, ArrowLeft, Search } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import Input from "$lib/components/Input.svelte";

    let searchQuery = $state("");

    const faqs = [
        {
            category: "General",
            questions: [
                {
                    q: "What is Happeno for Merchants?",
                    a: "Happeno helps you reach customers nearby by showcasing your menu prices and special offers in real-time. It's designed to drive footfall to your restaurant by helping users make informed dining decisions.",
                },
                {
                    q: "How do users find my restaurant?",
                    a: "Users browse restaurants based on location, offers, and menu prices. When they choose your restaurant, we provide them with navigation directions directly to your doorstep.",
                },
            ],
        },
        {
            category: "Offers & Deals",
            questions: [
                {
                    q: "How do offers work?",
                    a: "You can create special deals to attract customers during slow hours or to promote new items. These offers appear prominently to users in your vicinity.",
                },
                {
                    q: "What is the duration of an offer?",
                    a: "You have flexibility! You can host offers for 24 hours (Flash Sale), 2 days (perfect for weekends), or 7 days (Weekly Special). You choose what works best for your business strategy.",
                },
                {
                    q: "Can I edit an active offer?",
                    a: "To ensure a consistent experience for users, active offers cannot be edited. However, you can cancel an offer early if you run out of stock and create a new one.",
                },
            ],
        },
        {
            category: "Menu & Listings",
            questions: [
                {
                    q: "Why should I list my full menu?",
                    a: "Transparency attracts customers! Users are more likely to visit if they know what you serve and how much it costs. It helps them find exactly what they are craving.",
                },
                {
                    q: "How often can I update my menu?",
                    a: "You can update your menu and prices at any time. Keeping your menu up-to-date ensures users have accurate information and reduces ordering friction.",
                },
            ],
        },
    ];

    let expandedIndex: string | null = $state(null);

    function toggle(categoryIndex: number, questionIndex: number) {
        const key = `${categoryIndex}-${questionIndex}`;
        expandedIndex = expandedIndex === key ? null : key;
    }

    let filteredFaqs = $derived(
        faqs
            .map((cat) => ({
                ...cat,
                questions: cat.questions.filter(
                    (q) =>
                        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        q.a.toLowerCase().includes(searchQuery.toLowerCase()),
                ),
            }))
            .filter((cat) => cat.questions.length > 0),
    );
</script>

<div class="min-h-screen bg-bg-app pb-10 transition-colors duration-300">
    <!-- Header -->
    <header
        class="bg-surface px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-20 transition-colors duration-300"
    >
        <div class="flex items-center gap-4 mb-6">
            <button
                onclick={() => goto("/merchant/profile")}
                class="p-2 -ml-2 hover:bg-highlight rounded-full transition-colors"
            >
                <ArrowLeft size={24} class="text-text-primary" />
            </button>
            <h1 class="text-2xl font-bold font-heading text-text-primary">
                Help & FAQ
            </h1>
        </div>

        <div class="relative">
            <div
                class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            >
                <Search size={20} />
            </div>
            <input
                bind:value={searchQuery}
                placeholder="Search for help..."
                class="w-full pl-12 pr-4 py-4 bg-highlight border border-border-peach rounded-2xl outline-none focus:bg-surface focus:border-primary/50 focus:shadow-sm transition-all font-medium text-text-primary placeholder:text-text-muted"
            />
        </div>
    </header>

    <main class="px-6 mt-8 flex flex-col gap-8">
        {#if filteredFaqs.length === 0}
            <div class="text-center py-10 text-text-muted">
                <p>No results found for "{searchQuery}"</p>
            </div>
        {/if}

        {#each filteredFaqs as category, cIndex}
            <div in:fade={{ duration: 300 }}>
                <h2
                    class="text-sm font-bold text-text-muted uppercase tracking-wider mb-4 ml-2"
                >
                    {category.category}
                </h2>
                <div
                    class="bg-surface rounded-[28px] border border-border-peach shadow-sm overflow-hidden transition-colors duration-300"
                >
                    {#each category.questions as question, qIndex}
                        <div
                            class={qIndex !== 0
                                ? "border-t border-border-peach"
                                : ""}
                        >
                            <button
                                onclick={() => toggle(cIndex, qIndex)}
                                class="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-highlight/50 transition-colors"
                            >
                                <span
                                    class="font-bold text-text-primary text-base leading-tight"
                                    >{question.q}</span
                                >
                                <div
                                    class="shrink-0 transition-transform duration-300 text-text-muted"
                                    class:rotate-180={expandedIndex ===
                                        `${cIndex}-${qIndex}`}
                                >
                                    <ChevronDown size={20} />
                                </div>
                            </button>

                            {#if expandedIndex === `${cIndex}-${qIndex}`}
                                <div
                                    transition:slide={{ duration: 200 }}
                                    class="px-5 pb-6 text-text-secondary text-sm leading-relaxed"
                                >
                                    {question.a}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </main>
</div>
