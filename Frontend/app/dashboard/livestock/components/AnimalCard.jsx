"use client";

import { useRouter } from "next/navigation";

export default function AnimalCard({
    animal,
    onDelete,
}) {
    const router = useRouter();

    const status =
        animal.status || "ACTIVE";

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">

            {/* Image */}

            <div className="flex h-40 items-center justify-center bg-green-50">

                <span className="text-7xl">
                    🐄
                </span>

            </div>


            {/* Content */}

            <div className="p-5">

                <div className="flex items-start justify-between">

                    <div>

                        <h3 className="text-lg font-bold text-gray-900">
                            {animal.name ||
                                "Unnamed Animal"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            ID: {animal.tagNumber ||
                                "Not assigned"}
                        </p>

                    </div>


                    <span
                        className={`
                            rounded-full px-3 py-1
                            text-xs font-semibold
                            ${
                                status ===
                                "ACTIVE"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                            }
                        `}
                    >
                        {status}
                    </span>

                </div>


                {/* Details */}

                <div className="mt-5 grid grid-cols-2 gap-3">

                    <div className="rounded-xl bg-gray-50 p-3">

                        <p className="text-xs text-gray-500">
                            Gender
                        </p>

                        <p className="mt-1 font-semibold text-gray-900">
                            {animal.gender ||
                                "—"}
                        </p>

                    </div>


                    <div className="rounded-xl bg-gray-50 p-3">

                        <p className="text-xs text-gray-500">
                            Breed
                        </p>

                        <p className="mt-1 font-semibold text-gray-900">
                            {animal.breed ||
                                "—"}
                        </p>

                    </div>

                </div>


                {/* Actions */}

                <div className="mt-5 flex gap-2">

                    <button
                        onClick={() =>
                            router.push(
                                `/dashboard/livestock/${animal.id}`
                            )
                        }
                        className="flex-1 rounded-lg border border-green-700 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
                    >
                        View
                    </button>

                    <button
                        onClick={() =>
                            router.push(
                                `/dashboard/livestock/${animal.id}/edit`
                            )
                        }
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() =>
                            onDelete(
                                animal.id
                            )
                        }
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>
    );
}