"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

export default function ChangePasswordPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.currentPassword ||
            !formData.newPassword ||
            !formData.confirmPassword
        ) {
            setError(
                "Please fill all fields."
            );
            return;
        }

        if (
            formData.newPassword.length < 8
        ) {
            setError(
                "New password must contain at least 8 characters."
            );
            return;
        }

        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {
            setError(
                "New password and confirm password do not match."
            );
            return;
        }

        if (
            formData.currentPassword ===
            formData.newPassword
        ) {
            setError(
                "New password must be different from your current password."
            );
            return;
        }

        setLoading(true);

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
                `${API_BASE_URL}/auth/change-password`,
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
                        currentPassword:
                            formData.currentPassword,

                        newPassword:
                            formData.newPassword,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                        "Unable to change password."
                );
            }

            setSuccess(
                "Password changed successfully."
            );

            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            setTimeout(() => {
                router.push(
                    "/dashboard/profile"
                );
            }, 1200);

        } catch (error) {
            console.error(
                "Change password error:",
                error
            );

            setError(
                error.message ||
                    "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-2xl">

                {/* Header */}

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
                        Change Password
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Update your DairySaathi account
                        password.
                    </p>

                </div>


                {/* Form */}

                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* Current Password */}

                        <div>

                            <label
                                htmlFor="currentPassword"
                                className="mb-2 block text-sm font-semibold text-gray-800"
                            >
                                Current Password
                            </label>

                            <input
                                id="currentPassword"
                                type="password"
                                name="currentPassword"
                                value={
                                    formData.currentPassword
                                }
                                onChange={
                                    handleChange
                                }
                                autoComplete="current-password"
                                placeholder="Enter current password"
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                            />

                        </div>


                        {/* New Password */}

                        <div>

                            <label
                                htmlFor="newPassword"
                                className="mb-2 block text-sm font-semibold text-gray-800"
                            >
                                New Password
                            </label>

                            <input
                                id="newPassword"
                                type="password"
                                name="newPassword"
                                value={
                                    formData.newPassword
                                }
                                onChange={
                                    handleChange
                                }
                                autoComplete="new-password"
                                placeholder="Enter new password"
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                            />

                            <p className="mt-2 text-xs text-gray-500">
                                Password must contain at
                                least 8 characters.
                            </p>

                        </div>


                        {/* Confirm Password */}

                        <div>

                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-semibold text-gray-800"
                            >
                                Confirm New Password
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                value={
                                    formData.confirmPassword
                                }
                                onChange={
                                    handleChange
                                }
                                autoComplete="new-password"
                                placeholder="Confirm new password"
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                            />

                        </div>


                        {/* Error */}

                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                {error}
                            </div>
                        )}


                        {/* Success */}

                        {success && (
                            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                                {success}
                            </div>
                        )}


                        {/* Buttons */}

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                disabled={loading}
                                onClick={() =>
                                    router.push(
                                        "/dashboard/profile"
                                    )
                                }
                                className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading
                                    ? "Updating..."
                                    : "Change Password"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </main>
    );
}