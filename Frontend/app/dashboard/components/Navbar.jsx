"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Settings, Settings2, Settings2Icon, UserRoundArrowLeft } from 'lucide-react';

export default function Navbar({ user }) {
    const router = useRouter();

    const [profileOpen, setProfileOpen] =
        useState(false);

    const [menuOpen, setMenuOpen] =
        useState(false);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");

        router.replace("/");
    };

    const navigation = [
        {
            name: "Dashboard",
            path: "/dashboard",
        },
        {
            name: "Animals",
            path: "/dashboard/animals",
        },
        {
            name: "Health",
            path: "/dashboard/health",
        },
        {
            name: "Feeding",
            path: "/dashboard/feeding",
        },
        {
            name: "Milk",
            path: "/dashboard/milk",
        },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-green-100 bg-white/95 backdrop-blur">

            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* ================= LOGO ================= */}

                <button
                    type="button"
                    onClick={() =>
                        router.push("/dashboard")
                    }
                    className="flex items-center gap-2"
                >
                    <div className="flex items-center">
                        <img
                            src="/mainlogo.png"
                            alt="DairySaathi Logo"
                            className="h-12 sm:h-14 lg:h-16 w-auto"
                        />

                        <h1 className="text-xl sm:text-2xl lg:text-3xl text-green-700 font-bold">
                            DairySaathi
                        </h1>
                    </div>

                </button>


                {/* ================= DESKTOP NAV ================= */}

                <div className="hidden lg:flex items-center gap-1">

                    {navigation.map((item) => (
                        <button
                            key={item.path}
                            type="button"
                            onClick={() =>
                                router.push(item.path)
                            }
                            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-800"
                        >
                            {item.name}
                        </button>
                    ))}

                </div>


                {/* ================= RIGHT SIDE ================= */}

                <div className="flex items-center gap-2">

                    {/* Notification */}

                    <button
                        type="button"
                        aria-label="Notifications"
                        className="relative flex h-10 w-10 items-center justify-center rounded-full text-xl text-gray-600 transition hover:bg-green-50"
                    >
                        <Bell />

                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                    </button>


                    {/* ================= PROFILE ================= */}

                    <div className="relative hidden sm:block">

                        <button
                            type="button"
                            onClick={() =>
                                setProfileOpen(
                                    !profileOpen
                                )
                            }
                            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-green-50"
                        >

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700 font-semibold text-white">
                                {user?.fullName
                                    ?.charAt(0)
                                    ?.toUpperCase() ||
                                    "U"}
                            </div>

                            <div className="hidden md:block text-left">

                                <p className="max-w-32 truncate text-sm font-semibold text-gray-800">
                                    {user?.fullName ||
                                        "User"}
                                </p>

                                <p className="text-xs text-gray-500">
                                    {user?.role ||
                                        "FARMER"}
                                </p>

                            </div>

                            <span className="text-xs text-gray-500">
                                ▾
                            </span>

                        </button>


                        {/* PROFILE DROPDOWN */}

                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">

                                <div className="border-b border-gray-100 px-4 py-3">

                                    <p className="text-sm font-semibold text-gray-800">
                                        {user?.fullName|| "User" 
                                            }
                                    </p>

                                    <p className="mt-0.5 truncate text-xs text-gray-500">
                                        {user?.email ||
                                            user?.phone ||
                                            ""}
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={() => {
                                        setProfileOpen(
                                            false
                                        );

                                        router.push(
                                            "/dashboard/profile"
                                        );
                                    }}
                                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-green-50 flex gap-2"
                                >
                                    <UserRoundArrowLeft/> My Profile
                                </button>


                                <button
                                    type="button"
                                    onClick={() => {
                                        setProfileOpen(
                                            false
                                        );

                                        router.push(
                                            "/dashboard/settings"
                                        );
                                    }}
                                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-green-50 flex gap-2"
                                >
                                    <Settings/> Settings
                                </button>


                                <div className="border-t border-gray-100" />

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 flex gap-2"
                                >
                                 <LogOut/> Logout
                                </button>

                            </div>
                        )}

                    </div>


                    {/* ================= MOBILE MENU ================= */}

                    <button
                        type="button"
                        onClick={() =>
                            setMenuOpen(
                                !menuOpen
                            )
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-gray-700 hover:bg-green-50 lg:hidden"
                        aria-label="Open menu"
                    >
                        ☰
                    </button>

                </div>

            </div>


            {/* ================= MOBILE NAV ================= */}

            {menuOpen && (
                <div className="border-t border-green-100 bg-white lg:hidden">

                    <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">

                        {/* User */}

                        <div className="mb-3 flex items-center gap-3 rounded-xl bg-green-50 p-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 font-semibold text-white">
                                {user?.fullName
                                    ?.charAt(0)
                                    ?.toUpperCase() ||
                                    "U"}
                            </div>

                            <div>

                                <p className="text-sm font-semibold text-gray-800">
                                    {user?.fullName ||
                                        "User"}
                                </p>

                                <p className="text-xs text-gray-500">
                                    {user?.role ||
                                        "FARMER"}
                                </p>

                            </div>

                        </div>


                        {/* Navigation */}

                        <div className="space-y-1">

                            {navigation.map(
                                (item) => (
                                    <button
                                        key={
                                            item.path
                                        }
                                        type="button"
                                        onClick={() => {
                                            setMenuOpen(
                                                false
                                            );

                                            router.push(
                                                item.path
                                            );
                                        }}
                                        className="w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-800"
                                    >
                                        {
                                            item.name
                                        }
                                    </button>
                                )
                            )}

                        </div>


                        {/* Profile */}

                        <button
                            type="button"
                            onClick={() => {
                                setMenuOpen(
                                    false
                                );

                                router.push(
                                    "/dashboard/profile"
                                );
                            }}
                            className="mt-2 w-full rounded-lg px-3 py-3 text-left text-sm text-gray-700 hover:bg-green-50 flex gap-2"
                        >
                        <UserRoundArrowLeft/> My Profile
                        </button>


                        {/* Settings */}

                        <button
                            type="button"
                            onClick={() => {
                                setMenuOpen(
                                    false
                                );

                                router.push(
                                    "/dashboard/settings"
                                );
                            }}
                            className="w-full rounded-lg px-3 py-3 text-left text-sm text-gray-700 hover:bg-green-50 flex gap-2"
                        >
                            <Settings/> Settings
                        </button>


                        {/* Logout */}

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="mt-1 w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 flex gap-2"
                        >
                        <LogOut/> Logout
                        </button>

                    </div>

                </div>
            )}

        </nav>
    );
}