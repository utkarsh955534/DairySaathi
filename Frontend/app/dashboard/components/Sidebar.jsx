"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: "🏠",
    },
    {
        name: "My Animals",
        href: "/dashboard/livestock",
        icon: "🐄",
    },
    {
        name: "Milk Records",
        href: "/dashboard/milk",
        icon: "🥛",
    },
    {
        name: "Health",
        href: "/dashboard/health",
        icon: "🩺",
    },
    {
        name: "Veterinary",
        href: "/dashboard/veterinary",
        icon: "👨‍⚕️",
    },
    {
        name: "Reports",
        href: "/dashboard/reports",
        icon: "📊",
    },
];

export default function Sidebar({
    open = false,
    onClose,
}) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile overlay */}

            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}

            <aside
                className={`
                    fixed
                    left-0
                    top-0
                    z-50
                    h-screen
                    w-64
                    border-r
                    border-gray-200
                    bg-white

                    flex
                    flex-col

                    transition-transform
                    duration-300

                    lg:sticky
                    lg:top-0
                    lg:z-30

                    ${
                        open
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }

                    lg:translate-x-0
                `}
            >

                {/* Logo section */}

                <div className="flex h-20 shrink-0 items-center border-b border-gray-100 px-6">

                    <div className="flex items-center gap-3">

                        <span className="text-3xl">
                            🐄
                        </span>

                        <div>

                            <h2 className="text-lg font-bold text-green-700">
                                DairySaathi
                            </h2>

                            <p className="text-xs text-gray-400">
                                Farmer Dashboard
                            </p>

                        </div>

                    </div>

                    {/* Mobile close */}

                    <button
                        onClick={onClose}
                        className="ml-auto text-xl text-gray-500 lg:hidden"
                    >
                        ✕
                    </button>

                </div>


                {/* Navigation */}

                <nav className="flex-1 overflow-y-auto p-4">

                    <div className="space-y-2">

                        {menuItems.map(
                            (item) => {

                                const active =
                                    pathname ===
                                    item.href;

                                return (
                                    <Link
                                        key={
                                            item.href
                                        }
                                        href={
                                            item.href
                                        }
                                        onClick={
                                            onClose
                                        }
                                        className={`
                                            flex
                                            items-center
                                            gap-4
                                            rounded-xl
                                            px-4
                                            py-3
                                            text-sm
                                            font-medium
                                            transition

                                            ${
                                                active
                                                    ? "bg-green-700 text-white shadow-sm"
                                                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                                            }
                                        `}
                                    >

                                        <span className="text-lg">
                                            {
                                                item.icon
                                            }
                                        </span>

                                        <span>
                                            {
                                                item.name
                                            }
                                        </span>

                                    </Link>
                                );
                            }
                        )}

                    </div>

                </nav>

            </aside>
        </>
    );
}