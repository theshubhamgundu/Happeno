<script lang="ts">
    import { ArrowLeft, Shield } from "lucide-svelte";
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
                    Privacy Policy
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
                <Shield size={24} />
                <h2 class="text-lg font-bold">Your Privacy Matters</h2>
            </div>
            <p class="text-text-secondary leading-relaxed text-sm">
                At Happeno, we believe in transparency. This policy outlines how
                we collect, use, and protect your data while you discover the
                best deals around you.
            </p>
        </div>

        <div class="space-y-6">
            <section>
                <h3 class="text-lg font-bold text-text-primary mb-3">
                    1. Information We Collect
                </h3>
                <div
                    class="bg-white p-5 rounded-[24px] border border-slate-100 space-y-3"
                >
                    <div class="flex gap-3">
                        <div
                            class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"
                        ></div>
                        <p class="text-sm text-text-secondary leading-relaxed">
                            <span class="font-bold text-slate-700"
                                >Location Data:</span
                            > We collect your precise location to show you restaurants
                            and offers within your immediate vicinity.
                        </p>
                    </div>
                    <div class="flex gap-3">
                        <div
                            class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"
                        ></div>
                        <p class="text-sm text-text-secondary leading-relaxed">
                            <span class="font-bold text-slate-700"
                                >Account Information:</span
                            >
                            Name, email (or phone number), and preferences when you
                            sign up.
                        </p>
                    </div>
                    <div class="flex gap-3">
                        <div
                            class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"
                        ></div>
                        <p class="text-sm text-text-secondary leading-relaxed">
                            <span class="font-bold text-slate-700"
                                >Usage Data:</span
                            > Interactions with offers, menus views, and navigation
                            requests.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <h3 class="text-lg font-bold text-text-primary mb-3">
                    2. How We Use Your Data
                </h3>
                <ul
                    class="bg-white p-5 rounded-[24px] border border-slate-100 space-y-3 text-sm text-text-secondary leading-relaxed list-disc pl-9 marker:text-primary"
                >
                    <li>To provide and maintain the Service.</li>
                    <li>To notify you about changes to our Service.</li>
                    <li>To provide customer support.</li>
                    <li>
                        To gather analysis or valuable information so that we
                        can improve the Service.
                    </li>
                    <li>To monitor the usage of the Service.</li>
                </ul>
            </section>

            <section>
                <h3 class="text-lg font-bold text-text-primary mb-3">
                    3. Data Sharing
                </h3>
                <div
                    class="bg-white p-5 rounded-[24px] border border-slate-100"
                >
                    <p class="text-sm text-text-secondary leading-relaxed">
                        We <span class="font-bold text-text-primary"
                            >do not sell</span
                        > your personal data. We may share anonymized location data
                        with merchants to help them understand foot traffic trends,
                        but your identity remains private.
                    </p>
                </div>
            </section>

            <section>
                <h3 class="text-lg font-bold text-text-primary mb-3">
                    4. Security
                </h3>
                <div
                    class="bg-white p-5 rounded-[24px] border border-slate-100"
                >
                    <p class="text-sm text-text-secondary leading-relaxed">
                        The security of your data is important to us, but
                        remember that no method of transmission over the
                        Internet, or method of electronic storage is 100%
                        secure. While we strive to use commercially acceptable
                        means to protect your Personal Data, we cannot guarantee
                        its absolute security.
                    </p>
                </div>
            </section>

            <section>
                <h3 class="text-lg font-bold text-text-primary mb-3">
                    5. Contact Us
                </h3>
                <div
                    class="bg-white p-5 rounded-[24px] border border-slate-100"
                >
                    <p class="text-sm text-text-secondary leading-relaxed">
                        If you have any questions about this Privacy Policy,
                        please contact us at <a
                            href="mailto:privacy@happeno.com"
                            class="text-primary font-bold hover:underline"
                            >privacy@happeno.com</a
                        >.
                    </p>
                </div>
            </section>
        </div>
    </main>
</div>
