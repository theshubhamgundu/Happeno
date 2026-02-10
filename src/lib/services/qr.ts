import QRCode from 'qrcode';

/**
 * QR SERVICE
 * Handles table-specific ordering link generation.
 */
class QRService {

    async generateTableQR(restaurantId: string, tableNumber: string) {
        // Construct the URL that the customer scans
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
        const url = `${baseUrl}/user/restaurant/${restaurantId}/order?table=${tableNumber}`;

        try {
            // Generate Data URL for the QR code
            const qrDataUrl = await QRCode.toDataURL(url, {
                width: 512,
                margin: 2,
                color: {
                    dark: '#EC1C79', // Brand Pink
                    light: '#FFFFFF'
                }
            });
            return qrDataUrl;
        } catch (err) {
            console.error('QR Generation Failed:', err);
            return null;
        }
    }
}

export const qrService = new QRService();
