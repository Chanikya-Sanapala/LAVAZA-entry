import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface PassCardProps {
    studentName: string;
    studentId: string;
    qrDataUrl: string;
    expiryDate: string;
    className?: string;
}

export function PassCard({
    studentName,
    studentId,
    qrDataUrl,
    expiryDate,
    className,
}: PassCardProps) {
    return (
        <div
            className={cn(
                "relative flex flex-col items-center gap-6 rounded-3xl bg-white p-8 shadow-2xl dark:bg-zinc-900",
                className
            )}
        >
            <div className="flex flex-col items-center gap-1 text-center">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {studentName}
                </h2>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    ID: {studentId}
                </p>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-white p-4">
                {qrDataUrl ? (
                    <img src={qrDataUrl} alt="Student QR Code" className="h-48 w-48" />
                ) : (
                    <div className="h-48 w-48 animate-pulse bg-zinc-100 dark:bg-zinc-800" />
                )}
            </div>

            <div className="flex flex-col items-center gap-1">
                <p className="text-xs uppercase tracking-wider text-zinc-400">
                    Expires On
                </p>
                <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                    {expiryDate}
                </p>
            </div>

            <div className="absolute -bottom-2 h-4 w-3/4 rounded-full bg-zinc-100/50 blur-xl dark:bg-zinc-800/20" />
        </div>
    );
}
