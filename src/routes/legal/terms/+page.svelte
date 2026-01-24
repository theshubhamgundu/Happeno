<script lang="ts">
    import { ArrowLeft, FileText } from "lucide-svelte";
    import { goto } from "$app/navigation";

    function goBack() {
        window.history.back();
    }
</script>

<div class="min-h-screen bg-[#FFF5E1] pb-10">
    <!-- Header -->
    <header
        class="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-20"
    >
        <div class="flex items-center gap-4">
            <button
                onclick={goBack}
                class="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors"
            >
                <ArrowLeft size={24} class="text-text-primary" />
            </button>
            <div>
                <h1 class="text-2xl font-bold font-heading text-text-primary">
                    Terms of Service
                </h1>
                <p
                    class="text-xs font-bold text-text-muted uppercase tracking-wide"
                >
                    Last Updated: Jan 24, 2026
                </p>
            </div>
        </div>
    </header>

    <main class="px-6 mt-8 flex flex-col gap-6">
        <div
            class="bg-white p-6 rounded-[32px] border border-border-peach shadow-sm"
        >
            <div class="flex items-center gap-3 mb-4 text-primary">
                <FileText size={24} />
                <h2 class="text-lg font-bold">Agreement to Terms</h2>
            </div>
            <p class="text-text-secondary leading-relaxed text-sm">
                By accessing or using Happeno, you agree to be bound by these
                Terms. Use of our service means you accept these conditions.
            </p>
        </div>

        <div class="space-y-6">
            <section>
                <h3 class="text-lg font-bold text-text-primary mb-3">
                    1. Use of Service
                </h3>
                <div
                    class="bg-white p-5 rounded-[24px] border border-slate-100 space-y-3"
                >
                    <p class="text-sm text-text-secondary leading-relaxed">
                        You must follow any policies made available to you
                        within the Services. You may not misuse our Services.
                        For example, do not interfere with our Services or try
                        to access them using a method other than the interface
                        and the instructions that we provide.
                    </p>
                </div>
            </section>

            <section>
                <h3 class="text-lg font-bold text-text-primary mb-3">
                    2. Merchant Responsibilities
                </h3>
                <div
                    class="bg-white p-5 rounded-[24px] border border-slate-100 space-y-2"
                >
                    <p class="text-sm text-text-secondary leading-relaxed mb-2">
                        Merchants listing on Happeno agree to:
                    </p>
                    <ul
                        class="list-disc pl-4 space-y-2 text-sm text-text-secondary"
                    >
                        <li>
                            <span class="font-bold text-slate-700"
                                >Accuracy:</span
                            > Ensure all menu prices and offer details are current
                            and accurate.
                        </li>
                        <li>
                            <span class="font-bold text-slate-700"
                                >Honor Offers:</span
                            > All active offers displayed on the app must be honored
                            at the venue.
                        </li>
                        <li>
                            <span class="font-bold text-slate-700"
                                >Lawful Conduct:</span
                            > Comply with all applicable laws regarding the sale
                            of food and beverages.
                        </li>
                    </ul>
                </div>
            </section>

            <section>
                <h3 class="text-lg font-bold text-text-primary mb-3">
                    3. User Content
                </h3>
                <div
                    class="bg-white p-5 rounded-[24px] border border-slate-100"
                >
                    <p class="text-sm text-text-secondary leading-relaxed">
                        Some of our Services allow you to upload, submit, store,
                        send or receive content. You retain ownership of any
                        intellectual property rights that you hold in that
                        content. In short, what belongs to you stays yours.
                    </p>
                </div>
            </section>

            <section>
                <h3 class="text-lg font-bold text-text-primary mb-3">
                    4. Termination
                </h3>
                <div
                    class="bg-white p-5 rounded-[24px] border border-slate-100"
                >
                    <p class="text-sm text-text-secondary leading-relaxed">
                        We may terminate or suspend access to our Service
                        immediately, without prior notice or liability, for any
                        reason whatsoever, including without limitation if you
                        breach the Terms.
                    </p>
                </div>
            </section>

            <section>
                <h3 class="text-lg font-bold text-text-primary mb-3">
                    5. Changes to Terms
                </h3>
                <div
                    class="bg-white p-5 rounded-[24px] border border-slate-100"
                >
                    <p class="text-sm text-text-secondary leading-relaxed">
                        We reserve the right, at our sole discretion, to modify
                        or replace these Terms at any time. What constitutes a
                        material change will be determined at our sole
                        discretion.
                    </p>
                </div>
            </section>
        </div>
    </main>
</div>
