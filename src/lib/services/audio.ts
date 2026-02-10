/**
 * AUDIO SERVICE
 * Handles professional sound alerts for kitchen and staff notifications.
 */

class AudioService {
    private sounds: Record<string, HTMLAudioElement> = {};

    constructor() {
        if (typeof window !== 'undefined') {
            // High-fidelity UI sounds
            this.sounds = {
                // High-fidelity, sharp 'App Alert' for general pings
                notification: new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'),
                // Bright, premium success chime
                success: new Audio('https://assets.mixkit.co/active_storage/sfx/2014/2014-preview.mp3'),
                // HIGH-IMPACT: Next-Level 'New Order' Arrival Chime (Highly Distinctive)
                order_new: new Audio('https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3'),
                // Crisp 'Order Ready' service bell
                ready: new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3')
            };

            // Pre-warm and set volume to 100%
            Object.values(this.sounds).forEach(s => {
                s.volume = 1.0;
                s.load();
            });
        }
    }

    play(soundName: 'notification' | 'success' | 'order_new' | 'ready') {
        try {
            const sound = this.sounds[soundName];
            if (sound) {
                // Reset to start for rapid-fire notifications
                sound.currentTime = 0;
                sound.play().catch(e => {
                    // Fail silently or log for debugging
                    if (e.name !== 'NotAllowedError') {
                        console.warn(`Audio play error for ${soundName}:`, e);
                    }
                });
            }
        } catch (e) {
            console.error('Audio Service critical error:', e);
        }
    }
}

export const audioService = new AudioService();
