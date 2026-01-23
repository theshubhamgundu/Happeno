<script lang="ts">
  import { Home, Bookmark, User, Search } from "lucide-svelte";
  import { page } from "$app/stores";
  import { cn } from "$lib/utils";

  const navItems = [
    { icon: Search, label: "Nearby", path: "/user/nearby" },
    { icon: Bookmark, label: "Saved", path: "/user/saved" },
    { icon: User, label: "Profile", path: "/user/profile" },
  ];
</script>

<nav
  class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-border-peach px-6 pt-3 pb-8 flex justify-between items-center z-50"
>
  {#each navItems as item}
    <a
      href={item.path}
      class={cn(
        "flex flex-col items-center gap-1 transition-all duration-300",
        $page.url.pathname === item.path
          ? "text-primary scale-110"
          : "text-text-muted hover:text-text-secondary",
      )}
    >
      <div
        class={cn(
          "p-2 rounded-2xl transition-all",
          $page.url.pathname === item.path ? "bg-primary/10" : "bg-transparent",
        )}
      >
        <item.icon
          size={22}
          strokeWidth={$page.url.pathname === item.path ? 2.5 : 2}
        />
      </div>
      <span class="text-[10px] font-bold uppercase tracking-widest"
        >{item.label}</span
      >
    </a>
  {/each}
</nav>
