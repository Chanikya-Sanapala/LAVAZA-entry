"use client";

import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import {
    updateDoc,
    doc,
    getDoc,
} from "firebase/firestore";

import toast from "react-hot-toast";
import { CheckCircle, XCircle, AlertCircle, Loader2, ShieldCheck, User, IdCard, MapPin, GraduationCap } from "lucide-react";

function VerifyContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token")?.trim();

    const [status, setStatus] = useState<"loading" | "allowed" | "used" | "invalid" | "success">("loading");
    const [student, setStudent] = useState<any>(null);
    const [loadingAction, setLoading] = useState(false);

    const handleAdmit = async () => {
        if (!student || !student.id) return;
        try {
            setLoading(true);
            await updateDoc(doc(db, "registrations", student.id), {
                status: "USED",
            });
            setStatus("success");
            toast.success("Entry confirmed! ✅");
        } catch (err: any) {
            toast.error("Failed to confirm entry");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            setStatus("invalid");
            return;
        }

        const verifyPass = async () => {
            try {
                const docRef = doc(db, "registrations", token);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    setStatus("invalid");
                    return;
                }

                const data = docSnap.data();
                setStudent({ ...data, id: docSnap.id });

                if (data.status === "USED") {
                    setStatus("used");
                    return;
                }

                setStatus("allowed");
            } catch (err: any) {
                console.error("Verification error:", err);
                toast.error(`Verification failed: ${err.message}`);
                setStatus("invalid");
            }
        };

        verifyPass();
    }, [token]);

    const Container = ({ children }: { children: React.ReactNode }) => (
        <div className="relative min-h-screen flex items-center justify-center p-4 font-sans selection:bg-white/10 overflow-hidden bg-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

            {/* Background Image with Deep Overlay */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img
                    src="/images/pass_bg.png"
                    alt="Campus"
                    className="w-full h-full object-cover scale-110 blur-[3px] opacity-20 grayscale"
                />
                <div className="absolute inset-0 bg-zinc-950/95"></div>
            </div>

            <div className="relative z-10 w-full max-w-sm">
                {children}
            </div>
        </div>
    );

    if (status === "loading") {
        return (
            <Container>
                <div className="flex flex-col items-center gap-4 text-white">
                    <Loader2 className="w-12 h-12 text-zinc-500 animate-spin" />
                    <p className="text-xl font-bold tracking-tight">Verifying Pass...</p>
                </div>
            </Container>
        );
    }

    if (status === "success") {
        return (
            <Container>
                <div className="bg-zinc-900/60 backdrop-blur-3xl border border-emerald-500/30 rounded-[3rem] p-8 text-center shadow-[0_40px_100px_rgba(16,185,129,0.1)]">
                    <div className="flex justify-center mb-6">
                        <div className="bg-emerald-500/20 p-4 rounded-full border border-emerald-500/30">
                            <CheckCircle className="text-emerald-400 w-16 h-16" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tighter">ENTRY GRANTED</h1>
                    <p className="text-zinc-400 mb-8 uppercase tracking-widest text-[10px] font-black">Authorized Personnel Only</p>

                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mb-8">
                        <p className="text-white text-xl font-bold">{student?.name}</p>
                        <p className="text-zinc-500 text-sm uppercase font-bold tracking-widest mt-1">{student?.vtuId}</p>
                    </div>

                    <div className="py-3 px-6 bg-emerald-600/20 text-emerald-400 rounded-full font-black text-xs tracking-[0.2em] border border-emerald-500/30 inline-block">
                        ACCESS CONFIRMED ✅
                    </div>
                </div>
            </Container>
        );
    }

    if (status === "invalid") {
        return (
            <Container>
                <div className="bg-zinc-900/60 backdrop-blur-3xl border border-rose-500/30 rounded-[3rem] p-8 text-center shadow-[0_40px_100px_rgba(244,63,94,0.1)]">
                    <div className="flex justify-center mb-6">
                        <div className="bg-rose-500/20 p-4 rounded-full border border-rose-500/30">
                            <XCircle className="text-rose-400 w-16 h-16" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4 tracking-tighter uppercase">INVALID PASS</h1>
                    <p className="text-zinc-400 mb-8 text-sm leading-relaxed">The scanned pass is either non-existent or has a corrupted token. Do not grant entry.</p>

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-4 bg-rose-600/20 text-rose-400 rounded-2xl font-bold border border-rose-500/30 hover:bg-rose-600/30 transition-all"
                    >
                        RE-SCAN SYSTEM
                    </button>
                </div>
            </Container>
        );
    }

    if (status === "used") {
        return (
            <Container>
                <div className="bg-zinc-900/60 backdrop-blur-3xl border border-amber-500/30 rounded-[3rem] p-8 text-center shadow-[0_40px_100px_rgba(245,158,11,0.1)]">
                    <div className="flex justify-center mb-6">
                        <div className="bg-amber-500/20 p-4 rounded-full border border-amber-500/30">
                            <AlertCircle className="text-amber-400 w-16 h-16" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tighter uppercase">ALREADY ENTERED</h1>
                    <p className="text-zinc-500 mb-8 uppercase tracking-widest text-[10px] font-black">Duplicate Entry Attempt</p>

                    <div className="bg-white/5 rounded-2xl p-5 border border-white/5 mb-8 text-left space-y-3">
                        <div className="flex items-center gap-3">
                            <User size={16} className="text-amber-400" />
                            <p className="text-white font-bold">{student?.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <IdCard size={16} className="text-amber-400" />
                            <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">{student?.vtuId}</p>
                        </div>
                    </div>

                    <p className="text-rose-400 text-xs font-black uppercase tracking-[0.1em] border-t border-white/5 pt-6 leading-relaxed">
                        This pass was scanned previously and is no longer valid for entry.
                    </p>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="bg-zinc-900/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
                {/* Header Section */}
                <div className="bg-white/5 p-6 flex items-center justify-between border-b border-white/5">
                    <div className="space-y-0.5">
                        <h1 className="text-xl font-bold tracking-[-0.05em] text-white uppercase">
                            VALID PASS
                        </h1>
                        <p className="text-zinc-500 text-[7px] uppercase tracking-[0.5em] font-black">Verification System</p>
                    </div>
                    <div className="bg-emerald-500/20 p-2 rounded-xl backdrop-blur-md border border-emerald-500/30">
                        <ShieldCheck className="text-emerald-400 w-4 h-4" />
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Student Details Grid */}
                    <div className="space-y-4">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
                            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                                <User className="text-zinc-500 w-4 h-4" />
                                <div>
                                    <p className="text-[8px] uppercase font-bold text-zinc-600 tracking-widest">Full Name</p>
                                    <p className="text-white font-bold text-lg">{student?.name}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <IdCard size={10} className="text-zinc-500" />
                                        <p className="text-[8px] uppercase font-bold text-zinc-600 tracking-widest">VTU ID</p>
                                    </div>
                                    <p className="text-white font-bold text-sm uppercase">{student?.vtuId}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin size={10} className="text-zinc-500" />
                                        <p className="text-[8px] uppercase font-bold text-zinc-600 tracking-widest">Department</p>
                                    </div>
                                    <p className="text-white font-bold text-sm truncate">{student?.dept}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <GraduationCap size={10} className="text-zinc-500" />
                                        <p className="text-[8px] uppercase font-bold text-zinc-600 tracking-widest">Year</p>
                                    </div>
                                    <p className="text-white font-bold text-sm">{student?.year}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <AlertCircle size={10} className="text-zinc-500" />
                                        <p className="text-[8px] uppercase font-bold text-zinc-600 tracking-widest">Status</p>
                                    </div>
                                    <p className="text-emerald-400 font-black text-[10px] uppercase tracking-widest">{student?.status}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleAdmit}
                        disabled={loadingAction}
                        className={`w-full py-5 text-lg font-black text-white rounded-[1.5rem] shadow-2xl transition-all active:scale-95 group relative overflow-hidden ${loadingAction
                                ? 'bg-zinc-800'
                                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40'
                            }`}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {loadingAction ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>CONFIRM ENTRY 🔓</>
                            )}
                        </span>
                        {!loadingAction && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        )}
                    </button>

                    <p className="text-center text-zinc-500 text-[8px] font-bold uppercase tracking-[0.2em]">Authorized Gate Verification Required</p>
                </div>
            </div>
        </Container>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center bg-black">
                <Loader2 className="w-10 h-10 text-zinc-700 animate-spin" />
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}
