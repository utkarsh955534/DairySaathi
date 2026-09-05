"use client";

export default function DashboardHeader({
    onMenuClick,
}) {
    return (
        <div className="mb-8 flex items-center justify-between">

            <div>

                <button
                    onClick={onMenuClick}
                    className="mb-4 rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-700 lg:hidden"
                >
                    ☰ Menu
                </button>

                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Dashboard
                </h1>

                <p className="mt-1 text-sm text-gray-500 sm:text-base">
                    Manage your dairy farm from one place.
                </p>

            </div>

        </div>
    );
}