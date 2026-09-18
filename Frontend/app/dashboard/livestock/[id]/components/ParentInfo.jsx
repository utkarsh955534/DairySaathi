export default function ParentInfo({
    title,
    source,
    internal,
    externalName,
    externalBreed,
    externalTag,
}) {
    return (
        <div className="border-b border-gray-100 pb-4 last:border-0">
            <p className="text-sm font-medium text-gray-500">
                {title}
            </p>

            {source === "EXISTING" && internal && (
                <div className="mt-2">
                    <p className="font-semibold text-gray-900">
                        {internal.name}
                    </p>

                    <p className="text-xs text-gray-500">
                        {internal.tagNumber}
                    </p>
                </div>
            )}

            {source === "EXTERNAL" && (
                <div className="mt-2">
                    <p className="font-semibold text-gray-900">
                        {externalName || "—"}
                    </p>

                    {externalBreed && (
                        <p className="text-xs text-gray-500">
                            {externalBreed}
                        </p>
                    )}

                    {externalTag && (
                        <p className="text-xs text-gray-500">
                            Tag: {externalTag}
                        </p>
                    )}

                    <span className="mt-2 inline-block rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-600">
                        External
                    </span>
                </div>
            )}

            {source === "UNKNOWN" && (
                <p className="mt-2 text-sm text-gray-400">
                    Unknown
                </p>
            )}

            {!source && (
                <p className="mt-2 text-sm text-gray-400">
                    —
                </p>
            )}
        </div>
    );
}
