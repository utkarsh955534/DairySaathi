"use client";

import { useEffect, useState } from "react";

import LactationForm from "./LactationForm";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

export default function LactationSection({
    animalId,
}) {
    const [records, setRecords] = useState([]);
    const [animals, setAnimals] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const fetchLactations = async () => {
        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("authToken");

            if (!token) {
                throw new Error(
                    "Authentication required."
                );
            }

            const response = await fetch(
                `${API_BASE_URL}/lactation/animals/${animalId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to load lactation records"
                );
            }

            setRecords(data.data || []);
        } catch (error) {
            console.error(
                "Lactation records error:",
                error
            );

            setError(
                error.message ||
                    "Failed to load lactation records"
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchAnimals = async () => {
        try {
            const token =
                localStorage.getItem("authToken");

            if (!token) return;

            const response = await fetch(
                `${API_BASE_URL}/animals`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                return;
            }

            const animalList =
                Array.isArray(data?.data)
                    ? data.data
                    : Array.isArray(
                          data?.data?.animals
                      )
                    ? data.data.animals
                    : [];

            setAnimals(
                animalList.filter(
                    (item) =>
                        item.id !== animalId
                )
            );
        } catch (error) {
            console.error(
                "Animals fetch error:",
                error
            );
        }
    };

    useEffect(() => {
        if (!animalId) return;

        fetchLactations();
        fetchAnimals();
    }, [animalId]);

    const activeLactation =
        records.find(
            (record) =>
                record.endDate === null
        ) || null;

    const handleCreated = () => {
        setShowForm(false);
        fetchLactations();
    };

    const handleClosed = () => {
        setShowForm(false);
        fetchLactations();
    };

    return (
        <section className="mt-8">

            {/* =========================
                HEADER
            ========================= */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Lactation Records
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Track complete lactation cycles
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setShowForm(
                            (value) => !value
                        )
                    }
                    className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                >
                    {showForm
                        ? "Close"
                        : activeLactation
                        ? "Close Lactation"
                        : "+ Start Lactation"}
                </button>

            </div>

            {/* =========================
                FORM
            ========================= */}

            {showForm && (
                <LactationForm
                    animalId={animalId}
                    activeLactation={
                        activeLactation
                    }
                    animals={animals}
                    onCreated={
                        handleCreated
                    }
                    onClosed={
                        handleClosed
                    }
                    onCancel={() =>
                        setShowForm(false)
                    }
                />
            )}

            {/* =========================
                LOADING
            ========================= */}

            {loading && (
                <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="animate-pulse space-y-4">

                        <div className="h-5 w-40 rounded bg-gray-200" />

                        <div className="h-28 rounded-xl bg-gray-200" />

                        <div className="h-28 rounded-xl bg-gray-200" />

                    </div>
                </div>
            )}

            {/* =========================
                ERROR
            ========================= */}

            {!loading && error && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5">

                    <h3 className="font-semibold text-red-700">
                        Unable to load lactation records
                    </h3>

                    <p className="mt-1 text-sm text-red-600">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={
                            fetchLactations
                        }
                        className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Try Again
                    </button>

                </div>
            )}

            {/* =========================
                EMPTY
            ========================= */}

            {!loading &&
                !error &&
                records.length === 0 && (
                    <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">

                        <div className="text-4xl">
                            🥛
                        </div>

                        <h3 className="mt-3 font-semibold text-gray-900">
                            No lactation records yet
                        </h3>

                        <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
                            Start a lactation cycle after
                            calving or when milk production begins.
                        </p>

                    </div>
                )}

            {/* =========================
                RECORDS
            ========================= */}

            {!loading &&
                !error &&
                records.length > 0 && (
                    <div className="mt-5 space-y-4">

                        {records.map(
                            (record) => (
                                <LactationCard
                                    key={record.id}
                                    record={record}
                                />
                            )
                        )}

                    </div>
                )}

        </section>
    );
}

function LactationCard({
    record,
}) {
    const active =
        record.endDate === null;

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* Header */}

            <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
                            active
                                ? "bg-green-50"
                                : "bg-gray-50"
                        }`}
                    >
                        🥛
                    </div>

                    <div>

                        <div className="flex flex-wrap items-center gap-2">

                            <span className="text-xs font-semibold uppercase tracking-wide text-green-600">
                                Lactation #
                                {
                                    record.lactationNumber
                                }
                            </span>

                            {active && (
                                <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                                    Active
                                </span>
                            )}

                            {!active && (
                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                                    Completed
                                </span>
                            )}

                        </div>

                        <h3 className="mt-1 text-lg font-semibold text-gray-900">
                            {formatDate(
                                record.startDate
                            )}
                            {" → "}
                            {record.endDate
                                ? formatDate(
                                      record.endDate
                                  )
                                : "Present"}
                        </h3>

                    </div>

                </div>

                {record.calf && (
                    <div className="rounded-xl bg-gray-50 px-4 py-3">

                        <p className="text-xs text-gray-400">
                            Calf
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                            {
                                record.calf
                                    .tagNumber
                            }
                        </p>

                    </div>
                )}

            </div>

            {/* Details */}

            <div className="p-5">

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <Detail
                        label="Start Date"
                        value={formatDate(
                            record.startDate
                        )}
                    />

                    <Detail
                        label="End Date"
                        value={
                            record.endDate
                                ? formatDate(
                                      record.endDate
                                  )
                                : "Present"
                        }
                    />

                    <Detail
                        label="Total Milk"
                        value={
                            record.totalMilk !==
                            null
                                ? `${record.totalMilk} L`
                                : "—"
                        }
                    />

                    <Detail
                        label="Peak Milk"
                        value={
                            record.peakMilk !==
                            null
                                ? `${record.peakMilk} L/day`
                                : "—"
                        }
                    />

                </div>

                {record.notes && (
                    <div className="mt-4 rounded-xl bg-gray-50 p-4">

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Notes
                        </p>

                        <p className="mt-2 text-sm leading-6 text-gray-600">
                            {record.notes}
                        </p>

                    </div>
                )}

            </div>

        </div>
    );
}

function Detail({
    label,
    value,
}) {
    return (
        <div className="rounded-xl bg-gray-50 p-3">

            <p className="text-xs text-gray-400">
                {label}
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
                {value || "—"}
            </p>

        </div>
    );
}

function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
}