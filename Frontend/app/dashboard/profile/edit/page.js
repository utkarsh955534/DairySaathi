"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

export default function EditProfilePage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================
    // GET CURRENT USER
    // =========================

    useEffect(() => {
        const fetchUser = async () => {
            const token =
                localStorage.getItem("authToken");

            if (!token) {
                router.replace("/login");
                return;
            }

            try {
                const response = await fetch(
                    `${API_BASE_URL}/auth/me`,
                    {
                        method: "GET",
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                            Accept:
                                "application/json",
                        },
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {
                    localStorage.removeItem(
                        "authToken"
                    );

                    localStorage.removeItem(
                        "user"
                    );

                    router.replace("/login");
                    return;
                }

                const user = data.data;

                setFormData({
                    fullName:
                        user.fullName || "",
                    email:
                        user.email || "",
                    phone:
                        user.phone || "",
                });

            } catch (error) {
                console.error(
                    "Profile fetch error:",
                    error
                );

                setError(
                    "Unable to load profile."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);


    // =========================
    // INPUT CHANGE
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };


    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.fullName.trim()
        ) {
            setError(
                "Full name is required."
            );
            return;
        }

        setSaving(true);

        try {
            const token =
                localStorage.getItem(
                    "authToken"
                );

            if (!token) {
                router.replace("/login");
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/auth/profile`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,

                        Accept:
                            "application/json",
                    },

                    body: JSON.stringify({
                        fullName:
                            formData.fullName.trim(),

                        email:
                            formData.email.trim() ||
                            null,

                        phone:
                            formData.phone.trim() ||
                            null,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                        "Unable to update profile."
                );
            }

            // Update local user data
            if (data?.data) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        data.data
                    )
                );

                setFormData({
                    fullName:
                        data.data.fullName ||
                        "",
                    email:
                        data.data.email ||
                        "",
                    phone:
                        data.data.phone ||
                        "",
                });
            }

            setSuccess(
                "Profile updated successfully."
            );

            // Go back after short delay
            setTimeout(() => {
                router.push(
                    "/dashboard/profile"
                );
            }, 1000);

        } catch (error) {
            console.error(
                "Update profile error:",
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


    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">

                    <div className="text-4xl mb-3">
                        🐄
                    </div>

                    <p className="font-semibold text-green-700">
                        Loading profile...
                    </p>

                </div>
            </main>
        );
    }


    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-3xl">

                {/* HEADER */}

                <div className="mb-8">

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/dashboard/profile"
                            )
                        }
                        className="mb-4 text-sm font-medium text-green-700 hover:text-green-900"
                    >
                        ← Back to Profile
                    </button>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Edit Profile
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Update your DairySaathi account
                        information.
                    </p>

                </div>


                {/* FORM CARD */}

                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="space-y-6"
                    >

                        {/* FULL NAME */}

                        <div>

                            <label
                                htmlFor="fullName"
                                className="mb-2 block text-sm font-semibold text-gray-800"
                            >
                                Full Name
                            </label>

                            <input
                                id="fullName"
                                type="text"
                                name="fullName"
                                value={
                                    formData.fullName
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter your full name"
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                            />

                        </div>


                        {/* EMAIL */}

                        <div>

                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-semibold text-gray-800"
                            >
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={
                                    formData.email
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="you@example.com"
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                            />

                            <p className="mt-2 text-xs text-gray-500">
                                Changing your email may
                                require verification.
                            </p>

                        </div>


                        {/* PHONE */}

                        <div>

                            <label
                                htmlFor="phone"
                                className="mb-2 block text-sm font-semibold text-gray-800"
                            >
                                Phone Number
                            </label>

                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                value={
                                    formData.phone
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="+919876543210"
                                inputMode="tel"
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                            />

                            <p className="mt-2 text-xs text-gray-500">
                                Changing your phone number
                                may require verification.
                            </p>

                        </div>


                        {/* ERROR */}

                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                {error}
                            </div>
                        )}


                        {/* SUCCESS */}

                        {success && (
                            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                                {success}
                            </div>
                        )}


                        {/* BUTTONS */}

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        "/dashboard/profile"
                                    )
                                }
                                disabled={saving}
                                className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </main>
    );
}