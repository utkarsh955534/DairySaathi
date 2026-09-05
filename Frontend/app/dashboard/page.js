"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import StatsCards from "./components/StatsCard";
import QuickActions from "./components/QuickActions";
import RecentActivity from "./components/RecentActivity";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

export default function Dashboard() {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token =
                localStorage.getItem(
                    "authToken"
                );

            if (!token) {
                router.replace("/login");
                return;
            }

            try {
                const response =
                    await fetch(
                        `${API_BASE_URL}/auth/me`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                                Accept:
                                    "application/json",
                            },
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    localStorage.removeItem(
                        "authToken"
                    );

                    localStorage.removeItem(
                        "user"
                    );

                    router.replace("/login");

                    return;
                }

                setUser(data.data);

                // Keep latest user data
                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        data.data
                    )
                );

                setLoading(false);

            } catch (error) {
                console.error(
                    "Authentication error:",
                    error
                );

                localStorage.removeItem(
                    "authToken"
                );

                localStorage.removeItem(
                    "user"
                );

                router.replace("/login");
            }
        };

        checkAuth();
    }, [router]);


    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">

                <div className="text-center">

                    <div className="mb-3 text-4xl">
                        🐄
                    </div>

                    <p className="font-medium text-green-700">
                        Loading DairySaathi...
                    </p>

                </div>

            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50">



            <div className="flex">

                {/* =========================
                    SIDEBAR
                ========================= */}

                <Sidebar
                    open={sidebarOpen}
                    onClose={() =>
                        setSidebarOpen(
                            false
                        )
                    }
                />


                {/* =========================
                    MAIN CONTENT
                ========================= */}

                <main className="min-w-0 flex-1">

                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                        {/* HEADER */}

                        <DashboardHeader
                            onMenuClick={() =>
                                setSidebarOpen(
                                    true
                                )
                            }
                        />


                        {/* =========================
                            WELCOME CARD
                        ========================= */}

                        <section className="mb-8 overflow-hidden rounded-2xl bg-green-700 p-6 text-white shadow-sm sm:p-8">

                            <p className="text-sm font-medium text-green-100">
                                Welcome back,
                            </p>

                            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                                {user?.fullName} 👋
                            </h2>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-green-50 sm:text-base">
                                Manage your livestock,
                                milk production,
                                animal health and
                                veterinary activities
                                from one place.
                            </p>

                        </section>


                        {/* =========================
                            STATS
                        ========================= */}

                        <StatsCards />


                        {/* =========================
                            QUICK ACTIONS
                        ========================= */}

                        <QuickActions />


                        {/* =========================
                            RECENT ACTIVITY
                        ========================= */}

                        <RecentActivity />

                    </div>

                </main>

            </div>

        </div>
    );
}