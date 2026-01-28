"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import QRCode from "qrcode";
import { CheckCircle, MapPin, IdCard, Loader2, Sparkles } from "lucide-react";

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
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 text-zinc-900 font-black text-2xl uppercase tracking-tighter">
                Pass Not Found
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 font-sans selection:bg-indigo-100 overflow-hidden bg-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

            {/* Vibrant Background Mesh */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img
                    src="/images/pass_bg.png"
                    alt="Campus"
                    className="w-full h-full object-cover scale-110 blur-[2px] opacity-40 mix-blend-overlay"
                />

                {/* Animated Gradient Globs */}
                <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-cyan-400/30 blur-[120px] rounded-full animate-pulse transition-all duration-1000"></div>
                <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-rose-400/30 blur-[120px] rounded-full animate-pulse delay-700"></div>
                <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-amber-400/30 blur-[120px] rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-[20%] -right-[20%] w-[60%] h-[60%] bg-indigo-400/30 blur-[120px] rounded-full animate-pulse delay-300"></div>
            </div>

            <div className="relative z-10 w-full max-w-sm">
                {/* Branding Image Top */}
                <div className="flex justify-center mb-6 transition-all duration-700 hover:scale-110 drop-shadow-xl">
                    <img
                        src="/images/event_logo_hd.png"
                        alt="Lavaza"
                        className="w-40 h-auto object-cover rounded-2xl border border-white/50 shadow-xl bg-white/40 backdrop-blur-xl p-2"
                    />
                </div>

                {/* Main Pass Card - VIBRANT LIGHT GLASS */}
                <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.1)] transition-all duration-500 hover:shadow-[0_50px_120px_rgba(99,102,241,0.2)] group">

                    {/* Header Section - VIBRANT GRADIENT */}
                    <div className="bg-gradient-to-r from-indigo-500/10 via-rose-500/10 to-amber-500/10 p-6 flex items-center justify-between border-b border-white/40">
                        <div className="space-y-0.5">
                            <h1 className="text-xl font-bold tracking-[-0.05em] bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 bg-clip-text text-transparent uppercase">
                                VIP PASS
                            </h1>
                            <p className="text-indigo-900/40 text-[7px] uppercase tracking-[0.5em] font-black italic">Lavaza Festival 2026</p>
                        </div>
                        <div className="bg-white/60 p-2 rounded-xl backdrop-blur-md border border-white shadow-sm">
                            <Sparkles className="text-indigo-500 w-4 h-4" />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-6">
                        {/* QR Code Section - CLEAN */}
                        <div className="flex justify-center group/qr">
                            <div className="bg-white p-3 rounded-2xl border border-white shadow-lg flex items-center justify-center w-32 h-32 transform transition-all duration-500 group-hover/qr:scale-105 group-hover/qr:rotate-2">
                                {qr && <img src={qr} alt="QR Code" className="w-full aspect-square contrast-[1.1]" />}
                            </div>
                        </div>

                        {/* User Primary Info */}
                        <div className="text-center space-y-1">
                            <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-1">
                                <span className="text-[8px] uppercase tracking-[0.2em] font-black text-indigo-600">Verified Attendee</span>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter text-zinc-900 capitalize break-words leading-tight">
                                {data.name}
                            </h2>
                        </div>

                        {/* Details Grid - VIBRANT CARDS */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/60 p-3.5 rounded-2xl border border-white/80 space-y-1 text-center transition-all hover:bg-white/80 group/card">
                                <div className="flex items-center justify-center gap-2 text-zinc-400 group-hover/card:text-indigo-500 transition-colors">
                                    <IdCard size={12} />
                                    <span className="text-[8px] uppercase font-bold tracking-[0.2em]">VTU ID</span>
                                </div>
                                <p className="text-sm font-bold text-zinc-800 uppercase leading-none">{data.vtuId}</p>
                            </div>
                            <div className="bg-white/60 p-3.5 rounded-2xl border border-white/80 space-y-1 text-center transition-all hover:bg-white/80 group/card">
                                <div className="flex items-center justify-center gap-2 text-zinc-400 group-hover/card:text-rose-500 transition-colors">
                                    <MapPin size={12} />
                                    <span className="text-[8px] uppercase font-bold tracking-[0.2em]">Dept</span>
                                </div>
                                <p className="text-sm font-bold text-zinc-800 truncate leading-none">{data.dept}</p>
                            </div>
                        </div>

                        {/* Footer Status - VIBRANT */}
                        <div className="pt-4 flex items-center justify-between border-t border-indigo-500/10">
                            <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-3 py-2 rounded-full border border-emerald-500/20 shadow-sm">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">
                                    {data.status}
                                </span>
                            </div>
                            {data.createdAt && (
                                <div className="text-right">
                                    <p className="text-[8px] text-zinc-400 uppercase font-bold tracking-[0.1em]">Issued On</p>
                                    <p className="text-[11px] text-zinc-600 font-bold">
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
