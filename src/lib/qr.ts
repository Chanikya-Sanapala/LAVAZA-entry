import QRCode from "qrcode";

/**
 * Generates a QR code data URL from a given string.
 */
export const generateQRCode = async (text: string): Promise<string> => {
    try {
        const dataUrl = await QRCode.toDataURL(text, {
            width: 400,
            margin: 2,
            color: {
                dark: "#000000",
                light: "#ffffff",
            },
        });
        return dataUrl;
    } catch (err) {
        console.error("QR Code Error:", err);
        throw err;
    }
};
