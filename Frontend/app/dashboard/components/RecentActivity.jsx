export default function RecentActivity() {
    const activities = [
        {
            icon: "🥛",
            title: "Milk record added",
            description:
                "86 litres recorded today",
            time: "Today",
        },
        {
            icon: "🩺",
            title: "Health check required",
            description:
                "2 animals need attention",
            time: "Today",
        },
        {
            icon: "💉",
            title: "Vaccination upcoming",
            description:
                "Vaccination scheduled",
            time: "Tomorrow",
        },
        {
            icon: "🐄",
            title: "Livestock updated",
            description:
                "Animal information updated",
            time: "Yesterday",
        },
    ];

    return (
        <section className="mt-8">

            <div className="mb-4">

                <h2 className="text-xl font-bold text-gray-900">
                    Recent Activity
                </h2>

                <p className="text-sm text-gray-500">
                    Recent updates from your farm.
                </p>

            </div>


            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">

                {activities.map(
                    (activity, index) => (
                        <div
                            key={index}
                            className={`flex items-center gap-4 p-5 ${
                                index !==
                                activities.length -
                                    1
                                    ? "border-b border-gray-100"
                                    : ""
                            }`}
                        >

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-50 text-xl">
                                {activity.icon}
                            </div>

                            <div className="min-w-0 flex-1">

                                <p className="font-semibold text-gray-900">
                                    {activity.title}
                                </p>

                                <p className="mt-1 truncate text-sm text-gray-500">
                                    {activity.description}
                                </p>

                            </div>

                            <span className="shrink-0 text-xs text-gray-400">
                                {activity.time}
                            </span>

                        </div>
                    )
                )}

            </div>

        </section>
    );
}