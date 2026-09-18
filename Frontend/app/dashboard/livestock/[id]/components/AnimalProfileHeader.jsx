"use client";

export default function AnimalProfileHeader({
    animal,
    editing,
    onEdit,
    onDelete,
    deleting,
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-5">
                    {animal.photoUrl ? (
                        <img
                            src={animal.photoUrl}
                            alt={animal.name}
                            className="h-28 w-28 rounded-2xl object-cover"
                        />
                    ) : (
                        <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-green-100 text-4xl">
                            🐄
                        </div>
                    )}

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {animal.name}
                        </h1>

                        <p className="mt-1 text-gray-500">
                            {animal.tagNumber}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                            <Badge>{animal.species}</Badge>
                            <Badge>{animal.sex}</Badge>
                            <Badge>{animal.lifeStage}</Badge>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onEdit}
                        className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                    >
                        {editing ? "Cancel Edit" : "Edit Animal"}
                    </button>

                    <button
                        onClick={onDelete}
                        disabled={deleting}
                        className="rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Badge({ children }) {
    return (
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            {formatText(children)}
        </span>
    );
}

function formatText(value) {
    if (!value) return "—";

    return String(value)
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}
