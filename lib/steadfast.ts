export interface SteadfastOrderRequest {
    invoice: string;
    recipient_name: string;
    recipient_phone: string;
    recipient_address: string;
    cod_amount: number;
    note?: string;
}

export interface SteadfastOrderResponse {
    status: number;
    message: string;
    order?: {
        consignment_id: string;
        tracking_code: string;
        invoice: string;
        recipient_name: string;
        recipient_phone: string;
        recipient_address: string;
        cod_amount: number;
        status: string;
    };
    errors?: Record<string, string[]>;
}

export async function sendOrderToSteadfast(orderData: SteadfastOrderRequest) {
    const apiKey = process.env.STEADFAST_API_KEY;
    const secretKey = process.env.STEADFAST_SECRET;

    if (!apiKey || !secretKey) {
        throw new Error("Steadfast API Key or Secret Key is missing in environment variables.");
    }

    try {
        const response = await fetch("https://portal.steadfast.com.bd/api/v1/create_order", {
            method: "POST",
            headers: {
                "Api-Key": apiKey,
                "Secret-Key": secretKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
        });

        const result: SteadfastOrderResponse = await response.json();
        return result;
    } catch (error) {
        console.error("Error sending order to Steadfast:", error);
        throw error;
    }
}
