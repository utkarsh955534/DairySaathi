"use client";

import { useState } from "react";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

const HEALTH_TYPES = [
    {
        value: "DEWORMING",
        label: "Deworming",
    },
    {
        value: "VACCINATION",
        label: "Vaccination",
    },
    {
        value: "TREATMENT",
        label: "Treatment",
    },
    {
        value: "CHECKUP",
        label: "Checkup",
    },
    {
        value: "OTHER",
        label: "Other",
    },
];

const CHECKUP_TYPES = [
    {
        value: "GENERAL_HEALTH",
        label: "General Health",
    },
    {
        value: "PHYSICAL_EXAMINATION",
        label: "Physical Examination",
    },
    {
        value: "UDDER_HEALTH",
        label: "Udder Health",
    },
    {
        value: "HOOF_CHECK",
        label: "Hoof Check",
    },
    {
        value: "OTHER",
        label: "Other",
    },
];

export default function HealthRecordForm({
    animalId,
    onCreated,
}) {
    const [formData, setFormData] = useState({
        type: "VACCINATION",
        recordDate: new Date()
            .toISOString()
            .slice(0, 16),

        // Vaccination
        vaccineName: "",
        dose: "",
        nextDue: "",

        // Deworming
        dewormerName: "",
        dewormingDose: "",
        dewormingNextDue: "",

        // Treatment
        problem: "",
        diagnosis: "",
        treatmentMedicine: "",
        treatmentDose: "",
        treatmentNextReview: "",

        // Checkup
        checkupType: "GENERAL_HEALTH",
        findings: "",

        // Other
        title: "",
        details: "",

        // Common
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
            type: "VACCINATION",

            recordDate: new Date()
                .toISOString()
                .slice(0, 16),

            vaccineName: "",
            dose: "",
            nextDue: "",

            dewormerName: "",
            dewormingDose: "",
            dewormingNextDue: "",

            problem: "",
            diagnosis: "",
            treatmentMedicine: "",
            treatmentDose: "",
            treatmentNextReview: "",

            checkupType: "GENERAL_HEALTH",
            findings: "",

            title: "",
            details: "",

            notes: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.type) {
            setError(
                "Please select a health record type."
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
        // TYPE-SPECIFIC VALIDATION
        // =========================

        if (
            formData.type === "VACCINATION" &&
            !formData.vaccineName.trim()
        ) {
            setError("Please enter the vaccine name.");
            return;
        }

        if (
            formData.type === "DEWORMING" &&
            !formData.dewormerName.trim()
        ) {
            setError("Please enter the dewormer name.");
            return;
        }

        if (
            formData.type === "TREATMENT" &&
            !formData.problem.trim()
        ) {
            setError("Please enter the problem.");
            return;
        }

        if (
            formData.type === "CHECKUP" &&
            !formData.checkupType
        ) {
            setError("Please select the checkup type.");
            return;
        }

        if (
            formData.type === "OTHER" &&
            !formData.title.trim()
        ) {
            setError("Please enter a title.");
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

                // Vaccination
                vaccineName:
                    formData.vaccineName.trim() ||
                    undefined,

                // Deworming
                dewormerName:
                    formData.dewormerName.trim() ||
                    undefined,

                // Common dose
                dose:
                    (
                        formData.type === "VACCINATION"
                            ? formData.dose
                            : formData.type === "DEWORMING"
                            ? formData.dewormingDose
                            : undefined
                    )?.trim() || undefined,

                // Common due/review
                nextDue:
                    (
                        formData.type === "VACCINATION"
                            ? formData.nextDue
                            : formData.type === "DEWORMING"
                            ? formData.dewormingNextDue
                            : undefined
                    )
                        ? new Date(
                              formData.type ===
                              "VACCINATION"
                                  ? formData.nextDue
                                  : formData.dewormingNextDue
                          ).toISOString()
                        : undefined,

                // Treatment
                problem:
                    formData.problem.trim() ||
                    undefined,

                diagnosis:
                    formData.diagnosis.trim() ||
                    undefined,

                treatmentMedicine:
                    formData.treatmentMedicine.trim() ||
                    undefined,

                treatmentDose:
                    formData.treatmentDose.trim() ||
                    undefined,

                treatmentNextReview:
                    formData.treatmentNextReview
                        ? new Date(
                              formData.treatmentNextReview
                          ).toISOString()
                        : undefined,

                // Checkup
                checkupType:
                    formData.checkupType ||
                    undefined,

                findings:
                    formData.findings.trim() ||
                    undefined,

                // Other
                title:
                    formData.title.trim() ||
                    undefined,

                details:
                    formData.details.trim() ||
                    undefined,

                notes:
                    formData.notes.trim() ||
                    undefined,
            };

            const response = await fetch(
                `${API_BASE_URL}/health/animals/${animalId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to create health record"
                );
            }

            resetForm();

            onCreated?.(data.data);
        } catch (error) {
            console.error(
                "Create health record error:",
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
                Add Health Record
            </h3>

            {/* =========================
                TYPE + DATE
            ========================= */}

            <div className="mt-5 grid gap-4 md:grid-cols-2">

                <FormField label="Type">
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="form-input"
                    >
                        {HEALTH_TYPES.map((type) => (
                            <option
                                key={type.value}
                                value={type.value}
                            >
                                {type.label}
                            </option>
                        ))}
                    </select>
                </FormField>

                <FormField label="Record Date & Time">
                    <input
                        type="datetime-local"
                        name="recordDate"
                        value={formData.recordDate}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </FormField>

            </div>

            {/* =========================
                VACCINATION
            ========================= */}

            {formData.type === "VACCINATION" && (
                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">

                    <h4 className="mb-4 text-sm font-semibold text-blue-800">
                        Vaccination Details
                    </h4>

                    <div className="grid gap-4 md:grid-cols-3">

                        <FormField label="Vaccine">
                            <input
                                type="text"
                                name="vaccineName"
                                value={formData.vaccineName}
                                onChange={handleChange}
                                placeholder="e.g. FMD Vaccine"
                                className="form-input"
                            />
                        </FormField>

                        <FormField label="Dose">
                            <input
                                type="text"
                                name="dose"
                                value={formData.dose}
                                onChange={handleChange}
                                placeholder="e.g. 2 ml"
                                className="form-input"
                            />
                        </FormField>

                        <FormField label="Next Due">
                            <input
                                type="datetime-local"
                                name="nextDue"
                                value={formData.nextDue}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </FormField>

                    </div>
                </div>
            )}

            {/* =========================
                DEWORMING
            ========================= */}

            {formData.type === "DEWORMING" && (
                <div className="mt-5 rounded-xl border border-purple-100 bg-purple-50 p-4">

                    <h4 className="mb-4 text-sm font-semibold text-purple-800">
                        Deworming Details
                    </h4>

                    <div className="grid gap-4 md:grid-cols-3">

                        <FormField label="Dewormer">
                            <input
                                type="text"
                                name="dewormerName"
                                value={formData.dewormerName}
                                onChange={handleChange}
                                placeholder="e.g. Albendazole"
                                className="form-input"
                            />
                        </FormField>

                        <FormField label="Dose">
                            <input
                                type="text"
                                name="dewormingDose"
                                value={
                                    formData.dewormingDose
                                }
                                onChange={handleChange}
                                placeholder="e.g. 10 ml"
                                className="form-input"
                            />
                        </FormField>

                        <FormField label="Next Due">
                            <input
                                type="datetime-local"
                                name="dewormingNextDue"
                                value={
                                    formData.dewormingNextDue
                                }
                                onChange={handleChange}
                                className="form-input"
                            />
                        </FormField>

                    </div>
                </div>
            )}

            {/* =========================
                TREATMENT
            ========================= */}

            {formData.type === "TREATMENT" && (
                <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4">

                    <h4 className="mb-4 text-sm font-semibold text-red-800">
                        Treatment Details
                    </h4>

                    <div className="grid gap-4 md:grid-cols-2">

                        <FormField label="Problem">
                            <input
                                type="text"
                                name="problem"
                                value={formData.problem}
                                onChange={handleChange}
                                placeholder="e.g. Fever, Injury, Mastitis"
                                className="form-input"
                            />
                        </FormField>

                        <FormField label="Diagnosis">
                            <input
                                type="text"
                                name="diagnosis"
                                value={formData.diagnosis}
                                onChange={handleChange}
                                placeholder="Diagnosis"
                                className="form-input"
                            />
                        </FormField>

                        <FormField label="Medicine">
                            <input
                                type="text"
                                name="treatmentMedicine"
                                value={
                                    formData.treatmentMedicine
                                }
                                onChange={handleChange}
                                placeholder="e.g. Antibiotic"
                                className="form-input"
                            />
                        </FormField>

                        <FormField label="Dose">
                            <input
                                type="text"
                                name="treatmentDose"
                                value={
                                    formData.treatmentDose
                                }
                                onChange={handleChange}
                                placeholder="e.g. 10 ml"
                                className="form-input"
                            />
                        </FormField>

                        <FormField label="Next Review">
                            <input
                                type="datetime-local"
                                name="treatmentNextReview"
                                value={
                                    formData.treatmentNextReview
                                }
                                onChange={handleChange}
                                className="form-input"
                            />
                        </FormField>

                    </div>
                </div>
            )}

            {/* =========================
                CHECKUP
            ========================= */}

            {formData.type === "CHECKUP" && (
                <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-4">

                    <h4 className="mb-4 text-sm font-semibold text-green-800">
                        Checkup Details
                    </h4>

                    <div className="grid gap-4 md:grid-cols-2">

                        <FormField label="Checkup Type">
                            <select
                                name="checkupType"
                                value={
                                    formData.checkupType
                                }
                                onChange={handleChange}
                                className="form-input"
                            >
                                {CHECKUP_TYPES.map(
                                    (type) => (
                                        <option
                                            key={
                                                type.value
                                            }
                                            value={
                                                type.value
                                            }
                                        >
                                            {type.label}
                                        </option>
                                    )
                                )}
                            </select>
                        </FormField>

                    </div>

                    <div className="mt-4">
                        <FormField label="Findings">
                            <textarea
                                name="findings"
                                value={
                                    formData.findings
                                }
                                onChange={handleChange}
                                rows={4}
                                placeholder="Describe the checkup findings..."
                                className="form-input"
                            />
                        </FormField>
                    </div>

                </div>
            )}

            {/* =========================
                OTHER
            ========================= */}

            {formData.type === "OTHER" && (
                <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">

                    <h4 className="mb-4 text-sm font-semibold text-gray-800">
                        Other Health Event
                    </h4>

                    <FormField label="Title">
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Health observation"
                            className="form-input"
                        />
                    </FormField>

                    <div className="mt-4">
                        <FormField label="Details">
                            <textarea
                                name="details"
                                value={formData.details}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Describe the event..."
                                className="form-input"
                            />
                        </FormField>
                    </div>

                </div>
            )}

            {/* =========================
                NOTES
            ========================= */}

            <div className="mt-5">
                <FormField label="Notes">
                    <textarea
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Optional notes..."
                        className="form-input"
                    />
                </FormField>
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
                    : "Add Health Record"}
            </button>
        </form>
    );
}

/* =====================================================
   FORM FIELD
===================================================== */

function FormField({
    label,
    children,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
                {label}
            </label>

            {children}
        </div>
    );
}