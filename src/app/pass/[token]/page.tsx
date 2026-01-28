"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import QRCode from "qrcode";
import { CheckCircle, MapPin, IdCard, Loader2 } from "lucide-react";

export default function PassPage() {
    const params = useParams();
    const token = params.token as string;
    const [data, setData] = useState<any>(null);
    const [qr, setQr] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPass = async () => {
            if (!token) return;
            try {
                const docRef = doc(db, "registrations", token);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const passData = docSnap.data();
                    setData(passData);

                    // Generate QR code with the verification URL
                    const verifyUrl = `${window.location.origin}/verify?token=${token}`;

                    const qrUrl = await QRCode.toDataURL(verifyUrl, {
                        margin: 2,
                        width: 400,
                        color: {
                            dark: "#000000",
                            light: "#ffffff"
                        }
                    });
                    setQr(qrUrl);
                }
            } catch (error) {
                console.error("Error fetching pass:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPass();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="w-10 h-10 text-zinc-500 animate-spin" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white font-black text-2xl uppercase tracking-tighter">
                Pass Not Found
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 font-sans selection:bg-white/10 overflow-hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

            {/* Background Image with Neutral Overlay */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img
                    src="/images/pass_bg.png"
                    alt="Campus"
                    className="w-full h-full object-cover scale-105 blur-[1px] opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-transparent to-zinc-950/90"></div>
            </div>

            <div className="relative z-10 w-full max-w-sm">
                {/* Branding Image Top */}
                <div className="flex justify-center mb-6 transition-all duration-700 hover:scale-110">
                    <img
                        src="/images/event_logo_hd.png"
                        alt="Lavaza"
                        className="w-40 h-auto object-cover rounded-2xl border border-white/5 shadow-2xl bg-white/5 backdrop-blur-xl p-2 opacity-80"
                    />
                </div>

                {/* Main Pass Card - DARK NEUTRAL GLASS */}
                <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] transition-all duration-500 hover:border-white/20">

                    {/* Header Section */}
                    <div className="bg-white/5 p-6 flex items-center justify-between border-b border-white/5">
                        <div className="space-y-0.5">
                            <h1 className="text-xl font-bold tracking-[-0.05em] text-white uppercase">
                                VIP PASS
                            </h1>
                            <p className="text-zinc-500 text-[7px] uppercase tracking-[0.5em] font-black">Lavaza Festival 2026</p>
                        </div>
                        <div className="bg-white/5 p-2 rounded-xl backdrop-blur-md border border-white/5">
                            <CheckCircle className="text-white/40 w-4 h-4" />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-6">
                        {/* QR Code Section */}
                        <div className="flex justify-center group">
                            <div className="bg-white p-3 rounded-2xl border border-white/10 shadow-lg flex items-center justify-center w-28 h-28 transform transition-all duration-500 group-hover:scale-105">
                                {qr && <img src={qr} alt="QR Code" className="w-full aspect-square" />}
                            </div>
                        </div>

                        {/* User Primary Info */}
                        <div className="text-center space-y-1">
                            <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-1">
                                <span className="text-[8px] uppercase tracking-[0.2em] font-black text-zinc-500">Verified Attendee</span>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter text-white capitalize break-words leading-tight text-shadow-sm">
                                {data.name}
                            </h2>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 space-y-1 text-center transition-all hover:bg-white/10">
                                <div className="flex items-center justify-center gap-2 text-white/20">
                                    <IdCard size={12} />
                                    <span className="text-[8px] uppercase font-bold tracking-[0.2em]">VTU ID</span>
                                </div>
                                <p className="text-sm font-bold text-white uppercase leading-none">{data.vtuId}</p>
                            </div>
                            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 space-y-1 text-center transition-all hover:bg-white/10">
                                <div className="flex items-center justify-center gap-2 text-white/20">
                                    <MapPin size={12} />
                                    <span className="text-[8px] uppercase font-bold tracking-[0.2em]">Dept</span>
                                </div>
                                <p className="text-sm font-bold text-white truncate leading-none">{data.dept}</p>
                            </div>
                        </div>

                        {/* Footer Status */}
                        <div className="pt-4 flex items-center justify-between border-t border-white/5">
                            <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-2 rounded-full border border-emerald-500/20">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.3)]"></div>
                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest leading-none">
                                    {data.status}
                                </span>
                            </div>
                            {data.createdAt && (
                                <div className="text-right">
                                    <p className="text-[8px] text-white/20 uppercase font-bold tracking-[0.1em]">Issued On</p>
                                    <p className="text-[11px] text-white/50 font-bold">
                                        {new Date(data.createdAt.seconds * 1000).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
