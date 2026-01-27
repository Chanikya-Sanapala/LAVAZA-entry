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
            <nav className="flex justify-between items-center px-6 md:px-12 py-4 bg-white">
                <div className="text-xl font-bold tracking-tighter flex items-center gap-2 text-black">
                    <img src="/images/college_logo.png" className="h-8 w-auto" alt="Veltech" />
                    <span>Veltech university</span>
                </div>
                <div className="flex gap-6 md:gap-10 text-sm font-medium">
                    <a href="/" className="hover:text-orange-600 transition-colors">Home</a>
                    <a href="/register" className="underline decoration-2 underline-offset-4">Register</a>
                    <a href="#" className="hover:text-orange-600 transition-colors">About</a>
                    <a href="#" className="hover:text-orange-600 transition-colors">Contact</a>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="px-6 md:px-12 pt-16 overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
                    <h1 className="text-8xl md:text-[14rem] font-[family-name:var(--font-pinyon)] leading-[0.8] pt-12">
                        Vel Tech
                    </h1>

                    <div className="flex gap-8 md:gap-16 pb-8 md:pb-12 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                        <div>
                            <p>Strategy,Design,</p>
                            <p className="text-black">Performace</p>
                        </div>
                        <div>
                            <p>Global Creative</p>
                            <p className="text-black">& Technical Agency</p>
                        </div>
                    </div>
                </div>

                {/* Lavaza Logo Area */}
                <div className="mt-[-2rem] md:mt-[-4rem] flex justify-center w-full">
                    <img
                        src="/images/event_logo_hd.png"
                        alt="Lavaza"
                        className="w-full h-auto max-h-[200px] md:max-h-[350px] object-contain"
                    />
                </div>

                {/* Registration Form */}
                <section id="register-form" className="mt-[-2rem] md:mt-[-6rem] max-w-4xl mx-auto pb-24 relative z-10">
                    <div className="bg-gray-50/50 p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
                        <div className="text-center mb-12">
                            <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-orange-600">Secure Entry</span>
                            <h2 className="text-4xl font-bold tracking-tighter mt-2">Registration Form</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white px-6 py-4 border-2 border-gray-200 focus:border-black rounded-xl outline-none transition-all shadow-sm text-lg text-black"
                                />
                            </div>

                            {/* Department */}
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 ml-1">Department</label>
                                <div className="relative">
                                    <select
                                        value={dept}
                                        onChange={(e) => setDept(e.target.value)}
                                        className="w-full bg-white px-6 py-4 border-2 border-gray-200 focus:border-black rounded-xl outline-none transition-all shadow-sm text-lg text-black appearance-none"
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
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            {/* Year */}
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 ml-1">Year</label>
                                <div className="relative">
                                    <select
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="w-full bg-white px-6 py-4 border-2 border-gray-200 focus:border-black rounded-xl outline-none transition-all shadow-sm text-lg text-black appearance-none"
                                    >
                                        <option value="">Select Year</option>
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                        <option value="PG">PG</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="md:col-span-2 pt-6">
                                <button
                                    onClick={handleRegister}
                                    disabled={loading}
                                    className="w-full bg-black hover:bg-gray-800 text-white py-6 rounded-2xl text-xl font-bold transition-all active:scale-[0.98] disabled:bg-gray-400 shadow-xl shadow-gray-200"
                                >
                                    {loading ? "Processing..." : "Sign in with Google"}
                                </button>
                                <p className="text-center text-[11px] text-gray-400 font-bold mt-6 uppercase tracking-widest flex items-center justify-center gap-2">
                                    <span className="w-8 h-[1px] bg-gray-200"></span>
                                    Official Email Required (@veltech.edu.in)
                                    <span className="w-8 h-[1px] bg-gray-200"></span>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
