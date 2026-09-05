"use client";

import { useRouter } from "next/navigation";

export default function EmptyAnimals() {
    const router = useRouter();

    return (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-4xl">
                🐄
            </div>

            <h2 className="mt-6 text-xl font-bold text-gray-900">
                No animals added yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Start building your digital herd by
                adding your first animal. You can
                keep track of its details, health,
                feeding and milk production.
            </p>

            <button
                onClick={() =>
                    router.push(
                        "/dashboard/livestock/add"
                    )
                }
                className="mt-6 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
            >
                + Add Your First Animal
            </button>

        </div>
    );
}