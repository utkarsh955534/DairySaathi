"use client";

import { useEffect, useState } from "react";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

function formatDate(value) {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatDateTime(value) {
    if (!value) return "—";

    return new Date(value).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function label(value) {
    if (!value) return "—";

    return String(value)
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function InfoItem({ title, value }) {
    return (
        <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {title}
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-900">
                {value ?? "—"}
            </p>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
                {title}
            </h2>

            {children}
        </section>
    );
}

function EmptyState({ text = "No records available" }) {
    return (
        <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
            {text}
        </div>
    );
}

// =====================================================
// MILK
// =====================================================

function MilkSection({ records }) {
    return (
        <Section title="Milk History">
            {!records?.length ? (
                <EmptyState />
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 text-left">
                                <th className="px-3 py-3 font-semibold text-gray-600">
                                    Date
                                </th>
                                <th className="px-3 py-3 font-semibold text-gray-600">
                                    Morning
                                </th>
                                <th className="px-3 py-3 font-semibold text-gray-600">
                                    Evening
                                </th>
                                <th className="px-3 py-3 font-semibold text-gray-600">
                                    Total
                                </th>
                                <th className="px-3 py-3 font-semibold text-gray-600">
                                    Notes
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {records.map((record) => (
                                <tr
                                    key={record.id}
                                    className="border-b border-gray-100 last:border-0"
                                >
                                    <td className="px-3 py-3">
                                        {formatDate(record.recordDate)}
                                    </td>

                                    <td className="px-3 py-3">
                                        {record.morning ?? "—"} L
                                    </td>

                                    <td className="px-3 py-3">
                                        {record.evening ?? "—"} L
                                    </td>

                                    <td className="px-3 py-3 font-semibold">
                                        {record.total ?? "—"} L
                                    </td>

                                    <td className="px-3 py-3 text-gray-600">
                                        {record.notes || "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Section>
    );
}

// =====================================================
// WEIGHT
// =====================================================

function WeightSection({ records }) {
    return (
        <Section title="Weight History">
            {!records?.length ? (
                <EmptyState />
            ) : (
                <div className="space-y-3">
                    {records.map((record) => (
                        <div
                            key={record.id}
                            className="flex flex-col gap-2 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <p className="font-semibold text-gray-900">
                                    {record.weight} kg
                                </p>

                                <p className="text-sm text-gray-500">
                                    {formatDate(record.recordDate)}
                                </p>
                            </div>

                            <p className="text-sm text-gray-600">
                                {record.notes || "No notes"}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </Section>
    );
}

// =====================================================
// HEALTH
// =====================================================

function HealthSection({ records }) {
    return (
        <Section title="Health History">
            {!records?.length ? (
                <EmptyState />
            ) : (
                <div className="space-y-4">
                    {records.map((record) => (
                        <div
                            key={record.id}
                            className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                        >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {label(record.type)}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        {formatDate(record.recordDate)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {record.vaccineName && (
                                    <InfoItem
                                        title="Vaccine"
                                        value={record.vaccineName}
                                    />
                                )}

                                {record.dewormerName && (
                                    <InfoItem
                                        title="Dewormer"
                                        value={record.dewormerName}
                                    />
                                )}

                                {record.problem && (
                                    <InfoItem
                                        title="Problem"
                                        value={record.problem}
                                    />
                                )}

                                {record.diagnosis && (
                                    <InfoItem
                                        title="Diagnosis"
                                        value={record.diagnosis}
                                    />
                                )}

                                {record.treatmentMedicine && (
                                    <InfoItem
                                        title="Medicine"
                                        value={record.treatmentMedicine}
                                    />
                                )}

                                {record.treatmentDose && (
                                    <InfoItem
                                        title="Treatment Dose"
                                        value={record.treatmentDose}
                                    />
                                )}

                                {record.checkupType && (
                                    <InfoItem
                                        title="Checkup Type"
                                        value={record.checkupType}
                                    />
                                )}

                                {record.findings && (
                                    <InfoItem
                                        title="Findings"
                                        value={record.findings}
                                    />
                                )}

                                {record.dose && (
                                    <InfoItem
                                        title="Dose"
                                        value={record.dose}
                                    />
                                )}

                                {record.nextDue && (
                                    <InfoItem
                                        title="Next Due"
                                        value={formatDate(record.nextDue)}
                                    />
                                )}

                                {record.title && (
                                    <InfoItem
                                        title="Title"
                                        value={record.title}
                                    />
                                )}

                                {record.details && (
                                    <InfoItem
                                        title="Details"
                                        value={record.details}
                                    />
                                )}

                                {record.treatmentNextReview && (
                                    <InfoItem
                                        title="Next Review"
                                        value={formatDate(
                                            record.treatmentNextReview
                                        )}
                                    />
                                )}
                            </div>

                            {record.notes && (
                                <div className="mt-3 rounded-lg bg-white p-3">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Notes
                                    </p>

                                    <p className="mt-1 text-sm text-gray-700">
                                        {record.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Section>
    );
}

// =====================================================
// BREEDING
// =====================================================

function BreedingSection({ records }) {
    return (
        <Section title="Breeding History">
            {!records?.length ? (
                <EmptyState />
            ) : (
                <div className="space-y-4">
                    {records.map((record) => (
                        <div
                            key={record.id}
                            className="rounded-xl bg-gray-50 p-4"
                        >
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <h3 className="font-semibold text-gray-900">
                                    {label(record.type)}
                                </h3>

                                <span className="text-sm text-gray-500">
                                    {formatDate(record.recordDate)}
                                </span>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {record.heatObservation && (
                                    <InfoItem
                                        title="Heat Observation"
                                        value={record.heatObservation}
                                    />
                                )}

                                {record.semenCode && (
                                    <InfoItem
                                        title="Semen Code"
                                        value={record.semenCode}
                                    />
                                )}

                                {record.technician && (
                                    <InfoItem
                                        title="Technician"
                                        value={record.technician}
                                    />
                                )}

                                {record.pregnancyResult !== null &&
                                    record.pregnancyResult !== undefined && (
                                        <InfoItem
                                            title="Pregnancy Result"
                                            value={
                                                record.pregnancyResult
                                                    ? "Positive"
                                                    : "Negative"
                                            }
                                        />
                                    )}
                            </div>

                            {record.notes && (
                                <p className="mt-3 text-sm text-gray-600">
                                    {record.notes}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Section>
    );
}

// =====================================================
// CALVING
// =====================================================

function CalvingSection({ records }) {
    return (
        <Section title="Calving History">
            {!records?.length ? (
                <EmptyState />
            ) : (
                <div className="space-y-4">
                    {records.map((record) => (
                        <div
                            key={record.id}
                            className="rounded-xl bg-gray-50 p-4"
                        >
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <h3 className="font-semibold text-gray-900">
                                    Calving
                                </h3>

                                <span className="text-sm text-gray-500">
                                    {formatDate(record.calvingDate)}
                                </span>
                            </div>

                            {record.calf && (
                                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <InfoItem
                                        title="Calf Tag"
                                        value={
                                            record.calf.tagNumber
                                        }
                                    />

                                    <InfoItem
                                        title="Calf Name"
                                        value={record.calf.name}
                                    />
                                </div>
                            )}

                            {record.notes && (
                                <p className="mt-3 text-sm text-gray-600">
                                    {record.notes}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Section>
    );
}

// =====================================================
// LACTATION
// =====================================================

function LactationSection({ records }) {
    return (
        <Section title="Lactation History">
            {!records?.length ? (
                <EmptyState />
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {records.map((record) => (
                        <div
                            key={record.id}
                            className="rounded-xl bg-gray-50 p-4"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">
                                    Lactation #{record.lactationNumber}
                                </h3>

                                <span className="text-sm text-gray-500">
                                    {formatDate(record.startDate)}
                                </span>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <InfoItem
                                    title="Start Date"
                                    value={formatDate(
                                        record.startDate
                                    )}
                                />

                                <InfoItem
                                    title="End Date"
                                    value={formatDate(
                                        record.endDate
                                    )}
                                />

                                <InfoItem
                                    title="Total Milk"
                                    value={
                                        record.totalMilk != null
                                            ? `${record.totalMilk} L`
                                            : "—"
                                    }
                                />

                                <InfoItem
                                    title="Peak Milk"
                                    value={
                                        record.peakMilk != null
                                            ? `${record.peakMilk} L`
                                            : "—"
                                    }
                                />
                            </div>

                            {record.calf && (
                                <div className="mt-3">
                                    <InfoItem
                                        title="Associated Calf"
                                        value={
                                            record.calf.tagNumber
                                        }
                                    />
                                </div>
                            )}

                            {record.notes && (
                                <p className="mt-3 text-sm text-gray-600">
                                    {record.notes}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Section>
    );
}

// =====================================================
// PAGE
// =====================================================

export default function PublicAnimalPage({
    params,
}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAnimal = async () => {
            try {
                setLoading(true);
                setError("");

                const { token } = await params;

                const response = await fetch(
                    `${API_BASE_URL}/public/animal/${token}`
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                            "Unable to load animal profile"
                    );
                }

                setData(result.data);
            } catch (error) {
                console.error(error);
                setError(
                    error.message ||
                        "Unable to load animal profile"
                );
            } finally {
                setLoading(false);
            }
        };

        loadAnimal();
    }, [params]);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />

                    <p className="mt-3 text-sm text-gray-500">
                        Loading animal profile...
                    </p>
                </div>
            </main>
        );
    }

    if (error || !data) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
                    <h1 className="text-xl font-bold text-gray-900">
                        Animal Not Found
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        {error ||
                            "This animal profile is not available."}
                    </p>
                </div>
            </main>
        );
    }

    const { animal, history } = data;

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
                    <p className="text-sm font-medium text-green-600">
                        DairySaathi
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                        {animal.name || animal.tagNumber}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Animal Tag:{" "}
                        <span className="font-semibold text-gray-700">
                            {animal.tagNumber}
                        </span>
                    </p>
                </div>
            </header>

            <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">

                {/* Animal Overview */}
                <Section title="Animal Overview">
                    <div className="flex flex-col gap-6 md:flex-row">
                        {animal.photoUrl ? (
                            <img
                                src={animal.photoUrl}
                                alt={animal.name || animal.tagNumber}
                                className="h-48 w-48 rounded-2xl object-cover"
                            />
                        ) : (
                            <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-6xl">
                                🐄
                            </div>
                        )}

                        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <InfoItem
                                title="Name"
                                value={
                                    animal.name ||
                                    animal.tagNumber
                                }
                            />

                            <InfoItem
                                title="Tag Number"
                                value={animal.tagNumber}
                            />

                            <InfoItem
                                title="Species"
                                value={label(animal.species)}
                            />

                            <InfoItem
                                title="Sex"
                                value={label(animal.sex)}
                            />

                            <InfoItem
                                title="Life Stage"
                                value={label(animal.lifeStage)}
                            />

                            <InfoItem
                                title="Breed"
                                value={animal.breed}
                            />

                            <InfoItem
                                title="Date of Birth"
                                value={formatDate(
                                    animal.dateOfBirth
                                )}
                            />

                            <InfoItem
                                title="Current Weight"
                                value={
                                    animal.weight != null
                                        ? `${animal.weight} kg`
                                        : "—"
                                }
                            />

                            <InfoItem
                                title="Added On"
                                value={formatDate(
                                    animal.createdAt
                                )}
                            />
                        </div>
                    </div>
                </Section>

                {/* Parents */}
                <Section title="Parent Information">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <InfoItem
                            title="Mother"
                            value={
                                animal.mother
                                    ? `${animal.mother.tagNumber}${
                                          animal.mother.name
                                              ? ` (${animal.mother.name})`
                                              : ""
                                      }`
                                    : "Not available"
                            }
                        />

                        <InfoItem
                            title="Father"
                            value={
                                animal.father
                                    ? `${animal.father.tagNumber}${
                                          animal.father.name
                                              ? ` (${animal.father.name})`
                                              : ""
                                      }`
                                    : "Not available"
                            }
                        />
                    </div>
                </Section>

                {/* Production */}
                <Section title="Production & Pregnancy">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <InfoItem
                            title="Production Status"
                            value={label(
                                animal.productionStatus
                            )}
                        />

                        <InfoItem
                            title="Current Milk Production"
                            value={
                                animal.currentMilkProduction !=
                                null
                                    ? `${animal.currentMilkProduction} L`
                                    : "—"
                            }
                        />

                        <InfoItem
                            title="Lactation Number"
                            value={
                                animal.lactationNumber ??
                                "—"
                            }
                        />

                        <InfoItem
                            title="Pregnancy Status"
                            value={label(
                                animal.pregnancyStatus
                            )}
                        />

                        <InfoItem
                            title="Lactation Start"
                            value={formatDate(
                                animal.lactationStartDate
                            )}
                        />

                        <InfoItem
                            title="Last Calving"
                            value={formatDate(
                                animal.lastCalvingDate
                            )}
                        />

                        <InfoItem
                            title="Expected Calving"
                            value={formatDate(
                                animal.expectedCalvingDate
                            )}
                        />
                    </div>
                </Section>

                {/* Notes */}
                {animal.notes && (
                    <Section title="Notes">
                        <p className="text-sm leading-6 text-gray-700">
                            {animal.notes}
                        </p>
                    </Section>
                )}

                {/* History */}
                <MilkSection
                    records={history?.milk}
                />

                <WeightSection
                    records={history?.weight}
                />

                <HealthSection
                    records={history?.health}
                />

                <BreedingSection
                    records={history?.breeding}
                />

                <CalvingSection
                    records={history?.calving}
                />

                <LactationSection
                    records={history?.lactation}
                />

                <div className="pb-8 pt-2 text-center text-xs text-gray-400">
                    Powered by DairySaathi
                </div>
            </div>
        </main>
    );
}