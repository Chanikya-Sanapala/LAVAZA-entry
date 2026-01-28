"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import QRCode from "qrcode";

import { User, IdCard, GraduationCap, Calendar, CheckCircle, MapPin } from "lucide-react";

export default function PassPage() {
    const params = useParams();
    const token = params?.token as string;

    const [data, setData] = useState<any>(null);
    const [qr, setQr] = useState<string>("");

    useEffect(() => {
        if (!token) return;

        const fetchPass = async () => {
            const q = query(
                collection(db, "passes"),
                where("token", "==", token)
            );

            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const passData = snapshot.docs[0].data();
                setData(passData);

                const qrUrl = `${window.location.origin}/verify?token=${token}`;
                const qrImg = await QRCode.toDataURL(qrUrl, {
                    width: 400,
                    margin: 2,
                    color: {
                        dark: "#000000",
                        light: "#FFFFFF"
                    }
                });
                setQr(qrImg);
            }
        };

        fetchPass();
    }, [token]);

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium animate-pulse">Fetching your pass...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 font-sans selection:bg-indigo-100 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Lexend:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img
                    src="/images/pass_bg.png"
                    alt="Campus"
                    className="w-full h-full object-cover scale-105 blur-[1px] opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-transparent to-indigo-950/80"></div>
            </div>

            <div className="relative z-10 w-full max-w-sm">
                {/* Branding Image Top */}
                <div className="flex justify-center mb-5 transition-all duration-700 hover:scale-105 drop-shadow-2xl">
                    <img
                        src="/images/event_logo_hd.png"
                        alt="Lavaza"
                        className="w-40 h-auto object-cover rounded-2xl border border-white/20 shadow-2xl bg-white/10 backdrop-blur-md p-1.5"
                    />
                </div>

                {/* Main Pass Card */}
                <div className="bg-white/95 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.5)] transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)]">

                    {/* Header Section */}
                    <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-emerald-900 p-6 flex items-center justify-between border-b border-indigo-700/20">
                        <div className="space-y-0.5" style={{ fontFamily: "'Lexend', sans-serif" }}>
                            <h1 className="text-xl font-black tracking-tight text-white uppercase italic">
                                OFFICIAL PASS
                            </h1>
                            <p className="text-emerald-400 text-[8px] uppercase tracking-[0.4em] font-black">Lavaza Festival 2026</p>
                        </div>
                        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20">
                            <CheckCircle className="text-emerald-400 w-4 h-4" />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-5">
                        {/* QR Code Section - Compact & Sharp */}
                        <div className="flex justify-center">
                            <div className="bg-white p-2.5 rounded-2xl border border-slate-100 shadow-[0_10px_25px_rgba(0,0,0,0.05)] flex items-center justify-center w-28 h-28 transform transition-transform hover:scale-105">
                                {qr && <img src={qr} alt="QR Code" className="w-full aspect-square" />}
                            </div>
                        </div>

                        {/* User Primary Info */}
                        <div className="text-center space-y-0.5">
                            <div className="inline-block px-3 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 mb-1.5">
                                <span className="text-[8px] uppercase tracking-[0.2em] font-black text-emerald-700">Verified Attendee</span>
                            </div>
                            <h2 className="text-2xl font-black tracking-tight text-indigo-950 capitalize break-words leading-tight" style={{ fontFamily: "'Lexend', sans-serif" }}>
                                {data.name}
                            </h2>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3" style={{ fontFamily: "'Lexend', sans-serif" }}>
                            <div className="bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100/50 space-y-0.5 text-center">
                                <div className="flex items-center justify-center gap-1.5 text-indigo-400/70">
                                    <IdCard size={10} />
                                    <span className="text-[7px] uppercase font-black tracking-[0.2em]">VTU ID</span>
                                </div>
                                <p className="text-xs font-black text-indigo-900 uppercase leading-none">{data.vtuId}</p>
                            </div>
                            <div className="bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100/50 space-y-0.5 text-center">
                                <div className="flex items-center justify-center gap-1.5 text-indigo-400/70">
                                    <MapPin size={10} />
                                    <span className="text-[7px] uppercase font-black tracking-[0.2em]">DEPT</span>
                                </div>
                                <p className="text-xs font-black text-indigo-900 truncate leading-none">{data.dept}</p>
                            </div>
                        </div>

                        {/* Footer Status */}
                        <div className="pt-4 flex items-center justify-between border-t border-slate-100/70">
                            <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                                <span className="text-[8px] font-black text-emerald-700 uppercase tracking-[0.2em] leading-none">
                                    {data.status}
                                </span>
                            </div>
                            {data.createdAt && (
                                <div className="text-right">
                                    <p className="text-[7px] text-slate-400 uppercase font-black tracking-widest">Issued On</p>
                                    <p className="text-[10px] text-slate-700 font-bold">
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
