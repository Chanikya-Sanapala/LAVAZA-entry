"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import QRCode from "qrcode";

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
                const qrImg = await QRCode.toDataURL(qrUrl);
                setQr(qrImg);
            }
        };

        fetchPass();
    }, [token]); // ✅ NO params.token anywhere

    if (!data) {
        return <div className="p-10 text-center">Loading pass...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
                <h1 className="text-2xl font-bold mb-2 text-black">
                    LAVAZA 🎉
                </h1>

                <p className="text-lg font-semibold text-black">
                    {data.name}
                </p>

                <p className="text-sm text-black">
                    VTU No: {data.vtuId?.toUpperCase()}
                </p>

                <p className="text-sm mb-4 text-black">
                    Dept: {data.dept}
                </p>


                {qr && <img src={qr} alt="QR Code" className="mx-auto mb-4" />}

                <p className="text-sm font-bold text-green-600">
                    Status: {data.status}
                </p>

                {data.createdAt && (
                    <p className="text-[10px] text-gray-400 mt-2">
                        Registered: {new Date(data.createdAt.seconds * 1000).toLocaleString()}
                    </p>
                )}
            </div>
        </div>
    );
}
