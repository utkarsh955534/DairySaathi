"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "./components/Navbar";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

export default function DashboardLayout({
    children,
}) {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            const token =
                localStorage.getItem("authToken");

            // No token → login
            if (!token) {
                router.replace("/login");
                return;
            }

            try {
                const response = await fetch(
                    `${API_BASE_URL}/auth/me`,
                    {
                        method: "GET",
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

                // Invalid/expired token
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

                // Save authenticated user
                setUser(data.data);

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.data)
                );

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

            } finally {
                setLoading(false);
            }
        };

        checkAuthentication();
    }, [router]);

    // Loading screen
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">

                    <div className="text-4xl mb-3">
                        🐄
                    </div>

                    <p className="text-green-700 font-semibold">
                        Loading DairySaathi...
                    </p>

                </div>
            </div>
        );
    }

    // Prevent dashboard rendering
    // while redirecting
    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <Navbar user={user} />

            {children}

        </div>
    );
}