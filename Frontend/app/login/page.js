"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api/v1";

export default function Login() {
  const router = useRouter();

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
            Accept: "application/json",
          },

          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

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
        "Email login error:",
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
  // REQUEST PHONE OTP
  // =========================

  const handleRequestPhoneOtp = async (
    e
  ) => {
    e.preventDefault();

    setError("");

    const phone =
      formData.phone.trim();

    if (!phone) {
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
            Accept: "application/json",
          },

          body: JSON.stringify({
            phone,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to send OTP."
        );
      }

      // Reset OTP
      setOtp([
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      // Move to OTP screen
      setStep("otp");

    } catch (err) {
      console.error(
        "Phone OTP request error:",
        err
      );

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

  const handleOtpChange = (
    e,
    index
  ) => {
    const value =
      e.target.value;

    // Allow only one digit
    if (!/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = value;

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
  // OTP KEY DOWN
  // =========================

  const handleOtpKeyDown = (
    e,
    index
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      e.target.previousElementSibling
    ) {
      e.target.previousElementSibling.focus();
    }
  };

  // =========================
  // OTP PASTE
  // =========================

  const handleOtpPaste = (e) => {
    e.preventDefault();

    const pastedText =
      e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);

    if (!pastedText) {
      return;
    }

    const newOtp = [
      "",
      "",
      "",
      "",
      "",
      "",
    ];

    pastedText
      .split("")
      .forEach((digit, index) => {
        newOtp[index] = digit;
      });

    setOtp(newOtp);

    setError("");
  };

  // =========================
  // VERIFY PHONE OTP
  // =========================

  const handleVerifyPhoneOtp =
    async (e) => {
      e.preventDefault();

      const enteredOtp =
        otp.join("");

      setError("");

      if (
        enteredOtp.length !== 6
      ) {
        setError(
          "Please enter the complete 6-digit OTP."
        );
        return;
      }

      setLoading(true);

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/auth/login/phone/verify-otp`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
                Accept:
                  "application/json",
              },

              body: JSON.stringify({
                phone:
                  formData.phone.trim(),
                otp: enteredOtp,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Invalid or expired OTP."
          );
        }

        // =========================
        // GET JWT
        // =========================

        const token =
          data?.data?.token;

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
            JSON.stringify(
              data.data.user
            )
          );
        }

        // =========================
        // REDIRECT
        // =========================

        router.replace(
          "/dashboard"
        );

      } catch (err) {
        console.error(
          "Phone OTP verification error:",
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

  const handleResendOtp = async () => {
    setError("");

    if (!formData.phone.trim()) {
      setError(
        "Phone number is missing."
      );
      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          `${API_BASE_URL}/auth/login/phone/request-otp`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
              Accept:
                "application/json",
            },

            body: JSON.stringify({
              phone:
                formData.phone.trim(),
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to resend OTP."
        );
      }

      setOtp([
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      setError("");

    } catch (err) {
      console.error(
        "Resend OTP error:",
        err
      );

      setError(
        err.message ||
          "Unable to resend OTP."
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

        {/* EMAIL / PHONE TOGGLE */}

        <div className="flex bg-white p-1 rounded-lg border border-green-900">

          <button
            type="button"
            onClick={() =>
              handleAuthTypeSwitch(
                "email"
              )
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
              handleAuthTypeSwitch(
                "phone"
              )
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


        {/* =========================
            EMAIL LOGIN
        ========================= */}

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
                onChange={
                  handleChange
                }
                placeholder="you@example.com"
                autoComplete="email"
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
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
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
                className="text-sm text-green-800 hover:text-green-950 font-medium"
              >
                Forgot Password?
              </button>

            </div>


            {/* SIGN IN */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-green-700 hover:bg-green-900 text-white font-semibold rounded-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>

          </>
        )}


        {/* =========================
            PHONE LOGIN
        ========================= */}

        {authType === "phone" && (
          <>

            <div>

              <label className="block text-sm font-medium text-black mb-1">
                Phone Number
              </label>

              <input
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
                autoComplete="tel"
                required
                className="w-full px-4 py-3 bg-white border border-green-900 rounded-lg text-black placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-700"
              />

            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-green-700 hover:bg-green-900 text-white font-semibold rounded-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
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
        onSubmit={
          handleVerifyPhoneOtp
        }
        className="space-y-6"
      >

        {/* OTP DESCRIPTION */}

        <div className="text-center">

          <p className="text-sm text-black">
            Enter the 6-digit OTP
            sent to
          </p>

          <p className="font-semibold text-green-900 mt-1">
            {formData.phone}
          </p>

        </div>


        {/* OTP INPUTS */}

        <div className="flex justify-center gap-2 sm:gap-3">

          {otp.map(
            (digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
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
                onPaste={
                  index === 0
                    ? handleOtpPaste
                    : undefined
                }
                aria-label={`OTP digit ${
                  index + 1
                }`}
                className="w-11 h-12 sm:w-12 sm:h-12 text-center text-xl font-bold bg-white border border-green-900 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-700"
              />
            )
          )}

        </div>


        {/* VERIFY */}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-green-700 hover:bg-green-900 text-white font-semibold rounded-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Verifying..."
            : "Verify & Sign In"}
        </button>


        {/* CHANGE / RESEND */}

        <div className="flex justify-between text-sm">

          <button
            type="button"
            disabled={loading}
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
            className="text-green-900 hover:text-green-700 disabled:opacity-50"
          >
            ← Change number
          </button>


          <button
            type="button"
            disabled={loading}
            onClick={
              handleResendOtp
            }
            className="text-green-900 hover:text-green-700 disabled:opacity-50"
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

      <div className="max-w-md w-full bg-green-100 rounded-2xl shadow-xl p-6 sm:p-8 border border-green-900">

        {/* HEADER */}

        <div className="text-center mb-8">

          <h1 className="text-3xl sm:text-4xl font-bold text-green-700 tracking-tight">

            {step === "otp"
              ? "Verify OTP"
              : "Welcome Back"}

          </h1>

          <p className="text-black text-sm sm:text-base mt-2">

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
              onClick={() =>
                router.push(
                  "/signup"
                )
              }
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