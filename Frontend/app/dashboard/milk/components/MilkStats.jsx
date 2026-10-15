"use client";

import { useMemo } from "react";

function StatCard({
    title,
    value,
    subtitle,
    icon,
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        {subtitle}
                    </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl">
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default function MilkStats({
    dailyRecords,
    milkRecords,
    animals,
    selectedDate,
}) {
    const stats = useMemo(() => {
        let morning = 0;
        let evening = 0;
        let total = 0;
        let recorded = 0;

        dailyRecords.forEach(
            ({ record }) => {
                if (!record) return;

                morning += Number(
                    record.morning || 0
                );

                evening += Number(
                    record.evening || 0
                );

                total += Number(
                    record.total || 0
                );

                recorded++;
            }
        );

        const date =
            new Date(
                `${selectedDate}T00:00:00`
            );

        let monthlyTotal = 0;

        Object.values(milkRecords)
            .flat()
            .forEach((record) => {
                const recordDate =
                    new Date(
                        record.recordDate
                    );

                if (
                    recordDate.getMonth() ===
                        date.getMonth() &&
                    recordDate.getFullYear() ===
                        date.getFullYear()
                ) {
                    monthlyTotal += Number(
                        record.total || 0
                    );
                }
            });

        const average =
            recorded > 0
                ? total / recorded
                : 0;

        return {
            morning,
            evening,
            total,
            recorded,
            monthlyTotal,
            average,
        };
    }, [
        dailyRecords,
        milkRecords,
        selectedDate,
    ]);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

            <StatCard
                title="Morning Milk"
                value={`${stats.morning.toFixed(
                    1
                )} L`}
                subtitle="Farm total"
                icon="🌅"
            />

            <StatCard
                title="Evening Milk"
                value={`${stats.evening.toFixed(
                    1
                )} L`}
                subtitle="Farm total"
                icon="🌙"
            />

            <StatCard
                title="Total Milk"
                value={`${stats.total.toFixed(
                    1
                )} L`}
                subtitle="Selected date"
                icon="🥛"
            />

            <StatCard
                title="Recorded Animals"
                value={`${stats.recorded} / ${animals.length}`}
                subtitle="Milk recorded"
                icon="🐄"
            />

            <StatCard
                title="Monthly Total"
                value={`${stats.monthlyTotal.toFixed(
                    1
                )} L`}
                subtitle="Selected month"
                icon="📅"
            />
        </div>
    );
}