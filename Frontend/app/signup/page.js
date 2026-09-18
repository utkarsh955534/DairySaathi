"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api/v1";

export default function SignUp() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


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
  };


  // =========================
  // REGISTER
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");


    // =========================
    // FRONTEND VALIDATION
    // =========================

    if (!formData.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (formData.fullName.trim().length < 2) {
      setError(
        "Name must contain at least 2 characters."
      );
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (formData.password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }


    setLoading(true);

    try {
      // =========================
      // REGISTER REQUEST
      // =========================

      const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            fullName: formData.fullName.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          }),
        }
      );


      // =========================
      // SAFE RESPONSE PARSING
      // =========================

      const contentType =
        response.headers.get("content-type");

      if (
        !contentType ||
        !contentType.includes("application/json")
      ) {
        const text = await response.text();

        console.error(
          "Server returned non-JSON response:",
          text
        );

        throw new Error(
          "Unable to connect to DairySaathi server."
        );
      }


      const data = await response.json();


      // =========================
      // BACKEND ERROR
      // =========================

      if (!response.ok) {
        let errorMessage =
          data?.message ||
          "Registration failed.";

        if (
          data?.errors &&
          Array.isArray(data.errors) &&
          data.errors.length > 0
        ) {
          errorMessage = data.errors
            .map((item) => item.message)
            .join(", ");
        }

        throw new Error(errorMessage);
      }


      // =========================
      // REGISTRATION SUCCESS
      // =========================

      console.log(
        "Registration successful:",
        data
      );

      // Registration is complete.
      // No OTP verification required.

      router.replace("/login");

    } catch (err) {
      console.error(
        "Registration error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while registering."
      );

    } finally {
      setLoading(false);
    }
  };


  // =========================
  // MAIN UI
  // =========================

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">

      <div className="max-w-md w-full bg-green-100 rounded-2xl shadow-xl p-8 border border-green-900">

        {/* HEADER */}

        <div className="text-center mb-6">

          <h2 className="text-3xl font-bold text-green-700 tracking-tight">
            Create an Account
          </h2>

          <p className="text-black text-sm mt-2">
            Sign up to get started with DairySaathi
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-600 text-sm rounded-lg text-center font-medium">

            <p>{error}</p>

            {error
              .toLowerCase()
              .includes("already registered") && (
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="mt-2 text-green-800 font-semibold hover:text-green-950"
              >
                Go to Login →
              </button>
            )}

          </div>
        )}


        {/* REGISTRATION FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* FULL NAME */}

          <div>

            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-black mb-1"
            >
              Full Name
            </label>

            <input
              id="fullName"
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              className="w-full px-4 py-2.5 bg-white border border-green-900 rounded-lg text-black placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-700 text-sm"
            />

          </div>


          {/* EMAIL */}

          <div>

            <label
              htmlFor="email"
              className="block text-sm font-medium text-black mb-1"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-4 py-2.5 bg-white border border-green-900 rounded-lg text-black placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-700 text-sm"
            />

          </div>


          {/* PASSWORD */}

          <div>

            <label
              htmlFor="password"
              className="block text-sm font-medium text-black mb-1"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              className="w-full px-4 py-2.5 bg-white border border-green-900 rounded-lg text-black placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-700 text-sm"
            />

          </div>


          {/* CONFIRM PASSWORD */}

          <div>

            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-black mb-1"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              className="w-full px-4 py-2.5 bg-white border border-green-900 rounded-lg text-black placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-700 text-sm"
            />

          </div>


          {/* CREATE ACCOUNT */}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-green-700 hover:bg-green-900 text-white font-medium rounded-lg shadow-lg transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>


        {/* LOGIN LINK */}

        <div className="text-center mt-7 text-sm text-black">

          Already have an account?{" "}

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-green-800 font-semibold hover:text-green-950"
          >
            Login
          </button>

        </div>

      </div>

    </div>
  );
}