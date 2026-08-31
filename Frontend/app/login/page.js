"use client";

import React, { useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api/v1";

export default function Login() {
  const [authType, setAuthType] = useState("email");

  const [step, setStep] = useState("login");

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

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
  // SWITCH EMAIL / PHONE
  // =========================

  const handleAuthTypeSwitch = (type) => {
    setAuthType(type);

    setStep("login");

    setError("");

    setOtp([
      "",
      "",
      "",
      "",
      "",
      "",
    ]);
  };

  // =========================
  // EMAIL LOGIN
  // =========================

  const handleEmailLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/login/email`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Invalid email or password."
        );
      }

      // Get JWT token

      const token = data?.data?.token;

      if (!token) {
        throw new Error(
          "Login successful but authentication token was not received."
        );
      }

      // Store JWT

      localStorage.setItem(
        "authToken",
        token
      );

      // Store user if returned by backend

      if (data?.data?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.data.user)
        );
      }

      // Redirect

      window.location.href = "/dashboard";

    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while logging in."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // REQUEST PHONE OTP
  // =========================

  const handleRequestPhoneOtp = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.phone.trim()) {
      setError(
        "Please enter your phone number."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/login/phone/request-otp`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            phone: formData.phone,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to send OTP."
        );
      }

      // Move to OTP screen

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
      setError(
        err.message ||
          "Unable to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // OTP CHANGE
  // =========================

  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    // Allow numbers only

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = value.slice(-1);

    setOtp(newOtp);

    setError("");

    // Focus next input

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
  // VERIFY PHONE OTP
  // =========================

  const handleVerifyPhoneOtp = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    setError("");

    if (enteredOtp.length !== 6) {
      setError(
        "Please enter the complete 6-digit OTP."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/login/phone/verify-otp`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            phone: formData.phone,
            otp: enteredOtp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Invalid or expired OTP."
        );
      }

      const token = data?.data?.token;

      if (!token) {
        throw new Error(
          "Login successful but authentication token was not received."
        );
      }

      // Store JWT

      localStorage.setItem(
        "authToken",
        token
      );

      // Store user

      if (data?.data?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.data.user)
        );
      }

      // Redirect

      window.location.href = "/dashboard";

    } catch (err) {
      setError(
        err.message ||
          "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGIN FORM
  // =========================

  const renderLoginForm = () => {
    return (
      <form
        onSubmit={
          authType === "email"
            ? handleEmailLogin
            : handleRequestPhoneOtp
        }
        className="space-y-5"
      >

        {/* Email / Phone Toggle */}

        <div className="flex bg-white p-1 rounded-lg border border-green-900">

          <button
            type="button"
            onClick={() =>
              handleAuthTypeSwitch("email")
            }
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
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
              handleAuthTypeSwitch("phone")
            }
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              authType === "phone"
                ? "bg-green-700 text-white shadow"
                : "text-black hover:text-green-900"
            }`}
          >
            Use Phone
          </button>

        </div>

        {/* EMAIL LOGIN */}

        {authType === "email" && (
          <>
            <div>

              <label className="block text-sm font-medium text-black mb-1">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-white border border-green-900 rounded-lg text-black placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-700"
              />

            </div>

            <div>

              <label className="block text-sm font-medium text-black mb-1">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-white border border-green-900 rounded-lg text-black placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-700"
              />

            </div>

            <div className="flex justify-end">

              <button
                type="button"
                className="text-sm text-green-800 hover:text-green-950 font-medium"
              >
                Forgot Password?
              </button>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-green-700 hover:bg-green-900 text-white font-semibold rounded-lg shadow-lg transition disabled:opacity-50"
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>
          </>
        )}

        {/* PHONE LOGIN */}

        {authType === "phone" && (
          <>
            <div>

              <label className="block text-sm font-medium text-black mb-1">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+919876543210"
                required
                className="w-full px-4 py-3 bg-white border border-green-900 rounded-lg text-black placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-700"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-green-700 hover:bg-green-900 text-white font-semibold rounded-lg shadow-lg transition disabled:opacity-50"
            >
              {loading
                ? "Sending OTP..."
                : "Send OTP"}
            </button>
          </>
        )}

      </form>
    );
  };

  // =========================
  // OTP FORM
  // =========================

  const renderOtpForm = () => {
    return (
      <form
        onSubmit={handleVerifyPhoneOtp}
        className="space-y-6"
      >

        <div className="text-center">

          <p className="text-sm text-black">
            Enter the 6-digit OTP sent to
          </p>

          <p className="font-semibold text-green-900 mt-1">
            {formData.phone}
          </p>

        </div>

        {/* OTP INPUTS */}

        <div className="flex justify-between gap-2">

          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) =>
                handleOtpChange(e, index)
              }
              onKeyDown={(e) =>
                handleOtpKeyDown(e, index)
              }
              className="w-12 h-12 text-center text-xl font-bold bg-white border border-green-900 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          ))}

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-green-700 hover:bg-green-900 text-white font-semibold rounded-lg shadow-lg transition disabled:opacity-50"
        >
          {loading
            ? "Verifying..."
            : "Verify & Sign In"}
        </button>

        <div className="flex justify-between text-sm">

          <button
            type="button"
            onClick={() => {
              setStep("login");
              setOtp([
                "",
                "",
                "",
                "",
                "",
                "",
              ]);
              setError("");
            }}
            className="text-green-900 hover:text-green-700"
          >
            ← Change number
          </button>

          <button
            type="button"
            onClick={handleRequestPhoneOtp}
            className="text-green-900 hover:text-green-700"
          >
            Resend OTP
          </button>

        </div>

      </form>
    );
  };

  // =========================
  // MAIN UI
  // =========================

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">

      <div className="max-w-md w-full bg-green-100 rounded-2xl shadow-xl p-8 border border-green-900">

        {/* HEADER */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-green-700 tracking-tight">

            {step === "otp"
              ? "Verify OTP"
              : "Welcome Back"}

          </h1>

          <p className="text-black text-sm mt-2">

            {step === "otp"
              ? "Verify your phone number to continue"
              : "Sign in to your DairySaathi account"}

          </p>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 text-red-600 text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {/* CONTENT */}

        {step === "login"
          ? renderLoginForm()
          : renderOtpForm()}

        {/* SIGNUP LINK */}

        {step === "login" && (
          <div className="text-center mt-7 text-sm text-black">

            Don't have an account?{" "}

            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "/signup";
              }}
              className="text-green-800 font-semibold hover:text-green-950"
            >
              Create Account
            </button>

          </div>
        )}

      </div>

    </div>
  );
}