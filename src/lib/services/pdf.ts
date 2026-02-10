import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Order } from '$lib/types';

/**
 * PDF SERVICE
 * Generates professional, GST-compliant digital receipts and sales reports.
 */
class PDFService {

    async generateBill(order: Order, businessName: string) {
        const element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.width = '400px';
        element.style.padding = '40px';
        element.style.background = '#FFFFFF';
        element.style.color = '#1A1A1A';
        element.style.fontFamily = "'Inter', sans-serif";

        const itemsHtml = order.items.map(i => `
            <div style="display: flex; justify-between: space-between; margin-bottom: 10px; font-size: 14px;">
                <div style="flex: 1;">${i.name} (x${i.quantity})</div>
                <div style="width: 80px; text-align: right;">₹${i.price * i.quantity}</div>
            </div>
        `).join('');

        element.innerHTML = `
            <div style="text-align: center; border-bottom: 2px solid #F0F0F0; padding-bottom: 20px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px; color: #EC1C79;">${businessName}</h1>
                <p style="margin: 5px 0 0; font-size: 12px; color: #666; font-weight: bold;">Digital Tax Invoice</p>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 12px; color: #666;">
                <div><strong>Order ID:</strong> ${order.id}</div>
                <div style="text-align: right;"><strong>Table:</strong> ${order.tableNumber}</div>
            </div>
            <div style="margin-bottom: 30px;">${itemsHtml}</div>
            <div style="border-top: 2px solid #F0F0F0; padding-top: 20px; font-size: 14px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span>Subtotal</span><span>₹${order.subtotal}</span></div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span>GST (5%)</span><span>₹${order.tax}</span></div>
                <div style="display: flex; justify-content: space-between; font-weight: 900; font-size: 18px; color: #000;"><span>Grand Total</span><span style="color: #EC1C79;">₹${order.total}</span></div>
            </div>
            <div style="text-align: center; margin-top: 40px; border-top: 1px dashed #CCC; padding-top: 20px;">
                <p style="font-size: 10px; color: #999; margin: 0;">Thank you for dining with us!</p>
                <p style="font-size: 10px; color: #999; margin: 5px 0 0;">Powered by <strong>Happeno</strong></p>
            </div>
        `;

        document.body.appendChild(element);
        try {
            const canvas = await html2canvas(element, { scale: 2 });
            const pdf = new jsPDF('p', 'pt', [canvas.width / 2, canvas.height / 2]);
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
            pdf.save(`${order.id}_bill.pdf`);
        } finally {
            document.body.removeChild(element);
        }
    }

    async generateSalesReport(orders: Order[], businessName: string) {
        const totalRev = orders.reduce((acc, o) => acc + o.total, 0);
        const totalTax = orders.reduce((acc, o) => acc + o.tax, 0);

        const element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.width = '600px';
        element.style.padding = '50px';
        element.style.background = '#FFFFFF';
        element.style.color = '#1A1A1A';
        element.style.fontFamily = "'Inter', sans-serif";

        const rowsHtml = orders.map(o => `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F0F0F0; font-size: 11px;">
                <div style="width: 100px;">${o.id.substring(0, 8)}</div>
                <div style="flex: 1;">Table ${o.tableNumber}</div>
                <div style="width: 80px; text-align: right;">₹${o.total}</div>
            </div>
        `).join('');

        element.innerHTML = `
            <div style="border-bottom: 4px solid #EC1C79; padding-bottom: 20px; margin-bottom: 30px;">
                <h1 style="margin: 0; font-size: 28px;">Daily Sales Report</h1>
                <p style="margin: 5px 0 0; color: #666; font-weight: bold;">${businessName} | ${new Date().toLocaleDateString()}</p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px;">
                <div style="background: #F9F9F9; padding: 20px; border: 1px solid #EEE;">
                    <p style="margin: 0; font-size: 10px; color: #999; text-transform: uppercase;">Total Revenue</p>
                    <p style="margin: 5px 0 0; font-size: 20px; font-weight: 900; color: #EC1C79;">₹${totalRev}</p>
                </div>
                <div style="background: #F9F9F9; padding: 20px; border: 1px solid #EEE;">
                    <p style="margin: 0; font-size: 10px; color: #999; text-transform: uppercase;">Orders</p>
                    <p style="margin: 5px 0 0; font-size: 20px; font-weight: 900;">${orders.length}</p>
                </div>
                <div style="background: #F9F9F9; padding: 20px; border: 1px solid #EEE;">
                    <p style="margin: 0; font-size: 10px; color: #999; text-transform: uppercase;">Tax Collected</p>
                    <p style="margin: 5px 0 0; font-size: 20px; font-weight: 900;">₹${totalTax}</p>
                </div>
            </div>
            <div style="font-weight: 900; font-size: 12px; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 5px; display: flex;">
                <div style="width: 100px;">OrderID</div><div style="flex: 1;">Ref</div><div style="width: 80px; text-align: right;">Amount</div>
            </div>
            ${rowsHtml}
        `;

        document.body.appendChild(element);
        try {
            const canvas = await html2canvas(element, { scale: 2 });
            const pdf = new jsPDF('p', 'pt', [canvas.width / 2, canvas.height / 2]);
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
            pdf.save(`Sales_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        } finally {
            document.body.removeChild(element);
        }
    }
}

export const pdfService = new PDFService();
