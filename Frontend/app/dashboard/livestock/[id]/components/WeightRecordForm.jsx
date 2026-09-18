"use client";

import { useState } from "react";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

export default function WeightRecordForm({
    animalId,
    onCreated,
}) {
    const [formData, setFormData] = useState({
        recordDate: new Date().toISOString().slice(0, 16),
        weight: "",
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const weight = Number(formData.weight);

        if (!formData.weight || weight <= 0) {
            setError("Please enter a valid weight.");
            return;
        }

        try {
            setSaving(true);

            const token =
                localStorage.getItem("authToken");

            if (!token) {
                throw new Error("Please login again.");
            }

            const response = await fetch(
                `${API_BASE_URL}/weight/animals/${animalId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        recordDate: new Date(
                            formData.recordDate
                        ).toISOString(),
                        weight,
                        notes:
                            formData.notes.trim() ||
                            undefined,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to create weight record"
                );
            }

            setFormData({
                recordDate:
                    new Date()
                        .toISOString()
                        .slice(0, 16),
                weight: "",
                notes: "",
            });

            onCreated?.(data.data);
        } catch (error) {
            console.error(
                "Create weight record error:",
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
                Add Weight Record
            </h3>

            <div className="mt-5 grid gap-4 md:grid-cols-2">

                {/* Date */}

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Date & Time
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

                {/* Weight */}

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Weight (kg)
                    </label>

                    <input
                        type="number"
                        name="weight"
                        min="0.1"
                        step="0.1"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="e.g. 420"
                        required
                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-green-500"
                    />
                </div>

            </div>

            {/* Notes */}

            <div className="mt-4">
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

            {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={saving}
                className="mt-5 rounded-xl bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {saving
                    ? "Saving..."
                    : "Add Weight Record"}
            </button>
        </form>
    );
}