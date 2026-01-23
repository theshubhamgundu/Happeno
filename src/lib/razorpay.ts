import { PUBLIC_RAZORPAY_KEY_ID } from '$env/static/public';

export async function initializePayment(options: {
    amount: number;
    name: string;
    description: string;
    onSuccess: (response: any) => void;
    onFailure?: (response: any) => void;
}) {
    const settings = {
        key: PUBLIC_RAZORPAY_KEY_ID,
        amount: options.amount * 100, // in paise
        currency: "INR",
        name: "Happeno",
        description: options.description,
        handler: options.onSuccess,
        prefill: {
            name: options.name,
        },
        theme: {
            color: "#EC1C79",
        }
    };

    // @ts-ignore
    const rzp = new window.Razorpay(settings);
    rzp.on('payment.failed', options.onFailure || ((res: any) => console.error(res)));
    rzp.open();
}
