"use client";

import { useCallback, useEffect, useState } from "react";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

const getArray = (result) => {
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.data?.animals)) return result.data.animals;
    if (Array.isArray(result?.data?.records)) return result.data.records;
    return [];
};

const parseDate = (value) => {
    if (!value) return null;

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
};

const getTimeLabel = (value) => {
    const date = parseDate(value);

    if (!date) return "Date unavailable";

    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1 && diff >= 0) return "Just now";
    if (minutes < 60 && diff >= 0) return `${minutes} min ago`;
    if (hours < 24 && diff >= 0) return `${hours} hr ago`;
    if (days === 1) return "Yesterday";
    if (days > 1) return `${days} days ago`;

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
    });
};

const getDateKey = (date) =>
    [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");

const getUpcomingLabel = (value) => {
    const date = parseDate(value);

    if (!date) return "";

    const today = new Date();
    const todayKey = getDateKey(today);
    const dueKey = getDateKey(date);

    if (dueKey === todayKey) return "Due today";

    const tomorrow = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
    );

    if (dueKey === getDateKey(tomorrow)) return "Tomorrow";

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
    });
};

export default function RecentActivity() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchActivities = useCallback(async () => {
        try {
            const token = localStorage.getItem("authToken");

            if (!token) {
                throw new Error("Please log in to view recent activity.");
            }

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const request = async (url) => {
                const response = await fetch(url, {
                    headers,
                    cache: "no-store",
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Unable to load recent activity."
                    );
                }

                return result;
            };

            // Fetch the logged-in farmer's animals.
            const animalResult = await request(
                `${API_BASE_URL}/animals`
            );

            const animals = getArray(animalResult);
            const activityItems = [];

            // Add animal registration activity when its creation date exists.
            animals.forEach((animal) => {
                if (animal.createdAt) {
                    activityItems.push({
                        id: `animal-${animal.id}`,
                        icon: "🐄",
                        title: "Livestock registered",
                        description: `${animal.name || animal.tagNumber || "Animal"} added to your farm`,
                        date: animal.createdAt,
                    });
                }
            });

            // Fetch each animal's milk and health records.
            const results = await Promise.all(
                animals.map(async (animal) => {
                    const [milkResult, healthResult] =
                        await Promise.all([
                            request(
                                `${API_BASE_URL}/milk/animals/${animal.id}`
                            ),
                            request(
                                `${API_BASE_URL}/health/animals/${animal.id}`
                            ),
                        ]);

                    return {
                        animal,
                        milkRecords: getArray(milkResult),
                        healthRecords: getArray(healthResult),
                    };
                })
            );

            results.forEach(({ animal, milkRecords, healthRecords }) => {
                milkRecords.forEach((record) => {
                    if (!record.recordDate) return;

                    activityItems.push({
                        id: `milk-${animal.id}-${record.id ?? record.recordDate}`,
                        icon: "🥛",
                        title: "Milk record added",
                        description: `${animal.name || animal.tagNumber || "Animal"} · ${Number(record.total || 0)} litres recorded`,
                        date: record.createdAt || record.recordDate,
                    });
                });

                healthRecords.forEach((record) => {
                    if (!record.recordDate) return;

                    const type = String(record.type || "HEALTH")
                        .replaceAll("_", " ")
                        .toLowerCase();

                    activityItems.push({
                        id: `health-${animal.id}-${record.id ?? record.recordDate}`,
                        icon:
                            String(record.type).toUpperCase() === "VACCINATION"
                                ? "💉"
                                : "🩺",
                        title: `${type.charAt(0).toUpperCase()}${type.slice(1)} record added`,
                        description: `${animal.name || animal.tagNumber || "Animal"} · ${record.vaccineName || record.dewormerName || record.problem || record.title || "Health record saved"}`,
                        date: record.createdAt || record.recordDate,
                    });

                    // Show future health tasks due within the next 7 days.
                    const typeUpper = String(record.type || "").toUpperCase();

                    const dueTasks = [];

                    if (
                        ["DEWORMING", "VACCINATION"].includes(typeUpper) &&
                        record.nextDue
                    ) {
                        dueTasks.push({
                            date: record.nextDue,
                            description:
                                record.dewormerName ||
                                record.vaccineName ||
                                type.toLowerCase(),
                        });
                    }

                    if (
                        typeUpper === "TREATMENT" &&
                        record.treatmentNextReview
                    ) {
                        dueTasks.push({
                            date: record.treatmentNextReview,
                            description:
                                record.treatmentMedicine || "Treatment review",
                        });
                    }

                    const now = new Date();
                    const today = new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate()
                    );
                    const lastDay = new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate() + 7
                    );

                    dueTasks.forEach((task, index) => {
                        const dueDate = parseDate(task.date);
                        if (!dueDate) return;

                        const dueDay = new Date(
                            dueDate.getFullYear(),
                            dueDate.getMonth(),
                            dueDate.getDate()
                        );

                        if (dueDay < today || dueDay > lastDay) return;

                        activityItems.push({
                            id: `due-${animal.id}-${record.id ?? record.recordDate}-${index}`,
                            icon: "📅",
                            title: "Upcoming health task",
                            description: `${animal.name || animal.tagNumber || "Animal"} · ${task.description}`,
                            date: task.date,
                            timeLabel: getUpcomingLabel(task.date),
                            isUpcoming: true,
                        });
                    });
                });
            });

            // Show the newest activities first, with a maximum of 8.
            activityItems.sort((a, b) => {
                return (
                    (parseDate(b.date)?.getTime() || 0) -
                    (parseDate(a.date)?.getTime() || 0)
                );
            });

            if (typeof window !== "undefined") {
                // Avoid showing duplicate activities if an item is present
                // more than once in the fetched data.
                const uniqueActivities = [
                    ...new Map(
                        activityItems.map((item) => [item.id, item])
                    ).values(),
                ];

                setActivities(uniqueActivities.slice(0, 8));
            }

            setError("");
        } catch (err) {
            console.error("Recent activity error:", err);
            setError(err.message || "Unable to load recent activity.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchActivities();

        // Refresh the activity list every 30 seconds.
        const intervalId = setInterval(fetchActivities, 30000);

        return () => clearInterval(intervalId);
    }, [fetchActivities]);

    return (
        <section className="mt-8">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                    Recent Activity
                </h2>

                <p className="text-sm text-gray-500">
                    Recent updates from your farm.
                </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                {loading && activities.length === 0 ? (
                    <p className="p-5 text-sm text-gray-500">
                        Loading recent activities...
                    </p>
                ) : error && activities.length === 0 ? (
                    <p className="p-5 text-sm text-red-600">
                        {error}
                    </p>
                ) : activities.length === 0 ? (
                    <p className="p-5 text-sm text-gray-500">
                        No recent activity yet. Your farm updates will appear here.
                    </p>
                ) : (
                    activities.map((activity, index) => (
                        <div
                            key={activity.id}
                            className={`flex items-center gap-4 p-5 ${
                                index !== activities.length - 1
                                    ? "border-b border-gray-100"
                                    : ""
                            }`}
                        >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-50 text-xl">
                                {activity.icon}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-gray-900">
                                    {activity.title}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    {activity.description}
                                </p>
                            </div>

                            <span
                                className={`shrink-0 text-xs ${
                                    activity.isUpcoming
                                        ? "font-medium text-amber-600"
                                        : "text-gray-400"
                                }`}
                            >
                                {activity.timeLabel || getTimeLabel(activity.date)}
                            </span>
                        </div>
                    ))
                )}
            </div>

            {error && activities.length > 0 && (
                <p className="mt-2 text-xs text-amber-600">
                    Could not refresh activities: {error}
                </p>
            )}
        </section>
    );
}
