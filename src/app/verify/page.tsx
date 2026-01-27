"use client";

import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    query,
    where,
    updateDoc,
    doc,
} from "firebase/firestore";

import toast from "react-hot-toast";

function VerifyContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token")?.trim();

    const [status, setStatus] = useState<"loading" | "allowed" | "used" | "invalid">("loading");
    const [student, setStudent] = useState<any>(null);

    useEffect(() => {
        if (!token) {
            setStatus("invalid");
            return;
        }

        const verifyPass = async () => {
            try {
                const q = query(
                    collection(db, "passes"),
                    where("token", "==", token)
                );

                const snapshot = await getDocs(q);

                if (snapshot.empty) {
                    setStatus("invalid");
                    return;
                }

                const docSnap = snapshot.docs[0];
                const data = docSnap.data();

                setStudent(data);

                if (data.status === "USED") {
                    setStatus("used");
                    return;
                }

                // Mark as USED
                await updateDoc(doc(db, "passes", docSnap.id), {
                    status: "USED",
                });

                setStatus("allowed");
                toast.success("Pass verified! ✅");
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
            <div className="h-screen flex items-center justify-center text-2xl">
                Verifying pass...
            </div>
        );
    }

    if (status === "invalid") {
        return (
            <div className="h-screen flex items-center justify-center bg-red-100">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-600">❌ INVALID PASS</h1>
                </div>
            </div>
        );
    }

    if (status === "used") {
        return (
            <div className="h-screen flex items-center justify-center bg-red-100">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-600">⛔ ALREADY ENTERED</h1>
                    <p className="text-lg mt-2">{student?.name}</p>
                    <p>{student?.vtuId?.toUpperCase()}</p>
                </div>
            </div>
        );
    }

    // allowed
    return (
        <div className="h-screen flex items-center justify-center bg-green-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-green-700">✅ ENTRY ALLOWED</h1>
                <p className="text-lg mt-2">{student?.name}</p>
                <p>{student?.vtuId?.toUpperCase()}</p>
                <p>{student?.dept}</p>
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center text-2xl">Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
}
