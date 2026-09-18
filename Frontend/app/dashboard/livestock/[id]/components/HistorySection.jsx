import HistoryEvent from "./HistoryEvent";

export default function HistorySection({
    history = [],
    loading,
    error,
    onRetry,
}) {
    return (
        <section className="mt-8">

            {/* =========================
                HEADER
            ========================= */}

            <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-900">
                    History
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Complete activity timeline of this animal
                </p>
            </div>

            {/* =========================
                LOADING
            ========================= */}

            {loading && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="animate-pulse space-y-5">

                        <div className="h-5 w-32 rounded bg-gray-200" />

                        <div className="flex gap-4">
                            <div className="h-10 w-10 rounded-full bg-gray-200" />

                            <div className="flex-1">
                                <div className="h-4 w-40 rounded bg-gray-200" />

                                <div className="mt-3 h-3 w-64 rounded bg-gray-200" />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="h-10 w-10 rounded-full bg-gray-200" />

                            <div className="flex-1">
                                <div className="h-4 w-32 rounded bg-gray-200" />

                                <div className="mt-3 h-3 w-56 rounded bg-gray-200" />
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* =========================
                ERROR
            ========================= */}

            {!loading && error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

                    <h3 className="font-semibold text-red-700">
                        Unable to load history
                    </h3>

                    <p className="mt-1 text-sm text-red-600">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={onRetry}
                        className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Try Again
                    </button>

                </div>
            )}

            {/* =========================
                EMPTY
            ========================= */}

            {!loading &&
                !error &&
                history.length === 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">

                        <div className="text-4xl">
                            📋
                        </div>

                        <h3 className="mt-3 font-semibold text-gray-900">
                            No history available
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            No records have been added for this animal yet.
                        </p>

                    </div>
                )}

            {/* =========================
                TIMELINE
            ========================= */}

            {!loading &&
                !error &&
                history.length > 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                        <div className="relative">

                            {/* Timeline line */}

                            <div className="absolute bottom-3 left-5 top-3 w-px bg-gray-200" />

                            <div className="space-y-7">

                                {history.map(
                                    (event, index) => (
                                        <HistoryEvent
                                            key={`${event.type}-${event.date}-${index}`}
                                            event={event}
                                        />
                                    )
                                )}

                            </div>

                        </div>

                    </div>
                )}

        </section>
    );
}