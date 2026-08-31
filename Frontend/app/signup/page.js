"use client";

import React, { useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api/v1";

export default function SignUp() {
  const [step, setStep] = useState("form");
  const [authType, setAuthType] = useState("email");

  const [formData, setFormData] = useState({
    fullName: "",
    identifier: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

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
  // EMAIL / PHONE SWITCH
  // =========================

  const handleAuthTypeSwitch = (type) => {
    setAuthType(type);

    setFormData((prev) => ({
      ...prev,
      identifier: "",
    }));

    setError("");
  };

  // =========================
  // REGISTER
  // =========================

  const handleInitialSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.identifier.trim()) {
      setError(
        authType === "email"
          ? "Please enter your email."
          : "Please enter your phone number."
      );
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
      const requestBody =
        authType === "email"
          ? {
              fullName: formData.fullName.trim(),
              email: formData.identifier.trim(),
              password: formData.password,
            }
          : {
              fullName: formData.fullName.trim(),
              phone: formData.identifier.trim(),
              password: formData.password,
            };

      console.log(
        "Register URL:",
        `${API_BASE_URL}/auth/register`
      );

      console.log(
        "Register Body:",
        requestBody
      );

      const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify(requestBody),
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
          "Unable to connect to DairySaathi server. Please check the backend URL."
        );
      }

      const data = await response.json();

      console.log(
        "Register Response:",
        data
      );

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
            .map(
              (error) =>
                error.message
            )
            .join(", ");
        }

        throw new Error(errorMessage);
      }

      // =========================
      // MOVE TO OTP
      // =========================

      setOtp([
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      setStep("otp");

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
  // OTP INPUT
  // =========================

  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = value.slice(-1);

    setOtp(newOtp);
    setError("");

    if (
      value &&
      e.target.nextElementSibling
    ) {
      e.target.nextElementSibling.focus();
    }
  };

  // =========================
  // OTP BACKSPACE
  // =========================

  const handleOtpKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      e.target.previousElementSibling
    ) {
      e.target.previousElementSibling.focus();
    }
  };

  // =========================
  // VERIFY OTP
  // =========================

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    setError("");

    if (enteredOtp.length !== 6) {
      setError(
        "Please enter all 6 digits of the OTP."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/verify-otp`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            identifier:
              formData.identifier.trim(),
            otp: enteredOtp,
          }),
        }
      );

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
        "OTP Response:",
        data
      );

      if (!response.ok) {
        let errorMessage =
          data?.message ||
          "Invalid or expired OTP.";

        if (
          data?.errors &&
          Array.isArray(data.errors) &&
          data.errors.length > 0
        ) {
          errorMessage = data.errors
            .map(
              (error) =>
                error.message
            )
            .join(", ");
        }

        throw new Error(errorMessage);
      }

      setStep("success");

    } catch (err) {
      console.error(
        "OTP verification error:",
        err
      );

      setError(
        err.message ||
          "OTP verification failed."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESEND OTP
  // =========================

  const handleResendOtp = () => {
    setError(
      "Resend OTP will be available after we add the resend OTP API."
    );
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">

      <div className="max-w-md w-full bg-green-100 rounded-2xl shadow-xl p-8 border border-green-900">

        {/* HEADER */}

        <div className="text-center mb-6">

          <h2 className="text-3xl font-bold text-green-700 tracking-tight">

            {step === "otp"
              ? "Verify Account"
              : step === "success"
              ? "Welcome!"
              : "Create an Account"}

          </h2>

          <p className="text-black text-sm mt-2">

            {step === "form" &&
              "Sign up to get started with DairySaathi"}

            {step === "otp" &&
              `Enter the verification code sent to ${formData.identifier}`}

            {step === "success" &&
              "Your account has been successfully verified."}

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
                onClick={() => {
                  window.location.href =
                    "/login";
                }}
                className="mt-2 text-green-800 font-semibold hover:text-green-950"
              >
                Go to Login →
              </button>
            )}

          </div>
        )}

        {/* ========================= */}
        {/* REGISTRATION FORM */}
        {/* ========================= */}

        {step === "form" && (

          <form
            onSubmit={handleInitialSubmit}
            className="space-y-4"
          >

            {/* FULL NAME */}

            <div>

              <label className="block text-sm font-medium text-black mb-1">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 bg-white border border-green-900 rounded-lg text-black placeholder-slate-500 focus:outline-none text-sm"
              />

            </div>

            {/* EMAIL / PHONE */}

            <div className="flex bg-white p-1 rounded-lg border border-green-900">

              <button
                type="button"
                onClick={() =>
                  handleAuthTypeSwitch(
                    "email"
                  )
                }
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                  authType === "email"
                    ? "bg-green-700 text-white shadow"
                    : "text-black hover:text-green-900"
                }`}
              >
                Use Email
              </button>

              <button
                type="button"
                onClick={() =>
                  handleAuthTypeSwitch(
                    "phone"
                  )
                }
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                  authType === "phone"
                    ? "bg-green-700 text-white shadow"
                    : "text-black hover:text-green-900"
                }`}
              >
                Use Phone Number
              </button>

            </div>

            {/* EMAIL / PHONE INPUT */}

            <div>

              <label className="block text-sm font-medium text-black mb-1">

                {authType === "email"
                  ? "Email Address"
                  : "Phone Number"}

              </label>

              <input
                type={
                  authType === "email"
                    ? "email"
                    : "tel"
                }
                name="identifier"
                required
                value={formData.identifier}
                onChange={handleChange}
                placeholder={
                  authType === "email"
                    ? "you@example.com"
                    : "+919876543210"
                }
                className="w-full px-4 py-2.5 bg-white border border-green-900 rounded-lg text-black placeholder-slate-500 focus:outline-none text-sm"
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label className="block text-sm font-medium text-black mb-1">
                Password
              </label>

              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-white border border-green-900 rounded-lg text-black placeholder-slate-500 focus:outline-none text-sm"
              />

            </div>

            {/* CONFIRM PASSWORD */}

            <div>

              <label className="block text-sm font-medium text-black mb-1">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-white border border-green-900 rounded-lg text-black placeholder-slate-500 focus:outline-none text-sm"
              />

            </div>

            {/* CONTINUE */}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-green-700 hover:bg-green-900 text-white font-medium rounded-lg shadow-lg transition-colors duration-200 focus:outline-none disabled:opacity-50"
            >

              {loading
                ? "Sending OTP..."
                : "Continue"}

            </button>

          </form>

        )}

        {/* ========================= */}
        {/* OTP FORM */}
        {/* ========================= */}

        {step === "otp" && (

          <form
            onSubmit={handleOtpSubmit}
            className="space-y-6"
          >

            <div className="flex justify-between gap-2">

              {otp.map((digit, index) => (

                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) =>
                    handleOtpChange(
                      e,
                      index
                    )
                  }
                  onKeyDown={(e) =>
                    handleOtpKeyDown(
                      e,
                      index
                    )
                  }
                  className="w-12 h-12 text-center text-xl font-bold bg-white border border-green-900 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-700"
                />

              ))}

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-green-700 hover:bg-green-900 text-white font-medium rounded-lg shadow-lg transition-colors duration-200 focus:outline-none disabled:opacity-50"
            >

              {loading
                ? "Verifying..."
                : "Verify & Complete"}

            </button>

            <div className="flex justify-between items-center text-xs text-black">

              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setError("");
                }}
                className="hover:text-green-700 transition"
              >
                ← Change details
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                className="hover:text-green-700 transition"
              >
                Resend Code
              </button>

            </div>

          </form>

        )}

        {/* ========================= */}
        {/* SUCCESS */}
        {/* ========================= */}

        {step === "success" && (

          <div className="text-center space-y-4">

            <div className="w-12 h-12 bg-green-700/20 text-green-800 border border-green-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>

            <p className="text-black text-sm">
              Your account is ready. You can now login.
            </p>

            <button
              onClick={() => {
                window.location.href =
                  "/login";
              }}
              className="w-full py-2.5 px-4 bg-green-700 hover:bg-green-900 text-white font-medium rounded-lg shadow transition"
            >
              Go to Login
            </button>

          </div>

        )}

      </div>

    </div>
  );
}