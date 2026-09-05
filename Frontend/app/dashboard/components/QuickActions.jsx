"use client";

import { useRouter } from "next/navigation";

export default function QuickActions() {
    const router = useRouter();

    const actions = [
        {
            title: "Add Livestock",
            description: "Register a new animal",
            icon: "🐄",
            path: "/dashboard/livestock/add",
        },
        {
            title: "Add Milk Record",
            description: "Record today's milk",
            icon: "🥛",
            path: "/dashboard/milk/add",
        },
        {
            title: "Health Record",
            description: "Add health information",
            icon: "🩺",
            path: "/dashboard/health/add",
        },
        {
            title: "Book Veterinarian",
            description: "Schedule a consultation",
            icon: "👨‍⚕️",
            path: "/dashboard/veterinary",
        },
    ];

    return (
        <section className="mt-8">

            <div className="mb-4">

                <h2 className="text-xl font-bold text-gray-900">
                    Quick Actions
                </h2>

                <p className="text-sm text-gray-500">
                    Frequently used farm management actions.
                </p>

            </div>


            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {actions.map((action) => (
                    <button
                        key={action.title}
                        onClick={() =>
                            router.push(
                                action.path
                            )
                        }
                        className="group rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md"
                    >

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl transition group-hover:bg-green-100">
                            {action.icon}
                        </div>

                        <h3 className="mt-4 font-semibold text-gray-900">
                            {action.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            {action.description}
                        </p>

                    </button>
                ))}

            </div>

        </section>
    );
}