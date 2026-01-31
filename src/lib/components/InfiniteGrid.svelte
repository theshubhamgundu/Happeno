<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    // Track mouse position
    let mouseX = $state(0);
    let mouseY = $state(0);
    let containerEl: HTMLDivElement;

    // Grid offsets for infinite scroll animation
    let gridOffsetX = $state(0);
    let gridOffsetY = $state(0);

    const gridSize = 40;
    const speedX = 0.3;
    const speedY = 0.3;

    let animationId: number;

    function handleMouseMove(e: MouseEvent) {
        if (!containerEl) return;
        const rect = containerEl.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    }

    function animate() {
        gridOffsetX = (gridOffsetX + speedX) % gridSize;
        gridOffsetY = (gridOffsetY + speedY) % gridSize;
        animationId = requestAnimationFrame(animate);
    }

    onMount(() => {
        animate();
    });

    onDestroy(() => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });

    // Computed mask style
    let maskStyle = $derived(
        `radial-gradient(350px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
    );
</script>

<div
    bind:this={containerEl}
    onmousemove={handleMouseMove}
    role="presentation"
    class="infinite-grid-container"
>
    <!-- Layer 1: Subtle background grid (always visible) -->
    <div class="grid-layer grid-layer-bg">
        <svg class="w-full h-full">
            <defs>
                <pattern
                    id="grid-pattern-bg"
                    width={gridSize}
                    height={gridSize}
                    patternUnits="userSpaceOnUse"
                    x={gridOffsetX}
                    y={gridOffsetY}
                >
                    <path
                        d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                        fill="none"
                        stroke="currentColor"
                        stroke-width="0.5"
                        class="text-text-muted"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern-bg)" />
        </svg>
    </div>

    <!-- Layer 2: Highlighted grid (revealed by mouse mask) -->
    <div
        class="grid-layer grid-layer-active"
        style="mask-image: {maskStyle}; -webkit-mask-image: {maskStyle};"
    >
        <svg class="w-full h-full">
            <defs>
                <pattern
                    id="grid-pattern-active"
                    width={gridSize}
                    height={gridSize}
                    patternUnits="userSpaceOnUse"
                    x={gridOffsetX}
                    y={gridOffsetY}
                >
                    <path
                        d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1"
                        class="text-primary"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern-active)" />
        </svg>
    </div>

    <!-- Decorative Blur Spheres -->
    <div class="blur-spheres">
        <div class="sphere sphere-1"></div>
        <div class="sphere sphere-2"></div>
        <div class="sphere sphere-3"></div>
    </div>
</div>

<style>
    .infinite-grid-container {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        overflow: hidden;
    }

    .grid-layer {
        position: absolute;
        inset: 0;
        z-index: 0;
    }

    .grid-layer-bg {
        opacity: 0.04;
    }

    .grid-layer-active {
        opacity: 0.25;
    }

    .blur-spheres {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 0;
    }

    .sphere {
        position: absolute;
        border-radius: 50%;
        filter: blur(100px);
    }

    .sphere-1 {
        right: -15%;
        top: -15%;
        width: 35%;
        height: 35%;
        background: rgba(255, 16, 124, 0.15);
    }

    .sphere-2 {
        right: 15%;
        top: 5%;
        width: 15%;
        height: 15%;
        background: rgba(255, 159, 28, 0.12);
    }

    .sphere-3 {
        left: -10%;
        bottom: -15%;
        width: 35%;
        height: 35%;
        background: rgba(0, 136, 145, 0.15);
    }

    :global(.dark) .sphere-1 {
        background: rgba(255, 16, 124, 0.08);
    }

    :global(.dark) .sphere-2 {
        background: rgba(255, 159, 28, 0.06);
    }

    :global(.dark) .sphere-3 {
        background: rgba(0, 136, 145, 0.08);
    }
</style>
