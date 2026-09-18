"use client";

import { useState } from "react";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

export default function CalvingRecordForm({
    animalId,
    onCreated,
    onCancel,
}) {
    const [formData, setFormData] = useState({
        calvingDate: new Date()
            .toISOString()
            .slice(0, 16),
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

        if (!formData.calvingDate) {
            setError("Please select calving date.");
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

            const response = await fetch(
                `${API_BASE_URL}/calving/animals/${animalId}`,
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        calvingDate: new Date(
                            formData.calvingDate
                        ).toISOString(),

                        notes:
                            formData.notes.trim() ||
                            undefined,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to create calving record"
                );
            }

            setFormData({
                calvingDate: new Date()
                    .toISOString()
                    .slice(0, 16),
                notes: "",
            });

            onCreated?.(data.data);
        } catch (error) {
            console.error(
                "Create calving error:",
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
            <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">
                    Add Calving Record
                </h3>

                <button
                    type="button"
                    onClick={onCancel}
                    className="text-sm text-gray-500 hover:text-gray-800"
                >
                    Cancel
                </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">

                {/* Calving Date */}

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Calving Date & Time
                    </label>

                    <input
                        type="datetime-local"
                        name="calvingDate"
                        value={formData.calvingDate}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-green-500"
                    />
                </div>

                {/* Mother */}

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Mother
                    </label>

                    <div className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800">
                        Current Animal
                    </div>

                    <p className="mt-1 text-xs text-gray-400">
                        This calving will be recorded for the
                        current animal.
                    </p>
                </div>

            </div>

            {/* Notes */}

            <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Notes
                </label>

                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="e.g. Normal calving, healthy calf..."
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
                    : "Add Calving Record"}
            </button>
        </form>
    );
}