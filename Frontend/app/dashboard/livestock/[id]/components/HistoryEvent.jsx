import { formatDateTime, formatText, getHistoryEventConfig } from "./livestock-utils";

export default function HistoryEvent({ event }) {
    const config = getHistoryEventConfig(event.type);

    return (
        <div className="relative flex gap-4">
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-lg">
                {config.icon}
            </div>

            <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-green-600">
                            {config.label}
                        </span>

                        <h3 className="mt-1 font-semibold text-gray-900">
                            {event.title || config.label}
                        </h3>
                    </div>

                    <span className="text-xs text-gray-400 sm:mt-1">
                        {formatDateTime(event.date)}
                    </span>
                </div>

                {event.description && (
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                        {event.description}
                    </p>
                )}

                {event.details && (
                    <div className="mt-3 rounded-xl bg-gray-50 p-3">
                        {Object.entries(event.details).map(
                            ([key, value]) => (
                                <div
                                    key={key}
                                    className="flex justify-between gap-4 border-b border-gray-100 py-2 last:border-0"
                                >
                                    <span className="text-xs text-gray-500">
                                        {formatText(key)}
                                    </span>

                                    <span className="text-right text-xs font-medium text-gray-700">
                                        {value ?? "—"}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
