"use client";

import { useState } from "react";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

const BREEDING_TYPES = [
    {
        value: "HEAT",
        label: "Heat",
    },
    {
        value: "INSEMINATION",
        label: "Insemination",
    },
    {
        value: "PREGNANCY_CHECK",
        label: "Pregnancy Check",
    },
];

export default function BreedingRecordForm({
    animalId,
    onCreated,
}) {
    const [formData, setFormData] = useState({
        type: "HEAT",

        recordDate: new Date()
            .toISOString()
            .slice(0, 16),

        heatObservation: "",

        semenCode: "",
        technician: "",

        pregnancyResult: "",

        notes: "",
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData({
            type: "HEAT",

            recordDate: new Date()
                .toISOString()
                .slice(0, 16),

            heatObservation: "",

            semenCode: "",
            technician: "",

            pregnancyResult: "",

            notes: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        // =========================
        // BASIC VALIDATION
        // =========================

        if (!formData.type) {
            setError(
                "Please select a breeding record type."
            );
            return;
        }

        if (!formData.recordDate) {
            setError(
                "Please select the record date."
            );
            return;
        }

        // =========================
        // HEAT VALIDATION
        // =========================

        if (
            formData.type === "HEAT" &&
            !formData.heatObservation.trim()
        ) {
            setError(
                "Please enter heat observation."
            );
            return;
        }

        // =========================
        // INSEMINATION VALIDATION
        // =========================

        if (
            formData.type === "INSEMINATION" &&
            !formData.semenCode.trim()
        ) {
            setError(
                "Please enter semen code."
            );
            return;
        }

        // =========================
        // PREGNANCY VALIDATION
        // =========================

        if (
            formData.type === "PREGNANCY_CHECK" &&
            formData.pregnancyResult === ""
        ) {
            setError(
                "Please select pregnancy result."
            );
            return;
        }

        try {
            setSaving(true);

            const token =
                localStorage.getItem("authToken");

            if (!token) {
                throw new Error(
                    "Please login again."
                );
            }

            const body = {
                type: formData.type,

                recordDate: new Date(
                    formData.recordDate
                ).toISOString(),

                // Heat
                heatObservation:
                    formData.heatObservation.trim() ||
                    undefined,

                // Insemination
                semenCode:
                    formData.semenCode.trim() ||
                    undefined,

                technician:
                    formData.technician.trim() ||
                    undefined,

                // Pregnancy Check
                pregnancyResult:
                    formData.type ===
                    "PREGNANCY_CHECK"
                        ? formData.pregnancyResult ===
                          "PREGNANT"
                        : undefined,

                notes:
                    formData.notes.trim() ||
                    undefined,
            };

            const response = await fetch(
                `${API_BASE_URL}/breeding/animals/${animalId}`,
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify(body),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to create breeding record"
                );
            }

            resetForm();

            onCreated?.(data.data);
        } catch (error) {
            console.error(
                "Create breeding record error:",
                error
            );

            setError(
                error.message ||
                    "Something went wrong."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5"
        >
            <h3 className="text-base font-semibold text-gray-900">
                Add Breeding Record
            </h3>

            {/* =========================
                TYPE + DATE
            ========================= */}

            <div className="mt-5 grid gap-4 md:grid-cols-2">

                {/* Type */}

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Type
                    </label>

                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-green-500"
                    >
                        {BREEDING_TYPES.map(
                            (type) => (
                                <option
                                    key={type.value}
                                    value={type.value}
                                >
                                    {type.label}
                                </option>
                            )
                        )}
                    </select>
                </div>

                {/* Date */}

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Record Date & Time
                    </label>

                    <input
                        type="datetime-local"
                        name="recordDate"
                        value={formData.recordDate}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-green-500"
                    />
                </div>
            </div>

            {/* =========================
                HEAT
            ========================= */}

            {formData.type === "HEAT" && (
                <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50 p-4">

                    <h4 className="mb-4 text-sm font-semibold text-orange-800">
                        Heat Details
                    </h4>

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Heat Observation
                    </label>

                    <textarea
                        name="heatObservation"
                        value={
                            formData.heatObservation
                        }
                        onChange={handleChange}
                        rows={4}
                        placeholder="e.g. Restlessness, mounting behaviour, mucus discharge..."
                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-green-500"
                    />

                </div>
            )}

            {/* =========================
                INSEMINATION
            ========================= */}

            {formData.type === "INSEMINATION" && (
                <div className="mt-5 rounded-xl border border-purple-100 bg-purple-50 p-4">

                    <h4 className="mb-4 text-sm font-semibold text-purple-800">
                        Insemination Details
                    </h4>

                    <div className="grid gap-4 md:grid-cols-2">

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Semen Code
                            </label>

                            <input
                                type="text"
                                name="semenCode"
                                value={
                                    formData.semenCode
                                }
                                onChange={handleChange}
                                placeholder="e.g. SEM-2026-0918"
                                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Technician
                            </label>

                            <input
                                type="text"
                                name="technician"
                                value={
                                    formData.technician
                                }
                                onChange={handleChange}
                                placeholder="e.g. Dr. Sharma"
                                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-green-500"
                            />
                        </div>

                    </div>
                </div>
            )}

            {/* =========================
                PREGNANCY CHECK
            ========================= */}

            {formData.type ===
                "PREGNANCY_CHECK" && (
                <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-4">

                    <h4 className="mb-4 text-sm font-semibold text-green-800">
                        Pregnancy Check Details
                    </h4>

                    <div>
                        <label className="mb-3 block text-sm font-medium text-gray-700">
                            Pregnancy Result
                        </label>

                        <div className="flex flex-col gap-3 sm:flex-row">

                            {/* Pregnant */}

                            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
                                <input
                                    type="radio"
                                    name="pregnancyResult"
                                    value="PREGNANT"
                                    checked={
                                        formData.pregnancyResult ===
                                        "PREGNANT"
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="h-4 w-4"
                                />

                                <span className="text-sm font-medium text-gray-700">
                                    Pregnant
                                </span>
                            </label>

                            {/* Not Pregnant */}

                            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
                                <input
                                    type="radio"
                                    name="pregnancyResult"
                                    value="NOT_PREGNANT"
                                    checked={
                                        formData.pregnancyResult ===
                                        "NOT_PREGNANT"
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="h-4 w-4"
                                />

                                <span className="text-sm font-medium text-gray-700">
                                    Not Pregnant
                                </span>
                            </label>

                        </div>
                    </div>

                </div>
            )}

            {/* =========================
                NOTES
            ========================= */}

            <div className="mt-5">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Notes
                </label>

                <textarea
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Optional notes..."
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-green-500"
                />

            </div>

            {/* =========================
                ERROR
            ========================= */}

            {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* =========================
                SUBMIT
            ========================= */}

            <button
                type="submit"
                disabled={saving}
                className="mt-5 rounded-xl bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {saving
                    ? "Saving..."
                    : "Add Breeding Record"}
            </button>
        </form>
    );
}