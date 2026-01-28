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

                    // Generate QR code with more data for security
                    const qrData = JSON.stringify({
                        token: token,
                        vtuId: passData.vtuId,
                        name: passData.name
                    });

                    const qrUrl = await QRCode.toDataURL(qrData, {
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
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
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
        <div className="relative min-h-screen flex items-center justify-center p-4 font-sans selection:bg-purple-500/30 overflow-hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

            {/* Background Image with Deep Overlay */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img
                    src="/images/pass_bg.png"
                    alt="Campus"
                    className="w-full h-full object-cover scale-110 blur-[2px] opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-indigo-950/80 to-purple-950/60"></div>
            </div>

            <div className="relative z-10 w-full max-w-sm">
                {/* Branding Image Top */}
                <div className="flex justify-center mb-6 transition-all duration-700 hover:scale-110 drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                    <img
                        src="/images/event_logo_hd.png"
                        alt="Lavaza"
                        className="w-44 h-auto object-cover rounded-2xl border border-white/10 shadow-2xl bg-white/5 backdrop-blur-xl p-2"
                    />
                </div>

                {/* Main Pass Card - DARK VIP GLASS */}
                <div className="bg-slate-950/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] transition-all duration-500 hover:shadow-[0_50px_120px_rgba(139,92,246,0.2)]">

                    {/* Header Section - NEON GRADIENT */}
                    <div className="bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-indigo-600/20 p-6 flex items-center justify-between border-b border-white/5">
                        <div className="space-y-0.5">
                            <h1 className="text-xl font-bold tracking-[-0.05em] text-white uppercase">
                                VIP PASS
                            </h1>
                            <p className="text-purple-400 text-[7px] uppercase tracking-[0.5em] font-black">Lavaza Festival 2026</p>
                        </div>
                        <div className="bg-white/5 p-2 rounded-xl backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(167,139,250,0.2)]">
                            <CheckCircle className="text-purple-400 w-4 h-4" />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-6">
                        {/* QR Code Section - GLOWING */}
                        <div className="flex justify-center group">
                            <div className="bg-white/95 p-3 rounded-2xl border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center w-28 h-28 transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                                {qr && <img src={qr} alt="QR Code" className="w-full aspect-square contrast-125" />}
                            </div>
                        </div>

                        {/* User Primary Info */}
                        <div className="text-center space-y-1">
                            <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-1">
                                <span className="text-[8px] uppercase tracking-[0.2em] font-black text-purple-300">Verified Attendee</span>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter text-white capitalize break-words leading-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                                {data.name}
                            </h2>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 space-y-1 text-center transition-all hover:bg-white/10 hover:border-white/10">
                                <div className="flex items-center justify-center gap-2 text-white/30">
                                    <IdCard size={12} className="text-indigo-400" />
                                    <span className="text-[8px] uppercase font-bold tracking-[0.2em]">VTU ID</span>
                                </div>
                                <p className="text-sm font-bold text-white uppercase leading-none">{data.vtuId}</p>
                            </div>
                            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 space-y-1 text-center transition-all hover:bg-white/10 hover:border-white/10">
                                <div className="flex items-center justify-center gap-2 text-white/30">
                                    <MapPin size={12} className="text-indigo-400" />
                                    <span className="text-[8px] uppercase font-bold tracking-[0.2em]">Dept</span>
                                </div>
                                <p className="text-sm font-bold text-white truncate leading-none">{data.dept}</p>
                            </div>
                        </div>

                        {/* Footer Status */}
                        <div className="pt-4 flex items-center justify-between border-t border-white/5">
                            <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-2 rounded-full border border-emerald-500/20 shadow-inner">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                                <span className="text-[9px] font-black text-emerald-300 uppercase tracking-widest leading-none">
                                    {data.status}
                                </span>
                            </div>
                            {data.createdAt && (
                                <div className="text-right">
                                    <p className="text-[8px] text-white/30 uppercase font-bold tracking-[0.1em]">Issued On</p>
                                    <p className="text-[11px] text-white/70 font-bold">
                                        {new Date(data.createdAt.seconds * 1000).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Background elements */}
            <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse"></div>
        </div>
    );
}
