"use client";

import { useEffect, useState } from "react";

import CalvingRecordForm from "./CalvingRecordForm";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

export default function CalvingSection({
    animal,
    onChanged,
}) {
    const animalId = animal?.id;

    const [records, setRecords] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] =
        useState(false);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [activeCalvingId, setActiveCalvingId] =
        useState(null);

    const [actionType, setActionType] =
        useState(null);

    const [animals, setAnimals] =
        useState([]);

    const [selectedCalfId, setSelectedCalfId] =
        useState("");

    const [newCalfTag, setNewCalfTag] =
        useState("");

    const [actionError, setActionError] =
        useState("");

    // =====================================================
    // FETCH CALVING RECORDS
    // =====================================================

    const fetchCalvingRecords = async () => {
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
                `${API_BASE_URL}/calving/animals/${animalId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to load calving records"
                );
            }

            setRecords(data.data || []);
        } catch (error) {
            console.error(
                "Calving records error:",
                error
            );

            setError(
                error.message ||
                    "Failed to load calving records"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // FETCH EXISTING ANIMALS
    // =====================================================

    const fetchAnimals = async () => {
        try {
            const token =
                localStorage.getItem("authToken");

            if (!token) return;

            const response = await fetch(
                `${API_BASE_URL}/animals`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to load animals"
                );
            }

            /*
             * Supports common response formats:
             *
             * data.data
             * data.data.animals
             */

            const animalList =
                Array.isArray(data?.data)
                    ? data.data
                    : Array.isArray(
                          data?.data?.animals
                      )
                    ? data.data.animals
                    : [];

            setAnimals(animalList);
        } catch (error) {
            console.error(
                "Existing animals error:",
                error
            );
        }
    };

    useEffect(() => {
        fetchCalvingRecords();
        fetchAnimals();
    }, [animalId]);

    // =====================================================
    // AFTER CALVING CREATED
    // =====================================================

    const handleCalvingCreated = () => {
        setShowForm(false);

        fetchCalvingRecords();

        onChanged?.();
    };

    // =====================================================
    // OPEN ACTION
    // =====================================================

    const openAction = (
        calvingId,
        type
    ) => {
        setActiveCalvingId(calvingId);
        setActionType(type);

        setSelectedCalfId("");
        setNewCalfTag("");
        setActionError("");
    };

    // =====================================================
    // CLOSE ACTION
    // =====================================================

    const closeAction = () => {
        setActiveCalvingId(null);
        setActionType(null);

        setSelectedCalfId("");
        setNewCalfTag("");
        setActionError("");
    };

    // =====================================================
    // LINK EXISTING CALF
    // =====================================================

    const handleLinkExisting = async () => {
        if (!selectedCalfId) {
            setActionError(
                "Please select an animal."
            );
            return;
        }

        try {
            setActionLoading(true);
            setActionError("");

            const token =
                localStorage.getItem("authToken");

            if (!token) {
                throw new Error(
                    "Please login again."
                );
            }

            const response = await fetch(
                `${API_BASE_URL}/calving/${activeCalvingId}/calf/existing`,
                {
                    method: "PUT",

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        calfId: Number(
                            selectedCalfId
                        ),
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to link calf"
                );
            }

            closeAction();

            await fetchCalvingRecords();

            onChanged?.();
        } catch (error) {
            console.error(
                "Link calf error:",
                error
            );

            setActionError(
                error.message ||
                    "Failed to link existing calf"
            );
        } finally {
            setActionLoading(false);
        }
    };

    // =====================================================
    // CREATE NEW CALF
    // =====================================================

    const handleCreateNewCalf = async () => {
        const tagNumber =
            newCalfTag.trim();

        if (!tagNumber) {
            setActionError(
                "Please enter calf tag number."
            );
            return;
        }

        try {
            setActionLoading(true);
            setActionError("");

            const token =
                localStorage.getItem("authToken");

            if (!token) {
                throw new Error(
                    "Please login again."
                );
            }

            const response = await fetch(
                `${API_BASE_URL}/calving/${activeCalvingId}/calf/new`,
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        tagNumber,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to add calf"
                );
            }

            closeAction();

            await fetchCalvingRecords();
            await fetchAnimals();

            onChanged?.();
        } catch (error) {
            console.error(
                "Create calf error:",
                error
            );

            setActionError(
                error.message ||
                    "Failed to add calf"
            );
        } finally {
            setActionLoading(false);
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section className="mt-8">

            {/* =========================
                HEADER
            ========================= */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Calving Records
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Calving history of this animal
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setShowForm(
                            (value) => !value
                        )
                    }
                    className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                >
                    {showForm
                        ? "Close"
                        : "+ Add Calving"}
                </button>

            </div>

            {/* =========================
                FORM
            ========================= */}

            {showForm && (
                <CalvingRecordForm
                    animalId={animalId}
                    onCreated={
                        handleCalvingCreated
                    }
                    onCancel={() =>
                        setShowForm(false)
                    }
                />
            )}

            {/* =========================
                LOADING
            ========================= */}

            {loading && (
                <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="animate-pulse space-y-4">

                        <div className="h-5 w-40 rounded bg-gray-200" />

                        <div className="h-28 rounded-xl bg-gray-200" />

                        <div className="h-28 rounded-xl bg-gray-200" />

                    </div>
                </div>
            )}

            {/* =========================
                ERROR
            ========================= */}

            {!loading && error && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5">

                    <h3 className="font-semibold text-red-700">
                        Unable to load calving records
                    </h3>

                    <p className="mt-1 text-sm text-red-600">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={
                            fetchCalvingRecords
                        }
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
                            🐮
                        </div>

                        <h3 className="mt-3 font-semibold text-gray-900">
                            No calving records yet
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Add a calving event when this
                            animal gives birth.
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

                        {records.map(
                            (record) => (
                                <CalvingRecordCard
                                    key={record.id}
                                    record={record}
                                    activeCalvingId={
                                        activeCalvingId
                                    }
                                    actionType={
                                        actionType
                                    }
                                    animals={
                                        animals
                                    }
                                    selectedCalfId={
                                        selectedCalfId
                                    }
                                    setSelectedCalfId={
                                        setSelectedCalfId
                                    }
                                    newCalfTag={
                                        newCalfTag
                                    }
                                    setNewCalfTag={
                                        setNewCalfTag
                                    }
                                    actionError={
                                        actionError
                                    }
                                    actionLoading={
                                        actionLoading
                                    }
                                    openAction={
                                        openAction
                                    }
                                    closeAction={
                                        closeAction
                                    }
                                    handleLinkExisting={
                                        handleLinkExisting
                                    }
                                    handleCreateNewCalf={
                                        handleCreateNewCalf
                                    }
                                />
                            )
                        )}

                    </div>
                )}

        </section>
    );
}

/* =====================================================
   CALVING CARD
===================================================== */

function CalvingRecordCard({
    record,
    activeCalvingId,
    actionType,
    animals,
    selectedCalfId,
    setSelectedCalfId,
    newCalfTag,
    setNewCalfTag,
    actionError,
    actionLoading,
    openAction,
    closeAction,
    handleLinkExisting,
    handleCreateNewCalf,
}) {
    const hasCalf = Boolean(record.calf);

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* =========================
                HEADER
            ========================= */}

            <div className="border-b border-gray-100 p-5">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-2xl">
                            🐮
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                                Calving
                            </p>

                            <h3 className="mt-1 text-lg font-semibold text-gray-900">
                                {formatDate(
                                    record.calvingDate
                                )}
                            </h3>
                        </div>

                    </div>

                    <div className="rounded-xl bg-gray-50 px-4 py-3">
                        <p className="text-xs text-gray-400">
                            Mother
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                            {record.mother?.tagNumber ||
                                "—"}
                        </p>
                    </div>

                </div>

            </div>

            {/* =========================
                BODY
            ========================= */}

            <div className="p-5">

                {/* Notes */}

                {record.notes && (
                    <div className="rounded-xl bg-gray-50 p-4">

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Notes
                        </p>

                        <p className="mt-2 text-sm leading-6 text-gray-600">
                            {record.notes}
                        </p>

                    </div>
                )}

                {/* =========================
                    CALF
                ========================= */}

                <div className="mt-4 rounded-xl border border-gray-100 p-4">

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Calf
                            </p>

                            {hasCalf ? (
                                <div className="mt-2">
                                    <p className="font-semibold text-gray-900">
                                        {record.calf.tagNumber}
                                    </p>

                                    <p className="mt-1 text-xs text-green-600">
                                        Linked to livestock
                                    </p>
                                </div>
                            ) : (
                                <p className="mt-2 text-sm text-gray-500">
                                    Not added to livestock
                                </p>
                            )}
                        </div>

                        {/* Actions */}

                        {!hasCalf &&
                            activeCalvingId !==
                                record.id && (
                                <div className="flex flex-wrap gap-2">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            openAction(
                                                record.id,
                                                "EXISTING"
                                            )
                                        }
                                        className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                        Link Existing
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            openAction(
                                                record.id,
                                                "NEW"
                                            )
                                        }
                                        className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                                    >
                                        Add New Calf
                                    </button>

                                </div>
                            )}

                    </div>

                    {/* =========================
                        EXISTING CALF
                    ========================= */}

                    {!hasCalf &&
                        activeCalvingId ===
                            record.id &&
                        actionType ===
                            "EXISTING" && (
                            <div className="mt-5 rounded-xl bg-gray-50 p-4">

                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-gray-800">
                                        Link Existing Animal
                                    </h4>

                                    <button
                                        type="button"
                                        onClick={
                                            closeAction
                                        }
                                        className="text-xs text-gray-500 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                <div className="mt-4">

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Select Calf
                                    </label>

                                    <select
                                        value={
                                            selectedCalfId
                                        }
                                        onChange={(e) =>
                                            setSelectedCalfId(
                                                e.target
                                                    .value
                                            )
                                        }
                                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-green-500"
                                    >
                                        <option value="">
                                            Select an animal
                                        </option>

                                        {animals
                                            .filter(
                                                (
                                                    item
                                                ) =>
                                                    item.id !==
                                                    record.mother?.id
                                            )
                                            .map(
                                                (
                                                    item
                                                ) => (
                                                    <option
                                                        key={
                                                            item.id
                                                        }
                                                        value={
                                                            item.id
                                                        }
                                                    >
                                                        {
                                                            item.tagNumber
                                                        }
                                                    </option>
                                                )
                                            )}
                                    </select>

                                </div>

                                {actionError && (
                                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                        {actionError}
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={
                                        handleLinkExisting
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                    className="mt-4 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                                >
                                    {actionLoading
                                        ? "Linking..."
                                        : "Link Calf"}
                                </button>

                            </div>
                        )}

                    {/* =========================
                        NEW CALF
                    ========================= */}

                    {!hasCalf &&
                        activeCalvingId ===
                            record.id &&
                        actionType ===
                            "NEW" && (
                            <div className="mt-5 rounded-xl bg-green-50 p-4">

                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-green-800">
                                        Add Calf to Livestock
                                    </h4>

                                    <button
                                        type="button"
                                        onClick={
                                            closeAction
                                        }
                                        className="text-xs text-gray-500 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                {/* Mother */}

                                <div className="mt-4 rounded-xl bg-white p-4">
                                    <p className="text-xs text-gray-400">
                                        Mother
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-gray-800">
                                        {record.mother?.tagNumber ||
                                            "—"}
                                    </p>
                                </div>

                                {/* Tag */}

                                <div className="mt-4">

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Farm Tag Number
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            newCalfTag
                                        }
                                        onChange={(e) =>
                                            setNewCalfTag(
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="e.g. Cow-032"
                                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-green-500"
                                    />

                                    <p className="mt-2 text-xs text-gray-400">
                                        Enter the independent
                                        tag assigned by the farmer.
                                    </p>

                                </div>

                                {actionError && (
                                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                        {actionError}
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={
                                        handleCreateNewCalf
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                    className="mt-4 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                                >
                                    {actionLoading
                                        ? "Adding..."
                                        : "Add Calf"}
                                </button>

                            </div>
                        )}

                </div>

            </div>
        </div>
    );
}

/* =====================================================
   HELPERS
===================================================== */

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