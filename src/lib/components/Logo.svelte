<script lang="ts">
  let { size = 64, class: className } = $props();
</script>

<div class={className} style="width: {size}px; height: {size}px;">
  <img 
    src="/logo.jpeg" 
    alt="Happeno Logo" 
    class="w-full h-full object-contain rounded-3xl shadow-xl border-2 border-white"
  />
</div>
