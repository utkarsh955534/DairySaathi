"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

export default function AnimalProfilePage() {
    const { id } = useParams();
    const router = useRouter();

    const [animal, setAnimal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetchAnimal();
    }, [id]);

    const fetchAnimal = async () => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            router.replace("/login");
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/animals/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Animal not found"
                );
            }

            setAnimal(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${animal.name}?`
        );

        if (!confirmed) return;

        const token = localStorage.getItem("authToken");

        setDeleting(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/animals/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to delete animal"
                );
            }

            router.replace("/dashboard/livestock");
        } catch (error) {
            alert(error.message);
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-full items-center justify-center">
                <p className="text-gray-500">
                    Loading animal...
                </p>
            </div>
        );
    }

    if (!animal) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold">
                    Animal not found
                </h2>

                <button
                    onClick={() =>
                        router.push(
                            "/dashboard/livestock"
                        )
                    }
                    className="mt-4 text-green-600"
                >
                    ← Back to Animals
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gray-50 p-4 md:p-6 lg:p-8">

            {/* Header */}

            <div className="mx-auto max-w-5xl">

                <button
                    onClick={() =>
                        router.push(
                            "/dashboard/livestock"
                        )
                    }
                    className="mb-5 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                    ← Back to Animals
                </button>

                {/* Profile Header */}

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-5">

                            {animal.photoUrl ? (
                                <img
                                    src={animal.photoUrl}
                                    alt={animal.name}
                                    className="h-28 w-28 rounded-2xl object-cover"
                                />
                            ) : (
                                <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-green-100 text-4xl">
                                    🐄
                                </div>
                            )}

                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {animal.name}
                                </h1>

                                <p className="mt-1 text-gray-500">
                                    {animal.tagNumber}
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge>
                                        {animal.species}
                                    </Badge>

                                    <Badge>
                                        {animal.sex}
                                    </Badge>

                                    <Badge>
                                        {animal.lifeStage}
                                    </Badge>
                                </div>
                            </div>

                        </div>

                        <div className="flex gap-3">

                            <button
                                onClick={() =>
                                    setEditing(
                                        !editing
                                    )
                                }
                                className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                            >
                                {editing
                                    ? "Cancel Edit"
                                    : "Edit Animal"}
                            </button>

                            <button
                                onClick={
                                    handleDelete
                                }
                                disabled={deleting}
                                className="rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600 hover:bg-red-50"
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Delete"}
                            </button>

                        </div>

                    </div>

                </div>

                {/* Edit */}

                {editing && (
                    <EditAnimal
                        animal={animal}
                        onSaved={(updated) => {
                            setAnimal(updated);
                            setEditing(false);
                        }}
                    />
                )}

                {/* Information */}

                {!editing && (
                    <div className="mt-6 grid gap-6 md:grid-cols-2">

                        <InfoCard title="Basic Information">

                            <Info
                                label="Name"
                                value={animal.name}
                            />

                            <Info
                                label="Tag Number"
                                value={
                                    animal.tagNumber
                                }
                            />

                            <Info
                                label="Species"
                                value={
                                    animal.species
                                }
                            />

                            <Info
                                label="Breed"
                                value={
                                    animal.breed
                                }
                            />

                            <Info
                                label="Date of Birth"
                                value={
                                    formatDate(
                                        animal.dateOfBirth
                                    )
                                }
                            />

                            <Info
                                label="Weight"
                                value={
                                    animal.weight
                                        ? `${animal.weight} kg`
                                        : "—"
                                }
                            />

                        </InfoCard>


                        <InfoCard title="Production">

                            <Info
                                label="Status"
                                value={formatText(
                                    animal.productionStatus
                                )}
                            />

                            <Info
                                label="Lactation Number"
                                value={
                                    animal.lactationNumber ||
                                    "—"
                                }
                            />

                            <Info
                                label="Lactation Start"
                                value={formatDate(
                                    animal.lactationStartDate
                                )}
                            />

                            <Info
                                label="Current Milk"
                                value={
                                    animal.currentMilkProduction
                                        ? `${animal.currentMilkProduction} L/day`
                                        : "—"
                                }
                            />

                        </InfoCard>


                        <InfoCard title="Parentage">

                            <ParentInfo
                                title="Mother"
                                source={
                                    animal.motherSource
                                }
                                internal={
                                    animal.mother
                                }
                                externalName={
                                    animal.motherExternalName
                                }
                                externalBreed={
                                    animal.motherExternalBreed
                                }
                                externalTag={
                                    animal.motherExternalTag
                                }
                            />

                            <ParentInfo
                                title="Father"
                                source={
                                    animal.fatherSource
                                }
                                internal={
                                    animal.father
                                }
                                externalName={
                                    animal.fatherExternalName
                                }
                                externalBreed={
                                    animal.fatherExternalBreed
                                }
                                externalTag={
                                    animal.fatherExternalTag
                                }
                            />

                        </InfoCard>


                        <InfoCard title="Reproductive Information">

                            <Info
                                label="Pregnancy"
                                value={formatText(
                                    animal.pregnancyStatus
                                )}
                            />

                            <Info
                                label="Last Calving"
                                value={formatDate(
                                    animal.lastCalvingDate
                                )}
                            />

                            <Info
                                label="Expected Calving"
                                value={formatDate(
                                    animal.expectedCalvingDate
                                )}
                            />

                        </InfoCard>


                        {animal.notes && (
                            <div className="md:col-span-2">
                                <InfoCard title="Notes">
                                    <p className="text-sm leading-6 text-gray-600">
                                        {animal.notes}
                                    </p>
                                </InfoCard>
                            </div>
                        )}

                    </div>
                )}

            </div>
        </div>
    );
}


/* =====================================================
   EDIT ANIMAL
===================================================== */

function EditAnimal({
    animal,
    onSaved,
}) {
    const [name, setName] =
        useState(animal.name);

    const [breed, setBreed] =
        useState(animal.breed || "");

    const [weight, setWeight] =
        useState(animal.weight || "");

    const [notes, setNotes] =
        useState(animal.notes || "");

    const [saving, setSaving] =
        useState(false);

    const save = async () => {
        const token =
            localStorage.getItem(
                "authToken"
            );

        setSaving(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/animals/${animal.id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        breed,
                        weight:
                            weight === ""
                                ? null
                                : Number(weight),
                        notes,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to update animal"
                );
            }

            onSaved(data.data);
        } catch (error) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-bold">
                Edit Animal
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

                <EditInput
                    label="Name"
                    value={name}
                    onChange={setName}
                />

                <EditInput
                    label="Breed"
                    value={breed}
                    onChange={setBreed}
                />

                <EditInput
                    label="Weight (kg)"
                    type="number"
                    value={weight}
                    onChange={setWeight}
                />

            </div>

            <div className="mt-5">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Notes
                </label>

                <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) =>
                        setNotes(
                            e.target.value
                        )
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
                />

            </div>

            <button
                onClick={save}
                disabled={saving}
                className="mt-5 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
                {saving
                    ? "Saving..."
                    : "Save Changes"}
            </button>

        </div>
    );
}


/* =====================================================
   COMPONENTS
===================================================== */

function InfoCard({
    title,
    children,
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-bold text-gray-900">
                {title}
            </h2>

            <div className="space-y-4">
                {children}
            </div>

        </div>
    );
}

function Info({
    label,
    value,
}) {
    return (
        <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">

            <span className="text-sm text-gray-500">
                {label}
            </span>

            <span className="text-right text-sm font-medium text-gray-800">
                {value || "—"}
            </span>

        </div>
    );
}

function ParentInfo({
    title,
    source,
    internal,
    externalName,
    externalBreed,
    externalTag,
}) {
    return (
        <div className="border-b border-gray-100 pb-4 last:border-0">

            <p className="text-sm font-medium text-gray-500">
                {title}
            </p>

            {source === "EXISTING" &&
                internal && (
                    <div className="mt-2">
                        <p className="font-semibold text-gray-900">
                            {internal.name}
                        </p>

                        <p className="text-xs text-gray-500">
                            {internal.tagNumber}
                        </p>
                    </div>
                )}

            {source === "EXTERNAL" && (
                <div className="mt-2">
                    <p className="font-semibold text-gray-900">
                        {externalName}
                    </p>

                    {externalBreed && (
                        <p className="text-xs text-gray-500">
                            {externalBreed}
                        </p>
                    )}

                    {externalTag && (
                        <p className="text-xs text-gray-500">
                            Tag: {externalTag}
                        </p>
                    )}

                    <span className="mt-2 inline-block rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-600">
                        External
                    </span>
                </div>
            )}

            {source === "UNKNOWN" && (
                <p className="mt-2 text-sm text-gray-400">
                    Unknown
                </p>
            )}

        </div>
    );
}

function Badge({ children }) {
    return (
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            {formatText(children)}
        </span>
    );
}

function EditInput({
    label,
    value,
    onChange,
    type = "text",
}) {
    return (
        <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                type={type}
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
            />

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

function formatText(value) {
    if (!value) return "—";

    return String(value)
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (c) =>
            c.toUpperCase()
        );
}