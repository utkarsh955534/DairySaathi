"use client";

function formatMilk(value) {
    return `${Number(value || 0).toFixed(1)} L`;
}

function formatDate(value) {
    if (!value) return "—";

    return new Date(
        `${value}T00:00:00`
    ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export default function MilkHistory({
    dailyRecords = [],
    selectedDate,
    onAddRecord,
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            {/* HEADER */}
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">
                        Daily Milk Records
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        {formatDate(selectedDate)}
                    </p>
                </div>
            </div>

            {/* EMPTY */}
            {dailyRecords.length === 0 ? (
                <div className="rounded-xl bg-gray-50 p-10 text-center">
                    <div className="text-4xl">
                        🐄
                    </div>

                    <p className="mt-3 font-semibold text-gray-900">
                        No animals found
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Add animals to manage milk
                        production.
                    </p>
                </div>
            ) : (
                <>
                    {/* =================================================
                        DESKTOP
                    ================================================= */}

                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full min-w-[850px] text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-left">
                                    <th className="px-4 py-3 font-semibold text-gray-600">
                                        Animal
                                    </th>

                                    <th className="px-4 py-3 font-semibold text-gray-600">
                                        Morning
                                    </th>

                                    <th className="px-4 py-3 font-semibold text-gray-600">
                                        Evening
                                    </th>

                                    <th className="px-4 py-3 font-semibold text-gray-600">
                                        Total
                                    </th>

                                    <th className="px-4 py-3 font-semibold text-gray-600">
                                        Status
                                    </th>

                                    <th className="px-4 py-3 text-right font-semibold text-gray-600">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {dailyRecords.map(
                                    ({
                                        animal,
                                        record,
                                    }) => (
                                        <tr
                                            key={
                                                animal.id
                                            }
                                            className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                                        >
                                            {/* ANIMAL */}
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {
                                                            animal.tagNumber
                                                        }
                                                    </p>

                                                    {animal.name && (
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {
                                                                animal.name
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </td>

                                            {/* MORNING */}
                                            <td className="px-4 py-4 text-gray-700">
                                                {record?.morning !=
                                                null
                                                    ? formatMilk(
                                                          record.morning
                                                      )
                                                    : "—"}
                                            </td>

                                            {/* EVENING */}
                                            <td className="px-4 py-4 text-gray-700">
                                                {record?.evening !=
                                                null
                                                    ? formatMilk(
                                                          record.evening
                                                      )
                                                    : "—"}
                                            </td>

                                            {/* TOTAL */}
                                            <td className="px-4 py-4 font-bold text-green-700">
                                                {record
                                                    ? formatMilk(
                                                          record.total
                                                      )
                                                    : "—"}
                                            </td>

                                            {/* STATUS */}
                                            <td className="px-4 py-4">
                                                {record ? (
                                                    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                        Recorded
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                                        Not Recorded
                                                    </span>
                                                )}
                                            </td>

                                            {/* ACTION */}
                                            <td className="px-4 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onAddRecord(
                                                            animal.id
                                                        )
                                                    }
                                                    className="rounded-lg border border-green-200 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-50"
                                                >
                                                    {record
                                                        ? "Update"
                                                        : "Add Record"}
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>

                            {/* FOOTER */}
                            <tfoot>
                                <tr className="border-t-2 border-gray-200 bg-green-50">
                                    <td
                                        colSpan={6}
                                        className="px-4 py-4"
                                    >
                                        <div className="flex justify-end">
                                            <span className="text-sm font-semibold text-gray-700">
                                                Use the
                                                stats
                                                section
                                                above for
                                                farm
                                                totals.
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* =================================================
                        MOBILE
                    ================================================= */}

                    <div className="space-y-3 md:hidden">
                        {dailyRecords.map(
                            ({
                                animal,
                                record,
                            }) => (
                                <div
                                    key={
                                        animal.id
                                    }
                                    className="rounded-xl border border-gray-200 p-4"
                                >
                                    {/* TOP */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-gray-900">
                                                {
                                                    animal.tagNumber
                                                }
                                            </p>

                                            {animal.name && (
                                                <p className="text-xs text-gray-500">
                                                    {
                                                        animal.name
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onAddRecord(
                                                    animal.id
                                                )
                                            }
                                            className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white"
                                        >
                                            {record
                                                ? "Update"
                                                : "Add"}
                                        </button>
                                    </div>

                                    {/* VALUES */}
                                    <div className="mt-4 grid grid-cols-3 gap-2">
                                        <div className="rounded-lg bg-gray-50 p-3">
                                            <p className="text-xs text-gray-500">
                                                Morning
                                            </p>

                                            <p className="mt-1 font-semibold text-gray-900">
                                                {record?.morning !=
                                                null
                                                    ? formatMilk(
                                                          record.morning
                                                      )
                                                    : "—"}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-gray-50 p-3">
                                            <p className="text-xs text-gray-500">
                                                Evening
                                            </p>

                                            <p className="mt-1 font-semibold text-gray-900">
                                                {record?.evening !=
                                                null
                                                    ? formatMilk(
                                                          record.evening
                                                      )
                                                    : "—"}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-green-50 p-3">
                                            <p className="text-xs text-green-700">
                                                Total
                                            </p>

                                            <p className="mt-1 font-bold text-green-700">
                                                {record
                                                    ? formatMilk(
                                                          record.total
                                                      )
                                                    : "—"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* STATUS */}
                                    <div className="mt-3">
                                        {record ? (
                                            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                Milk
                                                recorded
                                            </span>
                                        ) : (
                                            <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                                Milk not
                                                recorded
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </>
            )}
        </div>
    );
}