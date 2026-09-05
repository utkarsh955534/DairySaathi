export default function StatsCards() {
    const stats = [
        {
            title: "Total Livestock",
            value: "12",
            subtitle: "Animals registered",
            icon: "🐄",
        },
        {
            title: "Today's Milk",
            value: "86 L",
            subtitle: "Milk production",
            icon: "🥛",
        },
        {
            title: "Health Records",
            value: "2",
            subtitle: "Need attention",
            icon: "🩺",
        },
        {
            title: "Upcoming",
            value: "3",
            subtitle: "Veterinary tasks",
            icon: "📅",
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {stats.map((stat) => (
                <div
                    key={stat.title}
                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-sm font-medium text-gray-500">
                                {stat.title}
                            </p>

                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {stat.value}
                            </p>

                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">
                            {stat.icon}
                        </div>

                    </div>

                    <p className="mt-3 text-xs text-gray-400">
                        {stat.subtitle}
                    </p>

                </div>
            ))}

        </div>
    );
}