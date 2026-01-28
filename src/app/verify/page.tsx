"use client";

import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    getDoc,
    query,
    where,
    updateDoc,
    doc,
} from "firebase/firestore";

import toast from "react-hot-toast";

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

    // UI STATES
    if (status === "loading") {
        return (
            <div className="h-screen flex items-center justify-center text-2xl text-black">
                Verifying pass...
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="h-screen flex items-center justify-center bg-green-100 p-4 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-green-500 max-w-sm w-full">
                    <div className="text-6xl mb-4">🏆</div>
                    <h1 className="text-4xl font-extrabold text-green-700 mb-2">ENTRY GRANTED</h1>
                    <p className="text-xl text-gray-700 font-medium">{student?.name}</p>
                    <div className="mt-6 py-3 px-6 bg-green-600 text-white rounded-full font-bold inline-block animate-bounce">
                        DONE! ✅
                    </div>
                </div>
            </div>
        );
    }

    if (status === "invalid") {
        return (
            <div className="h-screen flex items-center justify-center bg-red-100 p-4">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-600">❌ INVALID PASS</h1>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (status === "used") {
        return (
            <div className="h-screen flex items-center justify-center bg-red-100 p-4">
                <div className="text-center text-black">
                    <h1 className="text-4xl font-bold text-red-600">⛔ ALREADY ENTERED</h1>
                    <div className="mt-4 p-4 bg-white rounded-xl shadow-sm border border-red-200">
                        <p className="text-xl font-bold">{student?.name}</p>
                        <p className="text-lg">{student?.vtuId?.toUpperCase()}</p>
                    </div>
                    <p className="mt-4 text-gray-600">This pass has already been used for entry.</p>
                </div>
            </div>
        );
    }

    // allowed state (Not yet used)
    return (
        <div className="h-screen flex items-center justify-center bg-green-50 p-4">
            <div className="text-center text-black w-full max-w-sm">
                <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-green-500">
                    <h1 className="text-3xl font-bold text-green-700 mb-4">✅ VALID PASS</h1>

                    <div className="space-y-2 text-left bg-gray-50 p-4 rounded-xl mb-6 text-sm">
                        <p><span className="font-bold">Name:</span> {student?.name}</p>
                        <p><span className="font-bold">VTU No:</span> {student?.vtuId?.toUpperCase()}</p>
                        <p><span className="font-bold">Dept:</span> {student?.dept}</p>
                        <p><span className="font-bold">Year:</span> {student?.year}</p>
                        {student?.createdAt && (
                            <p className="text-gray-500 italic">
                                <span className="font-bold">Registered:</span> {new Date(student.createdAt.seconds * 1000).toLocaleString()}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={handleAdmit}
                        disabled={loadingAction}
                        className={`w-full py-4 text-xl font-bold text-white rounded-xl shadow-lg transition-transform active:scale-95 ${loadingAction ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                            }`}
                    >
                        {loadingAction ? "Processing..." : "CONFIRM ENTRY 🔓"}
                    </button>

                    <p className="mt-3 text-xs text-gray-500">Click only when the student is at the gate</p>
                </div>
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center text-2xl text-black">Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
}
