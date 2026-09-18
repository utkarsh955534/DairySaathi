"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api/v1";

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


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
  // EMAIL LOGIN
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const email = formData.email.trim();
    const password = formData.password;

    // Frontend validation
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/login/email`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      // Safe JSON parsing
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

      console.log(
        "Login Response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Invalid email or password."
        );
      }


      // =========================
      // GET JWT
      // =========================

      const token = data?.data?.token;

      if (!token) {
        throw new Error(
          "Login successful but authentication token was not received."
        );
      }


      // =========================
      // STORE JWT
      // =========================

      localStorage.setItem(
        "authToken",
        token
      );


      // =========================
      // STORE USER
      // =========================

      if (data?.data?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.data.user)
        );
      }


      // =========================
      // REDIRECT
      // =========================

      router.replace("/dashboard");

    } catch (err) {
      console.error(
        "Login error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while logging in."
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

      <div className="max-w-md w-full bg-green-100 rounded-2xl shadow-xl p-6 sm:p-8 border border-green-900">

        {/* HEADER */}

        <div className="text-center mb-8">

          <h1 className="text-3xl sm:text-4xl font-bold text-green-700 tracking-tight">
            Welcome Back
          </h1>

          <p className="text-black text-sm sm:text-base mt-2">
            Sign in to your DairySaathi account
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 text-red-600 text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}


        {/* LOGIN FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

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
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full px-4 py-3 bg-white border border-green-900 rounded-lg text-black placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-700"
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
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 bg-white border border-green-900 rounded-lg text-black placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-700"
            />

          </div>


          {/* FORGOT PASSWORD */}

          <div className="flex justify-end">

            <button
              type="button"
              disabled
              className="text-sm text-green-800 font-medium opacity-60 cursor-not-allowed"
            >
              Forgot Password?
            </button>

          </div>


          {/* SIGN IN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-green-700 hover:bg-green-900 text-white font-semibold rounded-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>

        </form>


        {/* SIGNUP LINK */}

        <div className="text-center mt-7 text-sm text-black">

          Don't have an account?{" "}

          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="text-green-800 font-semibold hover:text-green-950"
          >
            Create Account
          </button>

        </div>

      </div>

    </div>
  );
}