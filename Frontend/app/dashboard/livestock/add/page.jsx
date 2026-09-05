"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

export default function AddAnimalPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [animals, setAnimals] = useState([]);
    const [photoPreview, setPhotoPreview] = useState(null);

    const [form, setForm] = useState({
        // Basic
        name: "",
        tagNumber: "",

        // Classification
        species: "COW",
        sex: "FEMALE",
        lifeStage: "ADULT",

        // Physical
        breed: "",
        dateOfBirth: "",
        weight: "",

        // Mother
        motherSource: "UNKNOWN",
        motherId: "",
        motherExternalName: "",
        motherExternalBreed: "",
        motherExternalTag: "",

        // Father
        fatherSource: "UNKNOWN",
        fatherId: "",
        fatherExternalName: "",
        fatherExternalBreed: "",
        fatherExternalTag: "",

        // Production
        productionStatus: "NOT_APPLICABLE",
        lactationNumber: "",
        lactationStartDate: "",
        currentMilkProduction: "",

        // Reproduction
        pregnancyStatus: "NOT_APPLICABLE",
        lastCalvingDate: "",
        expectedCalvingDate: "",

        // Other
        notes: "",

        // File
        photo: null,
    });

    // =====================================================
    // AUTH + EXISTING ANIMALS
    // =====================================================

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            router.replace("/login");
            return;
        }

        fetchAnimals(token);
    }, [router]);

    const fetchAnimals = async (token) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/animals`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                return;
            }

            const data = await response.json();

            setAnimals(
                data?.data?.animals ||
                    data?.data ||
                    data?.animals ||
                    []
            );
        } catch (error) {
            console.error(
                "Failed to fetch animals:",
                error
            );
        }
    };

    // =====================================================
    // INPUT HANDLING
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            setForm((prev) => ({
                ...prev,
                photo: null,
            }));

            setPhotoPreview(null);

            return;
        }

        setForm((prev) => ({
            ...prev,
            photo: file,
        }));

        setPhotoPreview(URL.createObjectURL(file));
    };

    // =====================================================
    // PARENT SOURCE HANDLING
    // =====================================================

    const handleMotherSourceChange = (source) => {
        setForm((prev) => ({
            ...prev,

            motherSource: source,

            // Existing se external/unknown
            ...(source !== "EXISTING" && {
                motherId: "",
            }),

            // External se existing/unknown
            ...(source !== "EXTERNAL" && {
                motherExternalName: "",
                motherExternalBreed: "",
                motherExternalTag: "",
            }),
        }));
    };

    const handleFatherSourceChange = (source) => {
        setForm((prev) => ({
            ...prev,

            fatherSource: source,

            // Existing se external/unknown
            ...(source !== "EXISTING" && {
                fatherId: "",
            }),

            // External se existing/unknown
            ...(source !== "EXTERNAL" && {
                fatherExternalName: "",
                fatherExternalBreed: "",
                fatherExternalTag: "",
            }),
        }));
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("authToken");

        if (!token) {
            router.replace("/login");
            return;
        }

        // Basic validation
        if (!form.name.trim()) {
            alert("Animal name is required.");
            return;
        }

        if (!form.tagNumber.trim()) {
            alert("Tag number is required.");
            return;
        }

        // External mother validation
        if (
            form.motherSource === "EXTERNAL" &&
            !form.motherExternalName.trim()
        ) {
            alert("Please enter external mother's name.");
            return;
        }

        // External father validation
        if (
            form.fatherSource === "EXTERNAL" &&
            !form.fatherExternalName.trim()
        ) {
            alert("Please enter external father's name.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();

            // Basic fields
            formData.append("name", form.name.trim());
            formData.append(
                "tagNumber",
                form.tagNumber.trim()
            );

            formData.append("species", form.species);
            formData.append("sex", form.sex);
            formData.append("lifeStage", form.lifeStage);

            // Physical
            if (form.breed.trim()) {
                formData.append(
                    "breed",
                    form.breed.trim()
                );
            }

            if (form.dateOfBirth) {
                formData.append(
                    "dateOfBirth",
                    form.dateOfBirth
                );
            }

            if (form.weight !== "") {
                formData.append(
                    "weight",
                    form.weight
                );
            }

            // =================================================
            // MOTHER
            // =================================================

            formData.append(
                "motherSource",
                form.motherSource
            );

            if (
                form.motherSource === "EXISTING" &&
                form.motherId
            ) {
                formData.append(
                    "motherId",
                    form.motherId
                );
            }

            if (
                form.motherSource === "EXTERNAL"
            ) {
                formData.append(
                    "motherExternalName",
                    form.motherExternalName.trim()
                );

                if (form.motherExternalBreed.trim()) {
                    formData.append(
                        "motherExternalBreed",
                        form.motherExternalBreed.trim()
                    );
                }

                if (form.motherExternalTag.trim()) {
                    formData.append(
                        "motherExternalTag",
                        form.motherExternalTag.trim()
                    );
                }
            }

            // =================================================
            // FATHER
            // =================================================

            formData.append(
                "fatherSource",
                form.fatherSource
            );

            if (
                form.fatherSource === "EXISTING" &&
                form.fatherId
            ) {
                formData.append(
                    "fatherId",
                    form.fatherId
                );
            }

            if (
                form.fatherSource === "EXTERNAL"
            ) {
                formData.append(
                    "fatherExternalName",
                    form.fatherExternalName.trim()
                );

                if (form.fatherExternalBreed.trim()) {
                    formData.append(
                        "fatherExternalBreed",
                        form.fatherExternalBreed.trim()
                    );
                }

                if (form.fatherExternalTag.trim()) {
                    formData.append(
                        "fatherExternalTag",
                        form.fatherExternalTag.trim()
                    );
                }
            }

            // =================================================
            // PRODUCTION
            // =================================================

            formData.append(
                "productionStatus",
                form.productionStatus
            );

            if (
                form.productionStatus === "LACTATING"
            ) {
                if (form.lactationNumber) {
                    formData.append(
                        "lactationNumber",
                        form.lactationNumber
                    );
                }

                if (form.lactationStartDate) {
                    formData.append(
                        "lactationStartDate",
                        form.lactationStartDate
                    );
                }

                if (
                    form.currentMilkProduction !== ""
                ) {
                    formData.append(
                        "currentMilkProduction",
                        form.currentMilkProduction
                    );
                }
            }

            // =================================================
            // REPRODUCTION
            // =================================================

            formData.append(
                "pregnancyStatus",
                form.pregnancyStatus
            );

            if (form.lastCalvingDate) {
                formData.append(
                    "lastCalvingDate",
                    form.lastCalvingDate
                );
            }

            if (form.expectedCalvingDate) {
                formData.append(
                    "expectedCalvingDate",
                    form.expectedCalvingDate
                );
            }

            // =================================================
            // NOTES
            // =================================================

            if (form.notes.trim()) {
                formData.append(
                    "notes",
                    form.notes.trim()
                );
            }

            // =================================================
            // PHOTO
            // =================================================

            if (form.photo) {
                formData.append(
                    "photo",
                    form.photo
                );
            }

            const response = await fetch(
                `${API_BASE_URL}/animals`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                        "Failed to add animal."
                );
            }

            alert("Animal added successfully!");

            router.push("/dashboard/livestock");
        } catch (error) {
            console.error(
                "Add animal error:",
                error
            );

            alert(
                error.message ||
                    "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // DYNAMIC CONDITIONS
    // =====================================================

    const isAdultOrHeifer =
        form.lifeStage === "ADULT" ||
        form.lifeStage === "HEIFER";

    const isFemale =
        form.sex === "FEMALE";

    const isLactating =
        form.productionStatus === "LACTATING";

    const showProduction =
        isFemale &&
        isAdultOrHeifer;

    const showReproduction =
        isFemale &&
        isAdultOrHeifer;

    // Existing parents
    const existingMothers = animals.filter(
        (animal) =>
            animal.sex === "FEMALE"
    );

    const existingFathers = animals.filter(
        (animal) =>
            animal.sex === "MALE"
    );

    return (
        <div className="min-h-full bg-gray-50 p-4 md:p-6 lg:p-8">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mx-auto mb-8 max-w-5xl">

                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            "/dashboard/livestock"
                        )
                    }
                    className="mb-4 text-sm font-medium text-gray-500 transition hover:text-gray-900"
                >
                    ← Back to Animals
                </button>

                <h1 className="text-3xl font-bold text-gray-900">
                    Add New Animal
                </h1>

                <p className="mt-2 text-gray-500">
                    Add complete information about
                    your cow or buffalo.
                </p>

            </div>

            <form
                onSubmit={handleSubmit}
                className="mx-auto max-w-5xl space-y-6"
            >

                {/* =================================================
                    01 - ANIMAL IDENTITY
                ================================================= */}

                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <SectionHeader
                        number="01"
                        title="Animal Identity"
                        description="Basic identification information"
                    />

                    <div className="grid gap-5 md:grid-cols-2">

                        <Input
                            label="Animal Name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="e.g. Ganga"
                            required
                        />

                        <Input
                            label="Tag Number"
                            name="tagNumber"
                            value={form.tagNumber}
                            onChange={handleChange}
                            placeholder="e.g. COW-001"
                            required
                        />

                        {/* Photo */}

                        <div className="md:col-span-2">

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Animal Photo
                            </label>

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={
                                        handlePhotoChange
                                    }
                                    className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm"
                                />

                                {photoPreview && (
                                    <img
                                        src={
                                            photoPreview
                                        }
                                        alt="Animal preview"
                                        className="h-24 w-24 rounded-xl object-cover"
                                    />
                                )}

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    02 - CLASSIFICATION
                ================================================= */}

                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <SectionHeader
                        number="02"
                        title="Classification"
                        description="Define the animal's species, sex and life stage"
                    />

                    <div className="grid gap-5 md:grid-cols-3">

                        <Select
                            label="Species"
                            name="species"
                            value={form.species}
                            onChange={handleChange}
                            options={[
                                {
                                    value: "COW",
                                    label: "Cow",
                                },
                                {
                                    value: "BUFFALO",
                                    label: "Buffalo",
                                },
                            ]}
                        />

                        <Select
                            label="Sex"
                            name="sex"
                            value={form.sex}
                            onChange={handleChange}
                            options={[
                                {
                                    value: "FEMALE",
                                    label: "Female",
                                },
                                {
                                    value: "MALE",
                                    label: "Male",
                                },
                            ]}
                        />

                        <Select
                            label="Life Stage"
                            name="lifeStage"
                            value={form.lifeStage}
                            onChange={handleChange}
                            options={[
                                {
                                    value: "CALF",
                                    label: "Calf",
                                },
                                {
                                    value: "HEIFER",
                                    label: "Heifer",
                                },
                                {
                                    value: "ADULT",
                                    label: "Adult",
                                },
                            ]}
                        />

                    </div>

                    {form.lifeStage === "CALF" && (
                        <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
                            This animal will be
                            managed as a calf in the
                            livestock module.
                        </div>
                    )}

                </section>


                {/* =================================================
                    03 - PHYSICAL INFORMATION
                ================================================= */}

                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <SectionHeader
                        number="03"
                        title="Physical Information"
                        description="Breed, birth date and current weight"
                    />

                    <div className="grid gap-5 md:grid-cols-3">

                        <Input
                            label="Breed"
                            name="breed"
                            value={form.breed}
                            onChange={handleChange}
                            placeholder="e.g. Sahiwal"
                        />

                        <Input
                            label="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                            value={form.dateOfBirth}
                            onChange={handleChange}
                        />

                        <Input
                            label="Weight (kg)"
                            name="weight"
                            type="number"
                            min="0"
                            step="0.1"
                            value={form.weight}
                            onChange={handleChange}
                            placeholder="e.g. 420"
                        />

                    </div>

                </section>


                {/* =================================================
                    04 - PARENTAGE
                ================================================= */}

                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <SectionHeader
                        number="04"
                        title="Parentage"
                        description="Record parents from this dairy or external farms"
                    />

                    <div className="space-y-8">

                        {/* ================= MOTHER ================= */}

                        <ParentSection
                            title="Mother"
                            source={
                                form.motherSource
                            }
                            onSourceChange={
                                handleMotherSourceChange
                            }
                        >

                            {form.motherSource ===
                                "EXISTING" && (
                                <Select
                                    label="Select Existing Mother"
                                    name="motherId"
                                    value={
                                        form.motherId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    options={[
                                        {
                                            value: "",
                                            label:
                                                "Select mother",
                                        },

                                        ...existingMothers.map(
                                            (
                                                animal
                                            ) => ({
                                                value:
                                                    animal.id,
                                                label: `${animal.name} (${animal.tagNumber})`,
                                            })
                                        ),
                                    ]}
                                />
                            )}

                            {form.motherSource ===
                                "EXTERNAL" && (
                                <div className="grid gap-5 md:grid-cols-3">

                                    <Input
                                        label="Mother Name"
                                        name="motherExternalName"
                                        value={
                                            form.motherExternalName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Gauri"
                                        required
                                    />

                                    <Input
                                        label="Breed"
                                        name="motherExternalBreed"
                                        value={
                                            form.motherExternalBreed
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Sahiwal"
                                    />

                                    <Input
                                        label="Tag / Registration No."
                                        name="motherExternalTag"
                                        value={
                                            form.motherExternalTag
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Optional"
                                    />

                                </div>
                            )}

                            {form.motherSource ===
                                "UNKNOWN" && (
                                <InfoBox>
                                    Mother information
                                    is not available.
                                </InfoBox>
                            )}

                        </ParentSection>


                        {/* ================= FATHER ================= */}

                        <ParentSection
                            title="Father"
                            source={
                                form.fatherSource
                            }
                            onSourceChange={
                                handleFatherSourceChange
                            }
                        >

                            {form.fatherSource ===
                                "EXISTING" && (
                                <Select
                                    label="Select Existing Father"
                                    name="fatherId"
                                    value={
                                        form.fatherId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    options={[
                                        {
                                            value: "",
                                            label:
                                                "Select father",
                                        },

                                        ...existingFathers.map(
                                            (
                                                animal
                                            ) => ({
                                                value:
                                                    animal.id,
                                                label: `${animal.name} (${animal.tagNumber})`,
                                            })
                                        ),
                                    ]}
                                />
                            )}

                            {form.fatherSource ===
                                "EXTERNAL" && (
                                <div className="grid gap-5 md:grid-cols-3">

                                    <Input
                                        label="Father Name"
                                        name="fatherExternalName"
                                        value={
                                            form.fatherExternalName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Moti"
                                        required
                                    />

                                    <Input
                                        label="Breed"
                                        name="fatherExternalBreed"
                                        value={
                                            form.fatherExternalBreed
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. HF"
                                    />

                                    <Input
                                        label="Tag / Registration No."
                                        name="fatherExternalTag"
                                        value={
                                            form.fatherExternalTag
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Optional"
                                    />

                                </div>
                            )}

                            {form.fatherSource ===
                                "UNKNOWN" && (
                                <InfoBox>
                                    Father information
                                    is not available.
                                </InfoBox>
                            )}

                        </ParentSection>

                    </div>

                </section>


                {/* =================================================
                    05 - MILK PRODUCTION
                ================================================= */}

                {showProduction && (
                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                        <SectionHeader
                            number="05"
                            title="Milk Production"
                            description="Production information for female animals"
                        />

                        <div className="grid gap-5 md:grid-cols-2">

                            <Select
                                label="Production Status"
                                name="productionStatus"
                                value={
                                    form.productionStatus
                                }
                                onChange={
                                    handleChange
                                }
                                options={[
                                    {
                                        value:
                                            "LACTATING",
                                        label:
                                            "Lactating",
                                    },
                                    {
                                        value: "DRY",
                                        label: "Dry",
                                    },
                                    {
                                        value:
                                            "NOT_APPLICABLE",
                                        label:
                                            "Not Applicable",
                                    },
                                ]}
                            />

                            {isLactating && (
                                <>
                                    <Input
                                        label="Lactation Number"
                                        name="lactationNumber"
                                        type="number"
                                        min="1"
                                        value={
                                            form.lactationNumber
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. 3"
                                    />

                                    <Input
                                        label="Lactation Start Date"
                                        name="lactationStartDate"
                                        type="date"
                                        value={
                                            form.lactationStartDate
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                    <Input
                                        label="Current Daily Milk (Litres)"
                                        name="currentMilkProduction"
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={
                                            form.currentMilkProduction
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. 12.5"
                                    />
                                </>
                            )}

                        </div>

                        {isLactating && (
                            <InfoBox type="success">
                                Detailed morning and
                                evening milk records
                                will be managed in the
                                Milk Records module.
                            </InfoBox>
                        )}

                    </section>
                )}


                {/* =================================================
                    06 - REPRODUCTIVE INFORMATION
                ================================================= */}

                {showReproduction && (
                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                        <SectionHeader
                            number="06"
                            title="Reproductive Information"
                            description="Pregnancy and calving information"
                        />

                        <div className="grid gap-5 md:grid-cols-3">

                            <Select
                                label="Pregnancy Status"
                                name="pregnancyStatus"
                                value={
                                    form.pregnancyStatus
                                }
                                onChange={
                                    handleChange
                                }
                                options={[
                                    {
                                        value:
                                            "NOT_PREGNANT",
                                        label:
                                            "Not Pregnant",
                                    },
                                    {
                                        value:
                                            "PREGNANT",
                                        label:
                                            "Pregnant",
                                    },
                                    {
                                        value:
                                            "NOT_APPLICABLE",
                                        label:
                                            "Not Applicable",
                                    },
                                ]}
                            />

                            <Input
                                label="Last Calving Date"
                                name="lastCalvingDate"
                                type="date"
                                value={
                                    form.lastCalvingDate
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <Input
                                label="Expected Calving Date"
                                name="expectedCalvingDate"
                                type="date"
                                value={
                                    form.expectedCalvingDate
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                    </section>
                )}


                {/* =================================================
                    07 - NOTES
                ================================================= */}

                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <SectionHeader
                        number="07"
                        title="Additional Information"
                        description="Add any additional notes"
                    />

                    <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Enter any additional information about this animal..."
                        className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />

                </section>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="flex flex-col-reverse gap-3 pb-8 sm:flex-row sm:justify-end">

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/dashboard/livestock"
                            )
                        }
                        disabled={loading}
                        className="rounded-xl border border-gray-300 bg-white px-7 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-xl bg-green-600 px-7 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Saving Animal..."
                            : "Save Animal"}
                    </button>

                </div>

            </form>
        </div>
    );
}


/* =====================================================
   SECTION HEADER
===================================================== */

function SectionHeader({
    number,
    title,
    description,
}) {
    return (
        <div className="mb-6 flex items-start gap-4">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-sm font-bold text-green-700">
                {number}
            </div>

            <div>
                <h2 className="text-lg font-bold text-gray-900">
                    {title}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    {description}
                </p>
            </div>

        </div>
    );
}


/* =====================================================
   INPUT
===================================================== */

function Input({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
    min,
    step,
}) {
    return (
        <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </label>

            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                min={min}
                step={step}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />

        </div>
    );
}


/* =====================================================
   SELECT
===================================================== */

function Select({
    label,
    name,
    value,
    onChange,
    options,
}) {
    return (
        <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
                {label}
            </label>

            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>

        </div>
    );
}


/* =====================================================
   PARENT SECTION
===================================================== */

function ParentSection({
    title,
    source,
    onSourceChange,
    children,
}) {
    return (
        <div className="rounded-xl border border-gray-200 p-5">

            <h3 className="mb-4 text-base font-semibold text-gray-900">
                {title}
            </h3>

            {/* Parent source */}

            <div className="mb-5 grid gap-3 md:grid-cols-3">

                <button
                    type="button"
                    onClick={() =>
                        onSourceChange(
                            "EXISTING"
                        )
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                        source === "EXISTING"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                >
                    <p className="font-medium text-gray-900">
                        Existing Animal
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Parent is in this dairy
                    </p>
                </button>


                <button
                    type="button"
                    onClick={() =>
                        onSourceChange(
                            "EXTERNAL"
                        )
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                        source === "EXTERNAL"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                >
                    <p className="font-medium text-gray-900">
                        External Parent
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Parent belongs to another farm
                    </p>
                </button>


                <button
                    type="button"
                    onClick={() =>
                        onSourceChange(
                            "UNKNOWN"
                        )
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                        source === "UNKNOWN"
                            ? "border-gray-500 bg-gray-50"
                            : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                >
                    <p className="font-medium text-gray-900">
                        Unknown
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Parent information unavailable
                    </p>
                </button>

            </div>

            {children}

        </div>
    );
}


/* =====================================================
   INFO BOX
===================================================== */

function InfoBox({
    children,
    type = "default",
}) {
    const classes =
        type === "success"
            ? "bg-green-50 text-green-700"
            : "bg-gray-50 text-gray-600";

    return (
        <div
            className={`mt-5 rounded-xl p-4 text-sm ${classes}`}
        >
            {children}
        </div>
    );
}