"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import AnimalProfileHeader from "./components/AnimalProfileHeader";
import AnimalInformation from "./components/AnimalInformation";
import EditAnimal from "./components/EditAnimal";
import MilkSection from "./components/MilkSection";
import HistorySection from "./components/HistorySection";

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

    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [historyError, setHistoryError] = useState("");

    // =========================
    // FETCH ANIMAL
    // =========================

    useEffect(() => {
        if (!id) return;

        const fetchAnimal = async () => {
            const token = localStorage.getItem("authToken");

            if (!token) {
                router.replace("/login");
                return;
            }

            try {
                setLoading(true);

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
                console.error("Animal fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimal();
    }, [id, router]);

    // =========================
    // FETCH HISTORY
    // =========================

    const fetchHistory = async () => {
        if (!id) return;

        const token = localStorage.getItem("authToken");

        if (!token) {
            router.replace("/login");
            return;
        }

        try {
            setHistoryLoading(true);
            setHistoryError("");

            const response = await fetch(
                `${API_BASE_URL}/history/animal/${id}`,
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
                        "Failed to load animal history"
                );
            }

            setHistory(data?.data?.events || []);
        } catch (error) {
            console.error("History fetch error:", error);

            setHistoryError(
                error.message ||
                    "Failed to load history"
            );
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        if (!id) return;

        fetchHistory();
    }, [id]);

    // =========================
    // DELETE ANIMAL
    // =========================

    const handleDelete = async () => {
        if (!animal) return;

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

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="flex min-h-full items-center justify-center">
                <p className="text-gray-500">
                    Loading animal...
                </p>
            </div>
        );
    }

    // =========================
    // NOT FOUND
    // =========================

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

    // =========================
    // PAGE
    // =========================

    return (
        <div className="min-h-full bg-gray-50 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-5xl">

                {/* Back */}

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

                <AnimalProfileHeader
                    animal={animal}
                    editing={editing}
                    onEdit={() =>
                        setEditing((value) => !value)
                    }
                    onDelete={handleDelete}
                    deleting={deleting}
                />

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
                    <AnimalInformation
                        animal={animal}
                    />
                )}

                {/* Milk */}

                {!editing && (
                    <MilkSection
                        animalId={animal.id}
                    />
                )}

                {/* History */}

                {!editing && (
                    <HistorySection
                        history={history}
                        loading={historyLoading}
                        error={historyError}
                        onRetry={fetchHistory}
                    />
                )}

            </div>
        </div>
    );
}