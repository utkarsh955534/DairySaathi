"use client";

import { useMemo, useState } from "react";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

export default function MilkRecordForm({
    animalId,
    selectedDate,
    animals,
    onClose,
    onSuccess,
}) {
    const animal = useMemo(() => {
        return animals.find(
            (item) =>
                String(item.id) ===
                String(animalId)
        );
    }, [animals, animalId]);

    const [formData, setFormData] =
        useState({
            recordDate:
                selectedDate,
            morning: "",
            evening: "",
            notes: "",
        });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const total =
        (Number(formData.morning) || 0) +
        (Number(formData.evening) || 0);

    const handleChange = (e) => {
        const { name, value } =
            e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
        formData.morning === "" &&
        formData.evening === ""
    ) {
        setError(
            "Please enter morning or evening milk."
        );
        return;
    }

    const morning =
        formData.morning === ""
            ? null
            : Number(formData.morning);

    const evening =
        formData.evening === ""
            ? null
            : Number(formData.evening);

    if (
        morning !== null &&
        (!Number.isFinite(morning) || morning < 0)
    ) {
        setError(
            "Invalid morning milk value."
        );
        return;
    }

    if (
        evening !== null &&
        (!Number.isFinite(evening) || evening < 0)
    ) {
        setError(
            "Invalid evening milk value."
        );
        return;
    }

    try {
        setLoading(true);

        const token =
            localStorage.getItem("authToken");

        // Convert date-only into ISO datetime
        const recordDate = new Date(
            `${formData.recordDate}T00:00:00`
        ).toISOString();

        // Build body according to backend validator
        const body = {
            recordDate,
        };

        if (morning !== null) {
            body.morning = morning;
        }

        if (evening !== null) {
            body.evening = evening;
        }

        if (formData.notes.trim() !== "") {
            body.notes = formData.notes.trim();
        }

        console.log(
            "MILK REQUEST BODY:",
            body
        );

        const response = await fetch(
            `${API_BASE_URL}/milk/animals/${animalId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                    Authorization:
                        `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            }
        );

        const result =
            await response.json();

        console.log(
            "MILK RESPONSE:",
            result
        );

        if (!response.ok) {
            throw new Error(
                result?.message ||
                    "Failed to save milk record."
            );
        }

        await onSuccess?.();
    } catch (error) {
        console.error(
            "Milk save error:",
            error
        );

        setError(
            error.message ||
                "Failed to save milk record."
        );
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

                {/* HEADER */}

                <div className="mb-5 flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Add Milk Record
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {animal?.tagNumber ||
                                "Animal"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
                    >
                        ✕
                    </button>
                </div>

                {/* ERROR */}

                {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* DATE */}

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Record Date
                        </label>

                        <input
                            type="date"
                            name="recordDate"
                            value={
                                formData.recordDate
                            }
                            onChange={
                                handleChange
                            }
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        />
                    </div>

                    {/* MORNING + EVENING */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Morning Milk
                            </label>

                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    name="morning"
                                    value={
                                        formData.morning
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="5.5"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-10 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                />

                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                    L
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Evening Milk
                            </label>

                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    name="evening"
                                    value={
                                        formData.evening
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="4.8"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-10 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                />

                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                    L
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* TOTAL */}

                    <div className="rounded-xl bg-green-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                            Total Milk
                        </p>

                        <p className="mt-1 text-2xl font-bold text-green-900">
                            {total.toFixed(
                                1
                            )}{" "}
                            L
                        </p>
                    </div>

                    {/* NOTES */}

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
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
                            rows={3}
                            placeholder="Optional notes..."
                            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        />
                    </div>

                    {/* SUBMIT */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Saving..."
                            : "Save Milk Record"}
                    </button>

                </form>
            </div>
        </div>
    );
}