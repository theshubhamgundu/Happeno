export function reveal(node: HTMLElement, { delay = 0, duration = 800, x = 50, threshold = 0.1 } = {}) {
    // Set initial state
    node.style.opacity = '0';
    node.style.transform = `translateX(${x}px)`;
    // Use a smooth easing function (easeOutQuart-ish)
    node.style.transition = `opacity ${duration}ms cubic-bezier(0.25, 1, 0.5, 1), transform ${duration}ms cubic-bezier(0.25, 1, 0.5, 1)`;

    if (delay) {
        node.style.transitionDelay = `${delay}ms`;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Determine if the element is visible
                node.style.opacity = '1';
                node.style.transform = 'translateX(0)';
                // Stop observing once revealed
                observer.unobserve(node);
            }
        });
    }, { threshold });

    observer.observe(node);

    return {
        destroy() {
            observer.disconnect();
        }
    };
}
