<div class="space-y-4 px-4 overflow-hidden">
    <div class="h-4 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
    <div class="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {#each Array(4) as _}
            <div class="flex-shrink-0 w-24 space-y-2 animate-pulse">
                <div class="w-24 h-24 rounded-2xl bg-gray-200"></div>
                <div class="h-3 bg-gray-100 rounded-lg w-16 mx-auto"></div>
            </div>
        {/each}
    </div>
</div>
