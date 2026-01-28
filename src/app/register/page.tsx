"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    setDoc,
    serverTimestamp,
} from "firebase/firestore";

export default function RegisterPage() {
    const router = useRouter();

    // Form state
    const [vtuId, setVtuId] = useState("");
    const [name, setName] = useState("");
    const [dept, setDept] = useState("");
    const [year, setYear] = useState("");
    const [loading, setLoading] = useState(false);

    // Token generator
    const generateToken = (vtu: string) => {
        const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `LAVAZA_${vtu.toUpperCase()}_${rand}`;
    };

    const handleRegister = async () => {
        if (!vtuId || !name || !dept || !year) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            // Google Sign-in
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const email = user.email?.toLowerCase();

            // 1️⃣ Check official email
            if (!email || !email.endsWith("@veltech.edu.in")) {
                toast.error("Please use your official @veltech.edu.in email");
                await signOut(auth);
                setLoading(false);
                return;
            }

            // 2️⃣ Match VTU ID with email
            const vtuFromEmail = email.split("@")[0]; // vtu21761

            if (vtuFromEmail !== vtuId.toLowerCase()) {
                toast.error("VTU ID does not match your official email");
                await signOut(auth);
                setLoading(false);
                return;
            }

            // 3️⃣ Prevent duplicate registration
            const q = query(
                collection(db, "registrations"),
                where("vtuId", "==", vtuId.toLowerCase())
            );
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const existingData = snapshot.docs[0].data();
                toast.success("Welcome back! Redirecting to your pass...");
                router.push(`/pass/${existingData.token}`);
                setLoading(false);
                return;
            }

            // 4️⃣ Generate token
            const token = generateToken(vtuId);

            // 5️⃣ Save to Firestore
            await setDoc(doc(db, "registrations", token), {
                vtuId: vtuId.toLowerCase(),
                name,
                dept,
                year,
                email,
                token,
                status: "ACTIVE",
                createdAt: serverTimestamp(),
            });

            // 6️⃣ Redirect to pass page
            toast.success("Registration successful! 🎉");
            router.push(`/pass/${token}`);
        } catch (err: any) {
            console.error(err);
            toast.error(`Registration failed: ${err.message || "Try again."}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative h-screen text-white font-sans selection:bg-orange-500/30 overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" />
            {/* Video Background */}
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-black">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute w-full h-full object-cover opacity-100"
                >
                    <source src="/videos/bg_video.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-20 flex justify-between items-center px-6 md:px-12 py-3 bg-transparent h-14">
                <div className="text-lg font-bold tracking-tighter flex items-center gap-2">
                    <div className="bg-white p-1 rounded-md">
                        <img src="/images/college_logo.png" className="h-5 w-auto" alt="Veltech" />
                    </div>
                    <span className="drop-shadow-md text-base">Veltech University</span>
                </div>
                <div className="hidden md:flex gap-6 text-[10px] font-semibold uppercase tracking-wider">
                    <a href="/" className="hover:text-orange-500 transition-colors drop-shadow-md">Home</a>
                    <a href="/register" className="text-orange-500 font-black decoration-2 underline-offset-4">Register</a>
                    <a href="#" className="hover:text-orange-500 transition-colors drop-shadow-md">About</a>
                    <a href="#" className="hover:text-orange-500 transition-colors drop-shadow-md">Contact</a>
                </div>
            </nav>

            {/* Main Content */}
            <main className="relative z-10 px-6 md:px-12 flex flex-col items-center justify-center h-[calc(100vh-56px)] overflow-hidden">
                {/* Branding Image */}
                <div className="w-full max-w-[220px] mb-3 transition-all duration-700 hover:scale-105">
                    <img
                        src="/images/event_logo_hd.png"
                        alt="Lavaza"
                        className="w-full h-auto object-cover rounded-lg shadow-[0_0_15px_rgba(255,100,0,0.1)] border border-white/5"
                    />
                </div>

                {/* Registration Form Card */}
                <section id="register-form" className="w-full max-w-xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-3xl p-4 md:p-6 rounded-[1.5rem] border border-white/20 shadow-2xl transition-all duration-500 hover:border-white/30 hover:bg-white/15">
                        <div className="text-center mb-4">
                            <div className="inline-block px-3 py-0.5 rounded-full bg-white/10 border border-white/20 mb-1.5 transition-all hover:bg-white/20">
                                <span className="text-[8px] uppercase tracking-[0.3em] font-black text-white">Secure Entry</span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] leading-tight">Registration</h2>
                            <p className="text-white/60 mt-0.5 text-[9px] font-medium uppercase tracking-[0.1em]">Event Management System</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* VTU ID */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/70 ml-1">VTU ID</label>
                                <input
                                    type="text"
                                    placeholder="vtu12345"
                                    value={vtuId}
                                    onChange={(e) => setVtuId(e.target.value)}
                                    className="w-full bg-white/5 px-5 py-3.5 border-2 border-white/10 focus:border-orange-500 rounded-xl outline-none transition-all text-base text-white placeholder:text-white/20 focus:bg-white/10 shadow-inner"
                                />
                            </div>

                            {/* Name */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/70 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/5 px-5 py-3.5 border-2 border-white/10 focus:border-orange-500 rounded-xl outline-none transition-all text-base text-white placeholder:text-white/20 focus:bg-white/10 shadow-inner"
                                />
                            </div>

                            {/* Department */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/70 ml-1">Department</label>
                                <div className="relative">
                                    <select
                                        value={dept}
                                        onChange={(e) => setDept(e.target.value)}
                                        className="w-full bg-white/5 px-5 py-3.5 border-2 border-white/10 focus:border-orange-500 rounded-xl outline-none transition-all text-base text-white appearance-none focus:bg-white/10 cursor-pointer shadow-inner"
                                    >
                                        <option value="" className="bg-black text-white/40">Select Dept</option>
                                        <option value="CSE" className="bg-black">CSE</option>
                                        <option value="ECE" className="bg-black">ECE</option>
                                        <option value="EEE" className="bg-black">EEE</option>
                                        <option value="MECH" className="bg-black">MECH</option>
                                        <option value="AERO" className="bg-black">AERO</option>
                                        <option value="CIVIL" className="bg-black">CIVIL</option>
                                        <option value="MBA" className="bg-black">MBA</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-orange-500 text-xs animate-pulse">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            {/* Year */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/70 ml-1">Year</label>
                                <div className="relative">
                                    <select
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="w-full bg-white/5 px-5 py-3.5 border-2 border-white/10 focus:border-orange-500 rounded-xl outline-none transition-all text-base text-white appearance-none focus:bg-white/10 cursor-pointer shadow-inner"
                                    >
                                        <option value="" className="bg-black text-white/40">Select Year</option>
                                        <option value="1st Year" className="bg-black">1st Year</option>
                                        <option value="2nd Year" className="bg-black">2nd Year</option>
                                        <option value="3rd Year" className="bg-black">3rd Year</option>
                                        <option value="4th Year" className="bg-black">4th Year</option>
                                        <option value="PG" className="bg-black">PG</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-orange-500 text-xs animate-pulse">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="md:col-span-2 pt-1.5">
                                <button
                                    onClick={handleRegister}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 text-white py-3 rounded-lg text-sm font-black transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-orange-600/20 group"
                                >
                                    <span className="flex items-center justify-center gap-3">
                                        {loading ? (
                                            "Processing..."
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                    <path
                                                        fill="currentColor"
                                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                    />
                                                    <path
                                                        fill="currentColor"
                                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                    />
                                                    <path
                                                        fill="currentColor"
                                                        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94L5.84 14.1z"
                                                    />
                                                    <path
                                                        fill="currentColor"
                                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                                    />
                                                </svg>
                                                <span>Sign in with Google</span>
                                            </>
                                        )}
                                    </span>
                                </button>
                                <p className="text-center text-[8px] text-white/40 font-bold mt-3 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                    <span className="w-6 h-[1px] bg-white/20"></span>
                                    Official Email Required (@veltech.edu.in)
                                    <span className="w-6 h-[1px] bg-white/20"></span>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
