export function confetti(node: HTMLElement) {
    const scalar = 2;
    const triangle = confetti.shapeFromPath({ path: 'M0 10 L5 0 L10 10z' });

    // Mock implementation for demo if canvas-confetti isn't installed
    // In a real project, we would use: import confetti from 'canvas-confetti';
    console.log("Confetti triggered on", node);

    return {
        destroy() {
            // cleanup
        }
    };
}
