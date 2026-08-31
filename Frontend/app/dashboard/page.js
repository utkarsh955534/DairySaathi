
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "./components/Navbar";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

export default function Dashboard() {

    const router = useRouter();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
                setLoading(false);

            } catch (error) {

                console.error(error);

                localStorage.removeItem(
                    "authToken"
                );

                router.replace("/login");
            }
        };

        checkAuth();

    }, [router]);


    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-green-700">
                    Loading DairySaathi...
                </p>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50">

            <Navbar user={user} />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                <h1 className="text-3xl font-bold text-gray-800">
                    Welcome, {user?.fullName}
                </h1>

                <p className="mt-2 text-gray-600">
                    Manage your dairy farm from one place.
                </p>

            </main>

        </div>
    );
}