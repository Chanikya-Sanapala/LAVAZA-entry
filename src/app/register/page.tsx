"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
            alert("Please fill all fields");
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
                alert("Please use your official @veltech.edu.in email");
                await signOut(auth);
                setLoading(false);
                return;
            }

            // 2️⃣ Match VTU ID with email
            const vtuFromEmail = email.split("@")[0]; // vtu21761

            if (vtuFromEmail !== vtuId.toLowerCase()) {
                alert("VTU ID does not match your official email");
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
                alert("You have already registered");
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
            router.push(`/pass/${token}`);
        } catch (err) {
            console.error(err);
            alert("Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center text-black">
                    Lavaza Registration 🎉
                </h1>

                {/* VTU ID */}
                <input
                    type="text"
                    placeholder="vtu ID (e.g. vtu*****)"
                    value={vtuId}
                    onChange={(e) => setVtuId(e.target.value)}
                    className="w-full mb-3 px-4 py-2 border border-black rounded text-black"
                />

                {/* Name */}
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mb-3 px-4 py-2 border border-black rounded text-black"
                />

                {/* Department */}
                <select
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="w-full mb-3 px-4 py-2 border border-black rounded text-black"
                >
                    <option value="">Select Department</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="AERO">AERO</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="MBA">MBA</option>
                </select>

                {/* Year */}
                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full mb-5 px-4 py-2 border border-black rounded text-black"
                >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="PG">PG</option>
                </select>

                {/* Google Button */}
                <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full py-3 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-60"
                >
                    {loading ? "Registering..." : "Sign in with Google"}
                </button>

                <p className="text-xs text-black text-center mt-4">
                    Use your official <b>@veltech.edu.in</b> email
                </p>
            </div>
        </div>
    );
}
