<script lang="ts">
	import './layout.css';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/logo.jpeg" />
</svelte:head>
{@render children()}
