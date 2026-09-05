"use client";

import { useRouter } from "next/navigation";

export default function AnimalsHeader() {
    const router = useRouter();

    return (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    My Animals
                </h1>

                <p className="mt-1 text-sm text-gray-500 sm:text-base">
                    Keep track of all your livestock in one place.
                </p>

            </div>


            <button
                onClick={() =>
                    router.push(
                        "/dashboard/livestock/add"
                    )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-green-800"
            >
                <span className="text-xl">
                    +
                </span>

                Add Animal
            </button>

        </div>
    );
}