"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

export default function LivestockPage() {
    const router = useRouter();

    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        fetchAnimals();
    }, []);

    const fetchAnimals = async () => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            router.replace("/login");
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/animals`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load animals"
                );
            }

            setAnimals(
                data?.data?.animals ||
                data?.data ||
                []
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => ({
        total: animals.length,

        female: animals.filter(
            (a) => a.sex === "FEMALE"
        ).length,

        male: animals.filter(
            (a) => a.sex === "MALE"
        ).length,

        calves: animals.filter(
            (a) => a.lifeStage === "CALF"
        ).length,

        lactating: animals.filter(
            (a) =>
                a.productionStatus === "LACTATING"
        ).length,
    }), [animals]);

    const filteredAnimals = useMemo(() => {
        switch (filter) {
            case "FEMALE":
                return animals.filter(
                    (a) => a.sex === "FEMALE"
                );

            case "MALE":
                return animals.filter(
                    (a) => a.sex === "MALE"
                );

            case "CALF":
                return animals.filter(
                    (a) => a.lifeStage === "CALF"
                );

            case "LACTATING":
                return animals.filter(
                    (a) =>
                        a.productionStatus ===
                        "LACTATING"
                );

            default:
                return animals;
        }
    }, [animals, filter]);

    if (loading) {
        return (
            <div className="flex min-h-full items-center justify-center">
                <p className="text-gray-500">
                    Loading animals...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gray-50 p-4 md:p-6 lg:p-8">

            {/* Header */}

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Animals
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Manage your dairy livestock
                    </p>
                </div>

                <button
                    onClick={() =>
                        router.push(
                            "/dashboard/livestock/add"
                        )
                    }
                    className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                >
                    + Add Animal
                </button>

            </div>

            {/* Stats */}

            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">

                <Stat
                    title="Total"
                    value={stats.total}
                    active={filter === "ALL"}
                    onClick={() => setFilter("ALL")}
                />

                <Stat
                    title="Female"
                    value={stats.female}
                    active={filter === "FEMALE"}
                    onClick={() =>
                        setFilter("FEMALE")
                    }
                />

                <Stat
                    title="Male"
                    value={stats.male}
                    active={filter === "MALE"}
                    onClick={() =>
                        setFilter("MALE")
                    }
                />

                <Stat
                    title="Calves"
                    value={stats.calves}
                    active={filter === "CALF"}
                    onClick={() =>
                        setFilter("CALF")
                    }
                />

                <Stat
                    title="Lactating"
                    value={stats.lactating}
                    active={
                        filter === "LACTATING"
                    }
                    onClick={() =>
                        setFilter("LACTATING")
                    }
                />

            </div>

            {/* List */}

            <div className="mb-4 flex items-center justify-between">

                <h2 className="text-xl font-bold text-gray-900">
                    {filter === "ALL"
                        ? "All Animals"
                        : `${filterLabel(filter)} Animals`}
                </h2>

                <span className="text-sm text-gray-500">
                    {filteredAnimals.length} animals
                </span>

            </div>

            {filteredAnimals.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">

                    <h3 className="text-lg font-semibold text-gray-800">
                        No animals found
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                        Add an animal to start managing
                        your livestock.
                    </p>

                    <button
                        onClick={() =>
                            router.push(
                                "/dashboard/livestock/add"
                            )
                        }
                        className="mt-5 rounded-xl bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700"
                    >
                        Add Animal
                    </button>

                </div>
            ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                    {filteredAnimals.map(
                        (animal) => (
                            <AnimalCard
                                key={animal.id}
                                animal={animal}
                                onClick={() =>
                                    router.push(
                                        `/dashboard/livestock/${animal.id}`
                                    )
                                }
                            />
                        )
                    )}

                </div>
            )}

        </div>
    );
}


/* ================= STAT ================= */

function Stat({
    title,
    value,
    active,
    onClick,
}) {
    return (
        <button
            onClick={onClick}
            className={`rounded-2xl border bg-white p-5 text-left transition ${
                active
                    ? "border-green-500 ring-2 ring-green-100"
                    : "border-gray-200 hover:border-green-300"
            }`}
        >
            <p className="text-sm text-gray-500">
                {title}
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
                {value}
            </p>
        </button>
    );
}


/* ================= ANIMAL CARD ================= */

function AnimalCard({
    animal,
    onClick,
}) {
    const photo =
        animal.photoUrl ||
        "/animal-placeholder.png";

    return (
        <button
            onClick={onClick}
            className="group w-full rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-green-400 hover:shadow-md"
        >

            <div className="flex gap-4">

                <img
                    src={photo}
                    alt={animal.name}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                    onError={(e) => {
                        e.currentTarget.style.display =
                            "none";
                    }}
                />

                <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-2">

                        <div>
                            <h3 className="truncate text-lg font-bold text-gray-900 group-hover:text-green-600">
                                {animal.name}
                            </h3>

                            <p className="text-sm text-gray-500">
                                {animal.tagNumber}
                            </p>
                        </div>

                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                            {animal.species}
                        </span>

                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">

                        <Badge>
                            {animal.sex}
                        </Badge>

                        <Badge>
                            {animal.lifeStage}
                        </Badge>

                        {animal.productionStatus ===
                            "LACTATING" && (
                            <Badge>
                                Lactating
                            </Badge>
                        )}

                    </div>

                </div>

            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">

                <div>
                    <p className="text-xs text-gray-400">
                        Breed
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-gray-700">
                        {animal.breed || "—"}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-gray-400">
                        Weight
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                        {animal.weight
                            ? `${animal.weight} kg`
                            : "—"}
                    </p>
                </div>

            </div>

        </button>
    );
}


/* ================= BADGE ================= */

function Badge({ children }) {
    return (
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            {formatText(children)}
        </span>
    );
}


/* ================= HELPERS ================= */

function filterLabel(filter) {
    const labels = {
        FEMALE: "Female",
        MALE: "Male",
        CALF: "Calf",
        LACTATING: "Lactating",
    };

    return labels[filter] || "All";
}

function formatText(value) {
    return String(value)
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (c) =>
            c.toUpperCase()
        );
}