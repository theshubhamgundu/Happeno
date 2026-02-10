<script lang="ts">
    import type { Review } from "$lib/types";
    import { Star, ThumbsUp, MessageSquare, Edit3 } from "lucide-svelte";
    import { fade, fly } from "svelte/transition";
    import { formatReviewDate } from "$lib/data/reviews";

    let { reviews } = $props<{ reviews: Review[] }>();

    let stats = $derived.by(() => {
        if (reviews.length === 0) return { avg: 0, count: 0 };
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        return {
            avg: (sum / reviews.length).toFixed(1),
            count: reviews.length,
        };
    });
</script>

<div class="space-y-10 animate-in fade-in duration-500 pb-20">
    <!-- Review Summary -->
    <div
        class="bg-gray-50 rounded-[32px] p-8 flex items-center justify-between"
    >
        <div>
            <div class="flex items-center gap-3 mb-1">
                <span class="text-4xl font-black text-gray-900"
                    >{stats.avg}</span
                >
                <div class="flex text-yellow-500">
                    {#each Array(5) as _, i}
                        <Star
                            size={18}
                            fill={i < Math.floor(Number(stats.avg))
                                ? "currentColor"
                                : "none"}
                        />
                    {/each}
                </div>
            </div>
            <p
                class="text-xs font-black text-gray-400 uppercase tracking-widest"
            >
                Based on {stats.count} reviews
            </p>
        </div>
        <button
            class="bg-white px-6 py-3 rounded-2xl text-[10px] font-black text-primary border border-primary/10 shadow-sm active:scale-95 transition-all"
        >
            WRITE A REVIEW
        </button>
    </div>

    <!-- Review List -->
    <div class="space-y-6">
        {#each reviews as review, i}
            <div
                class="bg-white border border-gray-100 rounded-[32px] p-6 shadow-xl shadow-gray-200/20"
                in:fly={{ y: 20, delay: i * 100, duration: 500 }}
            >
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center gap-3">
                        <img
                            src={review.userAvatar}
                            alt={review.userName}
                            class="w-12 h-12 rounded-full border-2 border-primary/10"
                        />
                        <div>
                            <h4 class="text-sm font-black text-gray-900">
                                {review.userName}
                            </h4>
                            <p
                                class="text-[10px] text-gray-400 font-bold uppercase tracking-wider"
                            >
                                {formatReviewDate(review.createdAt)}
                            </p>
                        </div>
                    </div>
                    <div
                        class="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-xl flex items-center gap-1"
                    >
                        <span class="text-xs font-black">{review.rating}</span>
                        <Star size={10} fill="currentColor" />
                    </div>
                </div>

                <p
                    class="text-gray-600 text-sm leading-relaxed font-medium mb-6 italic"
                >
                    "{review.text}"
                </p>

                {#if review.images && review.images.length > 0}
                    <div
                        class="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2"
                    >
                        {#each review.images as img}
                            <img
                                src={img}
                                alt="review"
                                class="w-24 h-24 rounded-2xl object-cover shrink-0"
                            />
                        {/each}
                    </div>
                {/if}

                <div
                    class="pt-4 border-t border-gray-50 flex items-center gap-6"
                >
                    <button
                        class="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors"
                    >
                        <ThumbsUp size={16} />
                        <span class="text-[10px] font-black"
                            >{review.likes} Helpful</span
                        >
                    </button>
                    <button
                        class="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors"
                    >
                        <MessageSquare size={16} />
                        <span class="text-[10px] font-black">Reply</span>
                    </button>
                </div>
            </div>
        {/each}
    </div>
</div>
