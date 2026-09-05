"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, MailCheck, MoveRight, Phone } from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");

          router.replace("/login");
          return;
        }

        setUser(data.data);

        // Keep latest user data locally
        localStorage.setItem("user", JSON.stringify(data.data));
      } catch (err) {
        console.error("Profile fetch error:", err);

        setError("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-3">🐄</div>

          <p className="text-green-700 font-semibold">Loading profile...</p>
        </div>
      </main>
    );
  }

  // Error
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-red-600 font-medium">{error}</p>

          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 rounded-lg bg-green-700 px-5 py-2 text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}

        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="mb-4 text-sm font-medium text-green-700 hover:text-green-900"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

          <p className="mt-1 text-gray-500">
            View and manage your DairySaathi account.
          </p>
        </div>

        {/* Profile Card */}

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* Avatar */}

            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-green-700 text-3xl font-bold text-white">
              {initials}
            </div>

            {/* User */}

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.fullName}
                </h2>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {user.role}
                </span>
              </div>

              {user.email && (
                <p className="mt-2 text-gray-600 flex gap-2"> <span className="text-black"><MailCheck/></span> {user.email}</p>
              )}

              {user.phone && (
                <p className="mt-1 text-gray-600 flex gap-2"> <span className="text-black"><Phone/></span> {user.phone}</p>
              )}
            </div>

            <button
              onClick={() => router.push("/dashboard/profile/edit")}
              className="rounded-xl bg-green-700 px-5 py-2.5 font-semibold text-white transition hover:bg-green-800"
            >
              Edit Profile
            </button>
          </div>
        </section>

        {/* Personal Information */}

        <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Personal Information
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoCard
              label="Full Name"
              value={user.fullName || "Not provided"}
            />

            <InfoCard
              label="Email Address"
              value={user.email || "Not provided"}
            />

            <InfoCard
              label="Phone Number"
              value={user.phone || "Not provided"}
            />

            <InfoCard label="Role" value={user.role || "FARMER"} />
          </div>
        </section>

        {/* Verification */}

        <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Verification</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <VerificationCard
              title="Email Verification"
              verified={user.emailVerified}
            />

            <VerificationCard
              title="Phone Verification"
              verified={user.phoneVerified}
            />
          </div>
        </section>

        {/* Account */}

        <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Account Information
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoCard label="User ID" value={user.id ? `#${user.id}` : "N/A"} />

            <InfoCard
              label="Account Status"
              value={user.isActive ? "Active" : "Inactive"}
            />

            <InfoCard label="Member Since" value={memberSince} />
          </div>
        </section>

        {/* Security */}

        <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Security</h2>

          <button
            onClick={() => router.push("/dashboard/profile/change-password")}
            className="mt-4 flex w-full items-center justify-between rounded-xl p-4 text-left transition hover:bg-amber-500 bg-amber-400"
          >
            <div>
              <p className="font-semibold text-gray-900 flex gap-3"> <span><LockKeyhole/></span> Change Password</p>

              <p className="mt-1 text-sm text-gray-900">
                Update your account password.
              </p>
            </div>

            <span className="text-gray-900 "><MoveRight/></span>
          </button>
        </section>
      </div>
    </main>
  );
}

// =====================================
// INFO CARD
// =====================================

function InfoCard({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-2 break-words font-semibold text-gray-900">{value}</p>
    </div>
  );
}

// =====================================
// VERIFICATION CARD
// =====================================

function VerificationCard({ title, verified }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            verified
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {verified ? "✓" : "!"}
        </div>

        <div>
          <p className="font-semibold text-gray-900">{title}</p>

          <p className="mt-1 text-xs text-gray-500">
            {verified ? "Your information is verified" : "Verification pending"}
          </p>
        </div>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          verified
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {verified ? "Verified" : "Pending"}
      </span>
    </div>
  );
}
