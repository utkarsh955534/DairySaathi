"use client";

import { useEffect, useState } from "react";
import HealthRecordForm from "./HealthRecordForm";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

const HEALTH_CONFIG = {
    DEWORMING: {
        label: "Deworming",
        icon: "💊",
        bg: "bg-purple-50",
        text: "text-purple-700",
    },

    VACCINATION: {
        label: "Vaccination",
        icon: "💉",
        bg: "bg-blue-50",
        text: "text-blue-700",
    },

    TREATMENT: {
        label: "Treatment",
        icon: "🩺",
        bg: "bg-red-50",
        text: "text-red-700",
    },

    CHECKUP: {
        label: "Checkup",
        icon: "❤️",
        bg: "bg-green-50",
        text: "text-green-700",
    },

    OTHER: {
        label: "Other",
        icon: "📋",
        bg: "bg-gray-50",
        text: "text-gray-700",
    },
};

export default function HealthSection({ animalId }) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);

    const fetchHealthRecords = async () => {
        if (!animalId) return;

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
                `${API_BASE_URL}/health/animals/${animalId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to load health records"
                );
            }

            setRecords(data.data || []);
        } catch (error) {
            console.error(
                "Health records error:",
                error
            );

            setError(
                error.message ||
                    "Failed to load health records"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealthRecords();
    }, [animalId]);

    const handleCreated = () => {
        setShowForm(false);
        fetchHealthRecords();
    };

    return (
        <section className="mt-8">

            {/* =========================
                HEADER
            ========================= */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Health Records
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Vaccination, deworming, treatment and
                        health checkup history
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setShowForm((value) => !value)
                    }
                    className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                >
                    {showForm
                        ? "Close"
                        : "+ Add Health Record"}
                </button>

            </div>

            {/* =========================
                FORM
            ========================= */}

            {showForm && (
                <HealthRecordForm
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

                        <div className="h-20 rounded-xl bg-gray-200" />

                        <div className="h-20 rounded-xl bg-gray-200" />

                    </div>
                </div>
            )}

            {/* =========================
                ERROR
            ========================= */}

            {!loading && error && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5">

                    <h3 className="font-semibold text-red-700">
                        Unable to load health records
                    </h3>

                    <p className="mt-1 text-sm text-red-600">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={fetchHealthRecords}
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
                            🩺
                        </div>

                        <h3 className="mt-3 font-semibold text-gray-900">
                            No health records yet
                        </h3>

                        <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
                            Start recording this animal's
                            vaccinations, deworming,
                            treatments and checkups.
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
                            <HealthRecordCard
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
   HEALTH RECORD CARD
===================================================== */

function HealthRecordCard({ record }) {
    const config =
        HEALTH_CONFIG[record.type] ||
        HEALTH_CONFIG.OTHER;

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* =========================
                CARD HEADER
            ========================= */}

            <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                    {/* Icon */}

                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${config.bg}`}
                    >
                        {config.icon}
                    </div>

                    {/* Title */}

                    <div>
                        <span
                            className={`text-xs font-semibold uppercase tracking-wide ${config.text}`}
                        >
                            {config.label}
                        </span>

                        <h3 className="mt-1 text-lg font-semibold text-gray-900">
                            {getRecordTitle(record)}
                        </h3>
                    </div>

                </div>

                {/* Date */}

                <div className="sm:text-right">
                    <p className="text-sm font-medium text-gray-800">
                        {formatDate(record.recordDate)}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        {formatTime(record.recordDate)}
                    </p>
                </div>

            </div>

            {/* =========================
                DETAILS
            ========================= */}

            <div className="p-5">

                {record.type === "VACCINATION" && (
                    <VaccinationDetails
                        record={record}
                    />
                )}

                {record.type === "DEWORMING" && (
                    <DewormingDetails
                        record={record}
                    />
                )}

                {record.type === "TREATMENT" && (
                    <TreatmentDetails
                        record={record}
                    />
                )}

                {record.type === "CHECKUP" && (
                    <CheckupDetails
                        record={record}
                    />
                )}

                {record.type === "OTHER" && (
                    <OtherDetails
                        record={record}
                    />
                )}

            </div>

        </div>
    );
}

/* =====================================================
   VACCINATION
===================================================== */

function VaccinationDetails({ record }) {
    return (
        <>
            <div className="grid gap-4 sm:grid-cols-3">

                <Detail
                    label="Vaccine"
                    value={
                        record.vaccineName
                    }
                />

                <Detail
                    label="Dose"
                    value={record.dose}
                />

                <Detail
                    label="Next Due"
                    value={
                        record.nextDue
                            ? formatDate(
                                  record.nextDue
                              )
                            : null
                    }
                />

            </div>

            <Notes
                notes={record.notes}
            />
        </>
    );
}

/* =====================================================
   DEWORMING
===================================================== */

function DewormingDetails({ record }) {
    return (
        <>
            <div className="grid gap-4 sm:grid-cols-3">

                <Detail
                    label="Dewormer"
                    value={
                        record.dewormerName
                    }
                />

                <Detail
                    label="Dose"
                    value={record.dose}
                />

                <Detail
                    label="Next Due"
                    value={
                        record.nextDue
                            ? formatDate(
                                  record.nextDue
                              )
                            : null
                    }
                />

            </div>

            <Notes
                notes={record.notes}
            />
        </>
    );
}

/* =====================================================
   TREATMENT
===================================================== */

function TreatmentDetails({ record }) {
    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2">

                <Detail
                    label="Problem"
                    value={record.problem}
                />

                <Detail
                    label="Diagnosis"
                    value={
                        record.diagnosis
                    }
                />

                <Detail
                    label="Medicine"
                    value={
                        record.treatmentMedicine
                    }
                />

                <Detail
                    label="Dose"
                    value={
                        record.treatmentDose
                    }
                />

                <Detail
                    label="Next Review"
                    value={
                        record.treatmentNextReview
                            ? formatDate(
                                  record.treatmentNextReview
                              )
                            : null
                    }
                />

            </div>

            <Notes
                notes={record.notes}
            />
        </>
    );
}

/* =====================================================
   CHECKUP
===================================================== */

function CheckupDetails({ record }) {
    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2">

                <Detail
                    label="Checkup Type"
                    value={formatText(
                        record.checkupType
                    )}
                />

            </div>

            {record.findings && (
                <div className="mt-4 rounded-xl bg-green-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-green-600">
                        Findings
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-700">
                        {record.findings}
                    </p>
                </div>
            )}

            <Notes
                notes={record.notes}
            />
        </>
    );
}

/* =====================================================
   OTHER
===================================================== */

function OtherDetails({ record }) {
    return (
        <>
            <div className="grid gap-4">

                <Detail
                    label="Title"
                    value={record.title}
                />

            </div>

            {record.details && (
                <div className="mt-4 rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Details
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-700">
                        {record.details}
                    </p>
                </div>
            )}

            <Notes
                notes={record.notes}
            />
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
        case "VACCINATION":
            return (
                record.vaccineName ||
                "Vaccination"
            );

        case "DEWORMING":
            return (
                record.dewormerName ||
                "Deworming"
            );

        case "TREATMENT":
            return (
                record.problem ||
                "Treatment"
            );

        case "CHECKUP":
            return (
                formatText(record.checkupType) ||
                "Health Checkup"
            );

        case "OTHER":
            return (
                record.title ||
                "Other Health Event"
            );

        default:
            return "Health Record";
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

function formatText(value) {
    if (!value) return "—";

    return String(value)
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) =>
            char.toUpperCase()
        );
}