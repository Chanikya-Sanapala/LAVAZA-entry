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
                collection(db, "passes"),
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
            await setDoc(doc(db, "passes", token), {
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
        <div className="min-h-screen bg-white text-black font-sans selection:bg-orange-100">
            {/* Navbar */}
            <nav className="flex justify-between items-center px-6 md:px-12 py-4 bg-white border-b border-gray-100">
                <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
                    <img src="/images/college_logo.png" className="h-8 w-auto" alt="Veltech" />
                    <span className="hidden sm:inline">Veltech university</span>
                </div>
                <div className="flex gap-6 md:gap-10 text-sm font-medium">
                    <a href="/" className="hover:text-orange-600 transition-colors">Home</a>
                    <a href="/register" className="underline decoration-2 underline-offset-4">Register</a>
                    <a href="#" className="hover:text-orange-600 transition-colors">About</a>
                    <a href="#" className="hover:text-orange-600 transition-colors">Contact</a>
                </div>
            </nav>

            {/* Hero Text Section */}
            <main className="px-6 md:px-12 pt-8 pb-8 overflow-hidden">
                <div className="relative py-4">
                    <h1 className="text-7xl md:text-[10rem] font-[family-name:var(--font-pinyon)] leading-none mb-0">
                        Vel Tech
                    </h1>

                    <div className="flex flex-col md:flex-row justify-end gap-8 md:gap-24 mt-0 md:mt-[-3rem]">
                        <div className="max-w-[150px]">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Strategy,Design,</p>
                            <p className="text-xs leading-tight font-medium uppercase font-bold">Performace</p>
                        </div>
                        <div className="max-w-[150px]">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Global Creative</p>
                            <p className="text-xs leading-tight font-medium uppercase font-bold">& Technical Agency</p>
                        </div>
                    </div>
                </div>

                {/* Hero Image Container */}
                <div className="mt-4 relative group">
                    <div className="overflow-hidden rounded-[1rem] bg-white flex items-center justify-center p-2">
                        <img
                            src="/images/event_logo_hd.png"
                            alt="Lavaza Fest"
                            className="w-full h-auto md:h-[500px] object-cover scale-110 transition-transform duration-700 group-hover:scale-125"
                        />
                    </div>
                </div>

                {/* Registration Form Section */}
                <section id="register-form" className="mt-4 max-w-4xl mx-auto pb-8">
                    <div className="text-center mb-4">
                        <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-orange-600">Secure Entry</span>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mt-2">Registration Form</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/50 p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        {/* VTU ID */}
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 ml-1">VTU ID</label>
                            <input
                                type="text"
                                placeholder="vtu12345"
                                value={vtuId}
                                onChange={(e) => setVtuId(e.target.value)}
                                className="w-full bg-white px-6 py-4 border-2 border-gray-200 focus:border-black rounded-xl outline-none transition-all shadow-sm text-lg text-black"
                            />
                        </div>

                        {/* Name */}
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 ml-1">Full Name</label>
                            <input
                                type="text"
                                placeholder="Mahesh Chanu"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white px-6 py-4 border-2 border-gray-200 focus:border-black rounded-xl outline-none transition-all shadow-sm text-lg text-black"
                            />
                        </div>

                        {/* Department */}
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 ml-1">Department</label>
                            <select
                                value={dept}
                                onChange={(e) => setDept(e.target.value)}
                                className="w-full bg-white px-6 py-4 border-2 border-gray-200 focus:border-black rounded-xl outline-none transition-all shadow-sm text-lg appearance-none cursor-pointer text-black"
                            >
                                <option value="">Select Dept</option>
                                <option value="CSE">CSE</option>
                                <option value="ECE">ECE</option>
                                <option value="EEE">EEE</option>
                                <option value="MECH">MECH</option>
                                <option value="AERO">AERO</option>
                                <option value="CIVIL">CIVIL</option>
                                <option value="MBA">MBA</option>
                            </select>
                        </div>

                        {/* Year */}
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 ml-1">Year</label>
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full bg-white px-6 py-4 border-2 border-gray-200 focus:border-black rounded-xl outline-none transition-all shadow-sm text-lg appearance-none cursor-pointer text-black"
                            >
                                <option value="">Select Year</option>
                                <option value="1st Year">1st Year</option>
                                <option value="2nd Year">2nd Year</option>
                                <option value="3rd Year">3rd Year</option>
                                <option value="4th Year">4th Year</option>
                                <option value="PG">PG</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-2 pt-4">
                            <button
                                onClick={handleRegister}
                                disabled={loading}
                                className="w-full bg-black hover:bg-gray-800 text-white py-6 rounded-2xl text-xl font-bold tracking-tight transition-all active:scale-95 shadow-xl disabled:bg-gray-400 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span>Sign in with Google</span>
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.62 4.21 1.72l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[10px] text-gray-400 mt-6 font-bold tracking-widest uppercase">official email required • @veltech.edu.in</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-12 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100">
                    <img src="/images/college_logo.png" className="h-6 w-auto" alt="Veltech" />
                    <span className="text-[10px] font-extrabold uppercase tracking-tighter">Veltech University</span>
                </div>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">© 2026 Lavaza . All rights reserved</p>
            </footer>
        </div>
    );
}
