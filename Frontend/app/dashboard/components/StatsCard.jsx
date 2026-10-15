
"use client";

import { useEffect, useState } from "react";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

const getArray = (result) => {
    if (Array.isArray(result?.data)) return result.data;

    if (Array.isArray(result?.data?.animals))
        return result.data.animals;

    if (Array.isArray(result?.data?.records))
        return result.data.records;

    return [];
};

// Format a date using the browser's local calendar date.
const getLocalDateKey = (date) => {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
};

// Parse a date safely. Date-only strings are interpreted as local dates.
const parseDate = (value) => {
    if (!value) return null;

    let date;

    if (
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
        const [year, month, day] = value.split("-").map(Number);
        date = new Date(year, month - 1, day);
    } else {
        date = new Date(value);
    }

    return Number.isNaN(date.getTime()) ? null : date;
};

const isDueWithinNext7Days = (value, today, lastDay) => {
    const date = parseDate(value);

    if (!date) return false;

    const dateKey = getLocalDateKey(date);
    return dateKey >= today && dateKey <= lastDay;
};

export default function StatsCards() {
    const [stats, setStats] = useState({
        livestock: 0,
        milk: 0,
        health: 0,
        upcoming: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function fetchJSON(url, headers) {
            const response = await fetch(url, {
                headers,
                cache: "no-store",
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || `Request failed: ${url}`
                );
            }

            return result;
        }

        async function fetchStats() {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("authToken");

                if (!token) {
                    throw new Error(
                        "Please log in to view dashboard stats."
                    );
                }

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                // 1. Fetch all animals belonging to this farmer.
                const animalsResult = await fetchJSON(
                    `${API_BASE_URL}/animals`,
                    headers
                );

                const animals = getArray(animalsResult);

                // 2. Fetch milk and health records for each animal.
                const animalResults = await Promise.all(
                    animals.map(async (animal) => {
                        const [milkResult, healthResult] =
                            await Promise.all([
                                fetchJSON(
                                    `${API_BASE_URL}/milk/animals/${animal.id}`,
                                    headers
                                ),
                                fetchJSON(
                                    `${API_BASE_URL}/health/animals/${animal.id}`,
                                    headers
                                ),
                            ]);

                        return {
                            milkRecords: getArray(milkResult),
                            healthRecords: getArray(healthResult),
                        };
                    })
                );

                const allMilkRecords = animalResults.flatMap(
                    (item) => item.milkRecords
                );

                const allHealthRecords = animalResults.flatMap(
                    (item) => item.healthRecords
                );

                // 3. Calculate today's milk production.
                const now = new Date();
                const todayKey = getLocalDateKey(now);

                const todayMilk = allMilkRecords
                    .filter((record) => {
                        const date = parseDate(record.recordDate);

                        return (
                            date &&
                            getLocalDateKey(date) === todayKey
                        );
                    })
                    .reduce(
                        (total, record) =>
                            total + Number(record.total || 0),
                        0
                    );

                // 4. Calculate upcoming health tasks for the next 7 days.
                // Includes deworming/vaccination nextDue dates and
                // treatment review dates.
                const lastDayDate = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() + 7
                );

                const lastDayKey = getLocalDateKey(lastDayDate);

                const upcomingTasks = allHealthRecords.reduce(
                    (count, record) => {
                        let taskCount = 0;

                        const type = String(
                            record.type || ""
                        ).toUpperCase();

                        const isDeworming = type === "DEWORMING";
                        const isVaccination = type === "VACCINATION";
                        const isTreatment = type === "TREATMENT";

                        if (
                            (isDeworming || isVaccination) &&
                            isDueWithinNext7Days(
                                record.nextDue,
                                todayKey,
                                lastDayKey
                            )
                        ) {
                            taskCount++;
                        }

                        if (
                            isTreatment &&
                            isDueWithinNext7Days(
                                record.treatmentNextReview,
                                todayKey,
                                lastDayKey
                            )
                        ) {
                            taskCount++;
                        }

                        return count + taskCount;
                    },
                    0
                );

                if (!cancelled) {
                    setStats({
                        livestock: animals.length,
                        milk: Number(todayMilk.toFixed(2)),
                        health: allHealthRecords.length,
                        upcoming: upcomingTasks,
                    });
                }
            } catch (err) {
                console.error("Dashboard stats error:", err);

                if (!cancelled) {
                    setError(
                        err.message ||
                            "Unable to load dashboard stats."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchStats();

        return () => {
            cancelled = true;
        };
    }, []);

    const cards = [
        {
            title: "Total Livestock",
            value: stats.livestock,
            subtitle: "Animals registered",
            icon: "🐄",
        },
        {
            title: "Today's Milk",
            value: `${stats.milk} L`,
            subtitle: "Total recorded today",
            icon: "🥛",
        },
        {
            title: "Health Records",
            value: stats.health,
            subtitle: "Total health records",
            icon: "🩺",
        },
        {
            title: "Upcoming",
            value: stats.upcoming,
            subtitle: "Health tasks due in 7 days",
            icon: "📅",
        },
    ];

    return (
        <div>
            {error && (
                <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((stat) => (
                    <div
                        key={stat.title}
                        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    {stat.title}
                                </p>

                                <p className="mt-2 text-2xl font-bold text-gray-900">
                                    {loading ? "..." : stat.value}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">
                                {stat.icon}
                            </div>
                        </div>

                        <p className="mt-3 text-xs text-gray-400">
                            {stat.subtitle}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
