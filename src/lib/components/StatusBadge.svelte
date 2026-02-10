<script lang="ts">
    import type { OrderStatus } from "$lib/types";
    import { cn } from "$lib/utils";

    let { status, class: className = "" } = $props<{
        status: OrderStatus | string;
        class?: string;
    }>();

    const getStatusStyles = (s: string) => {
        switch (s.toLowerCase()) {
            case "pending":
                return "bg-amber-50 text-amber-600 border-amber-100";
            case "confirmed":
                return "bg-blue-50 text-blue-600 border-blue-100";
            case "preparing":
                return "bg-orange-50 text-orange-600 border-orange-100";
            case "ready":
                return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "served":
                return "bg-indigo-50 text-indigo-600 border-indigo-100";
            case "completed":
                return "bg-gray-50 text-gray-400 border-gray-100";
            case "cancelled":
                return "bg-red-50 text-red-600 border-red-100";
            default:
                return "bg-gray-50 text-gray-500 border-gray-100";
        }
    };
</script>

<span
    class={cn(
        "px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest",
        getStatusStyles(status),
        className,
    )}
>
    {status}
</span>
