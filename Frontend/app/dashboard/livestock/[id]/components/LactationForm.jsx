"use client";

import { useState } from "react";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

export default function LactationForm({
    animalId,
    activeLactation,
    animals,
    onCreated,
    onClosed,
    onCancel,
}) {
    const [formData, setFormData] = useState({
        startDate: new Date()
            .toISOString()
            .slice(0, 16),

        calfId: "",

        endDate: new Date()
            .toISOString()
            .slice(0, 16),

        totalMilk: "",
        peakMilk: "",

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

    // =====================================================
    // START LACTATION
    // =====================================================

    const handleStart = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.startDate) {
            setError("Please select start date.");
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
                startDate: new Date(
                    formData.startDate
                ).toISOString(),

                calfId: formData.calfId
                    ? Number(formData.calfId)
                    : undefined,

                notes:
                    formData.notes.trim() ||
                    undefined,
            };

            const response = await fetch(
                `${API_BASE_URL}/lactation/animals/${animalId}`,
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

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to start lactation"
                );
            }

            setFormData({
                startDate: new Date()
                    .toISOString()
                    .slice(0, 16),
                calfId: "",
                endDate: new Date()
                    .toISOString()
                    .slice(0, 16),
                totalMilk: "",
                peakMilk: "",
                notes: "",
            });

            onCreated?.(data.data);
        } catch (error) {
            console.error(
                "Start lactation error:",
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

    // =====================================================
    // CLOSE LACTATION
    // =====================================================

    const handleClose = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.endDate) {
            setError("Please select end date.");
            return;
        }

        if (activeLactation) {
            const start = new Date(
                activeLactation.startDate
            );

            const end = new Date(
                formData.endDate
            );

            if (end < start) {
                setError(
                    "End date cannot be before start date."
                );
                return;
            }
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
                endDate: new Date(
                    formData.endDate
                ).toISOString(),

                totalMilk:
                    formData.totalMilk === ""
                        ? undefined
                        : Number(
                              formData.totalMilk
                          ),

                peakMilk:
                    formData.peakMilk === ""
                        ? undefined
                        : Number(
                              formData.peakMilk
                          ),

                notes:
                    formData.notes.trim() ||
                    undefined,
            };

            const response = await fetch(
                `${API_BASE_URL}/lactation/${activeLactation.id}/close`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(body),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to close lactation"
                );
            }

            setFormData({
                startDate: new Date()
                    .toISOString()
                    .slice(0, 16),
                calfId: "",
                endDate: new Date()
                    .toISOString()
                    .slice(0, 16),
                totalMilk: "",
                peakMilk: "",
                notes: "",
            });

            onClosed?.(data.data);
        } catch (error) {
            console.error(
                "Close lactation error:",
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

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5">

            {/* HEADER */}

            <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">
                    {activeLactation
                        ? "Close Lactation"
                        : "Start Lactation"}
                </h3>

                <button
                    type="button"
                    onClick={onCancel}
                    className="text-sm text-gray-500 hover:text-gray-800"
                >
                    Cancel
                </button>
            </div>

            {/* START FORM */}

            {!activeLactation && (
                <form onSubmit={handleStart}>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">

                        {/* Start Date */}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Start Date & Time
                            </label>

                            <input
                                type="datetime-local"
                                name="startDate"
                                value={
                                    formData.startDate
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-green-500"
                            />
                        </div>

                        {/* Calf */}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Calf
                            </label>

                            <select
                                name="calfId"
                                value={
                                    formData.calfId
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-green-500"
                            >
                                <option value="">
                                    No calf linked
                                </option>

                                {animals.map(
                                    (item) => (
                                        <option
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {
                                                item.tagNumber
                                            }
                                        </option>
                                    )
                                )}
                            </select>

                            <p className="mt-1 text-xs text-gray-400">
                                Optional
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
                            value={
                                formData.notes
                            }
                            onChange={
                                handleChange
                            }
                            rows={4}
                            placeholder="Optional notes..."
                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-green-500"
                        />

                    </div>

                    {error && (
                        <ErrorMessage
                            message={error}
                        />
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="mt-5 rounded-xl bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving
                            ? "Starting..."
                            : "Start Lactation"}
                    </button>

                </form>
            )}

            {/* CLOSE FORM */}

            {activeLactation && (
                <form onSubmit={handleClose}>

                    <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-4">

                        <p className="text-xs text-green-600">
                            Active Lactation
                        </p>

                        <p className="mt-1 text-lg font-bold text-green-800">
                            Lactation #
                            {
                                activeLactation.lactationNumber
                            }
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                            Started{" "}
                            {formatDate(
                                activeLactation.startDate
                            )}
                        </p>

                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">

                        {/* End Date */}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                End Date & Time
                            </label>

                            <input
                                type="datetime-local"
                                name="endDate"
                                value={
                                    formData.endDate
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-green-500"
                            />
                        </div>

                        {/* Total Milk */}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Total Milk (L)
                            </label>

                            <input
                                type="number"
                                name="totalMilk"
                                value={
                                    formData.totalMilk
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                step="0.1"
                                placeholder="e.g. 3200"
                                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-green-500"
                            />
                        </div>

                        {/* Peak Milk */}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Peak Milk (L/day)
                            </label>

                            <input
                                type="number"
                                name="peakMilk"
                                value={
                                    formData.peakMilk
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                step="0.1"
                                placeholder="e.g. 18.5"
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
                            value={
                                formData.notes
                            }
                            onChange={
                                handleChange
                            }
                            rows={4}
                            placeholder="Optional notes..."
                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-green-500"
                        />

                    </div>

                    {error && (
                        <ErrorMessage
                            message={error}
                        />
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="mt-5 rounded-xl bg-orange-600 px-5 py-2.5 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving
                            ? "Closing..."
                            : "Close Lactation"}
                    </button>

                </form>
            )}

        </div>
    );
}

function ErrorMessage({ message }) {
    return (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {message}
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