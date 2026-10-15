"use client";

export default function AnimalSelector({
    animals = [],
    selectedAnimalId,
    onChange,
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
                Select Animal
            </label>

            <select
                value={selectedAnimalId}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
                <option value="">
                    Select an animal
                </option>

                {animals.map((animal) => (
                    <option
                        key={animal.id}
                        value={animal.id}
                    >
                        {animal.tagNumber}
                        {animal.name
                            ? ` - ${animal.name}`
                            : ""}
                    </option>
                ))}
            </select>
        </div>
    );
}