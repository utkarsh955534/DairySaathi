"use client";

function formatLabel(dateValue) {
    return new Date(
        `${dateValue}T00:00:00`
    ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
    });
}

export default function MilkChart({
    data = [],
}) {
    if (!data.length) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">
                    Milk Production Trend
                </h2>

                <div className="mt-4 flex h-52 items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-500">
                    No milk data available.
                </div>
            </div>
        );
    }

    const maxValue = Math.max(
        ...data.map(
            (item) =>
                Number(item.total || 0)
        ),
        1
    );

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                    Milk Production Trend
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Total farm milk for last 7 recorded days
                </p>
            </div>

            <div className="flex h-64 items-end gap-3 overflow-x-auto">
                {data.map((item) => {
                    const total =
                        Number(
                            item.total || 0
                        );

                    const height = Math.max(
                        (total / maxValue) *
                            100,
                        5
                    );

                    return (
                        <div
                            key={item.date}
                            className="flex min-w-[60px] flex-1 flex-col items-center justify-end gap-2"
                        >
                            <span className="text-xs font-semibold text-gray-700">
                                {total.toFixed(
                                    1
                                )}
                                L
                            </span>

                            <div className="flex h-44 w-full items-end">
                                <div
                                    className="w-full rounded-t-xl bg-green-500"
                                    style={{
                                        height: `${height}%`,
                                    }}
                                />
                            </div>

                            <span className="text-xs text-gray-500">
                                {formatLabel(
                                    item.date
                                )}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}