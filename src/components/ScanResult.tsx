import React from "react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ScanResultProps {
    status: "success" | "error" | "expired";
    message: string;
    details?: string;
}

export function ScanResult({ status, message, details }: ScanResultProps) {
    const configs = {
        success: {
            icon: <CheckCircle2 className="h-12 w-12 text-emerald-500" />,
            bg: "bg-emerald-50 dark:bg-emerald-950/20",
            border: "border-emerald-100 dark:border-emerald-900/50",
            text: "text-emerald-900 dark:text-emerald-50",
        },
        error: {
            icon: <XCircle className="h-12 w-12 text-rose-500" />,
            bg: "bg-rose-50 dark:bg-rose-950/20",
            border: "border-rose-100 dark:border-rose-900/50",
            text: "text-rose-900 dark:text-rose-50",
        },
        expired: {
            icon: <AlertCircle className="h-12 w-12 text-amber-500" />,
            bg: "bg-amber-50 dark:bg-amber-950/20",
            border: "border-amber-100 dark:border-amber-900/50",
            text: "text-amber-900 dark:text-amber-50",
        },
    };

    const config = configs[status];

    return (
        <div
            className={cn(
                "flex flex-col items-center gap-4 rounded-2xl border p-6 text-center transition-all",
                config.bg,
                config.border
            )}
        >
            {config.icon}
            <div className="flex flex-col gap-1">
                <h3 className={cn("text-lg font-bold", config.text)}>{message}</h3>
                {details && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{details}</p>
                )}
            </div>
        </div>
    );
}
