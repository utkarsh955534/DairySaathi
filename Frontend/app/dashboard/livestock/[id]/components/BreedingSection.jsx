"use client";

import { useEffect, useState } from "react";

import BreedingRecordForm from "./BreedingRecordForm";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

const BREEDING_CONFIG = {
    HEAT: {
        label: "Heat",
        icon: "🔥",
        bg: "bg-orange-50",
        text: "text-orange-700",
    },

    INSEMINATION: {
        label: "Insemination",
        icon: "🧬",
        bg: "bg-purple-50",
        text: "text-purple-700",
    },

    PREGNANCY_CHECK: {
        label: "Pregnancy Check",
        icon: "🤰",
        bg: "bg-green-50",
        text: "text-green-700",
    },
};

export default function BreedingSection({
    animalId,
}) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);

    const fetchBreedingRecords = async () => {
        if (!animalId) return;

        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem(
                    "authToken"
                );

            if (!token) {
                throw new Error(
                    "Authentication required."
                );
            }

            const response = await fetch(
                `${API_BASE_URL}/breeding/animals/${animalId}`,
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
                        "Failed to load breeding records"
                );
            }

            setRecords(data.data || []);
        } catch (error) {
            console.error(
                "Breeding records error:",
                error
            );

            setError(
                error.message ||
                    "Failed to load breeding records"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBreedingRecords();
    }, [animalId]);

    const handleCreated = () => {
        setShowForm(false);
        fetchBreedingRecords();
    };

    return (
        <section className="mt-8">

            {/* =========================
                HEADER
            ========================= */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Breeding Records
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Heat, insemination and pregnancy history
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
                        : "+ Add Breeding Record"}
                </button>

            </div>

            {/* =========================
                FORM
            ========================= */}

            {showForm && (
                <BreedingRecordForm
                    animalId={animalId}
                    onCreated={handleCreated}
                />
            )}

            {/* =========================
                LOADING
            ========================= */}

            {loading && (
                <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="animate-pulse space-y-4">

                        <div className="h-5 w-40 rounded bg-gray-200" />

                        <div className="h-24 rounded-xl bg-gray-200" />

                        <div className="h-24 rounded-xl bg-gray-200" />

                    </div>
                </div>
            )}

            {/* =========================
                ERROR
            ========================= */}

            {!loading && error && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5">

                    <h3 className="font-semibold text-red-700">
                        Unable to load breeding records
                    </h3>

                    <p className="mt-1 text-sm text-red-600">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={
                            fetchBreedingRecords
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
                            🧬
                        </div>

                        <h3 className="mt-3 font-semibold text-gray-900">
                            No breeding records yet
                        </h3>

                        <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
                            Start recording heat,
                            insemination and pregnancy
                            checks.
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

                        {records.map((record) => (
                            <BreedingRecordCard
                                key={record.id}
                                record={record}
                            />
                        ))}

                    </div>
                )}

        </section>
    );
}

/* =====================================================
   BREEDING RECORD CARD
===================================================== */

function BreedingRecordCard({
    record,
}) {
    const config =
        BREEDING_CONFIG[record.type] ||
        BREEDING_CONFIG.HEAT;

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* HEADER */}

            <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${config.bg}`}
                    >
                        {config.icon}
                    </div>

                    <div>
                        <span
                            className={`text-xs font-semibold uppercase tracking-wide ${config.text}`}
                        >
                            {config.label}
                        </span>

                        <h3 className="mt-1 text-lg font-semibold text-gray-900">
                            {getRecordTitle(
                                record
                            )}
                        </h3>
                    </div>

                </div>

                <div className="sm:text-right">

                    <p className="text-sm font-medium text-gray-800">
                        {formatDate(
                            record.recordDate
                        )}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        {formatTime(
                            record.recordDate
                        )}
                    </p>

                </div>

            </div>

            {/* DETAILS */}

            <div className="p-5">

                {record.type ===
                    "HEAT" && (
                    <HeatDetails
                        record={record}
                    />
                )}

                {record.type ===
                    "INSEMINATION" && (
                    <InseminationDetails
                        record={record}
                    />
                )}

                {record.type ===
                    "PREGNANCY_CHECK" && (
                    <PregnancyCheckDetails
                        record={record}
                    />
                )}

            </div>

        </div>
    );
}

/* =====================================================
   HEAT DETAILS
===================================================== */

function HeatDetails({
    record,
}) {
    return (
        <>
            {record.heatObservation && (
                <div className="rounded-xl bg-orange-50 p-4">

                    <p className="text-xs font-medium uppercase tracking-wide text-orange-600">
                        Heat Observation
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-700">
                        {record.heatObservation}
                    </p>

                </div>
            )}

            <Notes notes={record.notes} />
        </>
    );
}

/* =====================================================
   INSEMINATION DETAILS
===================================================== */

function InseminationDetails({
    record,
}) {
    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2">

                <Detail
                    label="Semen Code"
                    value={
                        record.semenCode
                    }
                />

                <Detail
                    label="Technician"
                    value={
                        record.technician
                    }
                />

            </div>

            <Notes notes={record.notes} />
        </>
    );
}

/* =====================================================
   PREGNANCY DETAILS
===================================================== */

function PregnancyCheckDetails({
    record,
}) {
    const pregnant =
        record.pregnancyResult === true;

    return (
        <>
            <div
                className={`rounded-xl p-4 ${
                    pregnant
                        ? "bg-green-50"
                        : "bg-red-50"
                }`}
            >
                <p
                    className={`text-xs font-medium uppercase tracking-wide ${
                        pregnant
                            ? "text-green-600"
                            : "text-red-600"
                    }`}
                >
                    Pregnancy Result
                </p>

                <p
                    className={`mt-2 text-lg font-bold ${
                        pregnant
                            ? "text-green-700"
                            : "text-red-700"
                    }`}
                >
                    {pregnant
                        ? "Pregnant"
                        : "Not Pregnant"}
                </p>
            </div>

            <Notes notes={record.notes} />
        </>
    );
}

/* =====================================================
   DETAIL
===================================================== */

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

/* =====================================================
   NOTES
===================================================== */

function Notes({ notes }) {
    if (!notes) return null;

    return (
        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4">

            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Notes
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-600">
                {notes}
            </p>

        </div>
    );
}

/* =====================================================
   HELPERS
===================================================== */

function getRecordTitle(record) {
    switch (record.type) {
        case "HEAT":
            return "Heat Detected";

        case "INSEMINATION":
            return "Insemination";

        case "PREGNANCY_CHECK":
            return record.pregnancyResult
                ? "Pregnancy Confirmed"
                : "Pregnancy Not Confirmed";

        default:
            return "Breeding Record";
    }
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