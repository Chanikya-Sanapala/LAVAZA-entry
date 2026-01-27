import { db } from "@/lib/firebase";
import { Users, ShieldCheck, History, Settings } from "lucide-react";

export default function AdminPage() {
    const stats = [
        { label: "Total Students", value: "1,240", icon: <Users /> },
        { label: "Active Passes", value: "856", icon: <ShieldCheck /> },
        { label: "Scans Today", value: "432", icon: <History /> },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <div className="mx-auto max-w-7xl p-8">
                <header className="mb-12 flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Admin Dashboard
                        </h1>
                        <p className="mt-2 text-black">Manage entry passes and view logs</p>
                    </div>
                    <button className="flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                        <Settings className="h-4 w-4" />
                        System Settings
                    </button>
                </header>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between rounded-3xl bg-white p-8 shadow-sm dark:bg-zinc-900"
                        >
                            <div>
                                <p className="text-sm font-medium text-black">{stat.label}</p>
                                <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                                    {stat.value}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-zinc-50 p-4 text-black dark:bg-zinc-800">
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 rounded-3xl bg-white p-8 shadow-sm dark:bg-zinc-900">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                        Recent Activity
                    </h2>
                    <div className="mt-6 flex flex-col gap-6">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between border-b border-zinc-50 pb-6 last:border-0 last:pb-0 dark:border-zinc-800"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                                    <div>
                                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                                            Student Alex Johnson
                                        </p>
                                        <p className="text-xs text-black">Verified at Main Gate</p>
                                    </div>
                                </div>
                                <p className="text-xs font-medium text-black">12:45 PM</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
