<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { App } from '@capacitor/app';

	let { children } = $props();

	onMount(() => {
		if (browser) {
			// 1. Handle Hardware Back Button (Android)
			const backListener = App.addListener('backButton', ({ canGoBack }) => {
				if (canGoBack) {
					window.history.back();
				} else {
					// Minimal delay to prevent accidental double-exit
					App.exitApp();
				}
			});

			// 2. State Persistence: Recovery on Cold Start
			const lastPath = localStorage.getItem('happeno_last_path');
			const isFirstLoad = !sessionStorage.getItem('happeno_session_active');
			
			if (isFirstLoad && lastPath && lastPath !== window.location.pathname) {
				// Don't redirect if we are already on a critical path like onboarding
				const criticalPaths = ['/', '/login', '/onboarding'];
				const isCurrentlyOnCritical = criticalPaths.some(p => window.location.pathname.includes(p));
				
				if (!isCurrentlyOnCritical) {
					console.log("Restoring session to:", lastPath);
					goto(lastPath);
				}
			}
			sessionStorage.setItem('happeno_session_active', 'true');

			return () => {
				backListener.then(l => l.remove());
			};
		}
	});

	// 3. Track current path for persistence
	$effect(() => {
		if (browser && $page.url.pathname) {
			// Skip storing transient/login paths to avoid stuck loops
			const skipPaths = ['/login', '/onboarding', '/merchant/login'];
			if (!skipPaths.some(p => $page.url.pathname.includes(p))) {
				localStorage.setItem('happeno_last_path', $page.url.pathname + $page.url.search);
			}
		}
	});
</script>

<svelte:head>
	<link rel="icon" href="/logo.jpeg" />
</svelte:head>

{@render children()}
