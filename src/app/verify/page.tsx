"use client";

import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
    updateDoc,
    doc,
    getDoc,
} from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

import toast from "react-hot-toast";
import { CheckCircle, XCircle, AlertCircle, Loader2, ShieldCheck, User, IdCard, MapPin, GraduationCap, Sparkles, LogIn } from "lucide-react";

function VerifyContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token")?.trim();

    const [status, setStatus] = useState<"loading" | "allowed" | "used" | "invalid" | "success">("loading");
    const [student, setStudent] = useState<any>(null);
    const [loadingAction, setLoading] = useState(false);
    const [admin, setAdmin] = useState<any>(auth.currentUser);

    // Sync auth state
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setAdmin(user);
        });
        return () => unsubscribe();
    }, []);

    const handleAdmit = async () => {
        if (!student || !student.id) return;

        try {
            setLoading(true);

            // 1️⃣ Ensure Admin Authentication
            let currentUser = auth.currentUser;
            if (!currentUser) {
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);
                currentUser = result.user;
            }

            const email = currentUser.email?.toLowerCase();
            if (!email || !email.endsWith("@veltech.edu.in")) {
                toast.error("Access Denied: Use your official @veltech.edu.in admin account");
                await signOut(auth);
                return;
            }

            // 2️⃣ Update Status
            await updateDoc(doc(db, "registrations", student.id), {
                status: "USED",
            });

            setStatus("success");
            toast.success("Entry confirmed! ✅");
        } catch (err: any) {
            console.error(err);
            toast.error(`Verification failed: ${err.message || "Permissions insufficient"}`);
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
        <div className="relative min-h-screen flex items-center justify-center p-4 font-sans selection:bg-indigo-100 overflow-hidden bg-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

            {/* Vibrant Background Mesh */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img
                    src="/images/pass_bg.png"
                    alt="Campus"
                    className="w-full h-full object-cover scale-110 blur-[2px] opacity-20 mix-blend-overlay"
                />
                <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-indigo-400/20 blur-[120px] rounded-full animate-pulse transition-all duration-1000"></div>
                <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-rose-400/20 blur-[120px] rounded-full animate-pulse delay-700"></div>
                <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-amber-400/20 blur-[120px] rounded-full animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 w-full max-w-sm">
                {children}
            </div>
        </div>
    );

    if (status === "loading") {
        return (
            <Container>
                <div className="flex flex-col items-center gap-4 text-indigo-600">
                    <Loader2 className="w-12 h-12 animate-spin" />
                    <p className="text-xl font-bold tracking-tight">Verifying Pass...</p>
                </div>
            </Container>
        );
    }

    if (status === "success") {
        return (
            <Container>
                <div className="bg-white/60 backdrop-blur-3xl border border-emerald-500/30 rounded-[3rem] p-8 text-center shadow-[0_40px_100px_rgba(16,185,129,0.1)]">
                    <div className="flex justify-center mb-6">
                        <div className="bg-emerald-500/10 p-4 rounded-full border border-emerald-500/20 shadow-sm transition-transform hover:scale-110">
                            <CheckCircle className="text-emerald-500 w-16 h-16" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-zinc-900 mb-2 tracking-tighter">ENTRY GRANTED</h1>
                    <p className="text-emerald-600/60 mb-8 uppercase tracking-widest text-[10px] font-black italic">Authorized Personnel Only</p>

                    <div className="bg-white/40 rounded-2xl p-4 border border-white mb-8 shadow-sm">
                        <p className="text-zinc-900 text-xl font-bold">{student?.name}</p>
                        <p className="text-zinc-500 text-sm uppercase font-bold tracking-widest mt-1">{student?.vtuId}</p>
                    </div>

                    <div className="py-3 px-6 bg-emerald-500/10 text-emerald-600 rounded-full font-black text-xs tracking-[0.2em] border border-emerald-500/20 inline-block shadow-sm">
                        ACCESS CONFIRMED ✅
                    </div>
                </div>
            </Container>
        );
    }

    if (status === "invalid") {
        return (
            <Container>
                <div className="bg-white/60 backdrop-blur-3xl border border-rose-500/30 rounded-[3rem] p-8 text-center shadow-[0_40px_100px_rgba(244,63,94,0.1)]">
                    <div className="flex justify-center mb-6">
                        <div className="bg-rose-500/10 p-4 rounded-full border border-rose-500/20 shadow-sm">
                            <XCircle className="text-rose-500 w-16 h-16" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900 mb-4 tracking-tighter uppercase leading-none">INVALID PASS</h1>
                    <p className="text-zinc-500 mb-8 text-sm leading-relaxed">The scanned pass is either non-existent or has a corrupted token. Do not grant entry.</p>

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-4 bg-rose-500/10 text-rose-600 rounded-2xl font-bold border border-rose-500/20 hover:bg-rose-500/20 transition-all shadow-sm"
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
                <div className="bg-white/60 backdrop-blur-3xl border border-amber-500/30 rounded-[3rem] p-8 text-center shadow-[0_40px_100px_rgba(245,158,11,0.1)]">
                    <div className="flex justify-center mb-6">
                        <div className="bg-amber-500/10 p-4 rounded-full border border-amber-500/20 shadow-sm">
                            <AlertCircle className="text-amber-500 w-16 h-16" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900 mb-2 tracking-tighter uppercase leading-none">ALREADY ENTERED</h1>
                    <p className="text-amber-600/60 mb-8 uppercase tracking-widest text-[10px] font-black italic">Duplicate Entry Attempt</p>

                    <div className="bg-white/40 rounded-2xl p-5 border border-white mb-8 text-left space-y-3 shadow-sm">
                        <div className="flex items-center gap-3">
                            <User size={16} className="text-amber-500" />
                            <p className="text-zinc-900 font-bold">{student?.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <IdCard size={16} className="text-amber-500" />
                            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">{student?.vtuId}</p>
                        </div>
                    </div>

                    <p className="text-rose-600 text-[10px] font-black uppercase tracking-[0.1em] border-t border-indigo-500/10 pt-6 leading-relaxed">
                        This pass was scanned previously and is no longer valid for entry.
                    </p>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="bg-white/60 backdrop-blur-3xl border border-white rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.05)] transition-all duration-500 group">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-indigo-500/5 via-rose-500/5 to-amber-500/5 p-6 flex items-center justify-between border-b border-white">
                    <div className="space-y-0.5">
                        <h1 className="text-xl font-bold tracking-[-0.05em] bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 bg-clip-text text-transparent uppercase">
                            VALID PASS
                        </h1>
                        <p className="text-indigo-900/40 text-[7px] uppercase tracking-[0.5em] font-black italic">Verification System</p>
                    </div>
                    <div className="bg-white/80 p-2 rounded-xl backdrop-blur-md border border-white shadow-sm">
                        <ShieldCheck className="text-indigo-500 w-4 h-4" />
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Student Details Grid */}
                    <div className="space-y-4">
                        <div className="bg-white/40 p-5 rounded-2xl border border-white space-y-4 shadow-sm transition-all group-hover:bg-white/60">
                            <div className="flex items-center gap-4 border-b border-indigo-500/5 pb-4">
                                <div className="bg-indigo-500/10 p-2 rounded-lg">
                                    <User className="text-indigo-600 w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[8px] uppercase font-bold text-indigo-400 tracking-widest">Full Name</p>
                                    <p className="text-zinc-900 font-bold text-xl tracking-tight">{student?.name}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <IdCard size={10} className="text-rose-400" />
                                        <p className="text-[8px] uppercase font-bold text-rose-400 tracking-widest">VTU ID</p>
                                    </div>
                                    <p className="text-zinc-800 font-bold text-sm uppercase">{student?.vtuId}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={10} className="text-amber-400" />
                                        <p className="text-[8px] uppercase font-bold text-amber-400 tracking-widest">Department</p>
                                    </div>
                                    <p className="text-zinc-800 font-bold text-sm truncate">{student?.dept}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-indigo-500/5 pt-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <GraduationCap size={10} className="text-indigo-400" />
                                        <p className="text-[8px] uppercase font-bold text-indigo-400 tracking-widest">Year</p>
                                    </div>
                                    <p className="text-zinc-800 font-bold text-sm">{student?.year}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={10} className="text-emerald-400" />
                                        <p className="text-[8px] uppercase font-bold text-emerald-400 tracking-widest">Status</p>
                                    </div>
                                    <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]">{student?.status}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleAdmit}
                        disabled={loadingAction}
                        className={`w-full py-5 text-lg font-black text-white rounded-[1.5rem] shadow-xl transition-all active:scale-95 group relative overflow-hidden ${loadingAction
                                ? 'bg-zinc-200 text-zinc-400'
                                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/20'
                            }`}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {loadingAction ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {!admin && <LogIn className="w-5 h-5" />}
                                    {admin ? "CONFIRM ENTRY 🔓" : "LOGIN TO VERIFY"}
                                </>
                            )}
                        </span>
                        {!loadingAction && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        )}
                    </button>

                    <p className="text-center text-zinc-400 text-[8px] font-bold uppercase tracking-[0.2em]">
                        {admin ? `Logged in as ${admin.email}` : "Authorized Gate Verification Required"}
                    </p>
                </div>
            </div>
        </Container>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}
