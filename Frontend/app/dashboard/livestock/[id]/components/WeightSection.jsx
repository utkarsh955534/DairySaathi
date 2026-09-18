"use client";

import { useEffect, useState } from "react";
import WeightRecordForm from "./WeightRecordForm";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

export default function WeightSection({
    animalId,
}) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);

    const fetchWeightRecords = async () => {
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
                `${API_BASE_URL}/weight/animals/${animalId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to load weight records"
                );
            }

            setRecords(data.data || []);
        } catch (error) {
            console.error(
                "Weight records error:",
                error
            );

            setError(
                error.message ||
                    "Failed to load weight records"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (animalId) {
            fetchWeightRecords();
        }
    }, [animalId]);

    const handleCreated = () => {
        setShowForm(false);
        fetchWeightRecords();
    };

    return (
        <section className="mt-8">

            {/* Header */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Weight Records
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Weight tracking history
                    </p>
                </div>

                <button
                    onClick={() =>
                        setShowForm((value) => !value)
                    }
                    className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                >
                    {showForm
                        ? "Close"
                        : "+ Add Weight Record"}
                </button>

            </div>

            {/* Form */}

            {showForm && (
                <WeightRecordForm
                    animalId={animalId}
                    onCreated={handleCreated}
                />
            )}

            {/* Loading */}

            {loading && (
                <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Loading weight records...
                    </p>
                </div>
            )}

            {/* Error */}

            {!loading && error && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5">
                    <p className="text-sm text-red-600">
                        {error}
                    </p>

                    <button
                        onClick={fetchWeightRecords}
                        className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Empty */}

            {!loading &&
                !error &&
                records.length === 0 && (
                    <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">

                        <div className="text-4xl">
                            ⚖️
                        </div>

                        <h3 className="mt-3 font-semibold text-gray-900">
                            No weight records yet
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Start recording this animal's weight.
                        </p>

                    </div>
                )}

            {/* Records */}

            {!loading &&
                !error &&
                records.length > 0 && (
                    <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                        <div className="divide-y divide-gray-100">
                            {records.map((record) => (
                                <WeightRecordItem
                                    key={record.id}
                                    record={record}
                                />
                            ))}
                        </div>

                    </div>
                )}

        </section>
    );
}

function WeightRecordItem({ record }) {
    return (
        <div className="p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <p className="font-semibold text-gray-900">
                        {formatDate(record.recordDate)}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        {formatTime(record.recordDate)}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-green-600">
                        {record.weight}
                    </span>

                    <span className="text-sm text-gray-500">
                        kg
                    </span>
                </div>

            </div>

            {record.notes && (
                <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
                    <p className="text-xs text-gray-400">
                        Notes
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                        {record.notes}
                    </p>
                </div>
            )}

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

function formatTime(date) {
    if (!date) return "—";

    return new Date(date).toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit",
        }
    );
}