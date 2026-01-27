"use client";

import { useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "passes"));
      snapshot.forEach(doc => {
        console.log("PASS:", doc.id, doc.data());
      });
    };

    fetchData();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center text-xl text-black">
      Firestore Connected ✅
    </div>
  );
}
