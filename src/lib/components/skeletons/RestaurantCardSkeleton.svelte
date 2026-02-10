<div
    class="bg-white rounded-[32px] overflow-hidden border border-gray-100/50 shadow-sm animate-pulse"
>
    <!-- Image Skeleton -->
    <div class="relative aspect-[16/9] bg-gray-200">
        <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
        ></div>
    </div>

    <!-- Content Skeleton -->
    <div class="p-4 space-y-4">
        <div class="flex justify-between items-start">
            <div class="flex-1 space-y-2">
                <div class="h-5 bg-gray-200 rounded-lg w-3/4"></div>
                <div class="h-3 bg-gray-100 rounded-lg w-1/2"></div>
            </div>
            <div class="h-5 bg-gray-200 rounded-lg w-16"></div>
        </div>

        <div class="flex items-center gap-3 pt-3 border-t border-gray-100">
            <div class="h-4 bg-gray-100 rounded-md w-20"></div>
            <div class="h-4 bg-gray-100 rounded-md w-24"></div>
        </div>
    </div>
</div>

<style>
    .animate-shimmer {
        animation: shimmer 2s infinite;
    }
    @keyframes shimmer {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }
</style>
