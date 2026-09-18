"use client";

import { useState } from "react";
import EditInput from "./EditInput";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

export default function EditAnimal({ animal, onSaved }) {
    const [name, setName] = useState(animal.name);
    const [breed, setBreed] = useState(animal.breed || "");
    const [weight, setWeight] = useState(animal.weight || "");
    const [notes, setNotes] = useState(animal.notes || "");
    const [saving, setSaving] = useState(false);

    const save = async () => {
        const token = localStorage.getItem("authToken");

        setSaving(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/animals/${animal.id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
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

            const data = await response.json();

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
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
                />
            </div>

            <button
                onClick={save}
                disabled={saving}
                className="mt-5 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
                {saving ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );
}
