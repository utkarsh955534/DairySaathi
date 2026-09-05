export default function AnimalStats({
    animals,
}) {
    const total = animals.length;

    const active = animals.filter(
        (animal) =>
            animal.status === "ACTIVE"
    ).length;

    const male = animals.filter(
        (animal) =>
            animal.gender === "MALE"
    ).length;

    const female = animals.filter(
        (animal) =>
            animal.gender === "FEMALE"
    ).length;

    const stats = [
        {
            title: "Total Animals",
            value: total,
            icon: "🐄",
        },
        {
            title: "Active",
            value: active,
            icon: "✓",
        },
        {
            title: "Female",
            value: female,
            icon: "♀",
        },
        {
            title: "Male",
            value: male,
            icon: "♂",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

            {stats.map((stat) => (
                <div
                    key={stat.title}
                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-gray-500">
                                {stat.title}
                            </p>

                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {stat.value}
                            </p>

                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl text-green-700">
                            {stat.icon}
                        </div>

                    </div>

                </div>
            ))}

        </div>
    );
}