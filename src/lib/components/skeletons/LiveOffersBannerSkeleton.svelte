<div class="px-4 animate-pulse">
    <div
        class="w-full aspect-[21/9] rounded-[32px] bg-gray-200 relative overflow-hidden"
    >
        <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
        ></div>
        <div class="absolute bottom-6 left-6 space-y-2">
            <div class="h-6 bg-gray-300 rounded-lg w-48"></div>
            <div class="h-4 bg-gray-300/50 rounded-lg w-32"></div>
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
